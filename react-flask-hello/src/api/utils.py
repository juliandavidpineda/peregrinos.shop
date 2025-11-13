from flask import jsonify, url_for, request
from functools import wraps
import jwt
import datetime
import os

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"

# =============================================================================
# AUTHENTICATION UTILITIES - ✅ CORREGIDO Y MEJORADO
# =============================================================================

def get_jwt_secret():
    """
    Obtiene la clave secreta JWT de forma consistente
    ✅ Prioriza JWT_SECRET_KEY, fallback a FLASK_APP_KEY para compatibilidad
    """
    secret = os.getenv('JWT_SECRET_KEY') or os.getenv('FLASK_APP_KEY')
    if not secret:
        print("⚠️ WARNING: No JWT secret key found in environment variables")
        return 'peregrinos-super-secret-key-2025-dev'  # Fallback solo para desarrollo
    return secret

def generate_token(user_id, role='user'):
    """
    Genera un token JWT para el usuario
    ✅ Usa JWT_SECRET_KEY de forma consistente
    
    Args:
        user_id (int): ID del usuario
        role (str): Rol del usuario (user, admin, superadmin, etc.)
    
    Returns:
        str: Token JWT codificado
    """
    try:
        secret_key = get_jwt_secret()
        
        # ✅ CORRECCIÓN CRÍTICA: Asegurar que 'sub' sea string (requerido por JWT)
        user_id_str = str(user_id)
        
        # ✅ Usar datetime actual (utcnow está deprecado pero sigue funcionando)
        current_time = datetime.datetime.utcnow()
        
        payload = {
            'exp': current_time + datetime.timedelta(days=1),
            'iat': current_time,
            'sub': user_id_str,  # ✅ 'sub' como STRING (solución al error)
            'user_id': user_id,  # ✅ También como user_id para compatibilidad
            'role': role
        }
        
        token = jwt.encode(
            payload,
            secret_key,
            algorithm='HS256'
        )
        
        print(f"✅ Token generado exitosamente para user_id={user_id}, role={role}")
        print(f"   - sub como string: '{user_id_str}'")
        return token
        
    except Exception as e:
        print(f"❌ Error generando token: {str(e)}")
        raise e

def token_required(f):
    """
    Decorador para verificar token JWT en rutas protegidas
    ✅ Mejorado con logging y soporte para CORS OPTIONS
    
    Usage:
        @api.route('/protected', methods=['GET'])
        @token_required
        def protected_route(current_user_id, current_user_role):
            return jsonify({'message': 'Access granted'})
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        # ✅ Permitir OPTIONS sin autenticación (CORS preflight)
        if request.method == 'OPTIONS':
            print("✅ OPTIONS request - permitiendo sin autenticación")
            return '', 200
        
        print(f"🔐 token_required: Verificando {request.method} {request.path}")
        
        token = request.headers.get('Authorization')
        
        if not token:
            print("❌ Token faltante en headers")
            return jsonify({
                'success': False,
                'message': 'Token is missing',
                'error': 'Authorization header required'
            }), 401
        
        try:
            # Extraer token del formato "Bearer <token>"
            if token.startswith('Bearer '):
                token = token[7:]
            elif token.startswith('bearer '):
                token = token[7:]
            
            secret_key = get_jwt_secret()
            
            # Decodificar token
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            
            # ✅ Extraer user_id (puede estar como 'sub' o 'user_id')
            current_user_id = data.get('user_id') or data.get('sub')
            current_user_role = data.get('role', 'user')
            
            if not current_user_id:
                print("❌ Token no contiene user_id ni sub")
                return jsonify({
                    'success': False,
                    'message': 'Invalid token structure',
                    'error': 'Token must contain user_id or sub'
                }), 401
            
            print(f"✅ Token válido - user_id: {current_user_id}, role: {current_user_role}")

        except jwt.ExpiredSignatureError:
            print("⏰ Token expirado")
            return jsonify({
                'success': False,
                'message': 'Token has expired',
                'error': 'Please login again'
            }), 401
        except jwt.InvalidTokenError as e:
            print(f"❌ Token inválido: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Token is invalid',
                'error': str(e)
            }), 401
        except Exception as e:
            print(f"❌ Error inesperado validando token: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({
                'success': False,
                'message': 'Error validating token',
                'error': str(e)
            }), 401
        
        # Ejecutar la función protegida pasando user_id y role
        return f(current_user_id, current_user_role, *args, **kwargs)
    
    return decorated

def admin_required(f):
    """
    Decorador para verificar que el usuario tiene rol de administrador
    ✅ Verifica roles: superadmin, admin, editor, content_manager
    
    Usage:
        @api.route('/admin/dashboard', methods=['GET'])
        @admin_required
        def admin_dashboard(current_user_id, current_user_role):
            return jsonify({'message': 'Admin area'})
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        # ✅ Permitir OPTIONS sin autenticación
        if request.method == 'OPTIONS':
            return '', 200
        
        print(f"🔐 admin_required: Verificando {request.method} {request.path}")
        
        token = request.headers.get('Authorization')
        
        if not token:
            print("❌ Token faltante")
            return jsonify({
                'success': False,
                'message': 'Token is missing',
                'error': 'Authorization required'
            }), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            secret_key = get_jwt_secret()
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            
            current_user_id = data.get('user_id') or data.get('sub')
            current_user_role = data.get('role', 'user')
            
            # ✅ Verificar rol de admin
            admin_roles = ['superadmin', 'admin', 'editor', 'content_manager']
            if current_user_role.lower() not in admin_roles:
                print(f"⛔ Acceso denegado - role: {current_user_role} no es admin")
                return jsonify({
                    'success': False,
                    'message': 'Admin access required',
                    'error': f'Your role ({current_user_role}) does not have admin privileges'
                }), 403
            
            print(f"✅ Admin verificado - user_id: {current_user_id}, role: {current_user_role}")
            
        except jwt.ExpiredSignatureError:
            print("⏰ Token expirado")
            return jsonify({
                'success': False,
                'message': 'Token has expired'
            }), 401
        except jwt.InvalidTokenError as e:
            print(f"❌ Token inválido: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Token is invalid'
            }), 401
        except Exception as e:
            print(f"❌ Error validando admin: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Error validating credentials'
            }), 401
        
        return f(current_user_id, current_user_role, *args, **kwargs)
    
    return decorated

def superadmin_required(f):
    """
    Decorador para verificar que el usuario es superadmin
    ✅ Solo permite acceso a usuarios con rol 'superadmin'
    
    Usage:
        @api.route('/superadmin/settings', methods=['GET'])
        @superadmin_required
        def superadmin_settings(current_user_id, current_user_role):
            return jsonify({'message': 'Superadmin area'})
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        # ✅ Permitir OPTIONS sin autenticación
        if request.method == 'OPTIONS':
            return '', 200
        
        print(f"🔐 superadmin_required: Verificando {request.method} {request.path}")
        
        token = request.headers.get('Authorization')
        
        if not token:
            print("❌ Token faltante")
            return jsonify({
                'success': False,
                'message': 'Token is missing',
                'error': 'Authorization required'
            }), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            secret_key = get_jwt_secret()
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            
            current_user_id = data.get('user_id') or data.get('sub')
            current_user_role = data.get('role', 'user')
            
            # ✅ Verificar rol de superadmin
            if current_user_role.lower() != 'superadmin':
                print(f"⛔ Acceso denegado - role: {current_user_role} no es superadmin")
                return jsonify({
                    'success': False,
                    'message': 'Superadmin access required',
                    'error': f'Your role ({current_user_role}) does not have superadmin privileges'
                }), 403
            
            print(f"✅ Superadmin verificado - user_id: {current_user_id}")
            
        except jwt.ExpiredSignatureError:
            print("⏰ Token expirado")
            return jsonify({
                'success': False,
                'message': 'Token has expired'
            }), 401
        except jwt.InvalidTokenError as e:
            print(f"❌ Token inválido: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Token is invalid'
            }), 401
        except Exception as e:
            print(f"❌ Error validando superadmin: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'Error validating credentials'
            }), 401
        
        return f(current_user_id, current_user_role, *args, **kwargs)
    
    return decorated

# =============================================================================
# UTILIDADES ADICIONALES JWT
# =============================================================================

def decode_token(token):
    """
    Decodifica un token JWT sin verificar expiración (útil para debugging)
    
    Args:
        token (str): Token JWT a decodificar
    
    Returns:
        dict: Payload del token o None si hay error
    """
    try:
        if token.startswith('Bearer '):
            token = token[7:]
        
        secret_key = get_jwt_secret()
        data = jwt.decode(
            token, 
            secret_key, 
            algorithms=['HS256'],
            options={'verify_exp': False}  # No verificar expiración
        )
        return data
    except Exception as e:
        print(f"❌ Error decodificando token: {str(e)}")
        return None

def refresh_token(old_token):
    """
    Genera un nuevo token a partir de uno existente
    
    Args:
        old_token (str): Token JWT existente
    
    Returns:
        str: Nuevo token JWT o None si hay error
    """
    try:
        data = decode_token(old_token)
        if not data:
            return None
        
        user_id = data.get('user_id') or data.get('sub')
        role = data.get('role', 'user')
        
        if not user_id:
            return None
        
        return generate_token(user_id, role)
    except Exception as e:
        print(f"❌ Error refrescando token: {str(e)}")
        return None

def verify_token_without_request(token):
    """
    Verifica un token JWT sin necesidad de estar en un contexto de request
    Útil para testing o validaciones fuera de endpoints
    
    Args:
        token (str): Token JWT a verificar
    
    Returns:
        tuple: (success: bool, user_id: int, role: str, error: str)
    """
    try:
        if token.startswith('Bearer '):
            token = token[7:]
        
        secret_key = get_jwt_secret()
        data = jwt.decode(token, secret_key, algorithms=['HS256'])
        
        user_id = data.get('user_id') or data.get('sub')
        role = data.get('role', 'user')
        
        if not user_id:
            return False, None, None, 'Token does not contain user_id'
        
        return True, user_id, role, None
        
    except jwt.ExpiredSignatureError:
        return False, None, None, 'Token has expired'
    except jwt.InvalidTokenError as e:
        return False, None, None, f'Invalid token: {str(e)}'
    except Exception as e:
        return False, None, None, f'Error: {str(e)}'