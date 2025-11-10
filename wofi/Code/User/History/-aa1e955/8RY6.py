import os
import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import Flask, request, render_template, send_file, jsonify
from werkzeug.utils import secure_filename
from statsmodels.tsa.holtwinters import ExponentialSmoothing

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"
app.config["DATABASE"] = "descongelamento.db"
app.config["ALLOWED_EXTENSIONS"] = {"csv"}


# Inicialização do banco de dados
def init_db():
    conn = sqlite3.connect(app.config["DATABASE"])
    c = conn.cursor()

    # Tabela de vendas históricas
    c.execute(
        """CREATE TABLE IF NOT EXISTS vendas (
                 id INTEGER PRIMARY KEY,
                 data DATE NOT NULL,
                 sku TEXT NOT NULL,
                 kg_vendidos REAL NOT NULL)"""
    )

    # Tabela de parâmetros dos SKUs
    c.execute(
        """CREATE TABLE IF NOT EXISTS skus (
                 sku TEXT PRIMARY KEY,
                 validade_dias INTEGER DEFAULT 2,
                 capacidade_maxima REAL)"""
    )

    # Tabela de lotes ativos
    c.execute(
        """CREATE TABLE IF NOT EXISTS lotes (
                 id INTEGER PRIMARY KEY,
                 data_retirada DATE NOT NULL,
                 data_disponivel DATE NOT NULL,
                 sku TEXT NOT NULL,
                 kg_bruto REAL NOT NULL,
                 kg_liquido REAL NOT NULL,
                 idade INTEGER DEFAULT 0)"""
    )

    # Tabela de retiradas calculadas
    c.execute(
        """CREATE TABLE IF NOT EXISTS retiradas (
                 id INTEGER PRIMARY KEY,
                 data DATE NOT NULL,
                 sku TEXT NOT NULL,
                 kg_retirados REAL NOT NULL)"""
    )

    conn.commit()
    conn.close()


# Inicializa o banco na primeira execução
if not os.path.exists(app.config["DATABASE"]):
    init_db()


# Funções auxiliares
def get_db():
    conn = sqlite3.connect(app.config["DATABASE"])
    conn.row_factory = sqlite3.Row
    return conn


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]
    )


# Modelo FIFO para gestão de lotes
class GerenciadorLotes:
    def __init__(self, sku):
        self.sku = sku
        self.db = get_db()

    def atualizar_estoque(self, data_hoje):
        # Atualiza idade dos lotes
        self.db.execute(
            """UPDATE lotes 
                          SET idade = julianday(?) - julianday(data_disponivel)
                          WHERE sku = ? AND data_disponivel <= ?""",
            (data_hoje, self.sku, data_hoje),
        )

        # Remove lotes vencidos
        self.db.execute(
            """DELETE FROM lotes 
                          WHERE sku = ? AND idade >= 
                          (SELECT validade_dias FROM skus WHERE sku = ?)""",
            (self.sku, self.sku),
        )

        self.db.commit()

    def calcular_disponibilidade(self, data_hoje):
        # Kg disponíveis hoje
        disponivel = (
            self.db.execute(
                """SELECT SUM(kg_liquido) FROM lotes 
                                      WHERE sku = ? AND data_disponivel <= ?""",
                (self.sku, data_hoje),
            ).fetchone()[0]
            or 0.0
        )

        # Kg em descongelamento (disponíveis amanhã)
        descongelamento = (
            self.db.execute(
                """SELECT SUM(kg_liquido) FROM lotes 
                                           WHERE sku = ? AND data_disponivel = ?""",
                (self.sku, data_hoje + timedelta(days=1)),
            ).fetchone()[0]
            or 0.0
        )

        # Idade máxima
        idade_max = (
            self.db.execute(
                """SELECT MAX(idade) FROM lotes 
                                     WHERE sku = ? AND data_disponivel <= ?""",
                (self.sku, data_hoje),
            ).fetchone()[0]
            or 0.0
        )

        return disponivel, descongelamento, idade_max

    def adicionar_lote(self, data_retirada, kg_bruto):
        data_disponivel = data_retirada + timedelta(days=2)
        kg_liquido = kg_bruto * 0.85

        self.db.execute(
            """INSERT INTO lotes 
                         (data_retirada, data_disponivel, sku, kg_bruto, kg_liquido)
                         VALUES (?, ?, ?, ?, ?)""",
            (data_retirada, data_disponivel, self.sku, kg_bruto, kg_liquido),
        )
        self.db.commit()


# Endpoint para upload de dados
@app.route("/upload", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        if "file" not in request.files:
            return render_template("upload.html", error="Nenhum arquivo enviado")

        file = request.files["file"]
        if file.filename == "":
            return render_template("upload.html", error="Nome de arquivo inválido")

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)

            # Processar o arquivo CSV
            try:
                df = pd.read_csv(filepath)
                conn = get_db()

                # Inserir dados no banco
                for _, row in df.iterrows():
                    conn.execute(
                        """INSERT INTO vendas (data, sku, kg_vendidos)
                                 VALUES (?, ?, ?)""",
                        (row["data"], row["sku"], row["kg_vendidos"]),
                    )

                conn.commit()
                return render_template(
                    "upload.html", success="Dados importados com sucesso!"
                )
            except Exception as e:
                return render_template(
                    "upload.html", error=f"Erro no processamento: {str(e)}"
                )

    return render_template("upload.html")


# Endpoint para previsão e cálculo de retiradas
@app.route("/calcular", methods=["GET"])
def calcular_retiradas():
    data_hoje = datetime.now().date()
    conn = get_db()

    # Obter lista de SKUs únicos
    skus = [
        row[0] for row in conn.execute("SELECT DISTINCT sku FROM vendas").fetchall()
    ]

    resultados = []

    for sku in skus:
        # 1. Obter dados históricos
        dados = conn.execute(
            """SELECT data, kg_vendidos 
                              FROM vendas 
                              WHERE sku = ?
                              ORDER BY data""",
            (sku,),
        ).fetchall()

        if not dados:
            continue

        # Converter para DataFrame
        df = pd.DataFrame(dados, columns=["data", "kg_vendidos"])
        df["data"] = pd.to_datetime(df["data"])
        df.set_index("data", inplace=True)

        # 2. Prever demanda para t+2
        try:
            modelo = ExponentialSmoothing(
                df, trend="add", seasonal="add", seasonal_periods=7
            ).fit()
            previsao = modelo.forecast(3)  # Previsão para 3 dias
            Vp_t2 = previsao.iloc[1]  # Demanda prevista para t+2
        except:
            # Fallback: média móvel de 7 dias
            Vp_t2 = df["kg_vendidos"].rolling(7).mean().iloc[-1]

        # 3. Calcular retirada R(t)
        # Obter R(t-1) - retirada do dia anterior
        R_t1_row = conn.execute(
            """SELECT kg_retirados FROM retiradas 
                                 WHERE sku = ? AND data = ?""",
            (sku, data_hoje - timedelta(days=1)),
        ).fetchone()
        R_t1 = R_t1_row[0] if R_t1_row else 0

        # Calcular desvio padrão (últimos 30 dias)
        sigma = df["kg_vendidos"].tail(30).std()
        k = 1.65  # Fator de segurança para 95% de confiança

        # Fórmula principal
        R_t = (Vp_t2 + k * sigma - 0.85 * R_t1) / 0.85

        # Aplicar restrições
        demanda_media = df["kg_vendidos"].mean()
        capacidade = conn.execute(
            """SELECT capacidade_maxima FROM skus 
                                  WHERE sku = ?""",
            (sku,),
        ).fetchone()
        capacidade = capacidade[0] if capacidade else float("inf")

        R_t = max(0, R_t)  # Não pode ser negativo
        R_t = min(R_t, capacidade, (2 * demanda_media) / 0.85)  # Limites

        # 4. Atualizar banco de dados
        conn.execute(
            """INSERT INTO retiradas (data, sku, kg_retirados)
                     VALUES (?, ?, ?)""",
            (data_hoje, sku, R_t),
        )

        # 5. Adicionar novo lote
        gerenciador = GerenciadorLotes(sku)
        gerenciador.atualizar_estoque(data_hoje)
        gerenciador.adicionar_lote(data_hoje, R_t)

        # 6. Calcular disponibilidade para relatório
        disponivel, descongelamento, idade_max = gerenciador.calcular_disponibilidade(
            data_hoje
        )

        resultados.append(
            {
                "sku": sku,
                "kg_retirar_hoje": round(R_t, 2),
                "kg_disponivel_hoje": round(disponivel, 2),
                "kg_em_descongelamento": round(descongelamento, 2),
                "idade_maxima": round(idade_max, 1),
            }
        )

    conn.commit()
    return jsonify(resultados)


# Endpoint para gerar relatório CSV
@app.route("/relatorio", methods=["GET"])
def gerar_relatorio():
    data_hoje = datetime.now().date()
    conn = get_db()

    # Obter dados para relatório
    dados = conn.execute(
        """SELECT 
        r.data,
        r.sku,
        r.kg_retirados AS kg_retirar_hoje,
        l_desc.kg_descongelamento,
        l_disp.kg_disponivel,
        l_idade.idade_maxima
    FROM retiradas r
    LEFT JOIN (
        SELECT sku, SUM(kg_liquido) AS kg_descongelamento
        FROM lotes
        WHERE data_disponivel = ?
        GROUP BY sku
    ) l_desc ON r.sku = l_desc.sku
    LEFT JOIN (
        SELECT sku, SUM(kg_liquido) AS kg_disponivel
        FROM lotes
        WHERE data_disponivel <= ?
        GROUP BY sku
    ) l_disp ON r.sku = l_disp.sku
    LEFT JOIN (
        SELECT sku, MAX(idade) AS idade_maxima
        FROM lotes
        WHERE data_disponivel <= ?
        GROUP BY sku
    ) l_idade ON r.sku = l_idade.sku
    WHERE r.data = ?""",
        (data_hoje + timedelta(days=1), data_hoje, data_hoje, data_hoje),
    ).fetchall()

    # Criar DataFrame
    df = pd.DataFrame(
        dados,
        columns=[
            "data",
            "sku",
            "kg_retirar_hoje",
            "kg_em_descongelamento",
            "kg_disponivel_hoje",
            "idade_maxima",
        ],
    )

    # Salvar como CSV
    csv_path = os.path.join(app.config["UPLOAD_FOLDER"], f"relatorio_{data_hoje}.csv")
    df.to_csv(csv_path, index=False)

    return send_file(csv_path, as_attachment=True)


# Dashboard simples
@app.route("/dashboard", methods=["GET"])
def dashboard():
    conn = get_db()

    # Últimas retiradas
    retiradas = conn.execute(
        """SELECT * FROM retiradas 
                             ORDER BY data DESC LIMIT 10"""
    ).fetchall()

    # Resumo de estoque
    estoque = conn.execute(
        """SELECT sku, SUM(kg_liquido) AS total
                            FROM lotes GROUP BY sku"""
    ).fetchall()

    # Perdas recentes
    perdas = conn.execute(
        """SELECT sku, COUNT(*) AS lotes_perdidos
                          FROM lotes 
                          WHERE idade >= (SELECT validade_dias FROM skus WHERE sku = lotes.sku)
                          GROUP BY sku"""
    ).fetchall()

    return render_template(
        "dashboard.html", retiradas=retiradas, estoque=estoque, perdas=perdas
    )


# Configuração de SKUs
@app.route("/skus", methods=["GET", "POST"])
def config_skus():
    conn = get_db()

    if request.method == "POST":
        sku = request.form["sku"]
        validade = int(request.form["validade"])
        capacidade = float(request.form["capacidade"])

        conn.execute(
            """INSERT OR REPLACE INTO skus (sku, validade_dias, capacidade_maxima)
                     VALUES (?, ?, ?)""",
            (sku, validade, capacidade),
        )
        conn.commit()
        return jsonify({"status": "success"})

    skus = conn.execute("SELECT * FROM skus").fetchall()
    return render_template("skus.html", skus=skus)


# Página inicial
@app.route("/")
def index():
    return render_template("index.html")


# Templates HTML
if __name__ == "__main__":
    # Criar pasta de uploads se não existir
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Templates embutidos para simplicidade
    @app.route("/templates/<template_name>")
    def serve_template(template_name):
        templates = {
            "index.html": """
            <!DOCTYPE html>
            <html>
            <head><title>Sistema de Descongelamento</title></head>
            <body>
                <h1>Gestão de Descongelamento - Filial 7</h1>
                <ul>
                    <li><a href="/upload">Importar Dados</a></li>
                    <li><a href="/calcular">Calcular Retiradas de Hoje</a></li>
                    <li><a href="/relatorio">Gerar Relatório Diário</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/skus">Configurar SKUs</a></li>
                </ul>
            </body>
            </html>
            """,
            "upload.html": """
            <!DOCTYPE html>
            <html>
            <head><title>Importar Dados</title></head>
            <body>
                <h1>Importar Histórico de Vendas</h1>
                {% if error %}<p style="color:red">{{ error }}</p>{% endif %}
                {% if success %}<p style="color:green">{{ success }}</p>{% endif %}
                <form method="post" enctype="multipart/form-data">
                    <input type="file" name="file">
                    <input type="submit" value="Importar">
                </form>
            </body>
            </html>
            """,
            "dashboard.html": """
            <!DOCTYPE html>
            <html>
            <head><title>Dashboard</title></head>
            <body>
                <h1>Dashboard Operacional</h1>
                
                <h2>Últimas Retiradas</h2>
                <table border="1">
                    <tr>
                        <th>Data</th>
                        <th>SKU</th>
                        <th>Kg Retirados</th>
                    </tr>
                    {% for r in retiradas %}
                    <tr>
                        <td>{{ r['data'] }}</td>
                        <td>{{ r['sku'] }}</td>
                        <td>{{ r['kg_retirados'] }}</td>
                    </tr>
                    {% endfor %}
                </table>
                
                <h2>Estoque Atual</h2>
                <table border="1">
                    <tr>
                        <th>SKU</th>
                        <th>Kg Disponível</th>
                    </tr>
                    {% for e in estoque %}
                    <tr>
                        <td>{{ e['sku'] }}</td>
                        <td>{{ e['total'] }}</td>
                    </tr>
                    {% endfor %}
                </table>
                
                <h2>Perdas Recentes</h2>
                <table border="1">
                    <tr>
                        <th>SKU</th>
                        <th>Lotes Perdidos</th>
                    </tr>
                    {% for p in perdas %}
                    <tr>
                        <td>{{ p['sku'] }}</td>
                        <td>{{ p['lotes_perdidos'] }}</td>
                    </tr>
                    {% endfor %}
                </table>
            </body>
            </html>
            """,
            "skus.html": """
            <!DOCTYPE html>
            <html>
            <head><title>Configurar SKUs</title></head>
            <body>
                <h1>Configuração de SKUs</h1>
                <form method="post">
                    <label>SKU: <input type="text" name="sku" required></label><br>
                    <label>Validade (dias): <input type="number" name="validade" value="2" min="1" required></label><br>
                    <label>Capacidade Máxima (kg): <input type="number" name="capacidade" step="0.1" required></label><br>
                    <input type="submit" value="Salvar">
                </form>
                
                <h2>SKUs Configurados</h2>
                <table border="1">
                    <tr>
                        <th>SKU</th>
                        <th>Validade (dias)</th>
                        <th>Capacidade Máxima (kg)</th>
                    </tr>
                    {% for s in skus %}
                    <tr>
                        <td>{{ s['sku'] }}</td>
                        <td>{{ s['validade_dias'] }}</td>
                        <td>{{ s['capacidade_maxima'] }}</td>
                    </tr>
                    {% endfor %}
                </table>
            </body>
            </html>
            """,
        }
        return templates.get(template_name, "Template não encontrado")

    app.run(debug=True)
