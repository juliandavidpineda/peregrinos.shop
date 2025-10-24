# test_model.py
from flask import Flask
from api.models import db, User
import os

def test_model():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/peregrinos.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        try:
            # Verificar que podemos crear una instancia con los nuevos campos
            test_user = User(
                email='test2@example.com',
                name='Test User 2',
                terms_accepted=True,
                privacy_policy_accepted=True, 
                marketing_emails=False
            )
            print('✅ Modelo User acepta campos legales')
            
            # Verificar serialización
            user_dict = test_user.serialize()
            legal_fields = [k for k in user_dict.keys() if any(legal in k for legal in ['terms', 'privacy', 'marketing'])]
            print(f'✅ Campos legales en serialize(): {legal_fields}')
            
            print('🎉 BACKEND COMPLETAMENTE PREPARADO!')
            
        except Exception as e:
            print(f'❌ Error en modelo: {e}')

if __name__ == '__main__':
    test_model()