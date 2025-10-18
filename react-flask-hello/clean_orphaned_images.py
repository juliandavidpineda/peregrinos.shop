# clean_orphaned_images.py
import os
from pathlib import Path

def clean_all_orphaned_images():
    """Elimina todas las imágenes huérfanas (ya que la BD está vacía)"""
    print("🧹 ELIMINANDO IMÁGENES HUÉRFANAS")
    print("=" * 50)
    
    uploads_dir = Path('uploads/images')
    
    if not uploads_dir.exists():
        print("❌ Directorio de imágenes no encontrado")
        return
    
    # Listar todas las imágenes
    image_files = []
    for file_path in uploads_dir.glob('*'):
        if file_path.is_file() and file_path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
            image_files.append(file_path)
    
    print(f"📸 Imágenes encontradas: {len(image_files)}")
    
    if not image_files:
        print("🎉 No hay imágenes para eliminar")
        return
    
    # Mostrar imágenes que se eliminarán
    print("\n📋 Imágenes que se eliminarán:")
    total_size = 0
    for img_path in image_files:
        file_size = img_path.stat().st_size
        total_size += file_size
        print(f"   - {img_path.name} ({file_size} bytes)")
    
    print(f"\n💾 Espacio total a liberar: {total_size / (1024*1024):.2f} MB")
    
    # Confirmar eliminación
    confirm = input(f"\n⚠️  ¿Eliminar {len(image_files)} imágenes? (SI/no): ")
    if confirm.upper() == 'SI':
        deleted_count = 0
        for img_path in image_files:
            try:
                img_path.unlink()
                print(f"🗑️  Eliminado: {img_path.name}")
                deleted_count += 1
            except Exception as e:
                print(f"❌ Error eliminando {img_path.name}: {e}")
        
        print(f"\n✅ Eliminadas {deleted_count} imágenes")
        print(f"💾 Espacio liberado: {total_size / (1024*1024):.2f} MB")
    else:
        print("❌ Eliminación cancelada")

if __name__ == "__main__":
    clean_all_orphaned_images()