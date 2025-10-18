# debug_db_direct.py
import os
import sqlite3
import json
from pathlib import Path

def debug_database_directly():
    """Debug directo de la base de datos SQLite"""
    print("🔍 DEBUG DIRECTO DE LA BASE DE DATOS")
    print("=" * 50)
    
    # Ruta a la base de datos
    db_path = 'instance/peregrinos.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Base de datos no encontrada: {db_path}")
        return
    
    # Conectar a la base de datos
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Verificar tablas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print("📋 TABLAS EN LA BD:")
    for table in tables:
        print(f"   - {table[0]}")
    
    # 2. Verificar productos
    if 'products' in [t[0] for t in tables]:
        cursor.execute("SELECT id, name, images FROM products")
        products = cursor.fetchall()
        
        print(f"\n📦 PRODUCTOS ENCONTRADOS: {len(products)}")
        
        for product_id, product_name, images_json in products:
            print(f"\n🎯 PRODUCTO: {product_name}")
            print(f"   🆔 ID: {product_id}")
            
            if images_json:
                try:
                    images = json.loads(images_json)
                    print(f"   📸 Imágenes en BD: {images}")
                    
                    for i, image_path in enumerate(images):
                        print(f"   🖼️  Imagen {i+1}: {image_path}")
                        
                        # Verificar tipo de ruta
                        if image_path.startswith('http'):
                            print(f"      🔗 Es URL EXTERNA")
                        else:
                            print(f"      📁 Es ruta LOCAL")
                            
                            # Construir URL como lo haría el frontend
                            full_url = f"http://localhost:3001{image_path}"
                            print(f"      🔗 URL para frontend: {full_url}")
                            
                            # Verificar si existe físicamente
                            if image_path.startswith('/uploads/'):
                                relative_path = image_path[1:]  # quitar el primer /
                                physical_path = Path(relative_path)
                                
                                if physical_path.exists():
                                    file_size = physical_path.stat().st_size
                                    print(f"      ✅ EXISTE físicamente ({file_size} bytes)")
                                else:
                                    print(f"      ❌ NO EXISTE físicamente")
                                    print(f"      📁 Buscado en: {physical_path.absolute()}")
                
                except json.JSONDecodeError as e:
                    print(f"   ❌ Error en JSON: {e}")
                    print(f"   📄 JSON crudo: {images_json}")
            else:
                print("   ❌ No tiene imágenes")
    
    # 3. Verificar directorio de uploads
    print(f"\n📁 VERIFICANDO DIRECTORIO UPLOADS:")
    uploads_dir = Path('uploads/images')
    
    if uploads_dir.exists():
        image_files = list(uploads_dir.glob('*'))
        image_count = len([f for f in image_files if f.is_file()])
        print(f"   ✅ Directorio existe: {uploads_dir}")
        print(f"   📸 Archivos encontrados: {image_count}")
        
        if image_count > 0:
            print(f"   📋 Lista de archivos:")
            for img_path in image_files:
                if img_path.is_file():
                    file_size = img_path.stat().st_size
                    print(f"      - {img_path.name} ({file_size} bytes)")
    else:
        print(f"   ❌ Directorio NO existe: {uploads_dir}")
    
    conn.close()

if __name__ == "__main__":
    debug_database_directly()