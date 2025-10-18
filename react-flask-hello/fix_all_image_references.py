# fix_all_image_references.py
import os
import sqlite3
import json

def fix_all_image_references():
    """Limpia todas las referencias a imágenes faltantes"""
    print("🔧 CORRIGIENDO TODAS LAS REFERENCIAS DE IMÁGENES")
    print("=" * 50)
    
    db_path = 'instance/peregrinos.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, images FROM products")
    products = cursor.fetchall()
    
    updated_count = 0
    
    for product_id, product_name, images_json in products:
        if images_json:
            try:
                images = json.loads(images_json)
                if images:
                    # Filtrar solo imágenes que existen físicamente
                    valid_images = []
                    for image_path in images:
                        if image_path.startswith('http'):
                            # URLs externas siempre son válidas
                            valid_images.append(image_path)
                            print(f"✅ Manteniendo URL externa: {product_name}")
                        elif image_path.startswith('/uploads/'):
                            physical_path = image_path[1:]  # quitar el primer /
                            if os.path.exists(physical_path):
                                valid_images.append(image_path)
                                print(f"✅ Imagen existe: {product_name} -> {os.path.basename(image_path)}")
                            else:
                                print(f"🗑️  Eliminando referencia: {product_name} -> {os.path.basename(image_path)}")
                        else:
                            # Otros tipos de rutas
                            valid_images.append(image_path)
                    
                    # Actualizar la BD si hay cambios
                    if len(valid_images) != len(images):
                        new_images_json = json.dumps(valid_images)
                        cursor.execute(
                            "UPDATE products SET images = ? WHERE id = ?",
                            (new_images_json, product_id)
                        )
                        updated_count += 1
                        print(f"📝 Actualizado: {product_name} - {len(valid_images)} imágenes válidas")
                    else:
                        print(f"ℹ️  Sin cambios: {product_name} - {len(images)} imágenes válidas")
                
            except json.JSONDecodeError as e:
                print(f"❌ Error JSON en {product_name}: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"\n🎉 ACTUALIZACIÓN COMPLETADA:")
    print(f"   • Productos actualizados: {updated_count}")
    print(f"   • Productos totales: {len(products)}")
    print(f"\n💡 SIGUIENTES PASOS:")
    print(f"   1. Ve al panel admin y edita cada producto")
    print(f"   2. Sube nuevas imágenes para los productos")
    print(f"   3. Las miniaturas deberían funcionar correctamente")

if __name__ == "__main__":
    fix_all_image_references()