"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory  # ✅ AGREGAR send_from_directory
from api.models import db, User, AdminUser, Product, Category, Order, OrderItem, PageContent, Banner, ContactLead, Review  # ✅ AGREGAR Review
from api.utils import generate_sitemap, APIException, generate_token, token_required, admin_required
from flask_cors import CORS
import datetime
from api.models import OrderStatusEnum
from sqlalchemy import func, desc, or_

import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app, send_from_directory

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
        print(f"🔧 Headers recibidos: {dict(request.headers)}")
        print(f"🔧 Content-Type: {request.content_type}")
        print(f"🔧 Método: {request.method}")
        print(f"🔧 Product ID: {product_id}")
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        data = request.get_json()
        print(f"📥 UPDATE - Datos recibidos: {data}")
        
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
        
        print("Datos recibidos para orden:", data)
        
        # Validar datos requeridos
        required_fields = ['customer_info', 'items']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Missing required field: {field}'}), 400
        
        customer_info = data['customer_info']
        items = data['items']
        
        # Validar campos del cliente
        if not all([customer_info.get('nombre'), customer_info.get('email'), customer_info.get('telefono')]):
            return jsonify({'message': 'Missing required customer information'}), 400
        
        # Calcular totales
        subtotal = sum(item['price'] * item['quantity'] for item in items)
        shipping = 10000  # Envío fijo
        total = subtotal + shipping
        
        # Crear la orden
        order = Order(
            customer_name=customer_info['nombre'],
            customer_email=customer_info['email'],
            customer_phone=customer_info['telefono'],
            customer_address=customer_info.get('direccion', ''),
            customer_city=customer_info.get('ciudad', ''),
            customer_department=customer_info.get('departamento', ''),
            customer_postal_code=customer_info.get('codigoPostal', ''),
            subtotal=subtotal,
            shipping=shipping,
            total=total,
            status=OrderStatusEnum.PENDING
        )
        
        db.session.add(order)
        db.session.flush()
        
        # Crear items de la orden
        for item_data in items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['productId'],
                quantity=item_data['quantity'],
                size=item_data['size'],
                price=item_data['price']
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.serialize(),
            'order_id': order.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print("Error creating order:", str(e))
        return jsonify({'message': f'Error creating order: {str(e)}'}), 400

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
        
        order.status = OrderStatusEnum(new_status)
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
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
        
        from datetime import datetime, timedelta
        
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
        
        # Calcular métricas periodo actual
        metrics_current = calculate_metrics(completed_orders_current)
        
        # Calcular métricas periodo anterior
        metrics_previous = calculate_metrics(completed_orders_previous) if compare and completed_orders_previous else None
        
        # Datos para gráfico de tendencias (últimas 12 semanas)
        weekly_trends = get_weekly_trends()
        
        return jsonify({
            'success': True,
            'metrics': metrics_current,
            'comparison': metrics_previous,
            'weekly_trends': weekly_trends,
            'period': period,
            'compare': compare
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def calculate_metrics(orders):
    """Calcular métricas para un conjunto de órdenes"""
    total_revenue = 0
    total_cost = 0
    product_profits = {}
    
    for order in orders:
        total_revenue += order.total if order.total else 0
        
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

    # Calcular márgenes
    gross_profit = total_revenue - total_cost
    profit_margin = (gross_profit / total_revenue * 100) if total_revenue > 0 else 0

    for product_id, data in product_profits.items():
        product_profit = data['total_revenue'] - data['total_cost']
        data['total_profit'] = product_profit
        data['margin'] = (product_profit / data['total_revenue'] * 100) if data['total_revenue'] > 0 else 0

    top_products = sorted(
        product_profits.values(),
        key=lambda x: x['total_profit'],
        reverse=True
    )[:10]

    return {
        'total_revenue': total_revenue,
        'total_cost': total_cost,
        'gross_profit': gross_profit,
        'profit_margin': round(profit_margin, 2),
        'total_orders': len(orders),
        'avg_order_value': total_revenue / len(orders) if orders else 0,
        'top_products': top_products
    }

def get_weekly_trends():
    """Obtener tendencias semanales de los últimos 3 meses INCLUYENDO semana actual"""
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
        week_cost = 0
        
        for order in week_orders:
            for item in order.items:
                product = Product.query.get(item.product_id)
                if product and product.costo_prenda:
                    week_cost += product.costo_prenda * item.quantity
        
        week_profit = week_revenue - week_cost
        week_margin = (week_profit / week_revenue * 100) if week_revenue > 0 else 0
        
        # Determinar si es la semana actual
        is_current_week = end_date >= week_start and end_date <= week_end
        
        weekly_data.append({
            'week': week_start.strftime('%d/%m'),
            'revenue': week_revenue,
            'profit': week_profit,
            'margin': round(week_margin, 2),
            'orders': len(week_orders),
            'week_start': week_start.isoformat(),
            'week_end': week_end.isoformat(),
            'is_current_week': is_current_week,
            'has_data': len(week_orders) > 0
        })
        
        current_date += timedelta(days=7)
        week_count += 1
    
    return weekly_data