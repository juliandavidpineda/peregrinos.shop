# debug_categories_simple.py
import sqlite3
import os

def debug_categories_simple():
    """Debug simple y directo del problema de categories"""
    print("🔍 DEBUG SIMPLE CATEGORIES")
    print("=" * 40)
    
    db_path = 'instance/peregrinos.db'
    
    # 1. Verificar que la BD existe
    if not os.path.exists(db_path):
        print(f"❌ Database file not found: {db_path}")
        return
    
    print(f"✅ Database file exists: {db_path}")
    print(f"📏 File size: {os.path.getsize(db_path)} bytes")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # 2. Verificar todas las tablas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print(f"📋 Tables in database: {[t[0] for t in tables]}")
        
        # 3. Verificar específicamente categories
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='categories'")
        categories_table = cursor.fetchone()
        
        if categories_table:
            print(f"✅ Table 'categories' exists")
            
            # 4. Verificar estructura de categories
            cursor.execute("PRAGMA table_info(categories)")
            columns = cursor.fetchall()
            print(f"📋 Columns in categories: {[col[1] for col in columns]}")
            
            # 5. Verificar datos en categories
            cursor.execute("SELECT COUNT(*) FROM categories")
            count = cursor.fetchone()[0]
            print(f"📦 Records in categories: {count}")
            
            if count > 0:
                cursor.execute("SELECT id, name FROM categories")
                categories = cursor.fetchall()
                print("🎯 Categories found:")
                for cat_id, cat_name in categories:
                    print(f"   - {cat_name} (ID: {cat_id})")
            else:
                print("❌ No categories found in table")
                
        else:
            print("❌ Table 'categories' does not exist")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_categories_simple()