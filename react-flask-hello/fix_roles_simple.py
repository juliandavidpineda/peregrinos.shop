import sqlite3

# Conectar a la base de datos
conn = sqlite3.connect('instance/peregrinos.db')
cursor = conn.cursor()

# Ver usuarios actuales
print("=== USUARIOS ACTUALES ===")
cursor.execute("SELECT id, email, role FROM admin_users")
users = cursor.fetchall()
for user in users:
    print(f"ID: {user[0]}, Email: {user[1]}, Role: {user[2]}")

# Actualizar roles
print("\n=== ACTUALIZANDO ROLES ===")
for user in users:
    user_id, email, old_role = user
    if old_role == 'editor':
        new_role = 'EDITOR'
    elif old_role == 'superadmin':
        new_role = 'SUPERADMIN' 
    elif old_role == 'content_manager':
        new_role = 'CONTENT_MANAGER'
    else:
        new_role = old_role
    
    cursor.execute("UPDATE admin_users SET role = ? WHERE id = ?", (new_role, user_id))
    print(f"{email}: {old_role} -> {new_role}")

# Guardar cambios
conn.commit()
conn.close()
print("\n✅ Todos los usuarios actualizados")