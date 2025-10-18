# investigate_database.py
import os
import sqlite3
from pathlib import Path

def investigate_thoroughly():
    """Investigación completa de la base de datos"""
    print("🔍 INVESTIGACIÓN COMPLETA DE LA BD")
    print("=" * 50)
    
    # Buscar TODOS los archivos .db en el proyecto
    print("📁 BUSCANDO ARCHIVOS .db EN EL PROYECTO:")
    db_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.db'):
                full_path = os.path.join(root, file)
                db_files.append(full_path)
                file_size = os.path.getsize(full_path)
                print(f"   📄 {full_path} ({file_size} bytes)")
    
    if not db_files:
        print("   ❌ No se encontraron archivos .db")
        return
    
    # Revisar CADA archivo .db encontrado
    for db_path in db_files:
        print(f"\n🛢️  ANALIZANDO: {db_path}")
        
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Listar tablas
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            
            if tables:
                print(f"   📋 Tablas encontradas ({len(tables)}):")
                for table in tables:
                    table_name = table[0]
                    print(f"      - {table_name}")
                    
                    # Contar registros en cada tabla
                    try:
                        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                        count = cursor.fetchone()[0]
                        print(f"        📊 Registros: {count}")
                        
                        # Si es la tabla products, mostrar algunos
                        if table_name == 'products' and count > 0:
                            cursor.execute("SELECT id, name FROM products LIMIT 3")
                            products = cursor.fetchall()
                            print(f"        🎯 Productos de ejemplo:")
                            for product_id, product_name in products:
                                print(f"           • {product_name} (ID: {product_id})")
                    except Exception as e:
                        print(f"        ❌ Error contando registros: {e}")
            else:
                print("   ❌ No tiene tablas")
            
            conn.close()
            
        except Exception as e:
            print(f"   ❌ Error al analizar: {e}")

def check_current_directory():
    """Verifica el directorio actual y archivos"""
    print(f"\n📁 DIRECTORIO ACTUAL: {os.getcwd()}")
    print("📋 ARCHIVOS EN EL DIRECTORIO:")
    for item in os.listdir('.'):
        if os.path.isdir(item):
            print(f"   📂 {item}/")
        else:
            print(f"   📄 {item}")

if __name__ == "__main__":
    check_current_directory()
    investigate_thoroughly()