import sqlite3
import logging
from queue import Queue
from typing import Dict, List
from datetime import datetime, timedelta


def buscar_lotes_por_produto_em_fila(
    conn: sqlite3.Connection, sku: str, data_atual: str
) -> Queue:
    """
    Busca lotes disponíveis e sobras de um produto, ordenados para consumo FIFO

    Args:
        conn: Conexão com o banco de dados
        sku: SKU do produto
        data_atual: Data atual para filtro

    Returns:
        Queue: Fila de lotes ordenados por prioridade de consumo
    """
    # Obtém todos os lotes do produto
    lotes = obter_lotes_por_sku(conn, sku)

    # Filtra e ordena os lotes para consumo
    lotes_para_consumo = [
        lote
        for lote in lotes
        if lote["status"] in ("sobra", "disponivel")
        and lote["data_venda"] <= datetime.strptime(data_atual, "%Y-%m-%d").date()
    ]

    # Ordena por: sobras primeiro, depois menor quantidade, depois mais antigo
    lotes_para_consumo.sort(
        key=lambda x: (
            0 if x["status"] == "sobra" else 1,  # sobras primeiro
            x["quantidade_atual"],  # menor quantidade
            x["data_retirado"],  # mais antigo
        )
    )

    # Converte para Queue
    fila = Queue()
    for lote in lotes_para_consumo:
        fila.put(lote)

    return fila


def criar_lote(conn: sqlite3.Connection, produto_sku, quantidade_bruta, data_retirada):
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
                produto_sku
            ) VALUES (?, ?, 0, 'descongelando', ?, ?, ?, ?)
        """,
        (
            quantidade_liquida,  # quantidade_retirada
            quantidade_liquida,  # quantidade_atual (saldo inicial igual ao retirado)
            data_retirada.strftime("%Y-%m-%d"),
            data_venda.strftime("%Y-%m-%d"),
            data_expiracao.strftime("%Y-%m-%d"),
            produto_sku,
        ),
    )
    conn.commit()
    logging.info(
        f"Novo lote criado: {quantidade_bruta:.2f}kg bruto -> {quantidade_liquida:.2f}kg líquido"
    )


def obter_retirada_anterior(conn: sqlite3.Connection, produto_sku, data_hoje):
    """Obtém a retirada do dia anterior (t-1) para o produto"""
    data_ontem = (data_hoje - timedelta(days=1)).strftime("%Y-%m-%d")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT quantidade_retirada FROM lote WHERE produto_sku = ? AND data_retirado = ?",
        (produto_sku, data_ontem),
    )
    row = cursor.fetchone()
    return row["quantidade_retirada"] if row else 0.0


def atualizar_status_lotes_diario(conn: sqlite3.Connection, data_hoje):
    """Atualiza o status dos lotes baseado na data atual"""
    cursor = conn.cursor()
    data_hoje_str = data_hoje.strftime("%Y-%m-%d")

    # Gerar uma função para cada
    # Atualizar lotes que estão prontos para venda
    cursor.execute(
        """
            UPDATE lote
            SET status = 'disponivel'
            WHERE data_venda = ? AND status = 'descongelando'
        """,
        (data_hoje_str,),
    )

    # Atualizar lotes que se tornam sobra
    cursor.execute(
        """
            UPDATE lote
            SET status = 'sobra'
            WHERE data_venda < ? AND status = 'disponivel' AND  quantidade_atual > 0
        """,
        (data_hoje_str,),
    )

    # Atualizar lotes que expiraram
    cursor.execute(
        """
            UPDATE lote
            SET status = 'perda'
            WHERE data_expiracao
             <= ? AND status IN ('disponivel', 'sobra')
        """,
        (data_hoje_str,),
    )

    cursor.execute(
        """
            UPDATE lote
            SET status  = 'vendido'
            WHERE data_venda <= ? AND status IN ('disponivel', 'sobra') AND quantidade_atual = 0
        """,
        (data_hoje_str,),
    )

    conn.commit()
    logging.info("Status dos lotes atualizados")


def obter_lotes_por_sku(conn, produto_sku):
    """
    Retorna todos os lotes de um determinado produto

    Args:
        conn: Conexão com o banco de dados
        produto_sku: SKU do produto

    Returns:
        list: Lista de dicionários com os dados dos lotes
    """
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT 
            id,
            produto_sku,
            quantidade_retirada,
            quantidade_atual,
            status,
            data_retirado,
            data_venda
        FROM lote 
        WHERE produto_sku = ?
        ORDER BY data_retirado DESC
        """,
        (produto_sku,),
    )

    # Converter os resultados em lista de dicionários
    colunas = [description[0] for description in cursor.description]
    lotes = []

    for row in cursor.fetchall():
        lote = dict(zip(colunas, row))
        # Converter datas de string para objeto date
        if lote["data_retirado"]:
            lote["data_retirado"] = datetime.strptime(
                lote["data_retirado"], "%Y-%m-%d"
            ).date()
        if lote["data_venda"]:
            lote["data_venda"] = datetime.strptime(
                lote["data_venda"], "%Y-%m-%d"
            ).date()
        lotes.append(lote)

    return lotes


def obter_lotes_por_status(conn: sqlite3.Connection, status: str):
    """
    Retorna todos os lotes com um determinado status.

    Args:
        conn: Conexão com o banco de dados.
        status: O status dos lotes a serem buscados (ex: 'disponivel', 'descongelando', 'sobra', 'perda', 'vendido').

    Returns:
        list: Uma lista de dicionários, onde cada dicionário representa um lote.
    """
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT
            id,
            produto_sku,
            quantidade_retirada,
            quantidade_atual,
            status,
            data_retirado,
            data_venda,
            data_expiracao
        FROM lote
        WHERE status = ?
        ORDER BY data_retirado DESC
        """,
        (status,),
    )

    colunas = [description[0] for description in cursor.description]
    lotes = []

    for row in cursor.fetchall():
        lote = dict(zip(colunas, row))
        if lote["data_retirado"]:
            lote["data_retirado"] = datetime.strptime(
                lote["data_retirado"], "%Y-%m-%d"
            ).date()
        if lote["data_venda"]:
            lote["data_venda"] = datetime.strptime(
                lote["data_venda"], "%Y-%m-%d"
            ).date()
        if lote["data_expiracao"]:
            lote["data_expiracao"] = datetime.strptime(
                lote["data_expiracao"], "%Y-%m-%d"
            ).date()
        lotes.append(lote)

    return lotes


def obter_todos_lotes_ativos(conn: sqlite3.Connection) -> List[Dict]:
    """
    Retorna todos os lotes que estão em status 'descongelando', 'disponivel' ou 'sobra'.

    Args:
        conn: Conexão com o banco de dados.

    Returns:
        list: Uma lista de dicionários, onde cada dicionário representa um lote ativo.
    """
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT
            id,
            produto_sku,
            quantidade_retirada,
            quantidade_atual,
            status,
            data_retirado,
            data_venda,
            data_expiracao
        FROM lote
        WHERE status IN ('descongelando', 'disponivel', 'sobra')
        ORDER BY data_retirado DESC
        """
    )

    colunas = [description[0] for description in cursor.description]
    lotes = []

    for row in cursor.fetchall():
        lote = dict(zip(colunas, row))
        if lote["data_retirado"]:
            lote["data_retirado"] = datetime.strptime(
                lote["data_retirado"], "%Y-%m-%d"
            ).date()
        if lote["data_venda"]:
            lote["data_venda"] = datetime.strptime(
                lote["data_venda"], "%Y-%m-%d"
            ).date()
        if lote["data_expiracao"]:
            lote["data_expiracao"] = datetime.strptime(
                lote["data_expiracao"], "%Y-%m-%d"
            ).date()
        lotes.append(lote)

    return lotes
