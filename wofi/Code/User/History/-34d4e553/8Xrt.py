

import logging
from pathlib import Path
from typing import Dict, Any
import sqlite3
import pandas as pd
from prophet import Prophet
from typing import List, Dict, Optional
from queue import Queue

import createDB  # Importa o módulo que cria o banco e tabelas
import scriptsDB  # Importa o módulo com funções de acesso ao banco

# --- Configuração do Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

DB_PATH = Path("estoque.db")

# --- Configuração do Script ---
CONFIG: Dict[str, Any] = {
    "entrada": Path("dados_zenith.csv"),
    "col_data": "data_dia",
    "col_alvo": "total_venda_dia_kg",
    "fmt_data": "%d/%m/%Y",
    "dias_treino": 90,        # 3 meses
    "dias_prev": 30            # previsão para 30 dias à frente
}

def sincronizar_produtos_csv_banco(
    conn: sqlite3.Connection,
    df: pd.DataFrame,
    arquivo_saida: Path = Path("produtos_nao_cadastrados.csv")
):
    """
    Verifica cada produto do DataFrame CSV no banco pelo SKU.
    Insere produtos novos no banco.
    Salva produtos não cadastrados num CSV.
    """
    cursor = conn.cursor()
    
    produtos_nao_cadastrados = []
    
    skus_unicos = df[['id_produto', 'descricao_produto']].drop_duplicates()
    
    for _, row in skus_unicos.iterrows():
        sku = str(row['id_produto'])
        nome = row['descricao_produto']
        
        cursor.execute("SELECT id FROM produto WHERE sku = ?", (sku,))
        existe = cursor.fetchone()
        
        if not existe:
            produtos_nao_cadastrados.append({'sku': sku, 'nome': nome})
            # Opcional: pode inserir já o produto no banco aqui, se quiser:
            cursor.execute(
                "INSERT INTO produto (sku, nome, categoria) VALUES (?, ?, ?)",
                (sku, nome, "Desconhecida")  # categoria padrão, ou você pode adaptar
            )
            logging.info(f"Produto inserido no banco: SKU={sku}, nome={nome}")
    
    conn.commit()
    
    if produtos_nao_cadastrados:
        df_nao_cadastrados = pd.DataFrame(produtos_nao_cadastrados)
        df_nao_cadastrados.to_csv(arquivo_saida, index=False)
        logging.info(f"Produtos não cadastrados salvos em {arquivo_saida}")
    else:
        logging.info("Todos os produtos do CSV já existem no banco.")

def carregar_dados(cfg: Dict[str, Any]) -> pd.DataFrame:
    df = pd.read_csv(cfg["entrada"], dayfirst=True)
    df[cfg["col_data"]] = pd.to_datetime(df[cfg["col_data"]], format=cfg["fmt_data"])
    df = df.sort_values(cfg["col_data"]).reset_index(drop=True)

    # Pegando apenas os últimos 90 dias
    df = df.tail(cfg["dias_treino"]).reset_index(drop=True)
    return df

def treinar_e_prever(df: pd.DataFrame, cfg: Dict[str, Any]) -> pd.DataFrame:
    """
    Retorna um DataFrame com as previsões futuras (yhat e data).
    """
    df_prophet = df[[cfg["col_data"], cfg["col_alvo"]]].rename(
        columns={cfg["col_data"]: "ds", cfg["col_alvo"]: "y"}
    )

    model = Prophet()
    model.fit(df_prophet)

    future = model.make_future_dataframe(periods=cfg["dias_prev"])
    forecast = model.predict(future)

    # Apenas as previsões futuras
    data_final_treino = df_prophet["ds"].max()
    previsoes_futuras = forecast[forecast["ds"] > data_final_treino][["ds", "yhat"]].copy()

    return previsoes_futuras

def salvar_previsoes_no_banco(
    conn: sqlite3.Connection,
    df: pd.DataFrame,
    skus_unicos: pd.DataFrame
):
    for _, row in skus_unicos.iterrows():
            sku = str(row['id_produto'])
            nome_produto = row['descricao_produto']
            categoria_produto = "Frango"
            
            df_produto = df[df['id_produto'] == row['id_produto']]
            if df_produto.empty:
                logging.warning(f"Sem dados para o produto SKU={sku}")
                continue
            
            previsoes = treinar_e_prever(df_produto, CONFIG)
            
            for _, prev in previsoes.iterrows():
                data_prevista = prev["ds"].date()
                quantidade_prevista = prev["yhat"]
                scriptsDB.salvar_previsao_no_banco(
                    conn, sku, nome_produto, categoria_produto,
                    pd.Timestamp(data_prevista), quantidade_prevista
                )

def logar_busca_previsoes(conn: sqlite3.Connection, sku: str) -> List[Dict[str, Any]]:
    """
    Busca previsões para o SKU fornecido e loga os resultados.
    """
    previsoes = scriptsDB.buscar_previsoes(conn, sku)
    if not previsoes:
        logging.warning(f"Nenhuma previsão encontrada para SKU={sku}")
    else:
        logging.info(f"\n\nPrevisões encontradas para SKU={sku}: {len(previsoes)}")
        for p in previsoes:
            logging.info(f"Data: {p['data']}, Quantidade Prevista: {p['quantidade_prevista']} kg")
    return previsoes

def logar_busca_produtos(conn: sqlite3.Connection) -> List[Dict[str, Any]]:
    """
    Busca todos os produtos cadastrados e loga os resultados.
    """
    produtos = scriptsDB.buscar_produtos(conn)
    if not produtos:
        logging.warning("Nenhum produto encontrado no banco.")
    else:
        logging.info(f"\n\nProdutos encontrados: {len(produtos)}")
        for p in produtos:
            logging.info(f"SKU: {p['sku']}, Nome: {p['nome']}, Categoria: {p['categoria']}")
    return produtos

def gerar_venda_diaria(conn: sqlite3.Connection, sku: str, data_venda: pd.Timestamp, quantidade_vendida: float):
    fila = scriptsDB.buscar_lotes_por_produto_em_fila(conn, sku,data_venda)
    if fila.empty():   
        logging.warning(f"Nenhum lote encontrado para o SKU={sku}.")
        return
    else:
        lote = fila.get()
        for i in range(len(fila)):
            quantidade_atual = lote['quantidade_atual']
            resto = quantidade_atual - quantidade_vendida
            if resto > 0:
                lote['quantidade_atual'] = resto
                lote['quantidade_retirada'] += quantidade_vendida
                lote['data_venda'] = data_venda.date()
                scriptsDB.atualizar_lote(conn, lote)
                scriptsDB.salvar_venda_no_banco(conn, sku, data_venda.date(), quantidade_vendida)
                logging.info(f"Venda registrada: SKU={sku}, Data={data_venda}, Quantidade={quantidade_vendida} kg")
                return
            else:


                
            

def main():
    df = carregar_dados(CONFIG)
    
    with sqlite3.connect(DB_PATH) as conn:
        # Sincroniza produtos CSV no banco e salva CSV dos novos produtos
        sincronizar_produtos_csv_banco(conn, df)
        
        skus_unicos = df[['id_produto', 'descricao_produto']].drop_duplicates()
        salvar_previsoes_no_banco(conn, df, skus_unicos)

        produtos = logar_busca_produtos(conn)
        previsoes = logar_busca_previsoes(conn, "237478")

if __name__ == "__main__":
    createDB.criar_banco_e_tabelas(DB_PATH)  # Cria o banco e tabelas se não existirem
    main()