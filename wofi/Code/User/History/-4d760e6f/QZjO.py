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

    print(f"R(t) do dia anterior: {R_t1}")

    # 4. Aplicar fórmula principal
    R_t = (Vp_t2 + k_seg * m_t2 - alpha * R_t1) / alpha

    # 5. Aplicar restrições
    demanda_media = VendaRepository.obter_demanda_media(conn, produto_sku)
    R_max = (2 * demanda_media) / alpha

    R_t = max(0, R_t)  # Não pode ser negativo
    R_t = min(R_t, R_max)  # depois adicionar capacidade

    return R_t


def registrar_venda(conn, produto_sku, data, quantidade):
    """Registra uma venda real no sistema"""
    cursor = conn.cursor()
    data_str = data.strftime("%Y-%m-%d")

    # Registrar a venda
    cursor.execute(
        """
            INSERT INTO venda (data, quantidade, produto_sku)
            VALUES (?, ?, ?)
        """,
        (data_str, quantidade, produto_sku),
    )
    
    # Atualizar os lotes após registrar a venda
    conn.commit()
    logging.info(f"Venda registrada: {quantidade}kg para produto {produto_sku}")


def atualizar_lotes(conn, produto_sku, data, quantidade):
    """Atualiza os lotes após uma venda, seguindo a política FIFO"""
    cursor = conn.cursor()
    data_str = data.strftime("%Y-%m-%d")

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
    quantidade_restante = quantidade

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

        # 4. (Opcional) Simular vendas do dia
        # Em produção, isso seria feito no final do dia com dados reais
        # fazer um jeito de trazer as vendas do dia
        # registrar_venda(conn, produto_sku, data_hoje, 50.0)

        return True
    except Exception as e:
        logging.error(f"Erro no fluxo diário: {str(e)}")
        return False


def fechar(conn, self):
    conn.close()


def realizar_previsao(conn):
    previsao.importar_vendas_csv(conn, Path("src/data/dados_zenith.csv"))
    previsao.prever(conn)
