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

@app.route("/api/retirada/<string:produto_sku>", methods=["POST"])
def executar_fluxo_diario(produto_sku):
    db_conn = get_db()  # 1. Pega a conexão segura para a requisição
    sucesso = Manager.executar_fluxo_diario(db_conn, produto_sku)
    if sucesso:
        return jsonify({"message": "Fluxo diário executado com sucesso."}), 200
    else:
        return jsonify({"message": "Erro ao executar o fluxo diário."}), 500


@app.route("/api/lotes/<string:produto_sku>", methods=["GET"])
def obter_lotes(produto_sku):
    """
    Retorna todos os lotes de um produto específico
    
    Args:
        produto_sku: SKU do produto
    
    Returns:
        200: Lista de lotes e métricas agregadas
        404: Produto não encontrado
    """
    db_conn = get_db()
    resultado = Manager.obter_lotes(db_conn, produto_sku)
    
    if not resultado["lotes"]:
        return jsonify({
            "error": "Produto não encontrado ou sem lotes registrados",
            "produto_sku": produto_sku
        }), 404
    
    return jsonify(resultado), 200


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
    """
    Registra uma venda para um produto específico
    Payload esperado:
    {
        "quantidade": float
    }
    """
    data = request.get_json()
    if not data or 'quantidade' not in data:
        return jsonify({"error": "Quantidade não informada no payload"}), 400
    
    quantidade_solicitada = float(data['quantidade'])
    if quantidade_solicitada <= 0:
        return jsonify({"error": "Quantidade deve ser maior que zero"}), 400

    data_hoje = datetime.now().date()
    db_conn = get_db()
    
    quantidade_vendida = Manager.registrar_venda(db_conn, produto_sku, data_hoje, quantidade_solicitada)
    
    response = {
        "message": "Venda Registrada" if quantidade_vendida > 0 else "Venda não realizada - sem estoque",
        "produto_sku": produto_sku,
        "quantidade_solicitada_da_venda": quantidade_solicitada,
        "quantidade_vendida": quantidade_vendida,
        "data": data_hoje.strftime("%Y-%m-%d")
    }
    
    status_code = 201 if quantidade_vendida > 0 else 404
    return jsonify(response), status_code



if __name__ == "__main__":
    app.run(debug=True)
