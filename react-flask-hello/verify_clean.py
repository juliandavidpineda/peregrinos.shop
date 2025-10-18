# verify_clean.py
import sqlite3

def verify_database_clean():
    """Verifica que la base de datos esté completamente limpia"""
    print("🔍 VERIFICANDO BASE DE DATOS LIMPIA")
    print("=" * 40)
    
    try:
        conn = sqlite3.connect('instance/peregrinos.db')
        cursor = conn.cursor()
        
        print("📊 ESTADO ACTUAL:")
        
        cursor.execute("SELECT COUNT(*) FROM products")
        products = cursor.fetchone()[0]
        print(f"   📦 Productos: {products}")
        
        cursor.execute("SELECT COUNT(*) FROM order_items")
        order_items = cursor.fetchone()[0]
        print(f"   📋 Items en órdenes: {order_items}")
        
        cursor.execute("SELECT COUNT(*) FROM orders")
        orders = cursor.fetchone()[0]
        print(f"   🛒 Órdenes: {orders}")
        
        cursor.execute("SELECT COUNT(*) FROM categories")
        categories = cursor.fetchone()[0]
        print(f"   📂 Categorías: {categories}")
        
        conn.close()
        
        if products == 0 and order_items == 0 and orders == 0:
            print("\n✅ ¡Base de datos completamente limpia!")
            print("💡 Puedes empezar a crear productos desde el panel admin")
        else:
            print("\n❌ La base de datos NO está completamente limpia")
            print("💡 Ejecuta clean_database.py nuevamente")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    verify_database_clean()