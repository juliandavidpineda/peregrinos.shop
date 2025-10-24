from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Float, Boolean, Text, JSON, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
import enum
import uuid
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def generate_uuid():
    return str(uuid.uuid4())

# Enums para roles y estados
class UserRoleEnum(enum.Enum):
    SUPERADMIN = "superadmin"
    EDITOR = "editor"
    CONTENT_MANAGER = "content_manager"
    
    # Método para crear desde string (ignora case)
    @classmethod
    def get(cls, value):
        value_lower = value.lower()
        for role in cls:
            if role.value.lower() == value_lower:
                return role
        raise ValueError(f"Invalid role: {value}")

class OrderStatusEnum(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class LeadStatusEnum(enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    LOST = "lost"

class PageTypeEnum(enum.Enum):
    ABOUT = "about"
    SANTORAL = "santoral"
    BLOG = "blog"
    CONTACT = "contact"
    TERMS = "terms"
    PRIVACY = "privacy"

class User(db.Model):
    __tablename__ = 'user'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    
    # NUEVOS CAMPOS PARA GOOGLE AUTH
    google_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=True)
    picture: Mapped[str] = mapped_column(Text, nullable=True)
    email_verified: Mapped[bool] = mapped_column(Boolean(), default=False)
    role: Mapped[str] = mapped_column(String(20), default='customer')  # customer, admin, etc.
    
    # Timestamps
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="user")

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "picture": self.picture,
            "email_verified": self.email_verified,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
            # do not serialize the password, its a security breach
        }

class AdminUser(db.Model):
    __tablename__ = 'admin_users'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    #role: Mapped[UserRoleEnum] = mapped_column(Enum(UserRoleEnum), default=UserRoleEnum.EDITOR)
    role: Mapped[str] = mapped_column(String(20), default='editor')
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login: Mapped[DateTime] = mapped_column(DateTime, nullable=True)
    
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<AdminUser {self.email} - {self.role}>'

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
#modelo AdminUser
class UserActivityLog(db.Model):
    __tablename__ = 'user_activity_logs'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    admin_user_id: Mapped[str] = mapped_column(String(36), db.ForeignKey('admin_users.id'), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)  # 'user_created', 'user_updated', etc.
    description: Mapped[str] = mapped_column(Text, nullable=False)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=True)  # Para IPv6
    user_agent: Mapped[str] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    
    # Relación
    admin_user: Mapped["AdminUser"] = relationship("AdminUser", backref="activity_logs")
    
    def __repr__(self):
        return f'<UserActivityLog {self.admin_user.email} - {self.action}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'admin_user': self.admin_user.serialize() if self.admin_user else None,
            'action': self.action,
            'description': self.description,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# función helper para los logs
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

class Category(db.Model):
    __tablename__ = 'categories'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(String(255), nullable=True)
    
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    
    # Relaciones
    products: Mapped[list["Product"]] = relationship("Product", back_populates="category_rel")

    def __repr__(self):
        return f'<Category {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'image_url': self.image_url,
            'product_count': len(self.products) if self.products else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    original_price: Mapped[float] = mapped_column(Float, nullable=True)
    
    # Foreign Keys
    category_id: Mapped[str] = mapped_column(String(36), ForeignKey('categories.id'), nullable=False)
    
    # Campos adicionales
    subcategory: Mapped[str] = mapped_column(String(100), nullable=True)
    sizes: Mapped[list] = mapped_column(JSON, nullable=True, default=list) 
    features: Mapped[list] = mapped_column(JSON, nullable=True, default=list)  

    in_stock: Mapped[bool] = mapped_column(Boolean, default=True)
    stock_quantity: Mapped[int] = mapped_column(Integer, default=0)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    is_new: Mapped[bool] = mapped_column(Boolean, default=False)
    is_on_sale: Mapped[bool] = mapped_column(Boolean, default=False)

    # CAMPOS MULTIMEDIA
    images: Mapped[list] = mapped_column(JSON, nullable=True, default=list) 
    videos: Mapped[list] = mapped_column(JSON, nullable=True, default=list)  

    # NUEVOS CAMPOS DE DETALLES
    material: Mapped[str] = mapped_column(String(200), nullable=True)
    cuidados: Mapped[str] = mapped_column(Text, nullable=True)
    origen: Mapped[str] = mapped_column(String(100), nullable=True)
    disponibilidad: Mapped[str] = mapped_column(String(100), nullable=True)
    costo_prenda: Mapped[float] = mapped_column(Float, nullable=True)
    
    # Fechas
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    category_rel: Mapped["Category"] = relationship("Category", back_populates="products")
    order_items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="product")
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates="product")

    def __repr__(self):
        return f'<Product {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'original_price': self.original_price,
            'images': self.images or [],
            'category': self.category_rel.name if self.category_rel else self.category_id,
            'category_id': self.category_id,
            'subcategory': self.subcategory,
            'sizes': self.sizes or [],
            'features': self.features or [],
            'in_stock': self.in_stock,
            'stock_quantity': self.stock_quantity,
            'rating': self.rating,
            'review_count': self.review_count,
            'is_new': self.is_new,
            'is_on_sale': self.is_on_sale,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'videos': self.videos or [],
            'material': self.material,
            'cuidados': self.cuidados,
            'origen': self.origen,
            'disponibilidad': self.disponibilidad,
            'costo_prenda': self.costo_prenda
        }
    
class Order(db.Model):
    __tablename__ = 'orders'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    
    # Foreign Key
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=True)
    
    # Información del cliente
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    customer_email: Mapped[str] = mapped_column(String(255), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(50), nullable=True)
    customer_address: Mapped[str] = mapped_column(Text, nullable=True)
    customer_city: Mapped[str] = mapped_column(String(100), nullable=True)
    customer_department: Mapped[str] = mapped_column(String(100), nullable=True)
    customer_postal_code: Mapped[str] = mapped_column(String(20), nullable=True)
    
    # Información de la orden
    subtotal: Mapped[float] = mapped_column(Float, nullable=False)
    shipping: Mapped[float] = mapped_column(Float, default=0.0)
    total: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[OrderStatusEnum] = mapped_column(Enum(OrderStatusEnum), default=OrderStatusEnum.PENDING)
    
    # Fechas
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    user: Mapped["User"] = relationship("User", back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship("OrderItem", back_populates="order")

    def __repr__(self):
        return f'<Order {self.id} - {self.customer_email}>'

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'customer_address': self.customer_address,
            'customer_city': self.customer_city,
            'customer_department': self.customer_department,
            'customer_postal_code': self.customer_postal_code,
            'subtotal': self.subtotal,
            'shipping': self.shipping,
            'total': self.total,
            'status': self.status.value,
            'items': [item.serialize() for item in self.items] if self.items else [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    
    # Foreign Keys
    order_id: Mapped[str] = mapped_column(String(36), ForeignKey('orders.id'), nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey('products.id'), nullable=False)
    
    # Información del item
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    size: Mapped[str] = mapped_column(String(10), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    
    # Relaciones
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship("Product", back_populates="order_items")

    def __repr__(self):
        return f'<OrderItem {self.id} - {self.quantity}x {self.size}>'

    def serialize(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'product_image': self.product.images[0] if self.product and self.product.images else None,
            'quantity': self.quantity,
            'size': self.size,
            'price': self.price,
            'subtotal': self.quantity * self.price
        }

class PageContent(db.Model):
    __tablename__ = 'page_content'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=True)
    meta_description: Mapped[str] = mapped_column(String(300), nullable=True)
    page_type: Mapped[PageTypeEnum] = mapped_column(Enum(PageTypeEnum), nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<PageContent {self.slug} - {self.page_type.value}>'

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'meta_description': self.meta_description,
            'page_type': self.page_type.value,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Banner(db.Model):
    __tablename__ = 'banners'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    image: Mapped[str] = mapped_column(String(255), nullable=False)
    link: Mapped[str] = mapped_column(String(255), nullable=True)
    position: Mapped[str] = mapped_column(String(50), nullable=False)  # hero, sidebar, footer
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    start_date: Mapped[DateTime] = mapped_column(DateTime, nullable=True)
    end_date: Mapped[DateTime] = mapped_column(DateTime, nullable=True)
    
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<Banner {self.title} - {self.position}>'

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'image': self.image,
            'link': self.link,
            'position': self.position,
            'is_active': self.is_active,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ContactLead(db.Model):
    __tablename__ = 'contact_leads'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[LeadStatusEnum] = mapped_column(Enum(LeadStatusEnum), default=LeadStatusEnum.NEW)
    
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f'<ContactLead {self.name} - {self.status.value}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'message': self.message,
            'status': self.status.value,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
class Review(db.Model):
    __tablename__ = 'reviews'
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    
    # Foreign Keys
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey('products.id'), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=True)  # Opcional si es usuario registrado
    
    # Datos de la reseña
    customer_name: Mapped[str] = mapped_column(String(100), nullable=False)
    customer_email: Mapped[str] = mapped_column(String(120), nullable=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)  # 1-5 estrellas
    title: Mapped[str] = mapped_column(String(200), nullable=True)
    comment: Mapped[str] = mapped_column(Text, nullable=True)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False)  # Para moderación
    
    # Fechas
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    product: Mapped["Product"] = relationship("Product")
    user: Mapped["User"] = relationship("User")

    def __repr__(self):
        return f'<Review {self.rating} stars for {self.product_id}>'

    def serialize(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }