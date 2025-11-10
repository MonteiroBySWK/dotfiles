import sqlite3
import logging
import pandas as pd
from typing import Optional, List, Dict

def buscar_previsoes(conn: sqlite3.Connection, sku: Optional[str] = None,
                      data_inicio: Optional[str] = None, data_fim: Optional[str] = None) -> List[Dict]:
    cursor = conn.cursor()
    query = """
        SELECT p.id, pr.sku, p.data, p.quantidade_prevista, p.produto_id, pr.nome
        FROM previsao p
        JOIN produto pr ON p.produto_id = pr.id
        WHERE 1=1
    """
    params = []
    if sku is not None:
        query += " AND pr.sku = ?"
        params.append(sku)
    if data_inicio is not None:
        query += " AND p.data >= ?"
        params.append(data_inicio)
    if data_fim is not None:
        query += " AND p.data <= ?"
        params.append(data_fim)

    cursor.execute(query, params)
    linhas = cursor.fetchall()

    previsoes = []
    for id_, sku, data_, quantidade_prevista, produto_id_, nome_produto in linhas:
        previsoes.append({
            "id": id_,
            "sku": sku,
            "data": data_,
            "quantidade_prevista": quantidade_prevista,
            "produto_id": produto_id_,
            "nome_produto": nome_produto
        })
    return previsoes

def obter_previsao(self, produto_id, data_venda):
        """Obtém a previsão de demanda para um produto em uma data específica"""
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT quantidade_prevista FROM previsao WHERE produto_id = ? AND data = ?",
            (produto_id, data_venda.strftime("%Y-%m-%d")),
        )
        row = cursor.fetchone()
        return row["quantidade_prevista"] if row else None

def salvar_previsao_no_banco(conn: sqlite3.Connection, sku: str, nome_produto: str,
                              categoria_produto: str, data_prevista: pd.Timestamp,
                              quantidade_prevista: float):
    c = conn.cursor()
    c.execute("SELECT id FROM produto WHERE sku = ?", (sku,))
    produto = c.fetchone()

    if produto:
        produto_id = produto[0]
    else:
        c.execute(
            "INSERT INTO produto (sku, nome, categoria) VALUES (?, ?, ?)",
            (sku, nome_produto, categoria_produto)
        )
        produto_id = c.lastrowid

    data_str = data_prevista.strftime("%Y-%m-%d")
    c.execute("SELECT id FROM previsao WHERE produto_id = ? AND data = ?",
              (produto_id, data_str))
    if not c.fetchone():
        c.execute("INSERT INTO previsao (data, quantidade_prevista, produto_id) VALUES (?, ?, ?)",
                  (data_str, quantidade_prevista, produto_id))
        conn.commit()