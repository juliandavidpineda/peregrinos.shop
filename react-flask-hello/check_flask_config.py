# check_flask_config.py
import os
import sys

def check_flask_config():
    """Verifica la configuración de Flask"""
    print("⚙️  VERIFICANDO CONFIGURACIÓN DE FLASK")
    print("=" * 50)
    
    try:
        # Agregar directorio actual al path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        sys.path.append(current_dir)
        
        from app import app
        
        print("✅ Flask app importada correctamente")
        print(f"📁 Directorio de instancia: {app.instance_path}")
        print(f"🔧 Modo debug: {app.debug}")
        print(f"🗄️  URI de base de datos: {app.config.get('SQLALCHEMY_DATABASE_URI')}")
        
        # Verificar rutas
        print(f"\n🌐 RUTAS DISPONIBLES:")
        with app.app_context():
            for rule in app.url_map.iter_rules():
                if 'api' in rule.rule or 'admin' in rule.rule:
                    methods = ','.join(sorted(rule.methods))
                    print(f"   📍 {rule.rule} -> {methods}")
                    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_flask_config()