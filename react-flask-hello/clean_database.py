# clean_database.py
import sqlite3

def clean_database_completely():
    """Elimina todos los productos y sus dependencias de forma segura"""
    print("🧹 LIMPIANDO BASE DE DATOS COMPLETAMENTE")
    print("=" * 50)
    
    try:
        conn = sqlite3.connect('instance/peregrinos.db')
        cursor = conn.cursor()
        
        # 1. Mostrar estadísticas antes
        print("📊 ESTADÍSTICAS ANTES:")
        cursor.execute("SELECT COUNT(*) FROM products")
        products_before = cursor.fetchone()[0]
        print(f"   📦 Productos: {products_before}")
        
        cursor.execute("SELECT COUNT(*) FROM order_items")
        order_items_before = cursor.fetchone()[0]
        print(f"   📋 Items en órdenes: {order_items_before}")
        
        cursor.execute("SELECT COUNT(*) FROM orders")
        orders_before = cursor.fetchone()[0]
        print(f"   🛒 Órdenes: {orders_before}")
        
        if products_before == 0:
            print("✅ La base de datos ya está limpia")
            return
        
        # 2. Confirmación
        print(f"\n⚠️  Esto eliminará:")
        print(f"   • {products_before} productos")
        print(f"   • {order_items_before} items de órdenes") 
        print(f"   • {orders_before} órdenes")
        
        confirm = input("\n¿Estás SEGURO de que quieres eliminar TODO? (ESCRIBE 'ELIMINAR' para confirmar): ")
        if confirm.upper() != 'ELIMINAR':
            print("❌ Limpieza cancelada")
            return
        
        # 3. Eliminar en el orden correcto (para evitar errores de foreign key)
        print("\n🗑️  ELIMINANDO...")
        
        # Primero order_items (dependen de products y orders)
        if order_items_before > 0:
            cursor.execute("DELETE FROM order_items")
            print(f"✅ Eliminados {cursor.rowcount} items de órdenes")
        
        # Luego orders (dependen de users)
        if orders_before > 0:
            cursor.execute("DELETE FROM orders")
            print(f"✅ Eliminadas {cursor.rowcount} órdenes")
        
        # Finalmente products
        cursor.execute("DELETE FROM products")
        print(f"✅ Eliminados {cursor.rowcount} productos")
        
        # 4. Verificar después
        cursor.execute("SELECT COUNT(*) FROM products")
        products_after = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM order_items")
        order_items_after = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM orders")
        orders_after = cursor.fetchone()[0]
        
        conn.commit()
        conn.close()
        
        print(f"\n🎉 BASE DE DATOS LIMPIA:")
        print(f"   📦 Productos: {products_after}")
        print(f"   📋 Items en órdenes: {order_items_after}")
        print(f"   🛒 Órdenes: {orders_after}")
        print(f"\n💡 Ahora puedes empezar a crear productos desde el panel admin")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    clean_database_completely()