import React from 'react';

const ProductImageGallery = ({ 
  images, 
  name, 
  selectedImage, 
  onImageSelect,
  onImageError // ✅ Nuevo prop para manejar errores
}) => {
  
  // ✅ MANEJAR error de imagen
  const handleImageError = (imagePath, index, isThumbnail = false) => {
    console.error(`❌ Error loading ${isThumbnail ? 'thumbnail' : 'main'} image:`, imagePath);
    
    // ✅ Notificar al componente padre sobre el error
    if (onImageError) {
      onImageError(imagePath);
    }
  };

  // ✅ OBTENER imagen principal válida
  const getMainImage = () => {
    if (images.length === 0) return null;
    
    const mainImage = images[selectedImage];
    return mainImage;
  };

  const mainImage = getMainImage();

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-4">
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={name}
            className="w-full h-96 object-cover rounded-lg"
            onError={() => handleImageError(mainImage, selectedImage, false)}
          />
        ) : (
          <div className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <span className="text-4xl mb-2">📷</span>
            <span>Imagen no disponible</span>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all ${
                selectedImage === index 
                  ? 'border-[#2f4823]' 
                  : 'border-[#779385]/20 hover:border-[#779385]'
              }`}
            >
              <img 
                src={image} 
                alt={`${name} ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
                onError={() => handleImageError(image, index, true)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Mensaje de bendición */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 bg-white text-[#2f4823] px-4 py-2 rounded-full text-sm border border-[#779385]/20">
          <span>✞</span>
          Imágenes reales del producto
          <span>✞</span>
        </span>
      </div>
    </div>
  );
};

export default ProductImageGallery;