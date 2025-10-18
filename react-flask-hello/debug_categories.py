# debug_categories.py
import sqlite3
import json

def debug_categories():
    """Debug detallado de las categorías"""
    print("🔍 DEBUG DETALLADO DE CATEGORÍAS")
    print("=" * 40)
    
    try:
        conn = sqlite3.connect('instance/peregrinos.db')
        cursor = conn.cursor()
        
        # 1. Verificar estructura de la tabla categories
        print("📋 ESTRUCTURA DE CATEGORÍAS:")
        cursor.execute("PRAGMA table_info(categories)")
        columns = cursor.fetchall()
        for col in columns:
            col_id, col_name, col_type, not_null, default_val, pk = col
            print(f"   - {col_name} ({col_type}) {'🔑' if pk else ''}")
        
        # 2. Verificar categorías existentes
        print(f"\n📦 CATEGORÍAS EN LA BD:")
        cursor.execute("SELECT id, name, description, image_url, created_at FROM categories")
        categories = cursor.fetchall()
        
        for cat_id, cat_name, cat_desc, cat_image, created_at in categories:
            print(f"\n🆔 ID: {cat_id}")
            print(f"📝 Nombre: '{cat_name}'")
            print(f"📄 Descripción: '{cat_desc}'")
            print(f"🖼️  Imagen: {cat_image}")
            print(f"📅 Creado: {created_at}")
            
            # Verificar si el nombre tiene caracteres extraños
            print(f"🔤 Longitud nombre: {len(cat_name)}")
            print(f"🔍 Nombre en ASCII: {ascii(cat_name)}")
        
        # 3. Verificar endpoint del API
        print(f"\n🌐 VERIFICANDO ENDPOINT DEL API:")
        print("   URL: http://localhost:3001/api/categories")
        print("   💡 Abre esta URL en tu navegador para ver si devuelve las categorías")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_categories()