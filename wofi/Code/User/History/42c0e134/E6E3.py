from src.Manager import ManagerSystem

manager = ManagerSystem()

try:
    # Supondo que temos um produto com ID 1
    produto_id = "237478"

    # Executar fluxo diário
    sucesso = manager.executar_fluxo_diario(produto_id)

    if sucesso:
        # Obter relatório de lotes atualizados
        cursor = manager.conn.cursor()
        cursor.execute("SELECT * FROM lote WHERE produto_id = ?", (produto_id,))
        lotes = cursor.fetchall()

        print("\nLotes atuais:")
        for lote in lotes:
            print(
                f"ID: {lote['id']}, Status: {lote['status']}, Quantidade: {lote['quantidade_atual']}kg"
            )
finally:
    manager.fechar()
