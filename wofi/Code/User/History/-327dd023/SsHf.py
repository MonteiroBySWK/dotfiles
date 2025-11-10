from flask import Flask, jsonify, request
from src.SistemaDescongelamento import SistemaDescongelamento
from pathlib import Path

app = Flask(__name__)
sistema = SistemaDescongelamento()

@app.route('/api/retirada/<int:produto_id>', methods=['POST'])
def executar_fluxo_diario(produto_id):
    sucesso = sistema.executar_fluxo_diario(produto_id)
    if sucesso:
        return jsonify({"message": "Fluxo diário executado com sucesso."}), 200
    else:
        return jsonify({"message": "Erro ao executar o fluxo diário."}), 500

@app.route('/api/lotes/<int:produto_id>', methods=['GET'])
def obter_lotes(produto_id):
    cursor = sistema.conn.cursor()
    cursor.execute("SELECT * FROM lote WHERE produto_id = ?", (produto_id,))
    lotes = cursor.fetchall()
    return jsonify([dict(lote) for lote in lotes]), 200

@app.route('/api/criar_db', methods=['POST'])
def criar_banco():
    db_path = Path("estoque.db")
    sistema.criar_banco_e_tabelas(db_path)
    return jsonify({"message": "Banco de dados criado com sucesso."}), 201

if __name__ == '__main__':
    app.run(debug=True)