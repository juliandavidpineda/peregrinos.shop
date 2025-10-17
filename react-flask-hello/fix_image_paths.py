#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para limpiar rutas de imágenes que no existen físicamente
Ejecutar: pipenv run python fix_image_paths.py
"""

import sys
import os

# Configurar la ruta de la base de datos
os.environ['DATABASE_URL'] = 'sqlite:///instance/peregrinos.db'

# Agregar src/ al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from api.models import db, Product
from src.app import app

def fix_image_paths():
    """Eliminar rutas de imágenes/videos que no existen físicamente"""
    with app.app_context():
        # Verificar que la BD existe
        db_path = os.path.join(os.path.dirname(__file__), 'instance', 'peregrinos.db')
        if not os.path.exists(db_path):
            print(f"❌ Base de datos no encontrada en: {db_path}")
            print("   Asegúrate de que el servidor Flask haya creado la BD primero.")
            return
        
        print(f"📊 Usando base de datos: {db_path}\n")
        
        products = Product.query.all()
        project_root = os.path.dirname(__file__)
        
        print(f"🔍 Revisando {len(products)} productos...")
        print(f"📁 Project root: {project_root}\n")
        
        fixed_count = 0
        total_removed = 0
        
        for product in products:
            images_fixed = []
            videos_fixed = []
            removed_images = []
            removed_videos = []
            
            # Revisar imágenes
            if product.images:
                print(f"\n📦 Producto: {product.name}")
                print(f"   Imágenes actuales: {len(product.images)}")
                
                for img in product.images:
                    # URL externa - mantener
                    if img.startswith('http'):
                        images_fixed.append(img)
                        print(f"   ✅ URL externa: {img[:50]}...")
                        continue
                    
                    # Construir ruta física
                    relative_path = img.lstrip('/')
                    full_path = os.path.join(project_root, relative_path)
                    full_path = os.path.abspath(full_path)
                    
                    if os.path.exists(full_path):
                        images_fixed.append(img)
                        file_size = os.path.getsize(full_path)
                        print(f"   ✅ Existe: {img} ({file_size} bytes)")
                    else:
                        removed_images.append(img)
                        print(f"   ❌ NO EXISTE: {img}")
                        print(f"      Buscado en: {full_path}")
            
            # Revisar videos
            if product.videos:
                for vid in product.videos:
                    if vid.startswith('http'):
                        videos_fixed.append(vid)
                        continue
                    
                    relative_path = vid.lstrip('/')
                    full_path = os.path.join(project_root, relative_path)
                    full_path = os.path.abspath(full_path)
                    
                    if os.path.exists(full_path):
                        videos_fixed.append(vid)
                        print(f"   ✅ Video existe: {vid}")
                    else:
                        removed_videos.append(vid)
                        print(f"   ❌ Video NO EXISTE: {vid}")
            
            # Actualizar si cambió algo
            if (images_fixed != product.images or videos_fixed != product.videos):
                product.images = images_fixed
                product.videos = videos_fixed
                fixed_count += 1
                total_removed += len(removed_images) + len(removed_videos)
                
                print(f"   🔧 ACTUALIZADO:")
                print(f"      - Imágenes removidas: {len(removed_images)}")
                print(f"      - Videos removidos: {len(removed_videos)}")
                print(f"      - Imágenes restantes: {len(images_fixed)}")
                print(f"      - Videos restantes: {len(videos_fixed)}")
        
        # Guardar cambios
        db.session.commit()
        
        print(f"\n{'='*60}")
        print(f"✅ RESUMEN:")
        print(f"   - Productos revisados: {len(products)}")
        print(f"   - Productos actualizados: {fixed_count}")
        print(f"   - Archivos removidos: {total_removed}")
        print(f"{'='*60}\n")

if __name__ == '__main__':
    try:
        fix_image_paths()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()