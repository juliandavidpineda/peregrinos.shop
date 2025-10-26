"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory 
from api.models import db, User, AdminUser, Product, Category, Order, OrderItem, PageContent, Banner, ContactLead, Review, UserActivityLog, UserRoleEnum 
from api.utils import generate_sitemap, APIException, generate_token, token_required, admin_required
from flask_cors import CORS
from datetime import datetime, timedelta
from api.models import OrderStatusEnum
from sqlalchemy import func, desc, or_

import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app, send_from_directory

from api.services.google_auth import GoogleAuthService
from functools import wraps

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
# ADMIN AUTH ENDPOINTS 
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
        print("🔧 === INICIANDO LOGIN ===")
        data = request.get_json()
        print("🔧 DATOS LOGIN:", data)
        
        email = data.get('email')
        password = data.get('password')
        
        print("🔧 BUSCANDO USUARIO:", email)
        admin = AdminUser.query.filter_by(email=email).first()
        
        if admin:
            password_valid = admin.check_password(password)
            
            if not password_valid:
                return jsonify({'message': 'Invalid credentials'}), 401
            
            if not admin.is_active:
                return jsonify({'message': 'Account is disabled'}), 401
            
            # Actualizar último login
            admin.last_login = datetime.utcnow()
            db.session.commit()
            
            # Generar token
            token = generate_token(admin.id, admin.role)
            
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'admin': admin.serialize()
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
        
    except Exception as e:
        print("🔧 ERROR EN LOGIN:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({'message': str(e)}), 400
    
# =============================================================================
# ADMIN CLIENT USERS ENDPOINTS (SOLO SUPERADMIN)
# =============================================================================

def superadmin_required(f):
    """Decorator para verificar que el usuario es superadmin"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            print("🔧 === SUPERADMIN REQUIRED ===")
            
            # Obtener token del header
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
            print(f"🔧 Token recibido: {token[:50]}...")
            
            if not token:
                return jsonify({'error': 'Token is required'}), 401
            
            # ✅ CAMBIO: Usar el MISMO secret key que generate_token
            secret_key = os.getenv('FLASK_APP_KEY')  # MISMO que generate_token
            
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            print(f"🔧 Payload del token: {payload}")
            
            admin_user_id = payload.get('sub')
            print(f"🔧 Admin User ID from token: {admin_user_id}")
            
            if not admin_user_id:
                return jsonify({'error': 'Invalid token'}), 401
            
            # Buscar admin user
            admin_user = AdminUser.query.get(admin_user_id)
            print(f"🔧 Admin User encontrado: {admin_user}")
            
            if not admin_user or not admin_user.is_active:
                return jsonify({'error': 'Admin user not found or inactive'}), 401
            
            print(f"🔧 Rol del admin: {admin_user.role}")
            
            # Verificar que es superadmin
            if admin_user.role.lower() != 'superadmin':  # ✅ .lower() para mayúsculas
                print(f"🔧 ❌ Rol no es superadmin: {admin_user.role}")
                return jsonify({'error': 'Superadmin access required'}), 403
            
            print("🔧 ✅ Acceso concedido - Es superadmin")
            return f(*args, **kwargs)
            
        except Exception as e:
            print(f"🔧 ❌ Error en decorator: {str(e)}")
            return jsonify({'error': str(e)}), 401
    return decorated_function

@api.route('/admin/client-users', methods=['GET'])
@superadmin_required
def get_client_users():
    """Obtener lista de usuarios clientes con filtros (solo superadmin)"""
    try:
        # Obtener parámetros de filtro
        search = request.args.get('search', '')
        is_active = request.args.get('is_active', type=lambda x: x.lower() == 'true')
        terms_accepted = request.args.get('terms_accepted', type=lambda x: x.lower() == 'true')
        marketing_emails = request.args.get('marketing_emails', type=lambda x: x.lower() == 'true')
        segment = request.args.get('segment', 'all')  # ✅ NUEVO FILTRO
        
        print(f"🔧 Filtros - segment: {segment}")
        
        # Construir query
        query = User.query
        
        # Aplicar filtros existentes
        if search:
            query = query.filter(
                db.or_(
                    User.email.ilike(f'%{search}%'),
                    User.name.ilike(f'%{search}%')
                )
            )
        
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
            
        if terms_accepted is not None:
            query = query.filter(User.terms_accepted == terms_accepted)
            
        if marketing_emails is not None:
            query = query.filter(User.marketing_emails == marketing_emails)
        
        # ✅ NUEVO: Aplicar filtro de segmentación
        if segment != 'all':
            if segment == 'vip':
                query = query.filter(User.total_orders.isnot(None)).filter(User.total_orders >= 3)
            elif segment == 'recurrent':
                query = query.filter(User.total_orders.isnot(None)).filter(User.total_orders >= 2)
            elif segment == 'new':
                query = query.filter(db.or_(
                    User.total_orders == 0,
                    User.total_orders == None
                ))
            elif segment == 'inactive':
                from datetime import datetime, timedelta
                thirty_days_ago = datetime.utcnow() - timedelta(days=30)
                query = query.filter(
                    db.or_(
                        User.last_login == None,
                        # ✅ Convertir a naive datetime para comparación
                        User.last_login < thirty_days_ago
                    )
                )
            elif segment == 'regular':
                query = query.filter(User.total_orders.isnot(None)).filter(User.total_orders == 1)
        
        # Ordenar por fecha de creación (más recientes primero)
        users = query.order_by(User.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'users': [user.serialize() for user in users],
            'total': len(users)
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting client users: {str(e)}")
        return jsonify({'error': str(e)}), 400

@api.route('/admin/client-users/<int:user_id>', methods=['PUT'])
@superadmin_required
def update_client_user(user_id):
    """Actualizar usuario cliente (solo superadmin)"""
    try:
        data = request.get_json()
        
        # Buscar usuario
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Campos permitidos para actualizar
        allowed_fields = ['is_active', 'name']
        
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        
        # Log de la actividad
        log_admin_activity(
            admin_user_id=get_current_admin_id(),  # Necesitarías implementar esta función
            action='update_client_user',
            description=f'Updated user {user.email}',
            request=request
        )
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User updated successfully',
            'user': user.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error updating client user: {str(e)}")
        return jsonify({'error': str(e)}), 400

@api.route('/admin/client-users/<int:user_id>/orders', methods=['GET'])
@superadmin_required
def get_client_user_orders(user_id):
    """Obtener pedidos de un usuario cliente (solo superadmin)"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'orders': [order.serialize() for order in orders],
            'total': len(orders)
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting user orders: {str(e)}")
        return jsonify({'error': str(e)}), 400

@api.route('/admin/client-users/stats', methods=['GET'])
@superadmin_required
def get_client_users_stats():
    """Obtener estadísticas de usuarios clientes (solo superadmin)"""
    try:
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        users_with_terms = User.query.filter_by(terms_accepted=True).count()
        users_with_marketing = User.query.filter_by(marketing_emails=True).count()
        
        return jsonify({
            'success': True,
            'stats': {
                'total_users': total_users,
                'active_users': active_users,
                'users_with_terms': users_with_terms,
                'users_with_marketing': users_with_marketing,
                'inactive_users': total_users - active_users
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting user stats: {str(e)}")
        return jsonify({'error': str(e)}), 400

@api.route('/admin/client-users/export', methods=['GET'])
@superadmin_required
def export_client_users():
    """Exportar usuarios clientes a CSV (solo superadmin)"""
    try:
        print("🔧 === EXPORT CLIENT USERS ===")
        
        # Obtener parámetros de filtro
        marketing_only = request.args.get('marketing_only', 'false').lower() == 'true'
        segment = request.args.get('segment', 'all')  # ✅ NUEVO: filtro por segmento
        
        print(f"🔧 Filtros - marketing_only: {marketing_only}, segment: '{segment}'")
        
        # Construir query
        query = User.query.filter(User.is_active == True)
        
        if marketing_only:
            query = query.filter(User.marketing_emails == True)
            print("🔧 Exportando solo usuarios con marketing aceptado")
        
        # ✅ NUEVO: Aplicar filtro de segmentación para exportación
        if segment != 'all':
            print(f"🔧 Exportando segmento: {segment}")
            
            if segment == 'vip':
                query = query.filter(User.total_orders >= 3)
            elif segment == 'recurrent':
                query = query.filter(User.total_orders >= 2)
            elif segment == 'new':
                query = query.filter(db.or_(
                    User.total_orders == 0,
                    User.total_orders == None
                ))
            elif segment == 'inactive':
                thirty_days_ago = datetime.utcnow() - timedelta(days=30)
                query = query.filter(
                    db.or_(
                        User.last_login == None,
                        User.last_login < thirty_days_ago
                    )
                )
            elif segment == 'regular':
                query = query.filter(User.total_orders == 1)
            elif segment == 'marketing':
                query = query.filter(User.marketing_emails == True)
        
        users = query.order_by(User.created_at.desc()).all()
        
        print(f"🔧 Usuarios a exportar: {len(users)}")
        
        # Crear datos CSV
        csv_data = []
        
        # Encabezados
        headers = [
            'ID', 
            'Email', 
            'Nombre', 
            'Email Verificado',
            'Segmento',
            'Total Pedidos',
            'Total Gastado', 
            'Términos Aceptados', 
            'Política Aceptada',
            'Marketing Aceptado', 
            'Último Login',
            'Fecha Registro',
            'Última Actualización'
        ]
        csv_data.append(headers)
        
        # Datos de usuarios
        for user in users:
            csv_data.append([
                user.id,
                user.email or '',
                user.name or '',
                'Sí' if user.email_verified else 'No',
                user.get_user_segment() if hasattr(user, 'get_user_segment') else 'N/A',
                user.total_orders or 0,
                user.total_spent or 0.0,
                'Sí' if user.terms_accepted else 'No',
                'Sí' if user.privacy_policy_accepted else 'No',
                'Sí' if user.marketing_emails else 'No',
                user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else 'Nunca',
                user.created_at.strftime('%Y-%m-%d %H:%M:%S') if user.created_at else '',
                user.updated_at.strftime('%Y-%m-%d %H:%M:%S') if user.updated_at else ''
            ])
        
        return jsonify({
            'success': True,
            'csv_data': csv_data,
            'total_users': len(users),
            'export_type': segment if segment != 'all' else 'marketing_only' if marketing_only else 'all_users',
            'export_date': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        print(f"❌ Error exporting client users: {str(e)}")
        return jsonify({'error': str(e)}), 400

# =============================================================================
# FUNCIÓN HELPER PARA LOGS ADMINUSER
# =============================================================================
def log_admin_activity(admin_user_id, action, description, request=None):
    """Función helper para registrar actividad de admin"""
    try:
        log = UserActivityLog(
            admin_user_id=admin_user_id,
            action=action,
            description=description,
            ip_address=request.remote_addr if request else None,
            user_agent=request.headers.get('User-Agent') if request else None
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print(f"Error logging activity: {e}")
        # No hacemos rollback de la transacción principal por un error en el log

# =============================================================================
# ADMIN USER MANAGEMENT ENDPOINTS
# =============================================================================

@api.route('/admin/users', methods=['GET'])
@admin_required
def get_admin_users(current_user_id, current_user_role):
    """Obtener lista de usuarios admin con filtros"""
    try:
       
        # Solo superadmin puede ver todos los usuarios
        if current_user_role.lower() != 'superadmin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Parámetros de filtro
        role_filter = request.args.get('role')
        status_filter = request.args.get('is_active')
        search = request.args.get('search')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        print("🔧 FILTROS:", {
            'role': role_filter,
            'is_active': status_filter, 
            'search': search,
            'page': page,
            'per_page': per_page
        })
        
        # Construir query base
        query = AdminUser.query
        
        # Aplicar filtros - CORREGIR LÓGICA DE is_active
        if role_filter:
            query = query.filter_by(role=role_filter)
        
        # CORRECCIÓN: Solo aplicar filtro si se especifica explícitamente
        if status_filter and status_filter != '':
            is_active = status_filter.lower() == 'true'
            query = query.filter_by(is_active=is_active)
        else:
            print("🔧 SIN FILTRO is_active")
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    AdminUser.email.ilike(search_term),
                    AdminUser.first_name.ilike(search_term),
                    AdminUser.last_name.ilike(search_term)
                )
            )
        
        total_before_pagination = query.count()
        
        # Paginación
        users = query.order_by(AdminUser.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        for user in users.items:
            print(f"🔧   - {user.email} (activo: {user.is_active})")
        
        return jsonify({
            'users': [user.serialize() for user in users.items],
            'total': users.total,
            'pages': users.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        print("🔧 ERROR EN LISTADO:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({'message': str(e)}), 400
    
@api.route('/admin/users/<user_id>', methods=['GET'])
@admin_required
def get_admin_user(current_user_id, current_user_role, user_id):
    """Obtener un usuario admin específico"""
    try:
        # Solo superadmin puede ver otros usuarios, o el propio usuario viéndose a sí mismo
        if current_user_role.lower() != 'superadmin' and current_user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        user = AdminUser.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'user': user.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    
@api.route('/admin/users', methods=['POST'])
@admin_required
def create_admin_user(current_user_id, current_user_role):
    try:        
        # Solo superadmin puede crear usuarios
        if current_user_role.lower() != 'superadmin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        # Validaciones básicas
        required_fields = ['email', 'password', 'first_name', 'last_name', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'Field {field} is required'}), 400
        
        # Verificar si el email ya existe
        existing_user = AdminUser.query.filter_by(email=data.get('email')).first()
        if existing_user:
            print("🔧 EMAIL YA EXISTE:", existing_user.email)
            return jsonify({'message': 'Email already registered'}), 400
        
        
        # CORRECCIÓN: Usar string directamente, NO Enum
        role_from_request = data.get('role')

        # Validar que el rol sea válido
        valid_roles = ['superadmin', 'editor', 'content_manager']
        if role_from_request not in valid_roles:
            print("🔧 ROL INVÁLIDO:", role_from_request)
            return jsonify({'message': 'Invalid role'}), 400
        
        print("🔧 ROL VÁLIDO, CREANDO USUARIO...")
        
        # Crear nuevo usuario - USAR STRING DIRECTAMENTE
        new_user = AdminUser(
            email=data.get('email'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            role=role_from_request,  # ← STRING, NO ENUM
            is_active=data.get('is_active', True)
        )
        new_user.set_password(data.get('password'))
        
        db.session.add(new_user)
        
        db.session.commit()
      
        
        return jsonify({
            'message': 'Admin user created successfully',
            'user': new_user.serialize()
        }), 201
        
    except Exception as e:
        print("🔧 ERROR EN create_admin_user:", str(e))
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'message': str(e)}), 400
    
@api.route('/admin/users/<user_id>', methods=['PUT'])
@admin_required
def update_admin_user(current_user_id, current_user_role, user_id):
    """Actualizar usuario admin"""
    try:
        user = AdminUser.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        data = request.get_json()
        
        # Permisos: superadmin puede editar cualquier usuario, otros solo su propio perfil
        if current_user_role.lower() != 'superadmin' and current_user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Restricciones para no-superadmin
        if current_user_role.lower() != 'superadmin':
            # No puede cambiar rol
            if 'role' in data:
                return jsonify({'message': 'Cannot change role'}), 403
            # No puede desactivar cuenta
            if 'is_active' in data:
                return jsonify({'message': 'Cannot change activation status'}), 403
        
        # Campos permitidos para actualizar
        if 'email' in data and data['email'] != user.email:
            # Verificar si nuevo email ya existe
            if AdminUser.query.filter_by(email=data['email']).first():
                return jsonify({'message': 'Email already registered'}), 400
            user.email = data['email']
        
        if 'first_name' in data:
            user.first_name = data['first_name']
        
        if 'last_name' in data:
            user.last_name = data['last_name']
        
        # Solo superadmin puede cambiar estos campos
        if current_user_role.lower() == 'superadmin':
            if 'role' in data:
                valid_roles = ['superadmin', 'editor', 'content_manager']
                if data['role'] not in valid_roles:
                    return jsonify({'message': 'Invalid role'}), 400
                user.role = data['role']
            
            if 'is_active' in data:
                user.is_active = data['is_active']
        
        # Actualizar contraseña si se proporciona
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        
        user.updated_at = func.now()
        db.session.commit()
        
        # Registrar actividad
        action = 'user_updated_self' if current_user_id == user_id else 'user_updated'
        log_admin_activity(
            current_user_id,
            action,
            f'Updated admin user: {user.email}',
            request
        )
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@api.route('/admin/users/<user_id>', methods=['DELETE'])
@admin_required
def delete_admin_user(current_user_id, current_user_role, user_id):
    """Eliminar usuario admin (solo superadmin)"""
    try:
        # Solo superadmin puede eliminar usuarios
        if current_user_role.lower() != 'superadmin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        user = AdminUser.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # No permitir eliminarse a sí mismo
        if current_user_id == user_id:
            return jsonify({'message': 'Cannot delete your own account'}), 400
        
        # Registrar actividad antes de eliminar
        log_admin_activity(
            current_user_id,
            'user_deleted',
            f'Deleted admin user: {user.email}',
            request
        )
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@api.route('/admin/users/<user_id>/toggle-status', methods=['PUT'])
@admin_required
def toggle_user_status(current_user_id, current_user_role, user_id):
    """Activar/desactivar usuario (solo superadmin)"""
    try:
        # Solo superadmin puede cambiar estado
        if current_user_role.lower() != 'superadmin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        user = AdminUser.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # No permitir desactivarse a sí mismo
        if current_user_id == user_id:
            return jsonify({'message': 'Cannot deactivate your own account'}), 400
        
        user.is_active = not user.is_active
        db.session.commit()
        
        # Registrar actividad
        status = 'activated' if user.is_active else 'deactivated'
        log_admin_activity(
            current_user_id,
            'user_status_changed',
            f'{status} admin user: {user.email}',
            request
        )
        
        return jsonify({
            'message': f'User {status} successfully',
            'user': user.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@api.route('/admin/activity-logs', methods=['GET'])
@admin_required
def get_activity_logs(current_user_id, current_user_role):
    """Obtener logs de actividad (solo superadmin)"""
    try:
        # Solo superadmin puede ver logs
        if current_user_role.lower() != 'superadmin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        # Parámetros de paginación
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Query con joins para obtener info del usuario
        logs = UserActivityLog.query.join(AdminUser).order_by(
            UserActivityLog.created_at.desc()
        ).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'logs': [log.serialize() for log in logs.items],
            'total': logs.total,
            'pages': logs.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

# =============================================================================
# PRODUCT ENDPOINTS - CRUD COMPLETO
# =============================================================================

@api.route('/products', methods=['GET'])
def get_products():
    """Obtener todos los productos con filtros opcionales"""
    try:
        # Filtros
        category = request.args.get('category')
        in_stock = request.args.get('in_stock')
        is_on_sale = request.args.get('is_on_sale')
        
        query = Product.query
        
        if category:
            query = query.filter_by(category=category)
        if in_stock:
            query = query.filter_by(in_stock=True)
        if is_on_sale:
            query = query.filter_by(is_on_sale=True)
        
        products = query.all()
        
        return jsonify({
            'products': [product.serialize() for product in products],
            'total': len(products)
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@api.route('/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """Obtener un producto específico por ID"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        return jsonify({
            'product': product.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@api.route('/products', methods=['POST'])
@admin_required
def create_product(current_user_id, current_user_role):
    """Crear un nuevo producto (Solo admins)"""
    try:
        data = request.get_json()
        
        # Validaciones básicas
        if not data.get('name') or not data.get('price'):
            return jsonify({'message': 'Name and price are required'}), 400
        
        product = Product(
            name=data.get('name'),
            description=data.get('description'),
            price=float(data.get('price')),
            original_price=float(data.get('original_price')) if data.get('original_price') else None,
            images=data.get('images', []),
            category_id=data.get('category_id'),
            subcategory=data.get('subcategory'),
            sizes=data.get('sizes', []),
            features=data.get('features', []),
            in_stock=bool(data.get('in_stock', True)),
            stock_quantity=int(data.get('stock_quantity', 0)),
            is_new=bool(data.get('is_new', False)),
            is_on_sale=bool(data.get('is_on_sale', False)),
            # NUEVOS CAMPOS
            material=data.get('material'),
            cuidados=data.get('cuidados'),
            origen=data.get('origen'),
            disponibilidad=data.get('disponibilidad'),
            costo_prenda=float(data.get('costo_prenda')) if data.get('costo_prenda') else None,
            videos=data.get('videos', [])
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@api.route('/products/<product_id>', methods=['PUT'])
@admin_required
def update_product(current_user_id, current_user_role, product_id):
    """Actualizar un producto existente (Solo admins)"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        data = request.get_json()
        
        # Actualizar campos
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = float(data['price'])
        if 'original_price' in data:
            product.original_price = float(data['original_price']) if data['original_price'] else None
        if 'images' in data:
            product.images = data['images']
        if 'category_id' in data:
            product.category_id = data['category_id']
        if 'subcategory' in data:
            product.subcategory = data['subcategory']
        if 'sizes' in data:
            product.sizes = data['sizes']
        if 'features' in data:
            product.features = data['features']
        if 'in_stock' in data:
            product.in_stock = bool(data['in_stock'])
        if 'stock_quantity' in data:
            product.stock_quantity = int(data['stock_quantity'])
        if 'is_new' in data:
            product.is_new = bool(data['is_new'])
        if 'is_on_sale' in data:
            product.is_on_sale = bool(data['is_on_sale'])
        # NUEVOS CAMPOS
        if 'material' in data:
            product.material = data['material']
        if 'cuidados' in data:
            product.cuidados = data['cuidados']
        if 'origen' in data:
            product.origen = data['origen']
        if 'disponibilidad' in data:
            product.disponibilidad = data['disponibilidad']
        if 'costo_prenda' in data:
            product.costo_prenda = float(data['costo_prenda']) if data['costo_prenda'] else None
        if 'videos' in data:
            product.videos = data['videos']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ ERROR al actualizar: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': str(e)}), 400

@api.route('/products/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user_id, current_user_role, product_id):
    """Eliminar un producto (Solo superadmins)"""
    try:
        if current_user_role.lower() != 'superadmin':
            return jsonify({'message': 'Superadmin access required'}), 403
            
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400
    
@api.route('/products/top-selling', methods=['GET'])
def get_top_selling_products():
    """Obtiene los productos más vendidos o productos destacados"""
    try:
        limit = request.args.get('limit', 4, type=int)
        
        # Intentar obtener productos más vendidos
        top_products_query = db.session.query(
            Product,
            func.coalesce(func.sum(OrderItem.quantity), 0).label('total_sold')
        ).outerjoin(OrderItem, Product.id == OrderItem.product_id)\
         .outerjoin(Order, OrderItem.order_id == Order.id)\
         .group_by(Product.id)\
         .order_by(desc('total_sold'), desc(Product.id))\
         .limit(limit)\
         .all()
        
        # Si no hay productos con ventas, traer productos normales
        if not top_products_query or all(sold == 0 for _, sold in top_products_query):
            # Traer los últimos productos creados
            products = Product.query.order_by(desc(Product.id)).limit(limit).all()
            products_list = []
            for product in products:
                products_list.append({
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': float(product.price),
                    'images': product.images if product.images else [],
                    'sizes': product.sizes if product.sizes else ['S', 'M', 'L', 'XL'],
                    'stock': product.stock if hasattr(product, 'stock') else 0,
                    'category_id': product.category_id if hasattr(product, 'category_id') else None,
                    'total_sold': 0
                })
        else:
            # Formatear productos con ventas
            products_list = []
            for product, total_sold in top_products_query:
                products_list.append({
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': float(product.price),
                    'images': product.images if product.images else [],
                    'sizes': product.sizes if product.sizes else ['S', 'M', 'L', 'XL'],
                    'stock': product.stock if hasattr(product, 'stock') else 0,
                    'category_id': product.category_id if hasattr(product, 'category_id') else None,
                    'total_sold': int(total_sold)
                })
        
        return jsonify({
            'success': True,
            'products': products_list
        }), 200
        
    except Exception as e:
        print(f"Error getting top selling products: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'message': 'Error al obtener productos más vendidos',
            'error': str(e)
        }), 500

# =============================================================================
# CATEGORY ENDPOINTS
# =============================================================================

@api.route('/categories', methods=['GET'])
def get_categories():
    """Obtener todas las categorías"""
    try:
        categories = Category.query.order_by(Category.name).all()
        
        categories_data = []
        for category in categories:
            categories_data.append({
                'id': category.id,
                'name': category.name,
                'description': category.description or '',
                'image_url': category.image_url or '',
                'product_count': len(category.products) if category.products else 0,
                'created_at': category.created_at.isoformat() if category.created_at else None
            })
        
        return jsonify({
            'success': True,
            'categories': categories_data,
            'total': len(categories_data)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}',
            'categories': []
        }), 500

@api.route('/admin/categories', methods=['POST'])
@admin_required
def create_category(current_user_id=None, current_user_role=None):
    """Crear nueva categoría"""
    try:
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'success': False, 'message': 'El nombre de la categoría es requerido'}), 400
        
        # Verificar si ya existe
        existing_category = Category.query.filter_by(name=data['name']).first()
        if existing_category:
            return jsonify({'success': False, 'message': 'Ya existe una categoría con este nombre'}), 400
        
        category = Category(
            name=data['name'],
            description=data.get('description', ''),
            image_url=data.get('image_url', '')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Categoría creada exitosamente',
            'category': category.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@api.route('/admin/categories/<category_id>', methods=['PUT'])
@admin_required
def update_category(current_user_id=None, current_user_role=None, category_id=None):
    """Actualizar categoría existente"""
    try:
        data = request.get_json()
        category = Category.query.get(category_id)
        
        if not category:
            return jsonify({'success': False, 'message': 'Categoría no encontrada'}), 404
        
        # Verificar nombre único (excluyendo la categoría actual)
        if data.get('name'):
            existing = Category.query.filter(
                Category.name == data['name'],
                Category.id != category_id
            ).first()
            if existing:
                return jsonify({'success': False, 'message': 'Ya existe otra categoría con este nombre'}), 400
            
            category.name = data['name']
        
        if 'description' in data:
            category.description = data['description']
        if 'image_url' in data:
            category.image_url = data['image_url']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Categoría actualizada exitosamente',
            'category': category.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@api.route('/admin/categories/<category_id>', methods=['DELETE'])
@admin_required
def delete_category(current_user_id=None, current_user_role=None, category_id=None):
    """Eliminar categoría"""
    try:
        category = Category.query.get(category_id)
        
        if not category:
            return jsonify({'success': False, 'message': 'Categoría no encontrada'}), 404
        
        # Verificar si hay productos en esta categoría
        product_count = len(category.products) if category.products else 0
        if product_count > 0:
            return jsonify({
                'success': False, 
                'message': f'No se puede eliminar la categoría. Tiene {product_count} producto(s) asociado(s)'
            }), 400
        
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Categoría eliminada exitosamente'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    

# =============================================================================
# ORDER ENDPOINTS
# =============================================================================

@api.route('/orders', methods=['POST'])
def create_order():
    """Crear una nueva orden desde el checkout"""
    try:
        data = request.get_json()
        
        # ✅ VALIDACIÓN DE SEGURIDAD: Verificar datos requeridos
        if not data:
            return jsonify({'message': 'No JSON data provided'}), 400
            
        print("📦 Datos recibidos para orden:", {k: v for k, v in data.items() if k != 'payment_details'})  # ✅ No loguear datos sensibles
        
        # ✅ VALIDACIÓN ROBUSTA de customer_info
        if 'customer_info' not in data:
            return jsonify({'message': 'Missing required field: customer_info'}), 400
        
        customer_info = data['customer_info']
        items = data.get('items', [])
        
        # ✅ VALIDACIÓN: Items no puede estar vacío
        if not items or not isinstance(items, list):
            return jsonify({'message': 'Invalid or empty items list'}), 400
        
        # ✅ COMPATIBILIDAD con ambos formatos (inglés/español) con validación
        customer_name = customer_info.get('name') or customer_info.get('nombre')
        customer_email = customer_info.get('email')
        customer_phone = customer_info.get('phone') or customer_info.get('telefono')
        customer_address = customer_info.get('address') or customer_info.get('direccion')
        customer_city = customer_info.get('city') or customer_info.get('ciudad')
        customer_department = customer_info.get('department') or customer_info.get('departamento')
        customer_postal_code = customer_info.get('postal_code') or customer_info.get('codigoPostal')
        
        # ✅ VALIDACIÓN DE SEGURIDAD: Campos requeridos
        required_fields = [customer_name, customer_email, customer_phone]
        if not all(required_fields):
            return jsonify({'message': 'Missing required customer information (name, email, phone)'}), 400
        
        # ✅ VALIDACIÓN: Email válido
        if '@' not in customer_email:
            return jsonify({'message': 'Invalid email format'}), 400
        
        # Calcular totales (usar los que vienen del frontend o calcular)
        subtotal = data.get('subtotal', sum(item.get('price', 0) * item.get('quantity', 0) for item in items))
        shipping = data.get('shipping', 10000)  # Usar el del frontend o 10000 por defecto
        total = data.get('total', subtotal + shipping)
        
        # ✅ VALIDACIÓN: Totales deben ser positivos
        if subtotal < 0 or shipping < 0 or total < 0:
            return jsonify({'message': 'Invalid order totals'}), 400
        
        # ✅ NUEVO: Buscar usuario por email (si existe)
        user = User.query.filter_by(email=customer_email).first()
        user_id = user.id if user else None
        
        if user:
            print(f"👤 Usuario encontrado: {user.email} (ID: {user.id})")
            print(f"🔍 Estado actual del usuario - Pedidos: {user.total_orders}, Gastado: ${user.total_spent}")
        else:
            print(f"👤 Usuario no registrado: {customer_email}")
        
        # Crear la orden
        order = Order(
            user_id=user_id,  # ✅ Asociar orden con usuario
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            customer_address=customer_address or '',
            customer_city=customer_city or '',
            customer_department=customer_department or '',
            customer_postal_code=customer_postal_code or '',
            subtotal=subtotal,
            shipping=shipping,
            total=total,
            status=OrderStatusEnum.PENDING
        )
        
        db.session.add(order)
        db.session.flush()  # Para obtener el ID sin commit
        print(f"📝 Orden creada en DB - ID: {order.id}, Status: {order.status.value}")
        
        # ✅ VALIDACIÓN: Crear items de la orden con verificación
        for item_data in items:
            # Validar campos requeridos en cada item
            if not all(key in item_data for key in ['productId', 'quantity', 'size', 'price']):
                db.session.rollback()
                return jsonify({'message': 'Missing required fields in order items'}), 400
            
            # Validar que el producto existe
            product = Product.query.get(item_data['productId'])
            if not product:
                db.session.rollback()
                return jsonify({'message': f"Product not found: {item_data['productId']}"}), 404
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['productId'],
                quantity=item_data['quantity'],
                size=item_data['size'],
                price=item_data['price']
            )
            db.session.add(order_item)
            print(f"📦 Item agregado - Producto: {item_data['productId']}, Cantidad: {item_data['quantity']}")
        
        # ✅ NUEVO: ACTUALIZACIÓN ROBUSTA DE ESTADÍSTICAS DEL USUARIO
        if user:
            try:
                from sqlalchemy import func
                
                print(f"🔍 === INICIANDO DEBUG DE ESTADÍSTICAS ===")
                print(f"🔍 User ID: {user.id}, Email: {user.email}")
                
                # Debug 1: Contar órdenes manualmente (sin filtro de status)
                manual_orders_count = Order.query.filter_by(user_id=user.id).count()
                print(f"🔍 DEBUG 1 - Manual orders count (todos los status): {manual_orders_count}")
                
                # Debug 2: Ver todas las órdenes del usuario
                user_orders = Order.query.filter_by(user_id=user.id).all()
                print(f"🔍 DEBUG 2 - Total de órdenes encontradas: {len(user_orders)}")
                for i, user_order in enumerate(user_orders):
                    print(f"🔍 DEBUG 2 - Orden {i+1}: ID={user_order.id}, Status={user_order.status.value}, Total=${user_order.total}")
                
                # Debug 3: Consulta con func.count (sin filtro de status)
                query_count_all = db.session.query(func.count(Order.id)).filter(Order.user_id == user.id)
                count_all_result = query_count_all.scalar()
                print(f"🔍 DEBUG 3 - Query count ALL orders result: {count_all_result}")
                
                # ✅ CORRECCIÓN DEFINITIVA: Usar OBJETOS Enum, no strings
                completed_statuses = [OrderStatusEnum.CONFIRMED, OrderStatusEnum.DELIVERED]
                print(f"🔍 DEBUG - Completed statuses (Enum objects): {[status.value for status in completed_statuses]}")
                
                # Debug 4: Consulta con func.count (solo confirmed/delivered - CORREGIDO)
                query_count_completed = db.session.query(func.count(Order.id)).filter(
                    Order.user_id == user.id,
                    Order.status.in_(completed_statuses)  # ✅ USAR OBJETOS ENUM
                )
                count_completed_result = query_count_completed.scalar()
                print(f"🔍 DEBUG 4 - Query count COMPLETED orders result: {count_completed_result}")
                
                # Debug 5: Consulta de total spent (solo confirmed/delivered - CORREGIDO)
                query_spent = db.session.query(func.coalesce(func.sum(Order.total), 0.0)).filter(
                    Order.user_id == user.id,
                    Order.status.in_(completed_statuses)  # ✅ USAR OBJETOS ENUM
                )
                spent_result = query_spent.scalar()
                print(f"🔍 DEBUG 5 - Query spent result: {spent_result}")
                
                # Debug 6: Consulta de total spent (TODAS las órdenes)
                query_spent_all = db.session.query(func.coalesce(func.sum(Order.total), 0.0)).filter(
                    Order.user_id == user.id
                )
                spent_all_result = query_spent_all.scalar()
                print(f"🔍 DEBUG 6 - Query spent ALL orders result: {spent_all_result}")
                
                # ✅ DECISIÓN: Qué valores usar
                user.total_orders = count_all_result or 0
                user.total_spent = float(spent_result or 0.0)
                
                # Actualizar last_order_date
                from datetime import datetime
                user.last_order_date = datetime.utcnow()
                
                print(f"🔍 === RESUMEN FINAL ===")
                print(f"🔍 Valores asignados - total_orders: {user.total_orders}, total_spent: {user.total_spent}")
                print(f"✅ Estadísticas usuario actualizadas - Pedidos: {user.total_orders}, Gastado: ${user.total_spent:.2f}")
                
                db.session.add(user)
                
            except Exception as stats_error:
                print(f"⚠️ Error actualizando estadísticas de usuario: {stats_error}")
                import traceback
                print(f"⚠️ Traceback completo: {traceback.format_exc()}")
        
        db.session.commit()
        print(f"💾 COMMIT realizado - Orden {order.id} guardada en base de datos")
        
        # ✅ VERIFICACIÓN POST-COMMIT
        if user:
            user_refreshed = User.query.get(user.id)
            print(f"🔍 VERIFICACIÓN POST-COMMIT - User {user_refreshed.email}:")
            print(f"🔍   - total_orders: {user_refreshed.total_orders}")
            print(f"🔍   - total_spent: {user_refreshed.total_spent}")
            print(f"🔍   - last_order_date: {user_refreshed.last_order_date}")
        
        print(f"✅ Orden creada exitosamente: {order.id}")
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.serialize(),
            'order_id': order.id,
            'user_updated': user is not None,
            'user_stats': {
                'total_orders': user.total_orders if user else 0,
                'total_spent': user.total_spent if user else 0
            } if user else None
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print("❌ Error creating order:", str(e))
        import traceback
        print(f"❌ Traceback completo: {traceback.format_exc()}")
        return jsonify({'message': f'Error creating order: {str(e)}'}), 400
    
@api.route('/admin/recalculate-user-stats', methods=['POST'])
@superadmin_required
def recalculate_user_stats():
    """Recalcular total_orders y total_spent para todos los usuarios (solo superadmin)"""
    try:
        print("🔧 === RECALCULATING USER STATS ===")
        
        # ✅ SEGURIDAD: Verificar que es superadmin (ya lo hace el decorator)
        from sqlalchemy import func
        
        users = User.query.all()
        updated_count = 0
        error_count = 0
        
        for user in users:
            try:
                # ✅ CÁLCULO SEGURO: Desde la base de datos, solo órdenes completadas
                stats = db.session.query(
                    func.count(Order.id).label('total_orders'),
                    func.coalesce(func.sum(Order.total), 0.0).label('total_spent')
                ).filter(
                    Order.user_id == user.id,
                    Order.status.in_(['confirmed', 'delivered'])  # ✅ Solo órdenes completadas
                ).first()
                
                # Actualizar usuario
                user.total_orders = stats.total_orders
                user.total_spent = float(stats.total_spent)
                
                # Actualizar last_order_date con la orden más reciente
                last_order = Order.query.filter_by(user_id=user.id)\
                    .order_by(Order.created_at.desc())\
                    .first()
                user.last_order_date = last_order.created_at if last_order else None
                
                db.session.add(user)
                updated_count += 1
                
                print(f"✅ Usuario {user.email}: {user.total_orders} pedidos, ${user.total_spent:.2f} gastado")
                
            except Exception as user_error:
                print(f"❌ Error procesando usuario {user.id}: {user_error}")
                error_count += 1
                continue  # Continuar con el siguiente usuario
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Stats recalculated for {updated_count} users, {error_count} errors',
            'updated_count': updated_count,
            'error_count': error_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error in recalculate_user_stats: {str(e)}")
        return jsonify({'error': str(e)}), 400
    
@api.route('/admin/users/<int:user_id>/recalculate-stats', methods=['POST'])
@superadmin_required
def recalculate_single_user_stats(user_id):
    """Recalcular estadísticas para un usuario específico (solo superadmin)"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        from sqlalchemy import func
        
        # Calcular estadísticas desde la base de datos
        stats = db.session.query(
            func.count(Order.id).label('total_orders'),
            func.coalesce(func.sum(Order.total), 0.0).label('total_spent')
        ).filter(
            Order.user_id == user.id,
            Order.status.in_(['confirmed', 'delivered'])
        ).first()
        
        # Actualizar usuario
        user.total_orders = stats.total_orders
        user.total_spent = float(stats.total_spent)
        
        # Actualizar last_order_date
        last_order = Order.query.filter_by(user_id=user.id)\
            .order_by(Order.created_at.desc())\
            .first()
        user.last_order_date = last_order.created_at if last_order else None
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Stats recalculated for user {user.email}',
            'user': user.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route('/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    """Obtener detalles de una orden específica"""
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        return jsonify({
            'order': order.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@api.route('/orders', methods=['GET'])
@admin_required
def get_all_orders(current_user_id, current_user_role):
    """Obtener todas las órdenes (solo admin)"""
    try:
        orders = Order.query.order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.serialize() for order in orders],
            'total': len(orders)
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@api.route('/orders/<order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(current_user_id, current_user_role, order_id):
    """Actualizar estado de una orden (solo admin)"""
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        # Validar estado
        valid_statuses = [status.value for status in OrderStatusEnum]
        if new_status not in valid_statuses:
            return jsonify({'message': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        old_status = order.status.value
        order.status = OrderStatusEnum(new_status)
        
        # ✅ NUEVO: ACTUALIZAR ESTADÍSTICAS DEL USUARIO SI LA ORDEN SE COMPLETA
        if order.user_id and new_status in ['confirmed', 'delivered']:
            try:
                user = User.query.get(order.user_id)
                if user:
                    from sqlalchemy import func
                    
                    # ✅ CORRECCIÓN DEFINITIVA: Usar OBJETOS Enum
                    completed_statuses = [OrderStatusEnum.CONFIRMED, OrderStatusEnum.DELIVERED]
                    
                    # Recalcular desde base de datos
                    total_orders = db.session.query(func.count(Order.id))\
                        .filter(Order.user_id == user.id)\
                        .scalar()
                    
                    total_spent_result = db.session.query(func.coalesce(func.sum(Order.total), 0.0))\
                        .filter(
                            Order.user_id == user.id,
                            Order.status.in_(completed_statuses)  # ✅ CORREGIDO
                        )\
                        .scalar()
                    
                    user.total_orders = total_orders
                    user.total_spent = float(total_spent_result)
                    
                    print(f"✅ Estadísticas actualizadas - Usuario {user.email}: {user.total_orders} pedidos, ${user.total_spent:.2f} gastado")
                    db.session.add(user)
                    
            except Exception as stats_error:
                print(f"⚠️ Error actualizando estadísticas: {stats_error}")
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error updating order status: {str(e)}")
        return jsonify({'message': str(e)}), 400

# =============================================================================
# CONTENIDO MULTIMEDIA PARA PRODUCTOS - VERSIÓN CORREGIDA
# =============================================================================   

# Configuración de archivos permitidos
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'mov', 'avi', 'webm'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

# ✅ SOLUCIÓN DEFINITIVA - UNA SOLA FUNCIÓN
def save_uploaded_file(file, folder):
    """Guardar archivo en uploads/folder/ EN LA RAÍZ DEL PROYECTO"""
    if file and allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS | ALLOWED_VIDEO_EXTENSIONS):
        # Generar nombre único
        file_ext = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        
        # ✅ SOLUCIÓN DEFINITIVA: 
        # current_app.root_path apunta a donde está app.py (src/)
        # Necesitamos subir UN nivel para llegar a react-flask-hello/
        
        # Obtener directorio donde está app.py
        app_dir = os.path.abspath(current_app.root_path)
        print(f"📁 app_dir (current_app.root_path): {app_dir}")
        
        # Subir un nivel si estamos en src/
        if app_dir.endswith('src'):
            project_root = os.path.dirname(app_dir)
            print(f"📁 Detectado 'src' en la ruta, subiendo un nivel")
        else:
            project_root = app_dir
            
        print(f"📁 project_root: {project_root}")
        
        upload_dir = os.path.join(project_root, 'uploads', folder)
        upload_dir = os.path.abspath(upload_dir)
        
        # Crear directorio si no existe
        os.makedirs(upload_dir, exist_ok=True)
        print(f"📁 upload_dir FINAL: {upload_dir}")
        
        # Guardar archivo físicamente
        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)
        print(f"💾 File saved to: {file_path}")
        
        # Verificar que se guardó
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"✅ File verified! Size: {file_size} bytes")
        else:
            print(f"❌ ERROR: File NOT saved: {file_path}")
            return None
        
        # Retornar ruta relativa para la BD
        return f"/uploads/{folder}/{unique_filename}"
    return None

# =============================================================================
# UPLOAD DE ARCHIVOS - VERSIÓN CORREGIDA
# =============================================================================

@api.route('/admin/upload/<product_id>', methods=['POST'])
@admin_required
def upload_media(current_user_id, current_user_role, product_id):
    """Subir imágenes o videos para un producto - VERSIÓN CORREGIDA"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        if 'files' not in request.files:
            return jsonify({'message': 'No se enviaron archivos'}), 400
        
        files = request.files.getlist('files')
        uploaded_files = []
        
        # ✅ CREAR NUEVAS LISTAS BASADAS EN LAS EXISTENTES
        new_images = product.images.copy() if product.images else []
        new_videos = product.videos.copy() if product.videos else []
        
        print(f"📸 Imágenes existentes: {new_images}")
        print(f"🎥 Videos existentes: {new_videos}")
        
        for file in files:
            if file.filename == '':
                continue
                
            # Verificar tamaño
            file.seek(0, os.SEEK_END)
            file_size = file.tell()
            file.seek(0)
            
            if file_size > MAX_FILE_SIZE:
                print(f"⚠️ Archivo muy grande: {file.filename} ({file_size} bytes)")
                continue
            
            # Determinar tipo de archivo
            if allowed_file(file.filename, ALLOWED_IMAGE_EXTENSIONS):
                folder = 'images'
                target_list = new_images
            elif allowed_file(file.filename, ALLOWED_VIDEO_EXTENSIONS):
                folder = 'videos' 
                target_list = new_videos
            else:
                print(f"⚠️ Tipo de archivo no permitido: {file.filename}")
                continue
            
            # Guardar archivo
            file_path = save_uploaded_file(file, folder)
            if file_path:
                target_list.append(file_path)
                uploaded_files.append(file_path)
                print(f"✅ Archivo agregado a {folder}: {file_path}")
        
        # ✅ ACTUALIZAR EL PRODUCTO CON LAS NUEVAS LISTAS
        product.images = new_images
        product.videos = new_videos
        
        print(f"🔄 Producto actualizado - images: {product.images}")
        print(f"🔄 Producto actualizado - videos: {product.videos}")
        
        db.session.commit()
        
        # ✅ VERIFICACIÓN FINAL
        db.session.refresh(product)
        print(f"✅ COMMIT exitoso")
        print(f"📸 Imágenes finales en BD: {product.images}")
        print(f"🎥 Videos finales en BD: {product.videos}")
        
        return jsonify({
            'message': f'Se subieron {len(uploaded_files)} archivos',
            'uploaded_files': uploaded_files,
            'product': product.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error en upload: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': str(e)}), 400

@api.route('/admin/upload/<product_id>', methods=['DELETE'])
@admin_required
def delete_media(current_user_id, current_user_role, product_id):
    """Eliminar una imagen o video de un producto - VERSIÓN CORREGIDA"""
    try:
        print(f"🔧 DELETE request recibida para product_id: {product_id}")
        
        # ✅ OBTENER el producto con lock para evitar condiciones de carrera
        product = Product.query.get(product_id)
        if not product:
            print(f"❌ Producto no encontrado: {product_id}")
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        data = request.get_json()
        print(f"📦 Datos recibidos: {data}")
        
        file_path = data.get('file_path')
        file_type = data.get('type')
        
        if not file_path or not file_type:
            print(f"❌ Faltan parámetros: file_path={file_path}, file_type={file_type}")
            return jsonify({'message': 'Ruta de archivo y tipo requeridos'}), 400
        
        # Determinar campo a actualizar
        media_field = 'images' if file_type == 'image' else 'videos'
        
        # ✅ OBTENER la lista actual y hacer una COPIA
        current_media = getattr(product, media_field, []) or []
        print(f"🗑️ Eliminando archivo: {file_path}")
        print(f"📋 Lista actual de {media_field}: {current_media}")
        
        # ✅ VERIFICAR y remover de la lista
        if file_path in current_media:
            print(f"✅ Archivo encontrado en la lista, eliminando...")
            # ✅ CREAR NUEVA LISTA sin el archivo
            updated_media = [img for img in current_media if img != file_path]
            print(f"📋 Lista después de eliminar: {updated_media}")
            
            # ✅ ACTUALIZAR EL PRODUCTO con la nueva lista
            setattr(product, media_field, updated_media)
            
        else:
            print(f"❌ Archivo NO encontrado en la lista: {file_path}")
            return jsonify({'message': 'Archivo no encontrado en el producto'}), 404
        
        # Eliminar archivo físico (solo para archivos locales)
        if file_path.startswith('/uploads/'):
            try:
                current_dir = os.path.dirname(__file__)
                project_root = os.path.join(current_dir, '..', '..')
                relative_path = file_path.lstrip('/')
                full_physical_path = os.path.join(project_root, relative_path)
                full_physical_path = os.path.abspath(full_physical_path)
                
                print(f"📁 Ruta física del archivo: {full_physical_path}")
                
                if os.path.exists(full_physical_path):
                    os.remove(full_physical_path)
                    print(f"✅ Archivo físico eliminado")
                else:
                    print(f"⚠️ Archivo físico no encontrado (pero se removió de la lista)")
                    
            except Exception as e:
                print(f"⚠️ Error eliminando archivo físico: {e}")
        else:
            print(f"ℹ️ Es una URL externa, no se elimina archivo físico")
        
        # ✅ HACER COMMIT para guardar los cambios
        db.session.commit()
        
        # ✅ CRÍTICO: Recargar el producto desde la base de datos
        db.session.refresh(product)
        
        print(f"✅ DELETE completado exitosamente")
        print(f"📸 Estado final REAL desde BD - images: {product.images}")
        print(f"🎥 Estado final REAL desde BD - videos: {product.videos}")
        
        return jsonify({
            'message': 'Archivo eliminado correctamente',
            'product': product.serialize()  # ✅ Esto ahora tendrá los datos ACTUALIZADOS
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error en DELETE: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': str(e)}), 400
            
# Endpoint para reordenar archivos multimedia
@api.route('/admin/upload/<product_id>/reorder', methods=['PUT'])
@admin_required
def reorder_media(current_user_id, current_user_role, product_id):
    """Reordenar imágenes o videos de un producto"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        data = request.get_json()
        media_type = data.get('type')  # 'images' o 'videos'
        new_order = data.get('order', [])
        
        if media_type not in ['images', 'videos']:
            return jsonify({'message': 'Tipo debe ser "images" o "videos"'}), 400
        
        setattr(product, media_type, new_order)
        db.session.commit()
        
        return jsonify({
            'message': 'Orden actualizado correctamente',
            'product': product.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

# =============================================================================
# CREAR RESEÑAS ENDPOINTS
# =============================================================================

# Endpoint para listar reviews pendientes (admin)
@api.route('/admin/reviews', methods=['GET'])
@admin_required
def get_admin_reviews(current_user_id, current_user_role):  # ✅ CAMBIÉ EL NOMBRE
    """Obtener todas las reseñas para moderación"""
    try:
        status = request.args.get('status', 'all')  # all, pending, approved
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        query = Review.query
        
        if status == 'pending':
            query = query.filter_by(is_approved=False)
        elif status == 'approved':
            query = query.filter_by(is_approved=True)
        
        reviews = query.order_by(Review.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'reviews': [review.serialize() for review in reviews.items],
            'total': reviews.total,
            'pages': reviews.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

# Endpoint para crear reseña
@api.route('/products/<product_id>/reviews', methods=['POST'])
def create_review(product_id):
    """Crear una nueva reseña para un producto"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        data = request.get_json()
        
        review = Review(
            product_id=product_id,
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            rating=data.get('rating'),
            title=data.get('title'),
            comment=data.get('comment'),
            user_id=data.get('user_id')  # Opcional si el usuario está logueado
        )
        
        db.session.add(review)
        db.session.commit()
        
        # Actualizar rating promedio del producto
        update_product_rating(product_id)
        
        return jsonify({
            'message': 'Reseña creada correctamente',
            'review': review.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

# Endpoint para obtener reseñas de un producto
@api.route('/products/<product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    """Obtener reseñas de un producto (solo las aprobadas)"""
    try:
        reviews = Review.query.filter_by(
            product_id=product_id, 
            is_approved=True
        ).order_by(Review.created_at.desc()).all()
        
        return jsonify({
            'reviews': [review.serialize() for review in reviews],
            'total': len(reviews)
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

# Endpoint para listar reviews pendientes (admin)    
@api.route('/admin/reviews', methods=['GET'])
@admin_required
def get_reviews_admin(current_user_id, current_user_role):
    """Obtener todas las reseñas para moderación"""
    try:
        status = request.args.get('status', 'all')  # all, pending, approved
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        query = Review.query
        
        if status == 'pending':
            query = query.filter_by(is_approved=False)
        elif status == 'approved':
            query = query.filter_by(is_approved=True)
        
        reviews = query.order_by(Review.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'reviews': [review.serialize() for review in reviews.items],
            'total': reviews.total,
            'pages': reviews.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

# Endpoint para eliminar review (solo content_manager+)
@api.route('/admin/reviews/<review_id>', methods=['DELETE'])
@admin_required  
def delete_review(current_user_id, current_user_role, review_id):
    """Eliminar reseña (solo content_manager y superadmin)"""
    try:
        # Convertir a minúsculas para comparación case-insensitive
        user_role_lower = current_user_role.lower()
        if user_role_lower not in ['content_manager', 'superadmin']:
            return jsonify({'message': 'No autorizado'}), 403
            
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'message': 'Reseña no encontrada'}), 404
        
        product_id = review.product_id
        db.session.delete(review)
        db.session.commit()
        
        # Actualizar rating del producto
        update_product_rating(product_id)
        
        return jsonify({'message': 'Reseña eliminada correctamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

# Endpoint para moderar reseñas (admin)
@api.route('/admin/reviews/<review_id>', methods=['PUT'])
@admin_required
def moderate_review(current_user_id, current_user_role, review_id):
    """Aprobar/rechazar reseña (solo admin)"""
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({'message': 'Reseña no encontrada'}), 404
        
        data = request.get_json()
        review.is_approved = data.get('is_approved', False)
        
        db.session.commit()
        
        # Actualizar rating del producto si se aprueba
        if review.is_approved:
            update_product_rating(review.product_id)
        
        return jsonify({
            'message': 'Reseña actualizada correctamente',
            'review': review.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

# Función helper para actualizar rating del producto
def update_product_rating(product_id):
    """Calcular y actualizar el rating promedio de un producto"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return
        
        # Calcular promedio solo de reseñas aprobadas
        approved_reviews = Review.query.filter_by(
            product_id=product_id, 
            is_approved=True
        ).all()
        
        if approved_reviews:
            total_rating = sum(review.rating for review in approved_reviews)
            average_rating = total_rating / len(approved_reviews)
            
            product.rating = round(average_rating, 1)
            product.review_count = len(approved_reviews)
        else:
            product.rating = 0.0
            product.review_count = 0
        
        db.session.commit()
        
    except Exception as e:
        db.session.rollback()
        print(f"Error actualizando rating: {e}")

# =============================================================================
# ANALYTICS
# =============================================================================

@api.route('/admin/analytics/profits', methods=['GET'])
@admin_required
def get_profit_analytics(current_user_id=None, current_user_role=None):
    """Obtener análisis de utilidades con filtros avanzados"""
    try:
        # Obtener parámetros
        period = request.args.get('period', 'all')
        compare = request.args.get('compare', 'false').lower() == 'true'
        
        from datetime import timedelta
        
        # Fechas para el periodo actual
        end_date_current = datetime.now()
        
        # Inicializar variables
        start_date_previous = None
        end_date_previous = None
        
        if period == 'today':
            start_date_current = end_date_current.replace(hour=0, minute=0, second=0, microsecond=0)
            if compare:
                start_date_previous = start_date_current - timedelta(days=1)
                end_date_previous = start_date_current - timedelta(seconds=1)
        elif period == 'week':
            start_date_current = end_date_current - timedelta(days=7)
            if compare:
                start_date_previous = start_date_current - timedelta(days=7)
                end_date_previous = start_date_current - timedelta(seconds=1)
        elif period == 'month':
            # Primer día del mes actual
            start_date_current = end_date_current.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if compare:
                # Para periodo anterior: mes pasado
                start_date_previous = (start_date_current - timedelta(days=1)).replace(day=1)
                end_date_previous = start_date_current - timedelta(seconds=1)
        elif period == '3months':
            start_date_current = end_date_current - timedelta(days=90)
            if compare:
                start_date_previous = start_date_current - timedelta(days=90)
                end_date_previous = start_date_current - timedelta(seconds=1)
        else:  # all
            start_date_current = datetime(2020, 1, 1)  # Fecha muy antigua
        
        # Query para periodo actual
        query_current = Order.query.filter(
            Order.status.in_(['DELIVERED', 'CONFIRMED']),
            Order.created_at >= start_date_current,
            Order.created_at <= end_date_current
        )
        
        completed_orders_current = query_current.all()
        
        # Datos del periodo anterior (para comparación)
        completed_orders_previous = []
        if compare and start_date_previous:
            query_previous = Order.query.filter(
                Order.status.in_(['DELIVERED', 'CONFIRMED']),
                Order.created_at >= start_date_previous,
                Order.created_at <= end_date_previous
            )
            completed_orders_previous = query_previous.all()
        
        # Calcular métricas periodo actual - CON FILTRO POR ROL
        metrics_current = calculate_metrics(completed_orders_current, current_user_role)
        
        # Calcular métricas periodo anterior - CON FILTRO POR ROL
        metrics_previous = calculate_metrics(completed_orders_previous, current_user_role) if compare and completed_orders_previous else None
        
        # Datos para gráfico de tendencias (últimas 12 semanas) - CON FILTRO POR ROL
        weekly_trends = get_weekly_trends(current_user_role)
        
        return jsonify({
            'success': True,
            'metrics': metrics_current,
            'comparison': metrics_previous,
            'weekly_trends': weekly_trends,
            'period': period,
            'compare': compare,
            'user_role': current_user_role  # Para debug en frontend
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def calculate_metrics(orders, user_role=None):
    """Calcular métricas para un conjunto de órdenes - FILTRADO POR ROL"""
    total_revenue = 0
    total_cost = 0
    product_profits = {}
    
    for order in orders:
        total_revenue += order.total if order.total else 0
        
        # Solo calcular costos si es SuperAdmin
        if user_role and user_role.lower() == 'superadmin':
            for item in order.items:
                product = Product.query.get(item.product_id)
                if product and product.costo_prenda:
                    item_cost = product.costo_prenda * item.quantity
                    item_revenue = item.price * item.quantity
                    
                    total_cost += item_cost
                    
                    if product.id not in product_profits:
                        product_profits[product.id] = {
                            'name': product.name,
                            'total_revenue': 0,
                            'total_cost': 0,
                            'total_quantity': 0
                        }
                    
                    product_profits[product.id]['total_revenue'] += item_revenue
                    product_profits[product.id]['total_cost'] += item_cost
                    product_profits[product.id]['total_quantity'] += item.quantity
        else:
            # Para roles no-SuperAdmin, solo contar cantidades
            for item in order.items:
                product = Product.query.get(item.product_id)
                if product:
                    if product.id not in product_profits:
                        product_profits[product.id] = {
                            'name': product.name,
                            'total_revenue': 0,
                            'total_cost': 0,
                            'total_quantity': 0
                        }
                    
                    product_profits[product.id]['total_revenue'] += item.price * item.quantity
                    product_profits[product.id]['total_quantity'] += item.quantity

    # Calcular márgenes SOLO para SuperAdmin
    if user_role and user_role.lower() == 'superadmin':
        gross_profit = total_revenue - total_cost
        profit_margin = (gross_profit / total_revenue * 100) if total_revenue > 0 else 0

        for product_id, data in product_profits.items():
            product_profit = data['total_revenue'] - data['total_cost']
            data['total_profit'] = product_profit
            data['margin'] = (product_profit / data['total_revenue'] * 100) if data['total_revenue'] > 0 else 0
    else:
        # Para roles no-SuperAdmin, ocultar datos financieros sensibles
        gross_profit = 0
        profit_margin = 0
        total_cost = 0
        
        for product_id, data in product_profits.items():
            data['total_profit'] = 0  # Ocultar ganancias
            data['margin'] = 0  # Ocultar márgenes

    top_products = sorted(
        product_profits.values(),
        key=lambda x: x['total_quantity'],  # Ordenar por cantidad vendida en lugar de ganancias
        reverse=True
    )[:10]

    return {
        'total_revenue': total_revenue if user_role and user_role.lower() == 'superadmin' else 0,
        'total_cost': total_cost if user_role and user_role.lower() == 'superadmin' else 0,
        'gross_profit': gross_profit if user_role and user_role.lower() == 'superadmin' else 0,
        'profit_margin': round(profit_margin, 2) if user_role and user_role.lower() == 'superadmin' else 0,
        'total_orders': len(orders),
        'avg_order_value': total_revenue / len(orders) if orders else 0,
        'top_products': top_products,
        'total_products_sold': sum(item['total_quantity'] for item in product_profits.values())
    }

def get_weekly_trends(user_role=None):
    """Obtener tendencias semanales de los últimos 3 meses - FILTRADO POR ROL"""
    from datetime import datetime, timedelta
    
    weekly_data = []
    end_date = datetime.now()
    
    # Últimos 3 meses INCLUYENDO la semana actual
    start_date = end_date - timedelta(days=84)  # 12 semanas = 3 meses

    # Primera semana comience en lunes
    days_since_monday = start_date.weekday()  # 0 = lunes, 6 = domingo
    adjusted_start_date = start_date - timedelta(days=days_since_monday)
    
    current_date = adjusted_start_date
    week_count = 0
    
    while current_date <= end_date and week_count < 13:  # 13 semanas para incluir completa
        week_start = current_date
        week_end = current_date + timedelta(days=6, hours=23, minutes=59, seconds=59)
        
        week_orders = Order.query.filter(
            Order.status.in_(['DELIVERED', 'CONFIRMED']),
            Order.created_at.between(week_start, week_end)
        ).all()
        
        week_revenue = sum(order.total for order in week_orders if order.total)
        
        # Solo calcular costos si es SuperAdmin
        if user_role and user_role.lower() == 'superadmin':
            week_cost = 0
            for order in week_orders:
                for item in order.items:
                    product = Product.query.get(item.product_id)
                    if product and product.costo_prenda:
                        week_cost += product.costo_prenda * item.quantity
            
            week_profit = week_revenue - week_cost
            week_margin = (week_profit / week_revenue * 100) if week_revenue > 0 else 0
        else:
            # Para roles no-SuperAdmin, ocultar datos financieros
            week_cost = 0
            week_profit = 0
            week_margin = 0
        
        # Determinar si es la semana actual
        is_current_week = end_date >= week_start and end_date <= week_end
        
        weekly_data.append({
            'week': week_start.strftime('%d/%m'),
            'revenue': week_revenue if user_role and user_role.lower() == 'superadmin' else 0,
            'profit': week_profit if user_role and user_role.lower() == 'superadmin' else 0,
            'margin': round(week_margin, 2) if user_role and user_role.lower() == 'superadmin' else 0,
            'orders': len(week_orders),
            'week_start': week_start.isoformat(),
            'week_end': week_end.isoformat(),
            'is_current_week': is_current_week,
            'has_data': len(week_orders) > 0
        })
        
        current_date += timedelta(days=7)
        week_count += 1
    
    return weekly_data

# =============================================================================
# WOMPI PAYMENT ENDPOINTS
# =============================================================================

@api.route('/create-wompi-payment', methods=['POST'])
def create_wompi_payment():
    """Crear link de pago en Wompi"""
    try:
        data = request.get_json()
        print("🎯 Datos recibidos para Wompi:", data)
        
        # Validar datos requeridos
        if not data.get('amount') or not data.get('order_id'):
            return jsonify({'error': 'Amount and order_id are required'}), 400
        
        from .services.wompi_service import WompiService
        wompi_service = WompiService()
        
        # Crear payment link en Wompi
        result = wompi_service.create_payment_link(
            amount=float(data['amount']),
            order_id=data['order_id'],
            customer_email=data.get('customer_email', ''),
            customer_name=data.get('customer_name', '')
        )
        
        print("🔗 Resultado de Wompi API:", result)
        
        if not result['success']:
            return jsonify({'error': result['error']}), 400
            
        return jsonify({
            'success': True,
            'payment_url': result['payment_url'],
            'payment_id': result['payment_id']
        }), 200
        
    except Exception as e:
        print("❌ Error en create-wompi-payment:", str(e))
        return jsonify({'error': str(e)}), 400

@api.route('/verify-wompi-payment', methods=['POST'])
def verify_wompi_payment():
    """Verificar estado de pago en Wompi"""
    try:
        data = request.get_json()
        transaction_id = data.get('transaction_id')
        
        if not transaction_id:
            return jsonify({'error': 'Transaction ID required'}), 400
        
        from .services.wompi_service import WompiService
        wompi_service = WompiService()
        
        # Verificar transacción
        result = wompi_service.verify_transaction(transaction_id)
        
        if not result['success']:
            return jsonify({'error': result['error']}), 400
            
        # Actualizar orden según estado
        if result['status'] == 'APPROVED':
            order_id = result['transaction'].get('reference')
            order = Order.query.get(order_id)
            
            if order:
                order.status = OrderStatusEnum.CONFIRMED
                db.session.commit()
                
                return jsonify({
                    'success': True,
                    'status': 'APPROVED',
                    'order_id': order_id,
                    'message': 'Payment confirmed successfully'
                }), 200
        
        return jsonify({
            'success': True,
            'status': result['status'],
            'message': f'Payment status: {result["status"]}'
        }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Webhook para Wompi (opcional pero recomendado)
@api.route('/wompi-webhook', methods=['POST'])
def wompi_webhook():
    """Webhook para recibir notificaciones de Wompi"""
    try:
        payload = request.json
        event_type = payload.get('event')
        data = payload.get('data', {})
        transaction = data.get('transaction', {})
        
        if event_type == 'transaction.updated':
            transaction_id = transaction.get('id')
            status = transaction.get('status')
            order_id = transaction.get('reference')
            
            if status == 'APPROVED' and order_id:
                order = Order.query.get(order_id)
                if order:
                    order.status = OrderStatusEnum.CONFIRMED
                    db.session.commit()
                    print(f"Order {order_id} confirmed via webhook")
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        print(f"Webhook error: {e}")
        return jsonify({'error': str(e)}), 400
    
from api.services.google_auth import GoogleAuthService
from api.models import db, User
import jwt
from datetime import datetime

# =============================================================================
# GOOGLE AUTH ENDPOINTS (MANTENER FUNCIONALIDAD EXISTENTE)
# =============================================================================

@api.route('/auth/google', methods=['POST'])
def google_auth():
    """Autenticación con Google para usuarios normales"""
    try:
        data = request.get_json()
        # ✅ MANTENER compatibilidad con 'credential' y 'token'
        token = data.get('credential') or data.get('token')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 400
        
        print("🎯 Iniciando autenticación con Google...")
        print(f"📦 Token recibido (primeros 50 chars): {token[:50]}...")
        
        # Verificar token con Google
        google_service = GoogleAuthService()
        verification_result = google_service.verify_google_token(token)
        
        if not verification_result['success']:
            return jsonify({'error': verification_result['error']}), 401
        
        user_data = verification_result['user_data']
        
        # Buscar o crear usuario en la base de datos (AHORA DEVUELVE is_new_user)
        user, is_new_user = google_service.find_or_create_user(user_data)
        
        # Generar JWT token
        jwt_token = google_service.generate_jwt_token(user.id, user.email)
        
        if not jwt_token:
            return jsonify({'error': 'Error generating token'}), 500
        
        print(f"✅ Autenticación exitosa para: {user.email}")
        
        # ✅ NUEVO: Determinar si necesita aceptar términos
        needs_terms_acceptance = is_new_user or not (user.terms_accepted and user.privacy_policy_accepted)
        
        return jsonify({
            'success': True,
            'token': jwt_token,
            'user': user.serialize(),
            'is_new_user': is_new_user,  # ✅ NUEVO: indicar si es usuario nuevo
            'needs_terms_acceptance': needs_terms_acceptance  # ✅ NUEVO: si necesita aceptar términos
        }), 200
        
    except Exception as e:
        print(f"❌ Error en google auth: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

@api.route('/auth/user/me', methods=['GET'])
def get_current_user():
    """Obtener información del usuario normal actual"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 401
        
        # Verificar token
        google_service = GoogleAuthService()
        try:
            payload = jwt.decode(token, google_service.secret_key, algorithms=['HS256'])
            user_id = payload['user_id']
            
            # Buscar usuario en la base de datos
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify({
                'success': True,
                'user': user.serialize()
            }), 200
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/auth/user/logout', methods=['POST'])
def logout_user():
    """Logout de usuario normal"""
    try:
        # En el frontend se eliminará el token del localStorage
        return jsonify({
            'success': True,
            'message': 'Logout exitoso'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# =============================================================================
# NUEVOS ENDPOINTS PARA TÉRMINOS LEGALES
# =============================================================================

# =============================================================================
# NUEVOS ENDPOINTS PARA TÉRMINOS LEGALES (CON NOMBRES ÚNICOS)
# =============================================================================

@api.route('/auth/accept-legal-terms', methods=['POST'])
def accept_legal_terms():
    """Endpoint para que usuarios nuevos acepten términos y políticas"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        terms_accepted = data.get('terms_accepted', False)
        privacy_policy_accepted = data.get('privacy_policy_accepted', False)
        marketing_emails = data.get('marketing_emails', False)
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        # Buscar usuario
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Actualizar campos legales
        if terms_accepted:
            user.terms_accepted = True
            user.terms_accepted_at = datetime.utcnow()
        
        if privacy_policy_accepted:
            user.privacy_policy_accepted = True
            user.privacy_policy_accepted_at = datetime.utcnow()
        
        if marketing_emails:
            user.marketing_emails = True
            user.marketing_emails_accepted_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Terms accepted successfully',
            'user': user.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error accepting terms: {str(e)}")
        return jsonify({'error': str(e)}), 400

@api.route('/auth/check-legal-terms/<user_id>', methods=['GET'])
def check_legal_terms_status(user_id):
    """Verificar si un usuario ha aceptado los términos"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'terms_accepted': user.terms_accepted or False,
            'privacy_policy_accepted': user.privacy_policy_accepted or False,
            'marketing_emails': user.marketing_emails or False,
            'needs_acceptance': not (user.terms_accepted and user.privacy_policy_accepted)
        }), 200
        
    except Exception as e:
        print(f"❌ Error checking terms: {str(e)}")
        return jsonify({'error': str(e)}), 400