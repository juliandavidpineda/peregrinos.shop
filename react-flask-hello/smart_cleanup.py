# smart_cleanup.py
import os
import sqlite3
import json
from pathlib import Path

def find_products_table(cursor):
    """Encuentra automáticamente la tabla de productos"""
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [table[0] for table in cursor.fetchall()]
    
    # Posibles nombres de tabla
    possible_names = ['products', 'product', 'items', 'productos']
    
    for table_name in possible_names:
        if table_name in tables:
            return table_name
    
    # Si no encuentra por nombre, buscar por columnas
    for table_name in tables:
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [col[1] for col in cursor.fetchall()]
        
        # Si tiene columnas típicas de productos
        if 'name' in columns and 'price' in columns:
            return table_name
    
    return None

def find_image_column(cursor, table_name):
    """Encuentra la columna que contiene las imágenes"""
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    
    # Posibles nombres de columna para imágenes
    possible_names = ['images', 'image', 'image_url', 'photos', 'picture']
    
    for col_id, col_name, col_type, not_null, default_val, pk in columns:
        if col_name in possible_names:
            return col_name
    
    # Si no encuentra, buscar columnas que contengan JSON
    for col_id, col_name, col_type, not_null, default_val, pk in columns:
        if col_type.upper() in ['JSON', 'TEXT']:
            # Verificar el contenido de algunos registros
            cursor.execute(f"SELECT {col_name} FROM {table_name} LIMIT 5")
            samples = cursor.fetchall()
            for sample in samples:
                if sample[0] and ('[' in sample[0] or '{' in sample[0]):
                    try:
                        json.loads(sample[0])
                        return col_name
                    except:
                        continue
    return None

def smart_find_orphaned_images():
    """
    Encuentra imágenes huérfanas de forma inteligente
    """
    print("🔍 BUSCANDO IMÁGENES HUÉRFANAS (MODO INTELIGENTE)")
    print("=" * 60)
    
    db_path = 'instance/peregrinos.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Base de datos no encontrada en: {db_path}")
        return set(), None
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Encontrar la tabla de productos
    products_table = find_products_table(cursor)
    if not products_table:
        print("❌ No se pudo encontrar la tabla de productos")
        conn.close()
        return set(), None
    
    print(f"✅ Tabla de productos encontrada: {products_table}")
    
    # 2. Encontrar la columna de imágenes
    image_column = find_image_column(cursor, products_table)
    if not image_column:
        print("❌ No se pudo encontrar la columna de imágenes")
        conn.close()
        return set(), None
    
    print(f"✅ Columna de imágenes encontrada: {image_column}")
    
    # 3. Obtener productos con imágenes
    cursor.execute(f"SELECT name, {image_column} FROM {products_table}")
    products = cursor.fetchall()
    
    db_image_paths = set()
    
    for product_name, images_data in products:
        if images_data:
            try:
                images_list = json.loads(images_data)
                for image_path in images_list:
                    if image_path:
                        filename = os.path.basename(image_path)
                        db_image_paths.add(filename)
                        print(f"📸 {product_name} -> {filename}")
            except json.JSONDecodeError:
                print(f"⚠️  Error en JSON para: {product_name}")
                continue
    
    print(f"\n📊 Imágenes en base de datos: {len(db_image_paths)}")
    print(f"📦 Productos revisados: {len(products)}")
    
    # 4. Obtener imágenes del filesystem
    uploads_dir = Path('uploads/images')
    fs_images = set()
    
    if uploads_dir.exists():
        for file_path in uploads_dir.glob('*'):
            if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                fs_images.add(file_path.name)
    
    print(f"📁 Imágenes en filesystem: {len(fs_images)}")
    
    # 5. Encontrar huérfanas
    orphaned_images = fs_images - db_image_paths
    
    print(f"\n🚨 IMÁGENES HUÉRFANAS ENCONTRADAS: {len(orphaned_images)}")
    
    if orphaned_images:
        print("📋 Lista:")
        for img in sorted(orphaned_images):
            print(f"   - {img}")
    else:
        print("🎉 ¡No hay imágenes huérfanas!")
    
    conn.close()
    return orphaned_images, uploads_dir

def delete_orphaned_images(orphaned_images, uploads_dir, dry_run=True):
    """Elimina imágenes huérfanas"""
    deleted_count = 0
    total_size = 0
    
    print(f"\n{'🔍 MODO SIMULACIÓN' if dry_run else '🗑️  ELIMINANDO'}")
    
    for img_name in orphaned_images:
        file_path = uploads_dir / img_name
        if file_path.exists():
            file_size = file_path.stat().st_size
            total_size += file_size
            
            if dry_run:
                print(f"📝 [SIMULACIÓN] {file_path} ({file_size} bytes)")
            else:
                try:
                    file_path.unlink()
                    print(f"🗑️  ELIMINADO: {file_path}")
                    deleted_count += 1
                except Exception as e:
                    print(f"❌ Error: {file_path} -> {e}")
    
    if dry_run:
        print(f"\n📊 Se eliminarían {len(orphaned_images)} archivos")
        print(f"💾 Espacio: {total_size / (1024*1024):.2f} MB")
        print(f"💡 Ejecuta con --delete para eliminar")
    else:
        print(f"\n✅ Eliminados: {deleted_count} archivos")
        print(f"💾 Espacio liberado: {total_size / (1024*1024):.2f} MB")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Limpia imágenes huérfanas')
    parser.add_argument('--delete', action='store_true', help='Eliminar realmente')
    
    args = parser.parse_args()
    
    orphaned_images, uploads_dir = smart_find_orphaned_images()
    
    if orphaned_images and uploads_dir:
        if args.delete:
            confirm = input(f"\n⚠️  ¿Eliminar {len(orphaned_images)} archivos? (SI/no): ")
            if confirm.upper() == 'SI':
                delete_orphaned_images(orphaned_images, uploads_dir, dry_run=False)
            else:
                print("❌ Cancelado")
        else:
            delete_orphaned_images(orphaned_images, uploads_dir, dry_run=True)

if __name__ == "__main__":
    main()