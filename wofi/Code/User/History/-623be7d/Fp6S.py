from app import db

class Venda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False)
    sku = db.Column(db.String, nullable=False)
    kg_vendidos = db.Column(db.Float, nullable=False)

class SKU(db.Model):
    sku = db.Column(db.String, primary_key=True)
    validade_dias = db.Column(db.Integer, default=2)
    capacidade_maxima = db.Column(db.Float)

class Lote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data_retirada = db.Column(db.Date, nullable=False)
    data_disponivel = db.Column(db.Date, nullable=False)
    sku = db.Column(db.String, nullable=False)
    kg_bruto = db.Column(db.Float, nullable=False)
    kg_liquido = db.Column(db.Float, nullable=False)
    idade = db.Column(db.Integer, default=0)

class Retirada(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False)
    sku = db.Column(db.String, nullable=False)
    kg_retirados = db.Column(db.Float, nullable=False)


