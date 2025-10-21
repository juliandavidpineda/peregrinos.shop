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
# AUTHENTICATION UTILITIES - NUEVAS FUNCIONES AGREGADAS
# =============================================================================

def generate_token(user_id, role):
    """
    Genera un token JWT para el usuario
    """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id,
            'role': role
        }
        return jwt.encode(
            payload,
            os.getenv('FLASK_APP_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return e

def token_required(f):
    """
    Decorator para verificar token JWT
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, os.getenv('FLASK_APP_KEY'), algorithms=['HS256'])
            current_user_id = data['sub']
            current_user_role = data['role']

            print(f"🔧 [token_required] User ID: {current_user_id}")
            print(f"🔧 [token_required] Role from token: [{current_user_role}]")
            print(f"🔧 [token_required] Role type: {type(current_user_role)}")

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user_id, current_user_role, *args, **kwargs)
    
    return decorated

def admin_required(f):
    """
    Decorator para verificar que el usuario es admin
    """
    @wraps(f)
    @token_required
    def decorated(current_user_id, current_user_role, *args, **kwargs):
        if current_user_role.lower() not in ['superadmin', 'editor', 'content_manager']:
            return jsonify({'message': 'Admin access required'}), 403
        return f(current_user_id, current_user_role, *args, **kwargs)
    
    return decorated

def superadmin_required(f):
    """
    Decorator para verificar que el usuario es superadmin
    """
    @wraps(f)
    @token_required
    def decorated(current_user_id, current_user_role, *args, **kwargs):
        if current_user_role.lower() != 'superadmin':
            return jsonify({'message': 'Superadmin access required'}), 403
        return f(current_user_id, current_user_role, *args, **kwargs)
    
    return decorated