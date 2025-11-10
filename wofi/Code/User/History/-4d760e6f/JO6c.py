from datetime import datetime, timedelta
import sqlite3
import numpy as np
import logging
from pathlib import Path

import src.repositories.PrevisaoRepository as PrevisaoRepository
import src.repositories.VendaRepository as VendaRepository
import src.repositories.LoteRepository as LoteRepository

import src.previsao as previsao

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

k_seg = 1.65  # Fator de segurança para 95% de confiança
alpha = 0.85  # Fator de retração (15% de perda)
validade_dias = 2  # Validade após descongelamento


def calcular_desvio_padrao(conn, produto_sku):
    """Calcula o desvio padrão dos erros de previsão"""
    cursor = conn.cursor()
    cursor.execute(
        """
            SELECT p.quantidade_prevista, v.quantidade
            FROM previsao p
            JOIN venda v ON p.produto_sku = v.produto_sku AND p.data = v.data
            WHERE p.produto_sku = ? 
            ORDER BY p.data DESC
            LIMIT 30
        """,
        (produto_sku,),
    )

    dados = cursor.fetchall()
    if not dados:
        return 0.0

    erros = [row["quantidade"] - row["quantidade_prevista"] for row in dados]
    return np.std(erros)


def calcular_retirada(conn, produto_sku, data_hoje):
    """
    Calcula R(t) - quantidade a ser retirada hoje (kg brutos)

    :param produto_sku: SKU do produto
    :param data_hoje: Data atual (dia t)
    :return: Quantidade em kg a ser retirada
    """
    # 1. Obter previsão para t+2
    data_venda = data_hoje + timedelta(days=2)

    Vp_t2 = PrevisaoRepository.obter_previsao(conn, produto_sku, data_venda)

    if Vp_t2 is None:
        # Fallback para demanda média se não houver previsão
        Vp_t2 = VendaRepository.obter_demanda_media(conn, produto_sku)
        logging.warning(
            f"Previsão não encontrada para produto {produto_sku}. Usando demanda média: {Vp_t2}"
        )

    # 2. Calcular desvio padrão para t+2
    m_t2 = calcular_desvio_padrao(conn, produto_sku)  # MUDAR URGENTE

    # 3. Obter retirada do dia anterior (t-1)
    R_t1 = LoteRepository.obter_retirada_anterior(conn, produto_sku, data_hoje)

    # 4. Aplicar fórmula principal
    R_t = (Vp_t2 + k_seg * m_t2 - alpha * R_t1) / alpha

    # 5. Aplicar restrições
    demanda_media = VendaRepository.obter_demanda_media(conn, produto_sku)
    R_max = (2 * demanda_media) / alpha

    R_t = max(0, R_t)  # Não pode ser negativo
    R_t = min(R_t, R_max)  # depois adicionar capacidade

    return R_t


def registrar_venda(conn, produto_sku, data, quantidade):
    """Registra uma venda real e atualiza os lotes"""
    cursor = conn.cursor()
    data_str = data.strftime("%Y-%m-%d")

    # 1. Verificar quantidade disponível usando a fórmula D(t)
    total_disponivel = calcular_qtd_disponivel(conn, produto_sku, data)
    quantidade_efetiva = min(quantidade, total_disponivel)

    if quantidade_efetiva <= 0:
        logging.warning(
            f"Venda não registrada: não há estoque disponível para o produto {produto_sku}"
        )
        return 0

    # 2. Registrar apenas a quantidade que pode ser atendida
    cursor.execute(
        """
            INSERT INTO venda (data, quantidade, produto_sku)
            VALUES (?, ?, ?)
        """,
        (data_str, quantidade_efetiva, produto_sku),
    )

    # 3. Atualizar lotes (FIFO)
    cursor.execute(
        """
            SELECT id, quantidade_atual
            FROM lote
            WHERE produto_sku = ? 
            AND status IN ('disponivel', 'sobra')
            AND data_venda <= ?
            ORDER BY data_retirado
        """,
        (produto_sku, data_str),
    )

    lotes = cursor.fetchall()
    quantidade_restante = quantidade_efetiva

    for lote in lotes:
        lote_id, qtd_lote = lote["id"], lote["quantidade_atual"]
        if quantidade_restante <= 0:
            break

        # Calcular quanto podemos consumir deste lote
        consumo = min(qtd_lote, quantidade_restante)
        nova_quantidade = qtd_lote - consumo
        quantidade_restante -= consumo

        # Atualizar a quantidade no lote
        cursor.execute(
            """
                UPDATE lote
                SET quantidade_atual = ?
                WHERE id = ?
            """,
            (nova_quantidade, lote_id),
        )

        # Se o lote zerou, marcamos como vendido
        if nova_quantidade <= 0:
            cursor.execute(
                """
                    UPDATE lote
                    SET status = 'vendido'
                    WHERE id = ?
                """,
                (lote_id,),
            )

    conn.commit()

    if quantidade_efetiva < quantidade:
        logging.warning(
            f"Venda parcial: solicitado {quantidade}kg, vendido {quantidade_efetiva}kg para produto {produto_sku}"
        )
    else:
        logging.info(
            f"Venda registrada: {quantidade_efetiva}kg para produto {produto_sku}"
        )

    return quantidade_efetiva  # Retorna a quantidade que foi efetivamente vendida


def executar_fluxo_diario(conn, produto_sku):
    """Executa todo o fluxo diário para um produto"""
    data_hoje = datetime.now().date()

    try:
        # 1. Atualizar status dos lotes
        LoteRepository.atualizar_status_lotes_diario(conn, data_hoje)

        # 2. Calcular retirada para hoje
        R_t = calcular_retirada(conn, produto_sku, data_hoje)
        logging.info(f"Produto {produto_sku}: Quantidade a retirar hoje: {R_t:.2f}kg")

        # 3. Criar novo lote com a retirada calculada
        LoteRepository.criar_lote(conn, produto_sku, R_t, data_hoje)

        return True
    except Exception as e:
        logging.error(f"Erro no fluxo diário: {str(e)}")
        return False


def calcular_qtd_disponivel(conn, produto_sku, data=None):
    """
    Calcula a quantidade disponível D(t) para o dia t
    D(t) = 0.85*R(t-2) + S(t-1)
    S(t-1) = D(t-1) - V(t-1) - P(t-1)

    Args:
        conn: Conexão com o banco de dados
        produto_sku: SKU do produto
        data: Data para cálculo (se None, usa a data atual)

    Returns:
        float: Quantidade disponível para o dia
    """
    if data is None:
        data = datetime.now().date()

    cursor = conn.cursor()

    # Calcular R(t-2): quantidade retirada há 2 dias
    data_retirada = data - timedelta(days=2)
    cursor.execute(
        """
        SELECT COALESCE(SUM(quantidade_inicial), 0) as retirada
        FROM lote
        WHERE produto_sku = ? AND DATE(data_retirado) = ?
        """,
        (produto_sku, data_retirada.strftime("%Y-%m-%d")),
    )
    R_t2 = cursor.fetchone()["retirada"]

    # Calcular D(t-1): quantidade disponível ontem
    data_ontem = data - timedelta(days=1)
    cursor.execute(
        """
        SELECT COALESCE(SUM(quantidade_atual), 0) as disponivel_ontem
        FROM lote
        WHERE produto_sku = ? 
        AND DATE(data_retirado) <= ?
        AND status IN ('disponivel', 'sobra')
        """,
        (produto_sku, data_ontem.strftime("%Y-%m-%d")),
    )
    D_t1 = cursor.fetchone()["disponivel_ontem"]

    # Calcular V(t-1): vendas de ontem
    cursor.execute(
        """
        SELECT COALESCE(SUM(quantidade), 0) as vendas_ontem
        FROM venda
        WHERE produto_sku = ? AND DATE(data) = ?
        """,
        (produto_sku, data_ontem.strftime("%Y-%m-%d")),
    )
    V_t1 = cursor.fetchone()["vendas_ontem"]

    # Calcular P(t-1): perdas de ontem (lotes que venceram)
    cursor.execute(
        """
        SELECT COALESCE(SUM(quantidade_atual), 0) as perdas_ontem
        FROM lote
        WHERE produto_sku = ?
        AND DATE(data_retirado) = ?
        AND status = 'vencido'
        """,
        (produto_sku, data_ontem.strftime("%Y-%m-%d")),
    )
    P_t1 = cursor.fetchone()["perdas_ontem"]

    # Calcular S(t-1): sobra de ontem
    S_t1 = D_t1 - V_t1 - P_t1

    # Calcular D(t): quantidade disponível hoje
    D_t = alpha * R_t2 + S_t1

    logging.info(
        f"""
        Cálculo de disponibilidade para {produto_sku} em {data}:
        R(t-2) = {R_t2:.2f}kg (retirada há 2 dias)
        D(t-1) = {D_t1:.2f}kg (disponível ontem)
        V(t-1) = {V_t1:.2f}kg (vendas ontem)
        P(t-1) = {P_t1:.2f}kg (perdas ontem)
        S(t-1) = {S_t1:.2f}kg (sobra ontem)
        D(t) = {D_t:.2f}kg (disponível hoje)
    """
    )

    return max(0, D_t)  # Não pode ser negativo


def realizar_previsao(conn):
    previsao.importar_vendas_csv(conn, Path("src/data/dados_zenith.csv"))
    previsao.prever(conn)


def obter_lotes(conn, produto_sku):
    """
    Obtém todos os lotes de um produto específico
    
    Args:
        conn: Conexão com o banco de dados
        produto_sku: SKU do produto
    
    Returns:
        dict: Informações dos lotes e métricas agregadas
    """
    lotes = LoteRepository.obter_lotes_por_sku(conn, produto_sku)
    
    # Calcular métricas agregadas
    total_disponivel = sum(
        lote['quantidade_atual'] 
        for lote in lotes 
        if lote['status'] in ('disponivel', 'sobra')
    )
    
    total_inicial = sum(lote['quantidade_inicial'] for lote in lotes)
    total_atual = sum(lote['quantidade_atual'] for lote in lotes)
    
    # Contar lotes por status
    status_count = {}
    for lote in lotes:
        status = lote['status']
        status_count[status] = status_count.get(status, 0) + 1
    
    return {
        "lotes": lotes,
        "metricas": {
            "total_disponivel": total_disponivel,
            "total_inicial": total_inicial,
            "total_atual": total_atual,
            "quantidade_lotes": len(lotes),
            "lotes_por_status": status_count
        }
    }
