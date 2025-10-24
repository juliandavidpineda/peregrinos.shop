import os
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt
from datetime import datetime, timedelta
from api.models import db, User

class GoogleAuthService:
    def __init__(self):
        self.client_id = os.getenv('GOOGLE_CLIENT_ID', '')
        self.secret_key = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')  # ✅ Cambiado
    
    def verify_google_token(self, token):
        """Verificar el token de Google"""
        try:
            print("🔐 Verificando token de Google...")
            
            # Verificar el token con Google
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                self.client_id,
                clock_skew_in_seconds=10  # ✅ Agregado
            )
            
            # Validar que el token es para nuestra app
            if idinfo['aud'] not in [self.client_id]:
                raise ValueError('Could not verify audience.')
            
            print("✅ Token verificado correctamente")
            
            return {
                'success': True,
                'user_data': {
                    'google_id': idinfo['sub'],
                    'email': idinfo['email'],
                    'name': idinfo.get('name', ''),
                    'picture': idinfo.get('picture', ''),
                    'email_verified': idinfo.get('email_verified', False)
                }
            }
            
        except ValueError as e:
            print(f"❌ Error verificando token: {str(e)}")
            return {
                'success': False,
                'error': f'Token de Google inválido: {str(e)}'  # ✅ Mostrar error específico
            }
        except Exception as e:
            print(f"❌ Error inesperado: {str(e)}")
            return {
                'success': False,
                'error': f'Error de autenticación: {str(e)}'
            }
    
    def generate_jwt_token(self, user_id, email):
        """Generar JWT token para el usuario"""
        try:
            payload = {
                'user_id': user_id,
                'email': email,
                'exp': datetime.utcnow() + timedelta(days=7)
            }
            token = jwt.encode(payload, self.secret_key, algorithm='HS256')
            return token
        except Exception as e:
            print(f"❌ Error generando JWT: {str(e)}")
            return None

    def find_or_create_user(self, user_data):
        """Buscar usuario por google_id o email, o crear uno nuevo"""
        try:
            print(f"🔍 Buscando usuario: {user_data['email']}")
            
            # Buscar por google_id
            user = User.query.filter_by(google_id=user_data['google_id']).first()
            
            if not user:
                # Buscar por email
                user = User.query.filter_by(email=user_data['email']).first()
                
                if user:
                    # Usuario existe pero sin google_id - actualizar
                    print(f"🔄 Actualizando usuario existente con Google ID: {user.email}")
                    user.google_id = user_data['google_id']
                    user.name = user_data['name']
                    user.picture = user_data['picture']
                    user.email_verified = user_data['email_verified']
                else:
                    # Crear nuevo usuario
                    print(f"👤 Creando nuevo usuario: {user_data['email']}")
                    user = User(
                        google_id=user_data['google_id'],
                        email=user_data['email'],
                        name=user_data['name'],
                        picture=user_data['picture'],
                        email_verified=user_data['email_verified'],
                        role='customer',
                        is_active=True,
                        password=None  # ✅ Agregado explícitamente
                    )
                    db.session.add(user)
            else:
                print(f"✅ Usuario existente encontrado: {user.email}")
            
            # Actualizar información del usuario
            user.name = user_data['name']
            user.picture = user_data['picture']
            user.email_verified = user_data['email_verified']
            
            db.session.commit()
            
            return user
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error en find_or_create_user: {str(e)}")
            raise e