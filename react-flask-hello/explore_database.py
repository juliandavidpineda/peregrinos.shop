# explore_database.py
import os
import sqlite3
from pathlib import Path

def explore_database():
    """Explora la estructura completa de la base de datos"""
    print("🔍 EXPLORANDO BASE DE DATOS")
    print("=" * 60)
    
    db_path = 'instance/peregrinos.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Base de datos no encontrada en: {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Listar todas las tablas
    print("\n📋 TABLAS EN LA BASE DE DATOS:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    for table in tables:
        table_name = table[0]
        print(f"\n🛢️  TABLA: {table_name}")
        
        # 2. Mostrar estructura de cada tabla
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        print(f"   📝 Columnas:")
        for col in columns:
            col_id, col_name, col_type, not_null, default_val, pk = col
            print(f"      - {col_name} ({col_type})")
        
        # 3. Contar registros en cada tabla
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"   📊 Registros: {count}")
        
        # 4. Mostrar algunos registros de ejemplo (solo para tablas pequeñas)
        if count > 0 and count <= 10:
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
            sample_records = cursor.fetchall()
            print(f"   🧪 Ejemplo de registros:")
            for record in sample_records:
                print(f"      {record}")
    
    conn.close()

def check_images_directory():
    """Verifica el directorio de imágenes"""
    print("\n📁 EXPLORANDO DIRECTORIO DE IMÁGENES")
    print("=" * 40)
    
    uploads_dir = Path('uploads/images')
    
    if not uploads_dir.exists():
        print("❌ Directorio uploads/images no encontrado")
        return
    
    # Listar todas las imágenes
    image_files = []
    for file_path in uploads_dir.glob('*'):
        if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            image_files.append(file_path)
    
    print(f"📸 Imágenes encontradas: {len(image_files)}")
    
    if image_files:
        print("📋 Lista de imágenes:")
        for img in sorted(image_files):
            print(f"   - {img.name} ({img.stat().st_size} bytes)")
    
    return image_files

if __name__ == "__main__":
    explore_database()
    check_images_directory()