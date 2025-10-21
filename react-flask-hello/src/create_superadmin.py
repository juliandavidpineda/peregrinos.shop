"""
Script para crear un superusuario en la base de datos
Ejecutar: python src/create_superadmin.py
"""

from api.models import db, AdminUser
from app import app

def create_superadmin():
    with app.app_context():
        # Datos del superadmin
        email = "admin@peregrinos.shop"
        password = "admin123"  # CAMBIAR EN PRODUCCIÓN
        first_name = "Super"
        last_name = "Admin"
        
        # Verificar si ya existe
        existing_admin = AdminUser.query.filter_by(email=email).first()
        
        if existing_admin:
            print(f"✅ El usuario {email} ya existe")
            print(f"   Rol actual: {existing_admin.role}")
            print(f"   Activo: {existing_admin.is_active}")
            
            # Actualizar a superadmin si no lo es
            if existing_admin.role != 'superadmin':
                existing_admin.role = 'superadmin'
                existing_admin.is_active = True
                db.session.commit()
                print(f"✅ Usuario actualizado a superadmin")
            return
        
        # Crear nuevo superadmin
        superadmin = AdminUser(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role='superadmin',  # ⚠️ STRING, NO ENUM
            is_active=True
        )
        superadmin.set_password(password)
        
        try:
            db.session.add(superadmin)
            db.session.commit()
            print(f"✅ Superadmin creado exitosamente:")
            print(f"   Email: {email}")
            print(f"   Password: {password}")
            print(f"   Rol: {superadmin.role}")
            print(f"   ⚠️  CAMBIAR CONTRASEÑA EN PRODUCCIÓN")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creando superadmin: {e}")

if __name__ == '__main__':
    create_superadmin()