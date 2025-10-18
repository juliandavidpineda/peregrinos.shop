# create_category_simple.py
import sqlite3
import uuid

def create_category_simple():
    """Crea una categoría directamente en la base de datos"""
    print("📦 CREANDO CATEGORÍA 'Ropa'")
    print("=" * 40)
    
    try:
        # Conectar a la base de datos
        conn = sqlite3.connect('instance/peregrinos.db')
        cursor = conn.cursor()
        
        # Verificar si ya existe la categoría
        cursor.execute("SELECT name FROM categories WHERE name = 'Ropa'")
        existing_category = cursor.fetchone()
        
        if existing_category:
            print("✅ La categoría 'Ropa' ya existe")
            return
        
        # Datos de la categoría
        category_id = str(uuid.uuid4())
        category_name = "Ropa"
        category_description = "Prendas de vestir católicas"
        
        # Insertar categoría
        cursor.execute(
            "INSERT INTO categories (id, name, description) VALUES (?, ?, ?)",
            (category_id, category_name, category_description)
        )
        
        conn.commit()
        
        # Verificar que se creó
        cursor.execute("SELECT id, name FROM categories WHERE name = 'Ropa'")
        new_category = cursor.fetchone()
        
        conn.close()
        
        if new_category:
            print("✅ Categoría 'Ropa' creada exitosamente!")
            print(f"🆔 ID: {new_category[0]}")
            print(f"📝 Nombre: {new_category[1]}")
        else:
            print("❌ Error: No se pudo crear la categoría")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_category_simple()