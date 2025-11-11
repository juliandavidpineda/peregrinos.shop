"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
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

# JWT Configuration
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
    # Aquí puedes agregar lógica para verificar tokens revocados
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


# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

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
        # Determinar la ruta base del proyecto
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Si estamos en src/, subir un nivel
        if current_dir.endswith('src'):
            project_root = os.path.dirname(current_dir)
        else:
            project_root = current_dir
        
        # Construir ruta completa al archivo
        file_path = os.path.join(project_root, 'uploads', folder, filename)
        file_path = os.path.abspath(file_path)
        
        # Verificar que el archivo existe
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            return jsonify({'error': 'File not found'}), 404
        
        # Servir el archivo
        return send_from_directory(
            os.path.join(project_root, 'uploads', folder), 
            filename
        )
        
    except Exception as e:
        print(f"❌ Error serving file: {e}")
        return jsonify({'error': str(e)}), 500