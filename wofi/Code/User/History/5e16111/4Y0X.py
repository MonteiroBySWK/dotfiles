import sqlite3
import logging
from datetime import date


def salvar_venda_no_banco(
    conn: sqlite3.Connection, sku: str, data_venda: str, quantidade: float
):
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM produto WHERE sku = ?", (sku,))
    resultado = cursor.fetchone()

    if not resultado:
        return

    produto_id = resultado[0]
    cursor.execute(
        "INSERT INTO venda (data, quantidade, produto_id) VALUES (?, ?, ?)",
        (data_venda, quantidade, produto_id),
    )
    conn.commit()


def buscar_total_vendido_no_dia(
    conn: sqlite3.Connection, data_venda: str = None
) -> float:
    cursor = conn.cursor()
    if data_venda is None:
        data_venda = date.today().isoformat()

    cursor.execute("SELECT SUM(quantidade) FROM venda WHERE data = ?", (data_venda,))
    resultado = cursor.fetchone()
    return resultado[0] if resultado[0] else 0.0


def obter_demanda_media(conn: sqlite3.Connection, produto_id):
    """Calcula a demanda média do produto"""
    cursor = conn.cursor()
    cursor.execute(
        "SELECT AVG(quantidade) FROM venda WHERE produto_id = ?", (produto_id,)
    )
    row = cursor.fetchone()
    return row[0] if row[0] else 0.0
