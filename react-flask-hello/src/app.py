"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS  # ✅ IMPORTAR CORS
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# =============================================================================
# ✅ CORS CONFIGURATION - SEGURA PARA DESARROLLO Y PRODUCCIÓN
# =============================================================================

# Determinar orígenes permitidos según el entorno
if ENV == "development":
    # Desarrollo: localhost
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ]
    print("🔧 Modo DESARROLLO - CORS configurado para localhost")
else:
    # Producción: solo tu dominio real
    allowed_origins = [
        "https://tudominio.com",  # ⚠️ CAMBIAR POR TU DOMINIO REAL
        "https://www.tudominio.com",
        os.getenv("FRONTEND_URL", "https://tudominio.com")  # Usar variable de entorno
    ]
    print(f"🔒 Modo PRODUCCIÓN - CORS configurado para: {allowed_origins}")

CORS(app, 
     resources={
         r"/api/*": {
             "origins": allowed_origins,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
             "allow_headers": ["Content-Type", "Authorization", "Accept"],
             "expose_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "max_age": 3600
         }
     })

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# =============================================================================
# JWT CONFIGURATION
# =============================================================================
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "peregrinos-super-secret-key-2025-dev")
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization" 
app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 86400  # 24 horas

# Inicializar JWT Manager
jwt = JWTManager(app)

# Callback para verificar si el token está en la blacklist (si implementas logout)
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return False

# Callback personalizado para errores de JWT
@jwt.unauthorized_loader
def unauthorized_callback(error):
    return jsonify({
        "error": "Acceso no autorizado",
        "message": "Token de acceso faltante o inválido"
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        "error": "Token inválido", 
        "message": "El token proporcionado es inválido"
    }), 422

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "error": "Token expirado",
        "message": "El token ha expirado, por favor inicia sesión nuevamente"
    }), 401

# =============================================================================
# SETUP
# =============================================================================
setup_admin(app)
setup_commands(app)

# ✅ IMPORTANTE: Registrar blueprint DESPUÉS de configurar CORS
app.register_blueprint(api, url_prefix='/api')

# =============================================================================
# ERROR HANDLERS
# =============================================================================
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# ✅ AGREGAR HANDLER PARA OPTIONS (preflight)
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({'status': 'ok'})
        response.headers.add("Access-Control-Allow-Origin", request.headers.get("Origin", "*"))
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization,Accept")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 200

# =============================================================================
# ROUTES
# =============================================================================
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# =============================================================================
# SERVIR ARCHIVOS UPLOADS
# =============================================================================
@app.route('/api/uploads/<path:folder>/<path:filename>')
def serve_uploaded_file(folder, filename):
    """
    Servir archivos subidos desde la carpeta uploads/
    Ejemplo: /api/uploads/images/uuid.png
    """
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        if current_dir.endswith('src'):
            project_root = os.path.dirname(current_dir)
        else:
            project_root = current_dir
        
        file_path = os.path.join(project_root, 'uploads', folder, filename)
        file_path = os.path.abspath(file_path)
        
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            return jsonify({'error': 'File not found'}), 404
        
        return send_from_directory(
            os.path.join(project_root, 'uploads', folder), 
            filename
        )
        
    except Exception as e:
        print(f"❌ Error serving file: {e}")
        return jsonify({'error': str(e)}), 500

# =============================================================================
# RUN
# =============================================================================
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)