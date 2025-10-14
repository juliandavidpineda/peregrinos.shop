import click
from api.models import db, User, AdminUser
from flask.cli import with_appcontext

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass

    # =============================================================================
    # COMANDOS PARA PEREGRINOS.SHOP - NUEVOS COMANDOS AGREGADOS
    # =============================================================================

    @app.cli.command("create-admin")
    @with_appcontext
    def create_admin():
        """Crear usuario admin por defecto para Peregrinos.shop"""
        
        # Verificar si ya existe
        if AdminUser.query.filter_by(email='admin@peregrinos.shop').first():
            click.echo('❌ Admin user already exists')
            return
        
        admin = AdminUser(
            email='admin@peregrinos.shop',
            first_name='Admin',
            last_name='Peregrinos',
            role='superadmin'
        )
        admin.set_password('admin123')
        
        db.session.add(admin)
        db.session.commit()
        click.echo('✅ Superadmin creado exitosamente!')
        click.echo('📧 Email: admin@peregrinos.shop')
        click.echo('🔑 Password: admin123')
        click.echo('⚠️  IMPORTANTE: Cambia la contraseña después del primer login!')

    @app.cli.command("insert-test-products")
    @with_appcontext
    def insert_test_products():
        """Insertar productos de prueba para Peregrinos.shop"""
        from api.models import Category, Product
        
        # Crear categorías de ejemplo
        categories_data = [
            {"name": "Camisetas", "description": "Camisetas con mensajes espirituales"},
            {"name": "Sudaderas", "description": "Sudaderas cómodas para el día a día"},
            {"name": "Accesorios", "description": "Accesorios y detalles especiales"},
        ]
        
        for cat_data in categories_data:
            if not Category.query.filter_by(name=cat_data["name"]).first():
                category = Category(**cat_data)
                db.session.add(category)
        
        db.session.commit()
        click.echo('✅ Categorías de prueba creadas')
        
        # Aquí podríamos agregar productos de prueba después
        click.echo('📦 Ejecuta "flask insert-test-products-full" para agregar productos completos')