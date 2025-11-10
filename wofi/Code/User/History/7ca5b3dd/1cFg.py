import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

# Inicializa a extensão do banco de dados
db = SQLAlchemy()

def create_app(config_class=Config):
    """Cria e configura uma instância da aplicação Flask."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Cria a pasta de uploads se não existir
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Inicializa as extensões com a aplicação
    db.init_app(app)

    # Registra as rotas na aplicação
    from app import routes
    app.register_blueprint(routes.bp)

    return app