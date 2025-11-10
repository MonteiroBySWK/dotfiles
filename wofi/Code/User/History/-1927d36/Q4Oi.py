from datetime import datetime, timedelta
import sqlite3
import numpy as np
import logging
from pathlib import Path

# Configuração de logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


class SistemaDescongelamento:
    def __init__(self, db_path="estoque.db"):
        self.db_path = Path(db_path)
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row
        self.k = 1.65  # Fator de segurança para 95% de confiança
        self.alpha = 0.85  # Fator de retração (15% de perda)
        self.validade_dias = 2  # Validade após descongelamento

    def obter_previsao(self, produto_id, data_venda):
        """Obtém a previsão de demanda para um produto em uma data específica"""
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT quantidade_prevista FROM previsao WHERE produto_id = ? AND data = ?",
            (produto_id, data_venda.strftime("%Y-%m-%d")),
        )
        row = cursor.fetchone()
        return row["quantidade_prevista"] if row else None

    def calcular_desvio_padrao(self, produto_id, horizonte=2):
        """Calcula o desvio padrão dos erros de previsão"""
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT p.quantidade_prevista, v.quantidade
            FROM previsao p
            JOIN venda v ON p.produto_id = v.produto_id AND p.data = v.data
            WHERE p.produto_id = ? 
            ORDER BY p.data DESC
            LIMIT 30
        """,
            (produto_id,),
        )

        dados = cursor.fetchall()
        if not dados:
            return 0.0

        erros = [row["quantidade"] - row["quantidade_prevista"] for row in dados]
        return np.std(erros)

    def obter_retirada_anterior(
        self, produto_id, data_hoje
    ):  # pode ser apenas uma consulta na tabela
        """Obtém a retirada do dia anterior (t-1) para o produto"""
        data_ontem = (data_hoje - timedelta(days=1)).strftime("%Y-%m-%d")
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT quantidade FROM lote WHERE produto_id = ? AND data_retirado = ?",
            (produto_id, data_ontem),
        )
        row = cursor.fetchone()
        return row["quantidade"] if row else 0.0

    def obter_demanda_media(self, produto_id):
        """Calcula a demanda média do produto"""
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT AVG(quantidade) FROM venda WHERE produto_id = ?", (produto_id,)
        )
        row = cursor.fetchone()
        return row[0] if row[0] else 0.0

    def calcular_retirada(self, produto_id, data_hoje):
        """
        Calcula R(t) - quantidade a ser retirada hoje (kg brutos)

        :param produto_id: ID do produto (SKU)
        :param data_hoje: Data atual (dia t)
        :return: Quantidade em kg a ser retirada
        """
        # 1. Obter previsão para t+2
        data_venda = data_hoje + timedelta(days=2)
        Vp_t2 = self.obter_previsao(produto_id, data_venda)

        if Vp_t2 is None:
            # Fallback para demanda média se não houver previsão
            Vp_t2 = self.obter_demanda_media(produto_id)
            logging.warning(
                f"Previsão não encontrada para produto {produto_id}. Usando demanda média: {Vp_t2}"
            )

        # 2. Calcular desvio padrão para t+2
        m_t2 = self.calcular_desvio_padrao(produto_id)

        # 3. Obter retirada do dia anterior (t-1)
        R_t1 = self.obter_retirada_anterior(produto_id, data_hoje)

        # 4. Aplicar fórmula principal
        R_t = (Vp_t2 + self.k * m_t2 - self.alpha * R_t1) / self.alpha

        # 5. Aplicar restrições
        demanda_media = self.obter_demanda_media(produto_id)
        R_max = (2 * demanda_media) / self.alpha
        capacidade = self.obter_capacidade_freezer(produto_id)

        R_t = max(0, R_t)  # Não pode ser negativo
        R_t = min(R_t, R_max, capacidade)

        return R_t

    def criar_lote(self, produto_id, quantidade_bruta, data_retirada):
        """Cria um novo lote no sistema"""
        # Quantidade líquida após retração
        quantidade_liquida = quantidade_bruta * self.alpha
        data_venda = data_retirada + timedelta(days=2)
        data_expiracao = data_retirada + timedelta(
            days=4
        )  # 2 dias de descongelamento + 2 dias de validade

        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT INTO lote (
                quantidade,
                idade,
                status,
                data_retirado,
                data_venda,
                data_expiracao,
                produto_id
            ) VALUES (?, 0, 'descongelando', ?, ?, ?, ?)
        """,
            (
                quantidade_liquida,
                data_retirada.strftime("%Y-%m-%d"),
                data_venda.strftime("%Y-%m-%d"),
                data_expiracao.strftime("%Y-%m-%d"),
                produto_id,
            ),
        )
        self.conn.commit()
        logging.info(
            f"Novo lote criado: {quantidade_bruta:.2f}kg bruto -> {quantidade_liquida:.2f}kg líquido"
        )

    def atualizar_status_lotes_diario(self, data_hoje):
        """Atualiza o status dos lotes baseado na data atual"""
        cursor = self.conn.cursor()
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

        self.conn.commit()
        logging.info("Status dos lotes atualizados")

    def registrar_venda(self, produto_id, data, quantidade):
        """Registra uma venda real e atualiza os lotes"""
        cursor = self.conn.cursor()
        data_str = data.strftime("%Y-%m-%d")

        # 1. Registrar a venda
        cursor.execute(
            """
            INSERT INTO venda (data, quantidade, produto_id)
            VALUES (?, ?, ?)
        """,
            (data_str, quantidade, produto_id),
        )

        # 2. Atualizar lotes (FIFO)
        cursor.execute(
            """
            SELECT id, quantidade_atual
            FROM lote
            WHERE produto_id = ? 
            AND status IN ('disponivel', 'sobra')
            AND data_venda <= ?
            ORDER BY data_retirado
        """,
            (produto_id, data_str),
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

        self.conn.commit()
        logging.info(f"Venda registrada: {quantidade}kg para produto {produto_id}")
        return quantidade_restante  # Retorna o que não foi atendido

    def executar_fluxo_diario(self, produto_id):
        """Executa todo o fluxo diário para um produto"""
        data_hoje = datetime.now().date()

        try:
            # 1. Atualizar status dos lotes
            self.atualizar_status_lotes_diario(data_hoje)

            # 2. Calcular retirada para hoje
            R_t = self.calcular_retirada(produto_id, data_hoje)
            logging.info(
                f"Produto {produto_id}: Quantidade a retirar hoje: {R_t:.2f}kg"
            )

            # 3. Criar novo lote com a retirada calculada
            self.criar_lote(produto_id, R_t, data_hoje)

            # 4. (Opcional) Simular vendas do dia
            # Em produção, isso seria feito no 
            # final do dia com dados reais
            self.registrar_venda(produto_id, data_hoje, 50.0)

            return True
        except Exception as e:
            logging.error(f"Erro no fluxo diário: {str(e)}")
            return False

    def fechar(self):
        self.conn.close()


# Exemplo de uso
if __name__ == "__main__":
    sistema = SistemaDescongelamento()

    try:
        # Supondo que temos um produto com ID 1
        produto_id = 1

        # Executar fluxo diário
        sucesso = sistema.executar_fluxo_diario(produto_id)

        if sucesso:
            # Obter relatório de lotes atualizados
            cursor = sistema.conn.cursor()
            cursor.execute("SELECT * FROM lote WHERE produto_id = ?", (produto_id,))
            lotes = cursor.fetchall()

            print("\nLotes atuais:")
            for lote in lotes:
                print(
                    f"ID: {lote['id']}, Status: {lote['status']}, Quantidade: {lote['quantidade_atual']}kg"
                )
    finally:
        sistema.fechar()
