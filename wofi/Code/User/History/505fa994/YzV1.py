import sqlite3
import logging
from typing import List, Dict

def buscar_produtos(conn: sqlite3.Connection) -> List[Dict]:
    cursor = conn.cursor()
    cursor.execute("SELECT sku, nome, categoria FROM produto")
    linhas = cursor.fetchall()

    produtos = []
    for sku, nome, categoria in linhas:
        produtos.append({
            "sku": sku,
            "nome": nome,
            "categoria": categoria
        })
    return produtos