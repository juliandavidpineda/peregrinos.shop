import React from 'react';

const ProductImageGallery = ({ 
  images, 
  name, 
  selectedImage, 
  onImageSelect,
  onImageError
}) => {
  
  const handleImageError = (imagePath) => {
    if (onImageError) {
      onImageError(imagePath);
    }
  };

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-4">
        {images.length > 0 ? (
          <img 
            src={images[selectedImage]} 
            alt={name}
            className="w-full h-96 object-contain bg-white rounded-lg"
            onError={() => handleImageError(images[selectedImage])}
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
                className="w-full h-full object-contain bg-white rounded-md"
                onError={() => handleImageError(image)}
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