import unittest
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
import os

import src.manager as Manager
import src.database as Database
import src.repositories.PrevisaoRepository as PrevisaoRepository
import src.repositories.VendaRepository as VendaRepository

db_path = "./src/data/data.db"
conn = sqlite3.connect(db_path)

class TestFluxoSemanal(unittest.TestCase):
    def setUp(self):
        """Configuração inicial do teste"""
        # Cria
        conn.row_factory = sqlite3.Row
        Database.criar_banco_e_tabelas(conn)
        
        # Produto de teste
        self.produto_sku = "237478"
        
        # Data inicial
        self.data_inicial = datetime(2025, 7, 16).date()  # Começamos em 16/07/2025
    
    def test_simular_semana(self):
        """Testa o fluxo completo por 7 dias usando previsões como vendas"""
        
        # 1. Realizar previsão inicial
        Manager.realizar_previsao(conn)
        
        data_atual = self.data_inicial
        resultados_diarios = []
        
        # 2. Simular 7 dias
        for dia in range(7):
            resultado_dia = {
                "dia": data_atual.strftime("%Y-%m-%d"),
                "metricas": {}
            }
            
            # 2.1 Executar fluxo diário (retirada)
            Manager.executar_fluxo_diario(conn, self.produto_sku)
            
            # 2.2 Obter quantidade disponível
            qtd_disponivel = Manager.calcular_qtd_disponivel(conn, self.produto_sku, data_atual)
            resultado_dia["metricas"]["quantidade_disponivel"] = qtd_disponivel
            
            # 2.3 Obter previsão para este dia
            previsao = PrevisaoRepository.obter_previsao(conn, self.produto_sku, data_atual)
            if previsao is not None:
                # 2.4 Registrar venda igual à previsão
                quantidade_vendida = Manager.registrar_venda(
                    conn, 
                    self.produto_sku, 
                    data_atual, 
                    previsao
                )
                
                resultado_dia["metricas"].update({
                    "previsao": previsao,
                    "venda_realizada": quantidade_vendida,
                    "atendimento": (quantidade_vendida / previsao * 100) if previsao > 0 else 100
                })
            
            # 2.5 Obter informações dos lotes
            lotes_info = Manager.obter_lotes(conn, self.produto_sku)
            resultado_dia["lotes"] = lotes_info
            
            resultados_diarios.append(resultado_dia)
            
            # Avançar para o próximo dia
            data_atual += timedelta(days=1)
        
        # 3. Validar resultados
        for resultado in resultados_diarios:
            print(f"\nResultados para {resultado['dia']}:")
            print(f"Quantidade Disponível: {resultado['metricas'].get('quantidade_disponivel', 0):.2f}kg")
            print(f"Previsão: {resultado['metricas'].get('previsao', 0):.2f}kg")
            print(f"Venda Realizada: {resultado['metricas'].get('venda_realizada', 0):.2f}kg")
            print(f"Atendimento: {resultado['metricas'].get('atendimento', 0):.2f}%")
            print(f"Lotes Ativos: {resultado['lotes']['metricas']['quantidade_lotes']}")
            print("Status dos Lotes:", resultado['lotes']['metricas']['lotes_por_status'])
            
            # Validações básicas
            self.assertGreaterEqual(resultado['metricas'].get('quantidade_disponivel', 0), 0)
            if 'atendimento' in resultado['metricas']:
                self.assertLessEqual(resultado['metricas']['atendimento'], 100)
                
if __name__ == '__main__':
    unittest.main()