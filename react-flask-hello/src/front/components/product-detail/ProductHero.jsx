import React from 'react';

const ProductHero = ({ name, onBack }) => {
  return (
    <>
      {/* Hero Mejorado */}
      <div className="relative bg-gradient-to-br from-[#2f4823] to-[#1f3219] text-white py-16 px-4 text-center overflow-hidden">
        
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-10 text-4xl">✞</div>
          <div className="absolute top-12 right-16 text-3xl">✝</div>
          <div className="absolute bottom-8 left-1/4 text-2xl">†</div>
          <div className="absolute bottom-12 right-1/4 text-3xl">☦</div>
        </div>

        {/* Líneas decorativas */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#779385]/30"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#779385]/30"></div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Badge espiritual */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <span className="text-amber-200">✞</span>
              Prenda única
              <span className="text-amber-200">✞</span>
            </span>
          </div>

          <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6 leading-tight">
            {name}
          </h1>
          
          {/* Versículo con borde y opacidad */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white/20 shadow-lg">
            <p className="text-lg md:text-xl italic mb-3 leading-relaxed">
              "Por encima de todo, vístanse de amor, que es el vínculo perfecto"
            </p>
            <p className="text-amber-200 font-semibold text-sm tracking-wide">
              Colosenses 3:14
            </p>
          </div>

          {/* Elementos decorativos inferiores */}
          <div className="mt-8 flex justify-center items-center gap-6 text-white/30">
            <div className="w-8 h-px bg-white/30"></div>
            <span className="text-lg">†</span>
            <div className="w-8 h-px bg-white/30"></div>
          </div>
        </div>

        {/* Onda decorativa en la parte inferior */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-8 text-[#f7f2e7] fill-current"
          >
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="shape-fill"></path>
          </svg>
        </div>
      </div>
      
      {/* Botón volver mejorado */}
      <div className="container mx-auto px-4 pt-8">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-[#779385] hover:text-[#2f4823] transition-all duration-300 hover:translate-x-1"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium border-b border-transparent group-hover:border-[#2f4823] transition-all">
            Volver a la Tienda
          </span>
        </button>
      </div>
    </>
  );
};

export default ProductHero;