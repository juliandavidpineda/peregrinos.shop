import React from 'react';

const ProductDescription = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#779385]/20 p-8 mb-8">
      {/* Header con icono */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#f7f2e7] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-[#2f4823]">✞</span>
        </div>
        <h3 className="font-serif font-bold text-3xl text-[#2f4823] mb-2">
          Sobre esta Prenda
        </h3>
        <div className="w-24 h-1 bg-[#779385] mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Columna izquierda - Descripción y Características */}
        <div className="space-y-8">
          {/* Sección Descripción */}
          <div className="bg-[#f7f2e7]/30 rounded-xl p-6 border border-[#779385]/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2f4823] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📝</span>
              </div>
              <h4 className="font-serif font-bold text-xl text-[#2f4823]">
                Descripción
              </h4>
            </div>
            <p className="text-[#2f4823] leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          {/* Sección Características */}
          <div className="bg-[#f7f2e7]/30 rounded-xl p-6 border border-[#779385]/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2f4823] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">✨</span>
              </div>
              <h4 className="font-serif font-bold text-xl text-[#2f4823]">
                Características
              </h4>
            </div>
            <ul className="space-y-3">
              {product.features?.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-[#2f4823] group">
                  <span className="w-6 h-6 bg-[#779385] text-white rounded-full flex items-center justify-center text-sm mt-0.5 flex-shrink-0 group-hover:bg-[#2f4823] transition-colors">
                    ✓
                  </span>
                  <span className="text-lg leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Columna derecha - Detalles */}
        <div className="space-y-8">
          <div className="bg-[#f7f2e7]/30 rounded-xl p-6 border border-[#779385]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#2f4823] rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🔍</span>
              </div>
              <h4 className="font-serif font-bold text-xl text-[#2f4823]">
                Detalles del Producto
              </h4>
            </div>
            
            <div className="space-y-6">
              {/* Material */}
              <div className="group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#779385] rounded-full"></span>
                  <span className="font-semibold text-[#779385] text-sm uppercase tracking-wide">
                    Material
                  </span>
                </div>
                <p className="text-[#2f4823] text-lg pl-4 border-l-2 border-[#779385]/30 group-hover:border-[#2f4823] transition-colors">
                  {product.material}
                </p>
              </div>

              {/* Cuidados */}
              <div className="group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#779385] rounded-full"></span>
                  <span className="font-semibold text-[#779385] text-sm uppercase tracking-wide">
                    Cuidados
                  </span>
                </div>
                <p className="text-[#2f4823] text-lg pl-4 border-l-2 border-[#779385]/30 group-hover:border-[#2f4823] transition-colors">
                  {product.cuidados}
                </p>
              </div>

              {/* Origen */}
              <div className="group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#779385] rounded-full"></span>
                  <span className="font-semibold text-[#779385] text-sm uppercase tracking-wide">
                    Origen
                  </span>
                </div>
                <p className="text-[#2f4823] text-lg pl-4 border-l-2 border-[#779385]/30 group-hover:border-[#2f4823] transition-colors">
                  {product.origen}
                </p>
              </div>

              {/* Disponibilidad */}
              <div className="group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#779385] rounded-full"></span>
                  <span className="font-semibold text-[#779385] text-sm uppercase tracking-wide">
                    Disponibilidad
                  </span>
                </div>
                <p className="text-[#2f4823] text-lg pl-4 border-l-2 border-[#779385]/30 group-hover:border-[#2f4823] transition-colors">
                  {product.disponibilidad}
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje de bendición */}
          <div className="bg-gradient-to-r from-[#2f4823] to-[#779385] rounded-xl p-6 text-center transform hover:scale-[1.02] transition-transform duration-300">
            <div className="text-white/80 text-4xl mb-3">✞</div>
            <p className="text-white font-serif italic text-lg">
              "Revístete de amor"
            </p>
            <p className="text-white/70 text-sm mt-2">Colosenses 3:14</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;