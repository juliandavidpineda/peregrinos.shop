import React, { useState } from 'react';
import { mediaService } from '../../../services/productService';
import { getBackendUrl } from '../../../utils/backendConfig';

const MediaUpload = ({ productId, onMediaUpdate, existingImages = [], existingVideos = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localImages, setLocalImages] = useState(existingImages);
  const [localVideos, setLocalVideos] = useState(existingVideos);

  const API_BASE_URL = getBackendUrl();

  console.log('🎯 MediaUpload rendered');
  console.log('🔧 API_BASE_URL:', API_BASE_URL);

  // ✅ Sincronizar con props cuando cambian
  React.useEffect(() => {
    console.log('🔄 Props changed - Images:', existingImages?.length, 'Videos:', existingVideos?.length);
    setLocalImages(existingImages || []);
    setLocalVideos(existingVideos || []);
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

      console.log('📤 Uploading files:', validFiles.map(f => f.name));
      const result = await mediaService.uploadMedia(productId, validFiles);
      
      console.log('✅ Upload successful:', result);
      
      if (result.product) {
        // ✅ NO usar estado local, pasar directamente al padre
        const updatedImages = result.product.images || [];
        const updatedVideos = result.product.videos || [];
        
        console.log('📸 Images after upload:', updatedImages);
        console.log('🎥 Videos after upload:', updatedVideos);
        
        // Notificar al padre inmediatamente
        if (onMediaUpdate) {
          onMediaUpdate(result.product);
        }
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
      
      if (result.product) {
        console.log('📸 Images after delete:', result.product.images);
        console.log('🎥 Videos after delete:', result.product.videos);
        
        // Notificar al padre
        if (onMediaUpdate) {
          onMediaUpdate(result.product);
        }
      }
      
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      alert('❌ Error al eliminar archivo: ' + error.message);
    }
  };

  // ✅ FUNCIÓN SIMPLIFICADA PARA CONSTRUIR URL
  const getMediaUrl = (mediaPath) => {
    if (mediaPath.startsWith('http')) {
      return mediaPath;
    }
    
    // mediaPath viene como: /uploads/images/uuid.png
    // Necesitamos: http://localhost:3001/api/uploads/images/uuid.png
    const cleanPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
    const fullUrl = `${API_BASE_URL}/api${cleanPath}`;
    
    console.log(`🔗 Media URL: ${mediaPath} -> ${fullUrl}`);
    return fullUrl;
  };

  // ✅ USAR PROPS DIRECTAMENTE (no estado local)
  const displayImages = existingImages || [];
  const displayVideos = existingVideos || [];
  
  console.log('🖼️ Rendering images:', displayImages.length, displayImages);
  console.log('🎥 Rendering videos:', displayVideos.length, displayVideos);

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
      {displayImages.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-[#2f4823] mb-3">
            🖼️ Imágenes ({displayImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayImages.map((image, index) => {
              const imageUrl = getMediaUrl(image);
              
              return (
                <div key={`img-${index}-${image}`} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      console.error('❌ Error loading image:', imageUrl);
                      e.target.style.border = '2px solid red';
                      e.target.style.background = '#fee';
                    }}
                    onLoad={() => console.log('✅ Image loaded:', imageUrl)}
                  />
                  {/* ✅ Botón de eliminar SIEMPRE visible en hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteFile(image, 'image')}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all transform scale-90 group-hover:scale-100 shadow-lg"
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
      {displayVideos.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-[#2f4823] mb-3">
            🎥 Videos ({displayVideos.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayVideos.map((video, index) => {
              const videoUrl = getMediaUrl(video);
              
              return (
                <div key={`vid-${index}-${video}`} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                  <video
                    src={videoUrl}
                    className="w-full h-40 object-cover bg-gray-100"
                    controls
                    preload="metadata"
                    onError={() => console.error('❌ Error loading video:', videoUrl)}
                    onLoadedData={() => console.log('✅ Video loaded:', videoUrl)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center pointer-events-none">
                    <button
                      onClick={() => handleDeleteFile(video, 'video')}
                      className="pointer-events-auto opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all transform scale-90 group-hover:scale-100 shadow-lg"
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

      {displayImages.length === 0 && displayVideos.length === 0 && (
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