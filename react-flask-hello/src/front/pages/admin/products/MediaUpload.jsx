import React, { useState } from 'react';
import { mediaService } from '../../../services/productService';
import { getBackendUrl } from '../../../utils/backendConfig';

const MediaUpload = ({ productId, onMediaUpdate, existingImages = [], existingVideos = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const API_BASE_URL = getBackendUrl();

  console.log('🎯 MediaUpload rendered');
  console.log('🔧 API_BASE_URL:', API_BASE_URL);
  console.log('🖼️ Existing images:', existingImages);
  console.log('🎥 Existing videos:', existingVideos);

  // ✅ Sincronizar cuando cambian las props
  React.useEffect(() => {
    console.log('🔄 Props updated:', { 
      images: existingImages?.length, 
      videos: existingVideos?.length 
    });
  }, [existingImages, existingVideos]);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    await uploadFiles(files);
    event.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    await uploadFiles(files);
  };

const uploadFiles = async (files) => {
  try {
    setUploading(true);
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/webm'];
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length === 0) {
      alert('Solo se permiten archivos de imagen (JPEG, PNG, WEBP) y video (MP4, MOV, AVI, WEBM)');
      return;
    }

    console.log('📤 Uploading files to product:', productId, validFiles.map(f => f.name));
    const result = await mediaService.uploadMedia(productId, validFiles);
    
    console.log('✅ Upload successful - Server response:', result);
    
    // ✅ VERIFICAR que el producto devuelto tenga las imágenes actualizadas
    if (result.product && onMediaUpdate) {
      console.log('📸 Server images after upload:', result.product.images);
      console.log('🎥 Server videos after upload:', result.product.videos);
      
      // ✅ Notificar al padre con el producto COMPLETO actualizado
      onMediaUpdate(result.product);
    } else {
      console.warn('⚠️ No product data in upload response');
    }
    
    alert(`✅ Se subieron ${result.uploaded_files?.length || 0} archivos exitosamente`);
    
  } catch (error) {
    console.error('❌ Error uploading files:', error);
    alert('❌ Error al subir archivos: ' + error.message);
  } finally {
    setUploading(false);
  }
};

  const handleDeleteFile = async (filePath, fileType) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) return;

    try {
      console.log('🗑️ Deleting file:', filePath, fileType);
      const result = await mediaService.deleteMedia(productId, filePath, fileType);
      
      console.log('✅ Delete successful:', result);
      
      if (result.product && onMediaUpdate) {
        onMediaUpdate(result.product);
      }
      
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      alert('❌ Error al eliminar archivo: ' + error.message);
    }
  };

  // ✅ FUNCIÓN MEJORADA PARA CONSTRUIR URL
  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) {
      console.warn('⚠️ Media path is empty');
      return '';
    }
    
    // Si ya es una URL completa, dejarla así
    if (mediaPath.startsWith('http')) {
      return mediaPath;
    }
    
    // mediaPath viene como: "/uploads/images/uuid.png"
    // Necesitamos: "http://localhost:3001/api/uploads/images/uuid.png"
    let cleanPath = mediaPath;
    
    // Asegurar que empiece con /
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    
    // Construir URL completa
    const fullUrl = `${API_BASE_URL}/api${cleanPath}`;
    
    console.log(`🔗 Media URL: "${mediaPath}" -> "${fullUrl}"`);
    return fullUrl;
  };

  return (
    <div className="space-y-6">
      {/* Área de Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-[#2f4823] bg-[#2f4823]/10' 
            : 'border-[#779385]/50 hover:border-[#779385]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-4">📁</div>
        <h3 className="text-lg font-semibold text-[#2f4823] mb-2">
          Subir Archivos Multimedia
        </h3>
        <p className="text-gray-600 mb-4">
          Arrastra imágenes y videos aquí o haz click para seleccionar
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Formatos: JPEG, PNG, WEBP, MP4, MOV, AVI, WEBM (Máx. 16MB por archivo)
        </p>
        
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
          disabled={uploading}
        />
        
        <label
          htmlFor="media-upload"
          className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors font-semibold ${
            uploading 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-[#2f4823] text-white hover:bg-[#1f3219] cursor-pointer'
          }`}
        >
          {uploading ? '⏳ Subiendo...' : '📸 Seleccionar Archivos'}
        </label>
      </div>

      {/* Preview de Imágenes */}
      {existingImages && existingImages.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-[#2f4823] mb-3">
            🖼️ Imágenes ({existingImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((image, index) => {
              const imageUrl = getMediaUrl(image);
              
              return (
                <div key={`img-${index}-${image}`} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      console.error('❌ Error loading image:', imageUrl);
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBlbmNvbnRyYWRhPC90ZXh0Pjwvc3ZnPg==';
                    }}
                    onLoad={() => console.log('✅ Image loaded successfully:', imageUrl)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteFile(image, 'image')}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all transform scale-90 group-hover:scale-100 shadow-lg"
                      title="Eliminar imagen"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview de Videos */}
      {existingVideos && existingVideos.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-[#2f4823] mb-3">
            🎥 Videos ({existingVideos.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingVideos.map((video, index) => {
              const videoUrl = getMediaUrl(video);
              
              return (
                <div key={`vid-${index}-${video}`} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                  <video
                    src={videoUrl}
                    className="w-full h-40 object-cover"
                    controls
                    preload="metadata"
                    onError={() => console.error('❌ Error loading video:', videoUrl)}
                    onLoadedData={() => console.log('✅ Video loaded:', videoUrl)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center pointer-events-none">
                    <button
                      onClick={() => handleDeleteFile(video, 'video')}
                      className="pointer-events-auto opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all transform scale-90 group-hover:scale-100 shadow-lg"
                      title="Eliminar video"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(!existingImages || existingImages.length === 0) && (!existingVideos || existingVideos.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📷</div>
          <p>No hay archivos multimedia aún</p>
          <p className="text-sm">Sube imágenes y videos para mostrar en el producto</p>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;