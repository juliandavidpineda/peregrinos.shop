import React from 'react';

const ProductImageGallery = ({ images, name, selectedImage, onImageSelect }) => {
  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-4">
        <img 
          src={images[selectedImage]} 
          alt={name}
          className="w-full h-96 object-cover rounded-lg"
        />
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