# check_categories.py en src/
import sqlite3
import os

# Conectar directamente a la base de datos
db_path = 'instance/peregrinos.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("📂 Categorías en la base de datos:")

# Obtener todas las categorías
cursor.execute('SELECT id, name, description FROM categories')
categories = cursor.fetchall()

for category in categories:
    cat_id, name, description = category
    
    # Contar productos en esta categoría
    cursor.execute('SELECT COUNT(*) FROM products WHERE category_id = ?', (cat_id,))
    product_count = cursor.fetchone()[0]
    
    print(f"   - {name}: {product_count} productos")
    if description:
        print(f"     Descripción: {description}")

print(f"\n📊 Total: {len(categories)} categorías")

# Mostrar productos y sus categorías
print(f"\n🔍 Productos y sus categorías:")
cursor.execute('''
    SELECT p.name, c.name 
    FROM products p 
    JOIN categories c ON p.category_id = c.id
''')
products = cursor.fetchall()

for product_name, category_name in products:
    print(f"   - {product_name} → {category_name}")

conn.close()