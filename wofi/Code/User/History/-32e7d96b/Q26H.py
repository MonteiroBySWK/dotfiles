import sqlite3
import logging
from pathlib import Path
import previsao

# --- Configuração de Logging ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Caminho padrão do banco
DB_PATH = Path("./data/data.db")

def criar_banco_e_tabelas(path_db: Path):
    """
    Cria o arquivo de banco SQLite e
    inicializa todas as tabelas necessárias.
    """
    
    # path_db.parent.mkdir(parents=True, exist_ok=True)  # <--- ADICIONE ESTA LINHA
    logging.info(f"Criando banco e tabelas em '{path_db}'...")
    conn = sqlite3.connect(path_db)
    c = conn.cursor()

    # Criação das tabelas
    # status: 'descongelando', 'disponivel', 'sobra', 'perda', 'vendido'
    # data_venda == data_disponivel
    c.execute(""" 
        CREATE TABLE IF NOT EXISTS lote (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quantidade_retirada FLOAT NOT NULL,
            quantidade_atual FLOAT NOT NULL,
            idade INTEGER NOT NULL,
            status TEXT NOT NULL,
            data_retirado DATE NOT NULL,
            data_venda DATE NOT NULL,
            data_expiracao DATE NOT NULL,
            produto_id INTEGER NOT NULL,
            FOREIGN KEY (produto_id) REFERENCES produto(id)
        )
    """)

    c.execute(""" 
        CREATE TABLE IF NOT EXISTS venda (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            quantidade FLOAT NOT NULL,
            produto_id INTEGER NOT NULL,
            FOREIGN KEY (produto_id) REFERENCES produto(id)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS previsao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            quantidade_prevista FLOAT NOT NULL,
            produto_id INTEGER NOT NULL,
            FOREIGN KEY (produto_id) REFERENCES produto(id),
            UNIQUE (produto_id, data)  -- evita duplicidade de previsão por produto e data
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS produto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sku TEXT NOT NULL UNIQUE,
            nome TEXT NOT NULL,
            categoria TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()
    logging.info("Banco e tabelas criados com sucesso.")

if __name__ == "__main__":
    criar_banco_e_tabelas(DB_PATH)

    CSV_ZENITH_PATH = Path("./data/dados_zenith.csv")

    with sqlite3.connect(DB_PATH) as conn:
        previsao.importar_vendas_csv(conn, CSV_ZENITH_PATH)
        previsao.prever(conn)


