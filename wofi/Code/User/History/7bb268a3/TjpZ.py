import os
import pandas as pd
from datetime import datetime, timedelta
from flask import (
    Blueprint, render_template, request, jsonify, current_app, send_file
)
from werkzeug.utils import secure_filename
from app import db
from app.models import Venda, SKU, Lote, Retirada, PrevisorDemanda, GerenciadorLotes

# Usamos um Blueprint para organizar as rotas
bp = Blueprint('main', __name__)

def allowed_file(filename):
    """Verifica se a extensão do arquivo é permitida."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return render_template('upload.html', error='Nenhum arquivo enviado')
        
        file = request.files['file']
        if file.filename == '':
            return render_template('upload.html', error='Nome de arquivo inválido')
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            try:
                df = pd.read_csv(filepath)
                # Otimização: Inserir em lote
                vendas_para_inserir = []
                for _, row in df.iterrows():
                    venda = Venda(
                        data=datetime.strptime(row['data'], '%Y-%m-%d').date(),
                        sku=row['sku'],
                        kg_vendidos=row['kg_vendidos']
                    )
                    vendas_para_inserir.append(venda)
                
                db.session.bulk_save_objects(vendas_para_inserir)
                db.session.commit()
                return render_template('upload.html', success='Dados importados com sucesso!')
            except Exception as e:
                db.session.rollback()
                return render_template('upload.html', error=f'Erro no processamento: {str(e)}')
    
    return render_template('upload.html')

@bp.route('/calcular', methods=['GET'])
def calcular_retiradas():
    data_hoje = datetime.now().date()
    
    # Obter lista de SKUs únicos dos parâmetros
    skus = SKU.query.all()
    if not skus:
        return jsonify({'error': 'Nenhum SKU configurado. Vá para /skus para adicioná-los.'}), 400
        
    resultados = []
    
    for sku_obj in skus:
        sku = sku_obj.sku
        
        # 1. Prever demanda
        previsor = PrevisorDemanda(sku)
        vp_t2, sigma = previsor.prever_para_t_mais_2()
        
        # 2. Obter retirada do dia anterior
        retirada_t1_obj = Retirada.query.filter_by(sku=sku, data=data_hoje - timedelta(days=1)).first()
        r_t1 = retirada_t1_obj.kg_retirados if retirada_t1_obj else 0
        
        # 3. Calcular retirada R(t) com fator de segurança (estoque de segurança)
        k = 1.65  # Fator de segurança para ~95% de nível de serviço
        estoque_seguranca = k * sigma
        
        # Fórmula: (Demanda Prevista + Estoque Segurança - Estoque já em descongelamento) / Fator de Quebra
        r_t_bruto = (vp_t2 + estoque_seguranca - (0.85 * r_t1)) / 0.85
        
        # 4. Aplicar restrições
        demanda_media_recente = db.session.query(db.func.avg(Venda.kg_vendidos)).filter(Venda.sku == sku).scalar() or 0
        
        r_t = max(0, r_t_bruto) # Não pode ser negativo
        r_t = min(r_t, sku_obj.capacidade_maxima, (2 * demanda_media_recente) / 0.85)
        
        # 5. Salvar retirada e atualizar lotes
        nova_retirada = Retirada(data=data_hoje, sku=sku, kg_retirados=r_t)
        db.session.add(nova_retirada)
        
        gerenciador = GerenciadorLotes(sku)
        gerenciador.atualizar_estoque(data_hoje)
        gerenciador.adicionar_lote(data_hoje, r_t)
        
        # 6. Calcular disponibilidade para o relatório
        disponivel, descongelamento, idade_max = gerenciador.calcular_disponibilidade(data_hoje)
        
        resultados.append({
            'sku': sku,
            'kg_retirar_hoje': round(r_t, 2),
            'kg_disponivel_hoje': round(disponivel, 2),
            'kg_em_descongelamento': round(descongelamento, 2),
            'idade_maxima': int(idade_max)
        })
        
    db.session.commit()
    return jsonify(resultados)

@bp.route('/relatorio', methods=['GET'])
def gerar_relatorio():
    data_hoje = datetime.now().date()
    
    # Busca as retiradas calculadas para hoje
    retiradas_hoje = Retirada.query.filter_by(data=data_hoje).all()
    
    if not retiradas_hoje:
        return "Nenhum cálculo de retirada foi executado para hoje.", 404
        
    dados_relatorio = []
    for retirada in retiradas_hoje:
        gerenciador = GerenciadorLotes(retirada.sku)
        disponivel, descongelamento, idade_max = gerenciador.calcular_disponibilidade(data_hoje)
        dados_relatorio.append({
            'data': data_hoje.strftime('%Y-%m-%d'),
            'sku': retirada.sku,
            'kg_retirar_hoje': round(retirada.kg_retirados, 2),
            'kg_em_descongelamento': round(descongelamento, 2),
            'kg_disponivel_hoje': round(disponivel, 2),
            'idade_maxima': int(idade_max)
        })

    df = pd.DataFrame(dados_relatorio)
    csv_path = os.path.join(current_app.config['UPLOAD_FOLDER'], f'relatorio_{data_hoje}.csv')
    df.to_csv(csv_path, index=False)
    
    return send_file(csv_path, as_attachment=True)

@bp.route('/dashboard', methods=['GET'])
def dashboard():
    retiradas = Retirada.query.order_by(Retirada.data.desc()).limit(10).all()
    
    estoque = db.session.query(
        Lote.sku, db.func.sum(Lote.kg_liquido).label('total')
    ).group_by(Lote.sku).all()
    
    # A lógica de perdas é complexa com o delete, então vamos simplificar.
    # O ideal seria ter uma tabela de perdas ou um status no lote.
    # Por agora, o dashboard mostrará o estado atual.
    
    return render_template('dashboard.html', retiradas=retiradas, estoque=estoque)

@bp.route('/skus', methods=['GET', 'POST'])
def config_skus():
    if request.method == 'POST':
        try:
            sku = SKU(
                sku=request.form['sku'],
                validade_dias=int(request.form['validade']),
                capacidade_maxima=float(request.form['capacidade'])
            )
            db.session.merge(sku) # Usa merge para inserir ou atualizar
            db.session.commit()
            return jsonify({'status': 'success'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'status': 'error', 'message': str(e)}), 400
            
    skus = SKU.query.all()
    return render_template('skus.html', skus=skus)