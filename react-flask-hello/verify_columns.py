# verify_columns.py
import sqlite3

def verify_columns():
    conn = sqlite3.connect('instance/peregrinos.db')
    cursor = conn.cursor()
    
    cursor.execute('PRAGMA table_info(user)')
    columns = cursor.fetchall()
    
    print('🎉 COLUMNAS EN TABLA USER:')
    legal_columns = []
    
    for col in columns:
        col_name = col[1]
        col_type = col[2] 
        nullable = 'NO' if col[3] == 0 else 'YES'
        default = col[4] or ''
        
        if any(legal in col_name for legal in ['terms', 'privacy', 'marketing']):
            legal_columns.append(col_name)
            print(f'  ✅ {col_name:28} {col_type:18} Nullable: {nullable:3} Default: {default}')
        else:
            print(f'  {col_name:28} {col_type:18} Nullable: {nullable:3} Default: {default}')
    
    print(f'\n📊 CAMPOS LEGALES: {len(legal_columns)}/6')
    print(f'🔖 Lista: {legal_columns}')
    
    # Verificar Alembic
    cursor.execute('SELECT version_num FROM alembic_version')
    version = cursor.fetchone()
    print(f'🎯 Versión Alembic: {version[0] if version else "None"}')
    
    conn.close()

if __name__ == '__main__':
    verify_columns()