"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, AdminUser
from api.utils import generate_sitemap, APIException, generate_token, token_required, admin_required
from flask_cors import CORS
import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# =============================================================================
# ADMIN AUTH ENDPOINTS - NUEVOS ENDPOINTS AGREGADOS
# =============================================================================

@api.route('/admin/register', methods=['POST'])
def admin_register():
    try:
        data = request.get_json()
        
        # Verificar si ya existe el email
        if AdminUser.query.filter_by(email=data.get('email')).first():
            return jsonify({'message': 'Email already registered'}), 400
        
        # Crear nuevo admin
        admin = AdminUser(
            email=data.get('email'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            role=data.get('role', 'editor')
        )
        admin.set_password(data.get('password'))
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'message': 'Admin user created successfully',
            'admin': admin.serialize()
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@api.route('/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        admin = AdminUser.query.filter_by(email=data.get('email')).first()
        
        if not admin or not admin.check_password(data.get('password')):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        if not admin.is_active:
            return jsonify({'message': 'Account is disabled'}), 401
        
        # Actualizar último login
        admin.last_login = datetime.datetime.utcnow()
        db.session.commit()
        
        # Generar token
        token = generate_token(admin.id, admin.role.value)
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'admin': admin.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@api.route('/admin/me', methods=['GET'])
@admin_required
def admin_profile(current_user_id, current_user_role):
    try:
        admin = AdminUser.query.get(current_user_id)
        if not admin:
            return jsonify({'message': 'Admin not found'}), 404
        
        return jsonify({
            'admin': admin.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

# Endpoint de prueba protegido
@api.route('/admin/test', methods=['GET'])
@admin_required
def admin_test(current_user_id, current_user_role):
    return jsonify({
        'message': 'Access granted to admin area',
        'user_id': current_user_id,
        'role': current_user_role
    }), 200