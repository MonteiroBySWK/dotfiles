import sqlite3
import logging
from pathlib import Path
import src.previsao

# --- Configuração de Logging ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Caminho padrão do banco
DB_PATH = Path("./data/data.db")

def criar_banco_e_tabelas(conn: sqlite3.Connection):
    """
    Cria o arquivo de banco SQLite e
    inicializa todas as tabelas necessárias.
    """
    
    logging.info(f"Criando banco e tabelas")
    c = conn.cursor()

    # Criação das tabelas
    # Primeiro criamos a tabela produto, pois outras tabelas dependem dela
    c.execute("""
        CREATE TABLE IF NOT EXISTS produto (
            sku TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            categoria TEXT NOT NULL
        )
    """)

    # Inserção dos produtos iniciais
    produtos = [
        ('237478', 'FILE DE PEITO FGO INTERF CONG KG', 'FRANGO'),
        ('237479', 'ASA DE FGO INTERF CONG KG', 'FRANGO'),
        ('237496', 'CORACAO DE FGO INTERF CONG KG', 'FRANGO'),
        ('237497', 'COXA C/SOB FGO INTERF CONG KG', 'FRANGO'),
        ('237498', 'PEITO DE FGO INTERFOLHADO CONG KG', 'FRANGO'),
        ('237506', 'COXA DE FGO INTERF CONG KG', 'FRANGO'),
        ('237508', 'COXINHA DA ASA FGO INTERF CONG KG', 'FRANGO'),
        ('237511', 'MOELA DE FRANGO INTERF CONG KG', 'FRANGO'),
        ('243152', 'SOBRECOXA DE FGO INTERF CONG KG', 'FRANGO'),
        ('384706', 'PE FRANGO INTERF CONG KG', 'FRANGO')
    ]
    c.executemany('INSERT OR IGNORE INTO produto (sku, nome, categoria) VALUES (?, ?, ?)', produtos)

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
            produto_sku TEXT NOT NULL,
            FOREIGN KEY (produto_sku) REFERENCES produto(sku)
        )
    """)

    c.execute(""" 
        CREATE TABLE IF NOT EXISTS venda (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            quantidade FLOAT NOT NULL,
            produto_sku TEXT NOT NULL,
            FOREIGN KEY (produto_sku) REFERENCES produto(sku)
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS previsao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            quantidade_prevista FLOAT NOT NULL,
            produto_sku TEXT NOT NULL,
            FOREIGN KEY (produto_sku) REFERENCES produto(sku),
            UNIQUE (produto_sku, data)  -- evita duplicidade de previsão por produto e data
        )
    """)

    conn.commit()
    conn.close()
    logging.info("Banco e tabelas criados com sucesso.")

def povoar_banco():
    ...