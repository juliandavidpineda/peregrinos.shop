# clean_tables.py
import sqlite3
import os

def clean_temp_tables():
    db_path = 'instance/peregrinos.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Base de datos no encontrada en: {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Listar todas las tablas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print('📋 Tablas en la base de datos:')
        for table in tables:
            print(f'  - {table[0]}')
        
        # Buscar y eliminar tablas temporales de Alembic
        temp_tables = [table[0] for table in tables if table[0].startswith('_alembic_tmp')]
        if temp_tables:
            print('🗑️  Eliminando tablas temporales...')
            for temp_table in temp_tables:
                print(f'  - Eliminando {temp_table}')
                cursor.execute(f'DROP TABLE IF EXISTS {temp_table}')
            conn.commit()
            print('✅ Tablas temporales eliminadas')
        else:
            print('✅ No hay tablas temporales que eliminar')
            
    except Exception as e:
        print(f'❌ Error: {e}')
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    clean_temp_tables()