from app import create_app, db
from app.models import SKU # Importe um modelo para garantir que o contexto do DB funcione

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)