# find_correct_path.py
import os
import sqlite3

def find_correct_path():
    """Encuentra la ruta correcta a la base de datos"""
    print("🔍 BUSCANDO RUTA CORRECTA A LA BD")
    print("=" * 50)
    
    # Posibles ubicaciones de la BD
    possible_paths = [
        'instance/peregrinos.db',  # Desde raíz del proyecto
        './instance/peregrinos.db',  # Desde raíz del proyecto
        '../instance/peregrinos.db',  # Desde directorio api/
        'src/instance/peregrinos.db',  # Desde directorio src/
        './src/instance/peregrinos.db',  # Desde raíz del proyecto
    ]
    
    # También buscar desde la ubicación actual del script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    possible_paths.append(os.path.join(current_dir, 'instance', 'peregrinos.db'))
    possible_paths.append(os.path.join(current_dir, '..', 'instance', 'peregrinos.db'))
    possible_paths.append(os.path.join(current_dir, '..', 'src', 'instance', 'peregrinos.db'))
    
    found_path = None
    
    for path in possible_paths:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            found_path = abs_path
            print(f"✅ BD encontrada en: {abs_path}")
            
            # Verificar que tiene la tabla categories
            try:
                conn = sqlite3.connect(abs_path)
                cursor = conn.cursor()
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='categories'")
                if cursor.fetchone():
                    print(f"✅ Tabla 'categories' encontrada")
                else:
                    print(f"❌ Tabla 'categories' NO encontrada")
                conn.close()
            except Exception as e:
                print(f"❌ Error verificando BD: {e}")
            
            break
        else:
            print(f"❌ No encontrada: {abs_path}")
    
    if not found_path:
        print("❌ No se pudo encontrar la base de datos en ninguna ubicación")
    
    return found_path

if __name__ == "__main__":
    find_correct_path()