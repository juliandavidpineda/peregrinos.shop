# fix_categories_table.py
import sqlite3

def fix_categories_table():
    """Corrige el problema de la tabla categories"""
    print("🔧 CORRIGIENDO TABLA CATEGORIES")
    print("=" * 40)
    
    try:
        conn = sqlite3.connect('instance/peregrinos.db')
        cursor = conn.cursor()
        
        # 1. Verificar nombres exactos de las tablas
        print("📋 TABLAS EXISTENTES:")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        for table in tables:
            table_name = table[0]
            print(f"   - {table_name}")
            
        # 2. Buscar la tabla de categorías (puede tener nombre diferente)
        category_tables = [t[0] for t in tables if 'categor' in t[0].lower()]
        print(f"\n🔍 TABLAS DE CATEGORÍAS ENCONTRADAS: {category_tables}")
        
        if not category_tables:
            print("❌ No se encontró ninguna tabla de categorías")
            return
        
        # 3. Renombrar la tabla al nombre correcto si es necesario
        current_table = category_tables[0]
        correct_table_name = "categories"
        
        if current_table != correct_table_name:
            print(f"🔄 Renombrando tabla: {current_table} -> {correct_table_name}")
            cursor.execute(f"ALTER TABLE {current_table} RENAME TO {correct_table_name}")
            print("✅ Tabla renombrada")
        else:
            print("✅ La tabla ya tiene el nombre correcto")
        
        # 4. Verificar la estructura de la tabla
        print(f"\n📋 ESTRUCTURA DE LA TABLA '{correct_table_name}':")
        cursor.execute(f"PRAGMA table_info({correct_table_name})")
        columns = cursor.fetchall()
        for col in columns:
            col_id, col_name, col_type, not_null, default_val, pk = col
            print(f"   - {col_name} ({col_type}) {'🔑' if pk else ''}")
        
        # 5. Verificar datos
        cursor.execute(f"SELECT COUNT(*) FROM {correct_table_name}")
        category_count = cursor.fetchone()[0]
        print(f"\n📦 CATEGORÍAS EN LA TABLA: {category_count}")
        
        if category_count > 0:
            cursor.execute(f"SELECT id, name FROM {correct_table_name}")
            categories = cursor.fetchall()
            for cat_id, cat_name in categories:
                print(f"   - {cat_name} (ID: {cat_id})")
        
        conn.commit()
        conn.close()
        
        print(f"\n🎉 ¡Problema de la tabla categories resuelto!")
        print("💡 Ahora el API debería funcionar correctamente")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fix_categories_table()