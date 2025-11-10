"""
Descongelamento Diário – Filial 7, Grupo Mateus

Este script executa um pipeline simples de forecast e alocação de 
estoque de produtos no fluxo de descongelamento. Para um SKU único,
você obtém:

  1) relatorio_diario.csv – para cada dia futuro (30 dias):
     - data_retirada: quando retirar do freezer hoje
     - sku: identificador do produto
     - caixas_a_retirar: quantas caixas retirar (lead time 2 dias)
     - kg_retirar_hoje: total em kg de produto líquido
     - kg_descongelando_amanha: kg que estarão descongelando amanhã
     - kg_pronto_para_venda: kg aptos a vender no dia
     - kg_previsto_venda: forecast de venda daquele dia
     - sobra: estoque maduro não consumido

  2) tempo_vida_lotes.csv – para cada lote gerado, ciclo de vida em 4 dias:
     dia 0=retirado, 1=descongelando, 2=pronto para venda, 3=vencido

Dependências:
  pandas, scikit-learn

Uso:
  python seu_script.py
"""

import math
import logging
from pathlib import Path
from datetime import timedelta
from typing import List, Dict, Any, Tuple

import pandas as pd
from sklearn.linear_model import LinearRegression

# Configuração de logging: INFO para linhas de progresso
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Parâmetros centrais do pipeline
CONFIG: Dict[str, Any] = {
    "entrada":      Path("zenith.csv"),            # histórico de vendas
    "saida_rel":    Path("relatorio_diario.csv"),  # relatório por dia
    "saida_tempo":  Path("tempo_vida_lotes.csv"),  # ciclo de vida dos lotes
    "col_data":     "data_dia",                    # nome da coluna de datas
    "col_alvo":     "total_venda_dia_kg",          # nome da coluna de vendas
    "fmt_data":     "%d/%m/%Y",                    # formato do csv
    "lags":         list(range(1, 8)),             # lags 1..7 para features
    "dias_prev":    30,                            # horizon forecasting
    "sku":          "SKU-FRANGO-001",              # identificador do SKU
    "modelo":       LinearRegression(),            # modelo de forecast
}


def carregar_dados(cfg: Dict[str, Any]) -> pd.DataFrame:
    """
    Lê o CSV de entrada, converte a coluna de datas e ordena cronologicamente.
    Retorna o DataFrame pronto para engenharia de features.
    """
    df = pd.read_csv(cfg["entrada"], dayfirst=True)
    df[cfg["col_data"]] = pd.to_datetime(df[cfg["col_data"]], format=cfg["fmt_data"])
    return df.sort_values(cfg["col_data"]).reset_index(drop=True)


def criar_features(
    df: pd.DataFrame,
    cfg: Dict[str, Any]
) -> Tuple[pd.DataFrame, List[str]]:
    """
    Gera colunas de lag-features a partir da coluna alvo.
    - Para cada lag em cfg["lags"], cria 'lag_{lag}'.
    - Remove linhas com NA resultantes do shift.
    Retorna (df_completo, lista_de_features).
    """
    df2 = df.copy()
    for lag in cfg["lags"]:
        df2[f"lag_{lag}"] = df2[cfg["col_alvo"]].shift(lag)
    feats = [f"lag_{lag}" for lag in cfg["lags"]]
    return df2.dropna().reset_index(drop=True), feats


def treinar_modelo(
    df: pd.DataFrame,
    feats: List[str],
    cfg: Dict[str, Any]
) -> LinearRegression:
    """
    Treina o modelo de regressão linear usando df[feats] como X
    e df[cfg['col_alvo']] como y. Retorna o modelo ajustado.
    """
    model = cfg["modelo"]
    model.fit(df[feats], df[cfg["col_alvo"]])
    return model


def prever_e_alocar(
    df: pd.DataFrame,
    model: LinearRegression,
    feats: List[str],
    cfg: Dict[str, Any]
) -> Tuple[pd.DataFrame, List[Dict[str, Any]]]:
    """
    Para cada dia futuro em horizon:
      1. Gera previsão de vendas (yhat) usando os lags.
      2. Calcula número de caixas e kg líquidos a retirar (lead time = 2 dias).
      3. Mantém lista de lotes ativos, expira com idade ≥ 3 (do freezer).
      4. Computa estoque maduro (idade == 2), sobra e descongelamento.
      5. Preenche relatório diario com colunas definidas.
      6. Atualiza histórico para alimentar novos lags.

    Retorna:
      - df_relatorio: DataFrame com colunas de saída diária
      - all_lotes: lista de todos os lotes criados (para ciclo de vida)
    """
    hoje = df[cfg["col_data"]].max().date()
    caixa_kg, pct_retrac = 18.0, 0.15
    liquido_por_caixa = caixa_kg * (1 - pct_retrac)

    active_lotes: List[Dict[str, Any]] = []
    all_lotes:    List[Dict[str, Any]] = []
    relatorio:    List[Dict[str, Any]] = []
    hist = df.copy()

    for _ in range(cfg["dias_prev"]):
        hoje += timedelta(days=1)

        # 1) Previsão de vendas
        x_last = {f"lag_{l}": hist[cfg["col_alvo"]].iloc[-l] for l in cfg["lags"]}
        yhat = model.predict(pd.DataFrame([x_last]))[0]

        # 2) Quantas caixas e kg líquido retirar
        caixas     = math.ceil(yhat / liquido_por_caixa)
        kg_liquido = caixas * liquido_por_caixa

        # 3) Registra lote recém-retirado
        lote = {
            "data_retirada": hoje,
            "kg_liquido":    round(kg_liquido, 2),
            "kg_restante":   round(kg_liquido, 2)
        }
        active_lotes.append(lote.copy())
        all_lotes.append(lote.copy())

        # 4) Expira lotes com vida ≥ 3 dias (não mais úteis)
        active_lotes[:] = [
            l for l in active_lotes
            if (hoje - l["data_retirada"]).days < 3
        ]

        # 5) Estoque pronto para venda hoje (idade == 2)
        kg_pronto = sum(
            l["kg_restante"]
            for l in active_lotes
            if (hoje - l["data_retirada"]).days == 2
        )

        # 6) Sobra de hoje (remanescente após forecast)
        sobra = round(max(kg_pronto - yhat, 0.0), 2)

        # 7) Venda: consome do estoque maduro
        dem = yhat
        for l in active_lotes:
            if (hoje - l["data_retirada"]).days == 2 and dem > 0:
                uso = min(l["kg_restante"], dem)
                l["kg_restante"] -= uso
                dem -= uso

        # 8) Em descongelamento amanhã (idade == 1)
        kg_descongel = sum(
            l["kg_restante"]
            for l in active_lotes
            if (hoje - l["data_retirada"]).days == 1
        )

        # 9) Monta linha do relatório
        relatorio.append({
            "data_retirada":            hoje.strftime(cfg["fmt_data"]),
            "sku":                      cfg["sku"],
            "caixas_a_retirar":         caixas,
            "kg_retirar_hoje":          round(kg_liquido, 2),
            "kg_descongelando_amanha":  round(kg_descongel, 2),
            "kg_pronto_para_venda":     round(kg_pronto, 2),
            "kg_previsto_venda":        round(yhat, 2),
            "sobra":                    sobra
        })

        # 10) Atualiza histórico para próximos lags
        hist = pd.concat([
            hist,
            pd.DataFrame([{
                cfg["col_data"]: hoje,
                cfg["col_alvo"]: round(yhat, 2)
            }])
        ], ignore_index=True)

    return pd.DataFrame(relatorio), all_lotes


def gerar_tempo_vida(
    lotes: List[Dict[str, Any]],
    cfg: Dict[str, Any]
) -> pd.DataFrame:
    """
    Gera um DataFrame com o ciclo de 4 dias de cada lote:
      - idade_dia: 0=retirado, 1=descongelando, 2=pronto, 3=vencido
      - kg_liquido: peso bruto útil por lote
    """
    rows: List[Dict[str, Any]] = []
    for lote in lotes:
        d0 = lote["data_retirada"]
        for i in range(4):
            dia = d0 + timedelta(days=i)
            if i == 0:
                status = "retirado"
            elif i == 1:
                status = "descongelando"
            elif i == 2:
                status = "pronto para venda"
            else:
                status = "vencido"
            rows.append({
                "data_retirada": d0.strftime(cfg["fmt_data"]),
                "data_dia":      dia.strftime(cfg["fmt_data"]),
                "idade_dia":     i,
                "status_dia":    status,
                "kg_liquido":    lote["kg_liquido"]
            })
    return pd.DataFrame(rows)


def main():
    """
    1) Carrega dados e engenharia de lags
    2) Treina modelo de forecast
    3) Previsão + alocação de lotes + relatório diário
    4) Gera CSV de ciclo de vida de lotes
    """
    # 1) ETL e features
    df = carregar_dados(CONFIG)
    df_feat, feats = criar_features(df, CONFIG)

    # 2) Treinamento
    model = treinar_modelo(df_feat, feats, CONFIG)

    # 3) Previsão e relatório diário
    df_rel, all_lotes = prever_e_alocar(df_feat, model, feats, CONFIG)

    # 4) Tempo de vida de cada lote
    df_tv = gerar_tempo_vida(all_lotes, CONFIG)

    # 5) Salva resultados
    df_rel.to_csv(CONFIG["saida_rel"], index=False)
    df_tv.to_csv(CONFIG["saida_tempo"], index=False)
    logging.info("Relatórios gerados com sucesso.")


if __name__ == "__main__":
    main()
