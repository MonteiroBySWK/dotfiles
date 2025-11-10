from datetime import datetime, timedelta
import sqlite3
import numpy as np
import logging
from pathlib import Path
import pandas as pd

import src.repositories.PrevisaoRepository as PrevisaoRepository
import src.repositories.VendaRepository as VendaRepository
import src.repositories.LoteRepository as LoteRepository
import src.repositories.ProdutoRepository as ProdutoRepository

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
        SELECT COALESCE(SUM(quantidade_retirada), 0) as retirada
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
        lote["quantidade_atual"]
        for lote in lotes
        if lote["status"] in ("disponivel", "sobra")
    )

    total_inicial = sum(lote["quantidade_retirada"] for lote in lotes)
    total_atual = sum(lote["quantidade_atual"] for lote in lotes)

    # Contar lotes por status
    status_count = {}
    for lote in lotes:
        status = lote["status"]
        status_count[status] = status_count.get(status, 0) + 1

    return {
        "lotes": lotes,
        "metricas": {
            "total_disponivel": total_disponivel,
            "total_inicial": total_inicial,
            "total_atual": total_atual,
            "quantidade_lotes": len(lotes),
            "lotes_por_status": status_count,
        },
    }


def obter_metricas_dashboard(conn):
    """Obtém métricas consolidadas e detalhadas para o dashboard"""
    cursor = conn.cursor()
    hoje = datetime.now().date()

    # 1. Métricas gerais
    cursor.execute("SELECT COUNT(*) FROM produto")
    total_produtos = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COALESCE(SUM(quantidade), 0) FROM venda WHERE data = ?",
        (hoje.strftime("%Y-%m-%d"),),
    )
    vendas_hoje = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT COALESCE(SUM(quantidade_atual), 0) 
        FROM lote 
        WHERE status IN ('disponivel', 'sobra')
    """
    )
    estoque_total = cursor.fetchone()[0]

    # 2. Produtos mais vendidos (top 5)
    cursor.execute(
        """
        SELECT p.sku, p.nome, SUM(v.quantidade) as total_vendido
        FROM venda v
        JOIN produto p ON v.produto_sku = p.sku
        WHERE v.data >= date('now', '-7 days')
        GROUP BY p.sku
        ORDER BY total_vendido DESC
        LIMIT 5
    """
    )
    top_produtos = [
        dict(zip(("sku", "nome", "total_vendido"), row)) for row in cursor.fetchall()
    ]

    # 3. Lotes próximos ao vencimento
    cursor.execute(
        """
        SELECT l.id, p.nome, l.quantidade_atual, l.data_expiracao, 
               julianday(l.data_expiracao) - julianday('now') as dias_restantes
        FROM lote l
        JOIN produto p ON l.produto_sku = p.sku
        WHERE l.status IN ('disponivel', 'sobra')
          AND dias_restantes BETWEEN 0 AND 3
        ORDER BY dias_restantes ASC
    """
    )
    lotes_proximo_vencer = []
    for row in cursor.fetchall():
        lotes_proximo_vencer.append(
            {
                "id": row[0],
                "nome_produto": row[1],
                "quantidade": row[2],
                "data_expiracao": row[3],
                "dias_restantes": int(row[4]) if row[4] else 0,
            }
        )

    # 4. Evolução de vendas (últimos 7 dias)
    cursor.execute(
        """
        SELECT date(v.data) as dia, COALESCE(SUM(v.quantidade), 0) as total
        FROM venda v
        WHERE v.data >= date('now', '-7 days')
        GROUP BY dia
        ORDER BY dia ASC
    """
    )
    evolucao_vendas = [{"dia": row[0], "total": row[1]} for row in cursor.fetchall()]

    # 5. Previsões de demanda (próximos 3 dias)
    cursor.execute(
        """
        SELECT p.data, SUM(p.quantidade_prevista) as total_previsto
        FROM previsao p
        WHERE p.data BETWEEN date('now') AND date('now', '+3 days')
        GROUP BY p.data
        ORDER BY p.data ASC
    """
    )
    previsoes = [{"data": row[0], "quantidade": row[1]} for row in cursor.fetchall()]

    # 6. Status de estoque por categoria
    cursor.execute(
        """
        SELECT p.categoria, 
               SUM(l.quantidade_atual) as estoque,
               COUNT(DISTINCT p.sku) as produtos
        FROM lote l
        JOIN produto p ON l.produto_sku = p.sku
        WHERE l.status IN ('disponivel', 'sobra')
        GROUP BY p.categoria
    """
    )
    estoque_por_categoria = []
    for row in cursor.fetchall():
        estoque_por_categoria.append(
            {"categoria": row[0], "estoque": row[1], "produtos": row[2]}
        )

    # 7. Alertas e notificações
    alertas = []
    # Alertas de estoque baixo (menos de 20% da média de vendas)
    cursor.execute(
        """
        SELECT p.sku, p.nome, 
               COALESCE(SUM(l.quantidade_atual), 0) as estoque_atual,
               (SELECT AVG(quantidade) FROM venda WHERE produto_sku = p.sku) as media_vendas
        FROM produto p
        LEFT JOIN lote l ON p.sku = l.produto_sku AND l.status IN ('disponivel', 'sobra')
        GROUP BY p.sku
        HAVING estoque_atual < (media_vendas * 0.2)
    """
    )
    for row in cursor.fetchall():
        alertas.append(
            {
                "tipo": "estoque_baixo",
                "mensagem": f"Estoque crítico: {row[1]}",
                "sku": row[0],
                "estoque_atual": row[2],
                "media_vendas": row[3],
            }
        )

    # Alertas de lotes vencendo hoje
    cursor.execute(
        """
        SELECT COUNT(*) 
        FROM lote 
        WHERE data_expiracao = ? 
          AND status IN ('disponivel', 'sobra')
    """,
        (hoje.strftime("%Y-%m-%d"),),
    )
    count_vencendo_hoje = cursor.fetchone()[0]
    if count_vencendo_hoje > 0:
        alertas.append(
            {
                "tipo": "vencimento_iminente",
                "mensagem": f"{count_vencendo_hoje} lotes vencem hoje!",
                "quantidade": count_vencendo_hoje,
            }
        )

    return {
        "resumo": {
            "total_produtos": total_produtos,
            "vendas_hoje": vendas_hoje,
            "estoque_total": estoque_total,
            "lotes_proximo_vencimento": len(lotes_proximo_vencer),
            "alertas_ativos": len(alertas),
        },
        "detalhes": {
            "top_produtos": top_produtos,
            "lotes_proximo_vencer": lotes_proximo_vencer,
            "evolucao_vendas": evolucao_vendas,
            "previsoes_demanda": previsoes,
            "estoque_por_categoria": estoque_por_categoria,
        },
        "alertas": alertas,
        "metadados": {
            "ultima_atualizacao": datetime.now().isoformat(),
            "periodo_analise": "7 dias",
        },
    }


def obter_dados_relatorio_diario(conn: sqlite3.Connection) -> list:
    """
    Gera os dados para o relatório diário, indicando:
    - Produtos a serem retirados hoje
    - Produtos em processo de descongelamento
    - Produtos já descongelados e prontos para venda
    - Lotes com idade informada (data de retirada)
    """
    hoje = datetime.now().date()
    db_conn = conn
    dados_relatorio = []

    # 1. Produtos a serem retirados hoje (baseado na previsão e cálculo de retirada)
    produtos = ProdutoRepository.buscar_produtos(db_conn)
    for produto in produtos:
        sku = produto["sku"]
        nome_produto = produto["nome"]
        quantidade_retirar = calcular_retirada(db_conn, sku, hoje)
        if quantidade_retirar > 0:
            dados_relatorio.append(
                {
                    "categoria": "A serem retirados hoje",
                    "sku": sku,
                    "nome_produto": nome_produto,
                    "quantidade_kg": round(quantidade_retirar, 2),
                    "status_lote": "n/a",
                    "idade_lote_dias": "n/a",
                }
            )

    # 2. Produtos em processo de descongelamento
    lotes_descongelando = LoteRepository.obter_lotes_por_status(
        db_conn, "descongelando"
    )
    for lote in lotes_descongelando:
        dados_relatorio.append(
            {
                "categoria": "Em processo de descongelamento",
                "sku": lote["produto_sku"],
                "nome_produto": ProdutoRepository.buscar_nome_produto(
                    db_conn, lote["produto_sku"]
                ),  # Assumindo uma função para buscar nome
                "quantidade_kg": round(lote["quantidade_atual"], 2),
                "status_lote": lote["status"],
                "idade_lote_dias": (
                    (hoje - lote["data_retirado"]).days
                    if lote["data_retirado"]
                    else "n/a"
                ),
            }
        )

    # 3. Produtos já descongelados e prontos para venda (status 'disponivel')
    lotes_disponiveis = LoteRepository.obter_lotes_por_status(db_conn, "disponivel")
    for lote in lotes_disponiveis:
        # Filtrar apenas os que foram descongelados e estão prontos para venda
        # A lógica de "pronto para venda" é que já passou pelo lead time e está disponível.
        # Poderíamos ter um status mais específico como 'pronto_venda' ou inferir pela data_venda no lote.
        # Para este exemplo, consideraremos 'disponivel' como pronto para venda.
        dados_relatorio.append(
            {
                "categoria": "Prontos para venda",
                "sku": lote["produto_sku"],
                "nome_produto": ProdutoRepository.buscar_nome_produto(
                    db_conn, lote["produto_sku"]
                ),
                "quantidade_kg": round(lote["quantidade_atual"], 2),
                "status_lote": lote["status"],
                "idade_lote_dias": (
                    (hoje - lote["data_retirado"]).days
                    if lote["data_retirado"]
                    else "n/a"
                ),
            }
        )

    # 4. Lotes com idade de lote informada (todos os lotes ativos com data de retirada)
    # Já estão incluídos nas categorias acima, mas podemos ter uma seção separada ou mais detalhada se necessário.
    # Por simplicidade, vamos garantir que todos os lotes ativos com data de retirada apareçam.
    lotes_ativos = LoteRepository.obter_todos_lotes_ativos(
        db_conn
    )  # Assumindo função para buscar todos os lotes ativos
    for lote in lotes_ativos:
        idade_lote = (
            (hoje - lote["data_retirado"]).days if lote["data_retirado"] else "n/a"
        )
        # Evita duplicidade se já listado em outras categorias mais específicas
        if {
            "categoria": "Todos os lotes ativos",  # Nova categoria para lotes gerais
            "sku": lote["produto_sku"],
            "nome_produto": ProdutoRepository.buscar_nome_produto(
                db_conn, lote["produto_sku"]
            ),
            "quantidade_kg": round(lote["quantidade_atual"], 2),
            "status_lote": lote["status"],
            "idade_lote_dias": idade_lote,
        } not in dados_relatorio:
            dados_relatorio.append(
                {
                    "categoria": "Todos os lotes ativos",
                    "sku": lote["produto_sku"],
                    "nome_produto": ProdutoRepository.buscar_nome_produto(
                        db_conn, lote["produto_sku"]
                    ),
                    "quantidade_kg": round(lote["quantidade_atual"], 2),
                    "status_lote": lote["status"],
                    "idade_lote_dias": idade_lote,
                }
            )

    return dados_relatorio

def obter_metricas_previsao(conn: sqlite3.Connection, dias_comparacao: int = 30):
    """
    Calcula e retorna as métricas de validação do modelo de previsão (MAPE, RMSE).
    Compara previsões com vendas reais dos últimos `dias_comparacao` dias.
    """
    cursor = conn.cursor()

    # Carregar vendas reais
    query_reais = """
        SELECT data, quantidade as real
        FROM venda
        WHERE data >= date('now', ?)
        ORDER BY data
    """
    df_reais = pd.read_sql_query(query_reais, conn, params=[f'-{dias_comparacao} days'])
    df_reais['data'] = pd.to_datetime(df_reais['data'])

    # Carregar previsões
    query_previsto = """
        SELECT data, quantidade_prevista as previsto
        FROM previsao
        WHERE data >= date('now', ?)
        ORDER BY data
    """
    df_previsto = pd.read_sql_query(query_previsto, conn, params=[f'-{dias_comparacao} days'])
    df_previsto['data'] = pd.to_datetime(df_previsto['data'])

    # Combinar dados reais e previsões
    df_merged = pd.merge(df_reais, df_previsto, on='data', how='inner')

    if df_merged.empty:
        logging.warning("Nenhuma data coincidente entre previsões e dados reais para o período.")
        return {'mape': None, 'rmse': None, 'ultima_atualizacao': datetime.now().isoformat(), 'message': 'Dados insuficientes para calcular métricas.'}

    # Assegurar que os arrays são numpy para os cálculos
    reais = df_merged['real'].values
    previstos = df_merged['previsto'].values

    # Calcular RMSE
    rmse = np.sqrt(mean_squared_error(reais, previstos))

    # Calcular MAPE
    # Evitar divisão por zero para quantidade_real
    # A implementação de mean_absolute_percentage_error do sklearn lida com zeros
    mape = mean_absolute_percentage_error(reais, previstos) * 100

    ultima_atualizacao = datetime.now().isoformat()

    return {
        "mape": mape,
        "rmse": rmse,
        "ultima_atualizacao": ultima_atualizacao,
        "periodo_comparacao_dias": dias_comparacao
    }