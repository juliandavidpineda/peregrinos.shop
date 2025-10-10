import React from 'react';

const ProductDescription = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 p-8 mb-8">
      <h3 className="font-serif font-bold text-2xl text-[#2f4823] mb-6 text-center">
        Sobre esta Prenda Espiritual
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-[#2f4823] mb-4">Descripción</h4>
          <p className="text-[#2f4823] leading-relaxed mb-6">
            {product.description}
          </p>
          
          <div>
            <h4 className="font-semibold text-[#2f4823] mb-3">Características</h4>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-[#2f4823]">
                  <span className="text-[#779385]">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#2f4823] mb-4">Detalles</h4>
          <div className="space-y-4">
            <div>
              <span className="font-medium text-[#779385]">Material:</span>
              <p className="text-[#2f4823]">{product.materials}</p>
            </div>
            <div>
              <span className="font-medium text-[#779385]">Cuidados:</span>
              <p className="text-[#2f4823]">{product.care}</p>
            </div>
            <div>
              <span className="font-medium text-[#779385]">Origen:</span>
              <p className="text-[#2f4823]">{product.madeIn}</p>
            </div>
            <div>
              <span className="font-medium text-[#779385]">Disponibilidad:</span>
              <p className="text-[#2f4823]">
                {product.inStock ? 
                  `${product.stockQuantity} unidades disponibles` : 
                  'Agotado'
                }
              </p>
            </div>
          </div>

          {/* Mensaje de bendición */}
          <div className="mt-6 p-4 bg-[#f7f2e7] rounded-lg border border-[#779385]/20">
            <p className="text-sm text-[#2f4823] italic text-center">
              "Revístete de amor"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;