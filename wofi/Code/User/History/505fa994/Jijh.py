import sqlite3
import logging
from typing import List, Dict


def buscar_produtos(conn: sqlite3.Connection) -> List[Dict]:
    cursor = conn.cursor()
    cursor.execute("SELECT sku, nome, categoria FROM produto")
    linhas = cursor.fetchall()

    produtos = []
    for sku, nome, categoria in linhas:
        produtos.append({"sku": sku, "nome": nome, "categoria": categoria})
    return produtos


def buscar_nome_produto(conn: sqlite3.Connection, sku: str) -> str:
    """
    Busca o nome de um produto pelo seu SKU.

    Args:
        conn: Conexão com o banco de dados.
        sku: O SKU do produto.

    Returns:
        str: O nome do produto, ou None se o produto não for encontrado.
    """
    cursor = conn.cursor()
    cursor.execute("SELECT nome FROM produto WHERE sku = ?", (sku,))
    row = cursor.fetchone()
    return row[0] if row else None
