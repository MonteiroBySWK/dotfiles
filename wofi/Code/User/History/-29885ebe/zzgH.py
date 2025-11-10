from flask import Flask, render_template, request, g
from flask.json import jsonify
from flasgger import Swagger, swag_from
import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta

import src.manager as Manager
import src.database as Database

import sqlite3

DATABASE = "src/data/data.db"

app = Flask(__name__)
swagger = Swagger(app)


def get_db():
    """
    Abre uma nova conexão com o banco de dados se não houver uma ativa
    no contexto desta requisição.
    """
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row  # Permite acessar colunas pelo nome
    return db


@app.teardown_appcontext
def close_connection(exception):
    """
    Fecha a conexão com o banco de dados automaticamente ao final da requisição.
    """
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["GET"])
def upload():
    return render_template("upload.html")


def read_file(file):
    if file.filename.endswith(".csv"):
        df = pd.read_csv(file)
    elif file.filename.endswith((".xls", ".xlsx")):
        df = pd.read_excel(file)
    else:
        return jsonify({"error": "Formato de arquivo não suportado"}), 400

    result = {
        "linhas": df.shape[0],
        "colunas": df.shape[1],
        "colunas_nome": df.columns.tolist(),
    }

    return result


def predict_model(data):
    # Modelo de predição aqui, retornar um excel?
    # Não sei se é pra retornar a previsão de um dia ou de uma determinada serie
    ...


@app.route("/predict", methods=["POST"])
def predict():
    # Essa função deve ser melhor pensada
    if "file" not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400

    file = request.files["file"]

    result = read_file(file)

    # aqui vem o predict(data)
    # puta merda isso tá muito mal escrito

    return jsonify(result), 200


@app.route("/report")
def report():
    # gerar o relatorio ou algo assim não se vai ficar assim no final
    ...


@app.route("/dashboard")
def dashboard():
    data = {"algo1": 1}
    return jsonify(data)


@app.route("/api/retirada/<string:produto_sku>", methods=["POST"])
def executar_fluxo_diario(produto_sku):
    db_conn = get_db()  # 1. Pega a conexão segura para a requisição
    sucesso = Manager.executar_fluxo_diario(db_conn, produto_sku)
    if sucesso:
        return jsonify({"message": "Fluxo diário executado com sucesso."}), 200
    else:
        return jsonify({"message": "Erro ao executar o fluxo diário."}), 500


@app.route("/api/registrar-venda")
def venda(): ...


# Isso provavelmente tá errado
@app.route("/api/lotes/<string:produto_sku>", methods=["GET"])
def obter_lotes(produto_sku):
    cursor = Manager.conn.cursor()
    cursor.execute("SELECT * FROM lote WHERE produto_sku = ?", (produto_sku,))
    lotes = cursor.fetchall()
    return jsonify([dict(lote) for lote in lotes]), 200


@app.route("/api/criar_db", methods=["POST"])
def criar_banco():
    db_conn = get_db()  # 1. Pega a conexão segura para a requisição
    Database.criar_banco_e_tabelas(db_conn)
    return jsonify({"message": "Banco de dados criado com sucesso."}), 201


@app.route("/api/prever", methods=["POST"])
def prever_rota():
    db_conn = get_db()
    Manager.realizar_previsao(db_conn)
    return jsonify({"message": "Previsão feita"}), 201


@app.route("/api/registrar-venda/<string:produto_sku>", methods=["POST"])
def registrar_venda_rota(produto_sku: str):
    data_hoje = datetime.now().date()
    quantidade = 0  # pegar no payload

    db_conn = get_db()
    Manager.registrar_venda(db_conn, produto_sku, data_hoje, quantidade)


if __name__ == "__main__":
    app.run(debug=True)
