


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
swagger = Swagger(
    app,
    template={
        "swagger": "2.0",
        "info": {
            "title": "Zenith Fresh API",
            "description": "Sistema de gestão de estoque e previsão de demanda",
            "version": "1.0.0",
        },
        "consumes": ["application/json"],
        "produces": ["application/json"],
        "tags": [
            {"name": "Estoque", "description": "Operações com lotes e estoque"},
            {"name": "Previsão", "description": "Previsão de demanda e análise"},
            {"name": "Vendas", "description": "Registro e gestão de vendas"},
            {"name": "Administração", "description": "Operações administrativas"},
        ],
    },
)

DATABASE = "./data/data.db"


def get_db():
    """Obtém uma conexão com o banco de dados para a requisição atual"""
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db


@app.teardown_appcontext
def close_connection(exception):
    """Fecha a conexão com o banco ao final da requisição"""
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/dashboard")
@swag_from(
    {
        "tags": ["Dashboard"],
        "description": "Métricas principais para o painel de controle",
        "responses": {
            200: {
                "description": "Dados consolidados para o dashboard",
                "examples": {
                    "application/json": {
                        "total_estoque": 3200.5,
                        "vendas_hoje": 450.2,
                        "previsao_amanha": 480.7,
                        "lotes_proximo_vencimento": 3,
                    }
                },
            }
        },
    }
)
def dashboard():
    db_conn = get_db()
    data = Manager.obter_metricas_dashboard(db_conn)
    return jsonify(data), 200


@app.route("/api/retirada/<string:produto_sku>", methods=["POST"])
@swag_from(
    {
        "tags": ["Estoque"],
        "parameters": [
            {
                "name": "produto_sku",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "SKU do produto",
            }
        ],
        "responses": {
            200: {
                "description": "Fluxo executado com sucesso",
                "examples": {
                    "application/json": {
                        "message": "Fluxo diário executado com sucesso."
                    }
                },
            },
            500: {"description": "Erro na execução do fluxo"},
        },
    }
)
def executar_fluxo_diario(produto_sku):
    db_conn = get_db()
    sucesso = Manager.executar_fluxo_diario(db_conn, produto_sku)
    if sucesso:
        return jsonify({"message": "Fluxo diário executado com sucesso."}), 200
    else:
        return jsonify({"message": "Erro ao executar o fluxo diário."}), 500


@app.route("/api/lotes/<string:produto_sku>", methods=["GET"])
@swag_from(
    {
        "tags": ["Estoque"],
        "parameters": [
            {
                "name": "produto_sku",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "SKU do produto",
            }
        ],
        "responses": {
            200: {
                "description": "Lista de lotes e métricas",
                "examples": {
                    "application/json": {
                        "lotes": [
                            {
                                "id": 1,
                                "produto_sku": "237478",
                                "quantidade_retirada": 150.0,
                                "quantidade_atual": 75.0,
                                "status": "disponivel",
                                "data_retirado": "2023-07-16",
                                "data_venda": "2023-07-18",
                            }
                        ],
                        "metricas": {
                            "total_disponivel": 320.5,
                            "total_inicial": 500.0,
                            "total_atual": 350.2,
                            "quantidade_lotes": 8,
                            "lotes_por_status": {
                                "disponivel": 5,
                                "sobra": 2,
                                "vencido": 1,
                            },
                        },
                    }
                },
            },
            404: {"description": "Produto não encontrado"},
        },
    }
)
def obter_lotes(produto_sku):
    db_conn = get_db()
    resultado = Manager.obter_lotes(db_conn, produto_sku)

    if not resultado["lotes"]:
        return (
            jsonify(
                {
                    "error": "Produto não encontrado ou sem lotes registrados",
                    "produto_sku": produto_sku,
                }
            ),
            404,
        )

    return jsonify(resultado), 200


@app.route("/api/criar_db", methods=["POST"])
@swag_from(
    {
        "tags": ["Administração"],
        "description": "Cria o banco de dados e tabelas necessárias",
        "responses": {
            201: {
                "description": "Banco criado com sucesso",
                "examples": {
                    "application/json": {
                        "message": "Banco de dados criado com sucesso."
                    }
                },
            }
        },
    }
)
def criar_banco():
    db_conn = get_db()
    Database.criar_banco_e_tabelas(db_conn)
    return jsonify({"message": "Banco de dados criado com sucesso."}), 201


@app.route("/api/prever", methods=["POST"])
@swag_from(
    {
        "tags": ["Previsão"],
        "description": "Executa rotina de previsão de demanda",
        "responses": {
            201: {
                "description": "Previsão realizada com sucesso",
                "examples": {"application/json": {"message": "Previsão feita"}},
            }
        },
    }
)
def prever_rota():
    db_conn = get_db()
    Manager.realizar_previsao(db_conn)
    return jsonify({"message": "Previsão feita"}), 201


@app.route("/api/registrar-venda/<string:produto_sku>", methods=["POST"])
@swag_from(
    {
        "tags": ["Vendas"],
        "parameters": [
            {
                "name": "produto_sku",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "SKU do produto",
            },
            {
                "name": "body",
                "in": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "quantidade": {
                            "type": "number",
                            "format": "float",
                            "example": 25.5,
                        }
                    },
                },
            },
        ],
        "responses": {
            201: {
                "description": "Venda registrada com sucesso",
                "examples": {
                    "application/json": {
                        "message": "Venda Registrada",
                        "produto_sku": "237478",
                        "quantidade_solicitada_da_venda": 25.5,
                        "quantidade_vendida": 25.5,
                        "data": "2023-07-16",
                    }
                },
            },
            400: {"description": "Dados inválidos na requisição"},
            404: {
                "description": "Estoque insuficiente",
                "examples": {
                    "application/json": {
                        "message": "Venda não realizada - sem estoque",
                        "produto_sku": "237478",
                        "quantidade_solicitada_da_venda": 25.5,
                        "quantidade_vendida": 0,
                        "data": "2023-07-16",
                    }
                },
            },
        },
    }
)
def registrar_venda_rota(produto_sku: str):
    data = request.get_json()
    if not data or "quantidade" not in data:
        return jsonify({"error": "Quantidade não informada no payload"}), 400

    quantidade_solicitada = float(data["quantidade"])
    if quantidade_solicitada <= 0:
        return jsonify({"error": "Quantidade deve ser maior que zero"}), 400

    data_hoje = datetime.now().date()
    db_conn = get_db()

    quantidade_vendida = Manager.registrar_venda(
        db_conn, produto_sku, data_hoje, quantidade_solicitada
    )

    response = {
        "message": (
            "Venda Registrada"
            if quantidade_vendida > 0
            else "Venda não realizada - sem estoque"
        ),
        "produto_sku": produto_sku,
        "quantidade_solicitada_da_venda": quantidade_solicitada,
        "quantidade_vendida": quantidade_vendida,
        "data": data_hoje.strftime("%Y-%m-%d"),
    }

    status_code = 201 if quantidade_vendida > 0 else 404
    return jsonify(response), status_code


# Nova rota para resumo do sistema
@app.route("/api/sumario", methods=["GET"])
@swag_from(
    {
        "tags": ["Dashboard"],
        "description": "Resumo geral do sistema para o dashboard",
        "responses": {
            200: {
                "description": "Métricas consolidadas",
                "examples": {
                    "application/json": {
                        "total_produtos": 10,
                        "vendas_hoje": 450.2,
                        "estoque_total": 3200.5,
                        "perdas_7dias": 120.7,
                        "lotes_proximo_vencimento": 3,
                    }
                },
            }
        },
    }
)
def resumo_sistema():
    db_conn = get_db()
    data = Manager.obter_metricas_dashboard(db_conn)
    return jsonify(data), 200


if __name__ == "__main__":
    app.run(debug=True)
