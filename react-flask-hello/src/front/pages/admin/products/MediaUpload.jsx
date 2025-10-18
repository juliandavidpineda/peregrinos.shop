import React, { useState, useCallback } from 'react';
import { mediaService } from '../../../services/productService';
import { getBackendUrl } from '../../../utils/backendConfig';
import toast from 'react-hot-toast';

const MediaUpload = ({ productId, onMediaUpdate, existingImages = [], existingVideos = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  const API_BASE_URL = getBackendUrl();

  // ✅ DEFINIR deleteFile PRIMERO con useCallback
 const deleteFile = useCallback(async (filePath, fileType) => {
    try {
      const result = await mediaService.deleteMedia(productId, filePath, fileType);
      
      if (result.product && onMediaUpdate) {
        setFailedImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(filePath);
          return newSet;
        });
        
        onMediaUpdate(result.product);
      }
      
      toast.success('✅ Archivo eliminado correctamente');
      
    } catch (error) {
      toast.error('❌ Error al eliminar archivo: ' + error.message);
    }
  }, [productId, onMediaUpdate]);

  // ✅ AHORA definir handleDeleteFile que usa deleteFile
  const handleDeleteFile = async (filePath, fileType) => {
    const toastId = toast.custom(
      (t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col border border-gray-200`}>
          <div className="p-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-red-600 text-xl">🗑️</span>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              ¿Eliminar archivo?
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Esta acción no se puede deshacer
            </p>
          </div>
          <div className="flex border-t border-gray-200">
            <button
              onClick={() => toast.dismiss(toastId)}
              className="flex-1 py-3 text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.dismiss(toastId);
                deleteFile(filePath, fileType);
              }}
              className="flex-1 py-3 text-sm font-medium text-red-600 hover:text-red-500 hover:bg-red-50 transition-colors border-l border-gray-200"
            >
              Eliminar
            </button>
          </div>
        </div>
      ),
      { 
        duration: Infinity,
        position: 'top-center'
      }
    );
  };

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
        toast.error('Solo se permiten archivos de imagen (JPEG, PNG, WEBP) y video (MP4, MOV, AVI, WEBM)');
        return;
      }

      const result = await mediaService.uploadMedia(productId, validFiles);
      
      if (result.product && onMediaUpdate) {
        onMediaUpdate(result.product);
      }
      
      toast.success(`✅ Se subieron ${result.uploaded_files?.length || 0} archivos exitosamente`);
      
    } catch (error) {
      toast.error('❌ Error al subir archivos: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const getMediaUrl = (mediaPath) => {
    if (mediaPath.startsWith('http')) {
      return mediaPath;
    }
    
    const cleanPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
    const fullUrl = `${API_BASE_URL}/api${cleanPath}`;
    
    return fullUrl;
  };

  const getFilteredImages = () => {
    return existingImages.filter(image => !failedImages.has(image));
  };

  const handleImageError = (imagePath) => {
    setFailedImages(prev => new Set(prev).add(imagePath));
  };

  const displayImages = getFilteredImages();
  const displayVideos = existingVideos || [];

  return (
    <div className="space-y-6">
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

      {displayImages.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-[#2f4823] mb-3">
            🖼️ Imágenes ({displayImages.length})
            {failedImages.size > 0 && (
              <span className="text-sm text-red-500 ml-2">
                ({failedImages.size} eliminadas)
              </span>
            )}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayImages.map((image, index) => {
              const imageUrl = getMediaUrl(image);
              
              if (failedImages.has(image)) return null;
              
              return (
                <div key={`img-${index}-${image}`} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onError={() => handleImageError(image)}
                  />
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