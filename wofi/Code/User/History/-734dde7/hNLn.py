import os

# Obtém o caminho base do projeto
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Configurações base da aplicação."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'uma-chave-secreta-muito-segura'
    
    # Configuração do SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app', 'descongelamento.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuração de Uploads
    UPLOAD_FOLDER = os.path.join(basedir, 'app', 'uploads')
    ALLOWED_EXTENSIONS = {'csv'}