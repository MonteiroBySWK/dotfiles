from flask import Flask, render_template, request, g, jsonify
from flasgger import Swagger, swag_from
from datetime import datetime, timedelta
import sqlite3
import logging

import src.manager as Manager
import src.database as Database
import src.repositories.ProdutoRepository as ProdutoRepository
import src.repositories.LoteRepository as LoteRepository
import src.repositories.VendaRepository as VendaRepository
import src.repositories.PrevisaoRepository as PrevisaoRepository

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)
swagger = Swagger(app)

# Configuração do banco de dados
DATABASE = "./data/data.db"

def get_db():
    """Obtém uma conexão com o banco de dados para a requisição atual"""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Fecha a conexão com o banco ao final da requisição"""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route("/")
def index():
    return render_template("index.html")

# Rotas de gerenciamento
@app.route("/api/retirada/<string:produto_sku>", methods=["POST"])
def executar_fluxo_diario(produto_sku):
    """Executa o fluxo diário de retirada para um produto"""
    db_conn = get_db()
    sucesso = Manager.executar_fluxo_diario(db_conn, produto_sku)
    if sucesso:
        return jsonify({"message": "Fluxo diário executado com sucesso."}), 200
    else:
        return jsonify({"message": "Erro ao executar o fluxo diário."}), 500

@app.route("/api/criar_db", methods=["POST"])
def criar_banco():
    """Cria o banco de dados e tabelas"""
    db_conn = get_db()
    Database.criar_banco_e_tabelas(db_conn)
    return jsonify({"message": "Banco de dados criado com sucesso."}), 201

@app.route("/api/prever", methods=["POST"])
def prever_rota():
    """Executa rotina de previsão de demanda"""
    db_conn = get_db()
    Manager.realizar_previsao(db_conn)
    return jsonify({"message": "Previsão realizada com sucesso"}), 201

@app.route("/api/registrar-venda/<string:produto_sku>", methods=["POST"])
def registrar_venda_rota(produto_sku: str):
    """Registra uma venda para um produto específico"""
    data = request.get_json()
    if not data or 'quantidade' not in data:
        return jsonify({"error": "Quantidade não informada no payload"}), 400
    
    quantidade_solicitada = float(data['quantidade'])
    if quantidade_solicitada <= 0:
        return jsonify({"error": "Quantidade deve ser maior que zero"}), 400

    data_hoje = datetime.now().date()
    db_conn = get_db()
    
    quantidade_vendida = Manager.registrar_venda(
        db_conn, produto_sku, data_hoje, quantidade_solicitada
    )
    
    response = {
        "message": "Venda Registrada" if quantidade_vendida > 0 else "Venda não realizada - sem estoque",
        "produto_sku": produto_sku,
        "quantidade_solicitada": quantidade_solicitada,
        "quantidade_vendida": quantidade_vendida,
        "data": data_hoje.strftime("%Y-%m-%d")
    }
    
    status_code = 201 if quantidade_vendida > 0 else 404
    return jsonify(response), status_code

# Rotas de consulta
@app.route("/api/produtos", methods=["GET"])
def listar_produtos():
    """Lista todos os produtos cadastrados"""
    try:
        db_conn = get_db()
        produtos = ProdutoRepository.buscar_produtos(db_conn)
        return jsonify(produtos)
    except Exception as e:
        logging.error(f"Erro ao listar produtos: {str(e)}")
        return jsonify({"error": "Erro interno no servidor"}), 500

@app.route("/api/lotes", methods=["GET"])
def listar_lotes():
    """Lista lotes com filtro opcional por SKU"""
    sku = request.args.get('sku')
    try:
        db_conn = get_db()
        if sku:
            lotes = LoteRepository.obter_lotes_por_sku(db_conn, sku)
        else:
            cursor = db_conn.cursor()
            cursor.execute("SELECT * FROM lote")
            lotes = [dict(row) for row in cursor.fetchall()]
        return jsonify(lotes)
    except Exception as e:
        logging.error(f"Erro ao listar lotes: {str(e)}")
        return jsonify({"error": "Erro interno no servidor"}), 500

@app.route("/api/lotes/<string:produto_sku>", methods=["GET"])
def obter_lotes_com_metricas(produto_sku):
    """Obtém lotes de um produto com métricas agregadas"""
    db_conn = get_db()
    resultado = Manager.obter_lotes(db_conn, produto_sku)
    
    if not resultado["lotes"]:
        return jsonify({
            "error": "Produto não encontrado ou sem lotes registrados",
            "produto_sku": produto_sku
        }), 404
    
    return jsonify(resultado), 200

@app.route("/api/vendas", methods=["GET"])
def listar_vendas():
    """Lista vendas com filtros opcionais"""
    data = request.args.get('data')
    sku = request.args.get('sku')
    
    try:
        db_conn = get_db()
        cursor = db_conn.cursor()
        
        query = "SELECT * FROM venda WHERE 1=1"
        params = []
        
        if data:
            query += " AND data = ?"
            params.append(data)
        if sku:
            query += " AND produto_sku = ?"
            params.append(sku)
            
        cursor.execute(query, params)
        vendas = [dict(row) for row in cursor.fetchall()]
        return jsonify(vendas)
    except Exception as e:
        logging.error(f"Erro ao listar vendas: {str(e)}")
        return jsonify({"error": "Erro interno no servidor"}), 500

@app.route("/api/previsoes", methods=["GET"])
def listar_previsoes():
    """Lista previsões com filtros opcionais"""
    sku = request.args.get('sku')
    data_inicio = request.args.get('data_inicio')
    data_fim = request.args.get('data_fim')
    
    try:
        db_conn = get_db()
        previsoes = PrevisaoRepository.buscar_previsoes(
            db_conn, sku, data_inicio, data_fim
        )
        return jsonify(previsoes)
    except Exception as e:
        logging.error(f"Erro ao listar previsões: {str(e)}")
        return jsonify({"error": "Erro interno no servidor"}), 500

@app.route("/api/disponibilidade/<string:produto_sku>", methods=["GET"])
def obter_disponibilidade(produto_sku):
    """Obtém quantidade disponível para um produto"""
    data = request.args.get('data')
    try:
        db_conn = get_db()
        data_obj = datetime.strptime(data, "%Y-%m-%d").date() if data else None
        disponibilidade = Manager.calcular_qtd_disponivel(db_conn, produto_sku, data_obj)
        return jsonify({
            "produto_sku": produto_sku,
            "data": data or datetime.now().strftime("%Y-%m-%d"),
            "quantidade_disponivel": disponibilidade
        })
    except Exception as e:
        logging.error(f"Erro ao calcular disponibilidade: {str(e)}")
        return jsonify({"error": "Erro interno no servidor"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)