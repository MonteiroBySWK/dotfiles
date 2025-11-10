import sqlite3
import logging
from queue import Queue
from typing import Dict
from datetime import datetime, timedelta


def buscar_lotes_por_produto_em_fila(
    conn: sqlite3.Connection, sku: str, data_atual: str
) -> Queue:
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM produto WHERE sku = ?", (sku,))
    produto = cursor.fetchone()
    if not produto:
        return Queue()

    produto_id = produto[0]
    cursor.execute(
        """
        SELECT id, quantidade_retirada, quantidade_atual, idade, status, 
               data_retirado, data_venda, data_expiracao
        FROM lote
        WHERE produto_id = ?
        AND status IN ('sobra', 'disponivel')
        AND DATE(data_retirado, '+' || idade || ' days') <= DATE(?)
        ORDER BY 
            CASE status WHEN 'sobra' THEN 0 WHEN 'disponivel' THEN 1 END ASC,
            quantidade_atual ASC,
            idade ASC
    """,
        (produto_id, data_atual),
    )

    fila = Queue()
    for lote in cursor.fetchall():
        fila.put(
            {
                "id": lote[0],
                "quantidade_retirada": lote[1],
                "quantidade_atual": lote[2],
                "idade": lote[3],
                "status": lote[4],
                "data_retirado": lote[5],
                "data_venda": lote[6],
                "data_expiracao": lote[7],
            }
        )
    return fila


def criar_lote(conn: sqlite3.Connection, produto_id, quantidade_bruta, data_retirada):
    """Cria um novo lote no sistema"""
    # Quantidade líquida após retração
    quantidade_liquida = quantidade_bruta * 0.85  # ALPHA
    data_venda = data_retirada + timedelta(days=2)
    data_expiracao = data_retirada + timedelta(
        days=4
    )  # 2 dias de descongelamento + 2 dias de validade

    cursor = conn.cursor()
    cursor.execute(
        """
            INSERT INTO lote (
                quantidade_retirada,
                quantidade_atual,
                idade,
                status,
                data_retirado,
                data_venda,
                data_expiracao,
                produto_id
            ) VALUES (?, ?, 0, 'descongelando', ?, ?, ?, ?)
        """,
        (
            quantidade_liquida,  # quantidade_retirada
            quantidade_liquida,  # quantidade_atual (saldo inicial igual ao retirado)
            data_retirada.strftime("%Y-%m-%d"),
            data_venda.strftime("%Y-%m-%d"),
            data_expiracao.strftime("%Y-%m-%d"),
            produto_id,
        ),
    )
    conn.commit()
    logging.info(
        f"Novo lote criado: {quantidade_bruta:.2f}kg bruto -> {quantidade_liquida:.2f}kg líquido"
    )


def obter_retirada_anterior(self, produto_id, data_hoje):
    """Obtém a retirada do dia anterior (t-1) para o produto"""
    data_ontem = (data_hoje - timedelta(days=1)).strftime("%Y-%m-%d")
    cursor = self.conn.cursor()
    cursor.execute(
        "SELECT quantidade_retirada FROM lote WHERE produto_id = ? AND data_retirado = ?",
        (produto_id, data_ontem),
    )
    row = cursor.fetchone()
    return row["quantidade_retirada"] if row else 0.0
