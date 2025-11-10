import os
import pandas as pd
from datetime import datetime, timedelta
from flask import (
    Blueprint, request, jsonify, current_app, send_file
)
from werkzeug.utils import secure_filename
from app import db
from app.models import Venda, SKU, Lote, Retirada, PrevisorDemanda, GerenciadorLotes

bp = Blueprint('api', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

# --- ROTAS DA API ---

@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Nome de arquivo inválido ou tipo não permitido'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        df = pd.read_csv(filepath)
        vendas = [Venda(data=datetime.strptime(row['data'], '%Y-%m-%d').date(), sku=row['sku'], kg_vendidos=row['kg_vendidos']) for _, row in df.iterrows()]
        db.session.bulk_save_objects(vendas)
        db.session.commit()
        return jsonify({'success': f'{len(vendas)} registros importados com sucesso!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro no processamento do arquivo: {str(e)}'}), 500

@bp.route('/calcular', methods=['POST']) # Alterado para POST pois executa uma ação
def calcular_retiradas():
    # ... (A lógica de cálculo permanece a mesma da resposta anterior) ...
    # (Copie e cole a lógica da função calcular_retiradas da resposta anterior aqui)
    # No final, em vez de um simples jsonify, retornamos um status mais claro
    # ...
    # (Código omitido para brevidade)
    # Exemplo do final da função:
    # ...
    # db.session.commit()
    return jsonify({
        'message': f'{len(resultados)} SKUs processados com sucesso.',
        'data': resultados
    })


@bp.route('/relatorio', methods=['GET'])
def gerar_relatorio():
    # ... (A lógica de geração de relatório permanece a mesma) ...
    # (Copie e cole a lógica da função gerar_relatorio da resposta anterior aqui)
    # A função send_file já funciona bem com fetch
    ...


@bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    retiradas_query = Retirada.query.order_by(Retirada.data.desc()).limit(10).all()
    estoque_query = db.session.query(Lote.sku, db.func.sum(Lote.kg_liquido).label('total')).group_by(Lote.sku).all()
    
    retiradas = [{'data': r.data.strftime('%Y-%m-%d'), 'sku': r.sku, 'kg_retirados': f"{r.kg_retirados:.2f}"} for r in retiradas_query]
    estoque = [{'sku': e.sku, 'total': f"{e.total:.2f}"} for e in estoque_query]
    
    return jsonify({'retiradas': retiradas, 'estoque': estoque})


@bp.route('/skus', methods=['GET', 'POST'])
def handle_skus():
    if request.method == 'POST':
        data = request.get_json()
        if not all(k in data for k in ['sku', 'validade', 'capacidade']):
            return jsonify({'error': 'Dados incompletos'}), 400
        try:
            sku = SKU(sku=data['sku'], validade_dias=int(data['validade']), capacidade_maxima=float(data['capacidade']))
            db.session.merge(sku)
            db.session.commit()
            return jsonify({'status': 'success', 'message': f'SKU {sku.sku} salvo.'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'status': 'error', 'message': str(e)}), 400
            
    # GET
    skus_query = SKU.query.all()
    skus = [{'sku': s.sku, 'validade_dias': s.validade_dias, 'capacidade_maxima': s.capacidade_maxima} for s in skus_query]
    return jsonify(skus)