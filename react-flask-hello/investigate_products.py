# investigate_products.py
import sqlite3
import os
from pathlib import Path

def investigate_products_mystery():
    """Investiga el misterio de los productos que no deberían existir"""
    print("🕵️ INVESTIGANDO EL MISTERIO DE LOS PRODUCTOS")
    print("=" * 50)
    
    # Verificar TODAS las bases de datos
    db_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.db'):
                full_path = os.path.join(root, file)
                db_files.append(full_path)
    
    print("📁 ARCHIVOS .db ENCONTRADOS:")
    for db_path in db_files:
        file_size = os.path.getsize(db_path)
        print(f"   📄 {db_path} ({file_size} bytes)")
        
        # Verificar productos en cada BD
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Verificar si tiene tabla products
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")
            has_products_table = cursor.fetchone()
            
            if has_products_table:
                cursor.execute("SELECT COUNT(*) FROM products")
                product_count = cursor.fetchone()[0]
                print(f"      📦 Productos: {product_count}")
                
                if product_count > 0:
                    cursor.execute("SELECT id, name FROM products LIMIT 3")
                    sample_products = cursor.fetchall()
                    print(f"      🎯 Ejemplos: {[p[1] for p in sample_products]}")
            else:
                print(f"      ❌ No tiene tabla products")
            
            conn.close()
            
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    # Verificar la BD actual que estamos usando
    current_db = 'instance/peregrinos.db'
    print(f"\n🔍 BASE DE DATOS ACTUAL: {current_db}")
    if os.path.exists(current_db):
        conn = sqlite3.connect(current_db)
        cursor = conn.cursor()
        
        # Verificar transacciones pendientes
        print("📋 INFORMACIÓN DE LA BD ACTUAL:")
        
        cursor.execute("SELECT COUNT(*) FROM products")
        total_products = cursor.fetchone()[0]
        print(f"   📦 Total productos: {total_products}")
        
        cursor.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table'")
        total_tables = cursor.fetchone()[0]
        print(f"   🛢️  Total tablas: {total_tables}")
        
        # Listar todos los productos
        if total_products > 0:
            print(f"\n📋 LISTA COMPLETA DE PRODUCTOS:")
            cursor.execute("SELECT id, name, category_id FROM products")
            products = cursor.fetchall()
            
            for i, (prod_id, prod_name, cat_id) in enumerate(products, 1):
                print(f"   {i:2d}. {prod_name}")
                print(f"       🆔 {prod_id}")
                print(f"       📂 Categoría: {cat_id}")
        
        conn.close()
    else:
        print("❌ La BD actual no existe")

if __name__ == "__main__":
    investigate_products_mystery()