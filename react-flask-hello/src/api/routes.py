"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, AdminUser, Product, Category, Order, OrderItem, PageContent, Banner, ContactLead
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
            is_on_sale=bool(data.get('is_on_sale', False))
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
        if 'category' in data:
            product.category = data['category']
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
        
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@api.route('/products/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user_id, current_user_role, product_id):
    """Eliminar un producto (Solo superadmins)"""
    try:
        if current_user_role != 'superadmin':
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
    
# =============================================================================
# CATEGORY ENDPOINTS
# =============================================================================

@api.route('/categories', methods=['GET'])
def get_categories():
    """Obtener todas las categorías"""
    try:
        categories = Category.query.all()
        
        return jsonify({
            'categories': [category.serialize() for category in categories]
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@api.route('/categories', methods=['POST'])
@admin_required
def create_category(current_user_id, current_user_role):
    """Crear nueva categoría"""
    try:
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'message': 'Category name is required'}), 400
        
        # Verificar si ya existe
        if Category.query.filter_by(name=data['name']).first():
            return jsonify({'message': 'Category already exists'}), 400
        
        category = Category(
            name=data['name'],
            description=data.get('description'),
            image_url=data.get('image_url')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': category.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400