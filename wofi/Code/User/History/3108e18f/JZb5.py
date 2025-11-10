from models import *

class PrevisorDemanda:
    """Responsável por prever a demanda de um SKU."""
    def __init__(self, sku: str):
        self.sku = sku

    def prever_para_t_mais_2(self):
        """Prevê a demanda de vendas para dois dias no futuro (t+2)."""
        dados_historicos = Venda.query.filter_by(sku=self.sku).order_by(Venda.data).all()
        
        if not dados_historicos or len(dados_historicos) < 14: # Requer dados mínimos
            return 0.0, 0.0 # Retorna previsão e desvio padrão nulos

        df = pd.DataFrame([(d.data, d.kg_vendidos) for d in dados_historicos], columns=['data', 'kg_vendidos'])
        df['data'] = pd.to_datetime(df['data'])
        df.set_index('data', inplace=True)
        
        # Resample para garantir frequência diária, preenchendo dias sem vendas com 0
        df = df.resample('D').sum()

        try:
            modelo = ExponentialSmoothing(df['kg_vendidos'], trend='add', seasonal='add', seasonal_periods=7).fit()
            previsao = modelo.forecast(3)
            vp_t2 = previsao.iloc[2] # Previsão para t+2
        except Exception:
            # Fallback para média móvel de 7 dias se o modelo falhar
            vp_t2 = df['kg_vendidos'].rolling(window=7, min_periods=1).mean().iloc[-1]
            
        sigma = df['kg_vendidos'].tail(30).std()
        
        return vp_t2, sigma if pd.notna(sigma) else 0.0

class GerenciadorLotes:
    """Gerencia o ciclo de vida dos lotes de um SKU (FIFO)."""
    def __init__(self, sku_id: str):
        self.sku_id = sku_id

    def atualizar_estoque(self, data_hoje: datetime.date):
        """Atualiza a idade dos lotes e remove os vencidos."""
        param_sku = SKU.query.get(self.sku_id)
        if not param_sku:
            return

        # Atualiza a idade de todos os lotes ativos
        lotes_ativos = Lote.query.filter_by(sku=self.sku_id).all()
        for lote in lotes_ativos:
            if lote.data_disponivel <= data_hoje:
                lote.idade = (data_hoje - lote.data_disponivel).days
        
        # Remove lotes vencidos
        Lote.query.filter(Lote.sku == self.sku_id, Lote.idade >= param_sku.validade_dias).delete()
        db.session.commit()

    def adicionar_lote(self, data_retirada: datetime.date, kg_bruto: float):
        """Adiciona um novo lote ao sistema."""
        novo_lote = Lote(
            data_retirada=data_retirada,
            data_disponivel=data_retirada + timedelta(days=2),
            sku=self.sku_id,
            kg_bruto=kg_bruto,
            kg_liquido=kg_bruto * 0.85 # Fator de quebra
        )
        db.session.add(novo_lote)
        db.session.commit()

    def calcular_disponibilidade(self, data_hoje: datetime.date):
        """Calcula o estoque disponível, em descongelamento e a idade máxima."""
        disponivel_hoje = db.session.query(db.func.sum(Lote.kg_liquido)).filter(
            Lote.sku == self.sku_id,
            Lote.data_disponivel <= data_hoje
        ).scalar() or 0.0
        
        em_descongelamento = db.session.query(db.func.sum(Lote.kg_liquido)).filter(
            Lote.sku == self.sku_id,
            Lote.data_disponivel == data_hoje + timedelta(days=1)
        ).scalar() or 0.0
        
        idade_max = db.session.query(db.func.max(Lote.idade)).filter(
            Lote.sku == self.sku_id,
            Lote.data_disponivel <= data_hoje
        ).scalar() or 0
        
        return disponivel_hoje, em_descongelamento, idade_max