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
            "title": "Zenith API",
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


@app.route("/api/dashboard", methods=["GET"])
@swag_from(
    {
        "tags": ["Dashboard"],
        "description": "Resumo completo do sistema para o dashboard",
        "responses": {
            200: {
                "description": "Dados consolidados para o dashboard",
                "examples": {
                    "application/json": {
                        "resumo": {
                            "total_produtos": 15,
                            "vendas_hoje": 320.5,
                            "estoque_total": 2850.75,
                            "lotes_proximo_vencimento": 3,
                            "alertas_ativos": 2,
                        },
                        "detalhes": {
                            "top_produtos": [
                                {
                                    "sku": "237478",
                                    "nome": "File de Peito",
                                    "total_vendido": 125.5,
                                },
                                {
                                    "sku": "237506",
                                    "nome": "Coxa de Frango",
                                    "total_vendido": 98.2,
                                },
                            ],
                            "lotes_proximo_vencer": [
                                {
                                    "id": 45,
                                    "nome_produto": "File de Peito",
                                    "quantidade": 15.0,
                                    "data_expiracao": "2023-07-18",
                                    "dias_restantes": 1,
                                }
                            ],
                            "evolucao_vendas": [
                                {"dia": "2023-07-10", "total": 285.5},
                                {"dia": "2023-07-11", "total": 310.2},
                            ],
                            "previsoes_demanda": [
                                {"data": "2023-07-17", "quantidade": 295.8},
                                {"data": "2023-07-18", "quantidade": 302.4},
                            ],
                            "estoque_por_categoria": [
                                {
                                    "categoria": "Frango",
                                    "estoque": 1850.5,
                                    "produtos": 8,
                                },
                                {
                                    "categoria": "Suínos",
                                    "estoque": 750.3,
                                    "produtos": 4,
                                },
                            ],
                        },
                        "alertas": [
                            {
                                "tipo": "estoque_baixo",
                                "mensagem": "Estoque crítico: File de Peito",
                                "sku": "237478",
                                "estoque_atual": 18.5,
                                "media_vendas": 95.2,
                            },
                            {
                                "tipo": "vencimento_iminente",
                                "mensagem": "2 lotes vencem hoje!",
                                "quantidade": 2,
                            },
                        ],
                        "metadados": {
                            "ultima_atualizacao": "2023-07-16T14:30:45Z",
                            "periodo_analise": "7 dias",
                        },
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


@app.route("/api/retirada/all", methods=["POST"])
def retirar_todos_skus():
    ...

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
def retirar_por_sku(produto_sku):
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


@app.route("/api/vendas/historico/upload", methods=["POST"])
@swag_from(
    {
        "tags": ["Vendas"],
        "description": "Faz o upload de um arquivo com dados históricos de vendas para ingestão.",
        "parameters": [
            {
                "name": "file",  # This name must match the key used to access the file in request.files
                "in": "formData",
                "type": "file",
                "required": True,
                "description": "Arquivo CSV ou Excel com dados históricos de vendas.",
            }
        ],
        "responses": {
            200: {"description": "Dados históricos de vendas importados com sucesso."},
            400: {"description": "Nenhum arquivo enviado ou formato inválido."},
        },
    }
)
def upload_historico_vendas():
    if "file" not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado no formulário."}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Nome do arquivo vazio."}), 400

    if file:
        file_content = file.read().decode("utf-8")  # Read file content and decode

        conn = None
        try:
            conn = get_db()
            # Assuming Manager.importar_historico_vendas_do_string_csv expects a string
            Manager.importar_historico_vendas_do_string_csv(conn, file_content)
            return (
                jsonify(
                    {"message": "Dados históricos de vendas importados com sucesso."}
                ),
                200,
            )
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            print(f"Failed to import historical sales data: {e}")
            return (
                jsonify(
                    {
                        "error": "Falha ao importar dados históricos de vendas",
                        "details": str(e),
                    }
                ),
                500,
            )
        finally:
            if conn:
                conn.close()
    else:
        return jsonify({"error": "Erro no upload do arquivo."}), 500


@app.route("/api/relatorio-diario", methods=["GET"])
@swag_from(
    {
        "tags": ["Relatórios"],
        "description": "Gera um relatório diário de status de produtos e lotes.",
        "responses": {
            200: {
                "description": "Relatório diário gerado com sucesso.",
                "examples": {
                    "application/json": [
                        {
                            "categoria": "A serem retirados hoje",
                            "sku": "237478",
                            "nome_produto": "FILE DE PEITO FGO INTERF CONG KG",
                            "quantidade_kg": 50.0,
                            "status_lote": "n/a",
                            "idade_lote_dias": "n/a",
                        },
                        {
                            "categoria": "Em processo de descongelamento",
                            "sku": "237479",
                            "nome_produto": "ASA DE FGO INTERF CONG KG",
                            "quantidade_kg": 20.0,
                            "status_lote": "descongelando",
                            "idade_lote_dias": 1,
                        },
                    ]
                },
            }
        },
    }
)
def obter_relatorio_diario_rota():
    db_conn = get_db()
    data_str = request.args.get("data")
    data_relatorio = datetime.now().date()
    if data_str:
        try:
            data_relatorio = datetime.strptime(data_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Formato de data inválido. Use YYYY-MM-DD"}), 400

    relatorio = Manager.obter_dados_relatorio_diario(db_conn, data_relatorio)
    return jsonify(relatorio), 200


@app.route("/api/metricas-previsao", methods=["GET"])
@swag_from(
    {
        "tags": ["Relatórios"],
        "parameters": [
            {
                "name": "dias_comparacao",
                "in": "query",
                "type": "integer",
                "required": False,
                "default": 30,
                "description": "Número de dias para comparar previsões (padrão: 30).",
            }
        ],
        "description": "Calcula e retorna as métricas de validação do modelo de previsão (MAPE, RMSE).",
        "responses": {
            200: {
                "description": "Métricas de previsão calculadas com sucesso.",
                "examples": {
                    "application/json": {
                        "mape": 12.5,
                        "rmse": 15.7,
                        "ultima_atualizacao": "2023-07-16T15:00:00.000000",
                        "periodo_comparacao_dias": 30,
                    }
                },
            }
        },
    }
)
def obter_metricas_previsao_rota():
    db_conn = get_db()
    dias_comparacao_str = request.args.get("dias_comparacao", "30")
    try:
        dias_comparacao = int(dias_comparacao_str)
    except ValueError:
        return jsonify({"error": "dias_comparacao deve ser um número inteiro."}), 400

    metricas = Manager.obter_metricas_previsao(db_conn, dias_comparacao)
    return jsonify(metricas), 200


if __name__ == "__main__":
    app.run(debug=True)
