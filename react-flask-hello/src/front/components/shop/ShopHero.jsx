import React from 'react';

const ShopHero = ({ 
  title = "Tienda Católica",
  subtitle = "Viste tu fe con modesta elegancia y significado espiritual",
  verse = "Vístanse con la armadura de Dios",
  verseLocation = "Efesios 6:11"
}) => {
  return (
    <div className="relative bg-gradient-to-br opacity-90 from-[#2f4823] to-[#1f3219] text-[#f0f4f0] py-20 px-4 overflow-hidden">
      
      {/* Fondos decorativos */}
      <div className="absolute inset-0 opacity-10">
        {/* Patrón de cruces sutiles */}
        <div className="absolute top-10 left-10 text-4xl">✞</div>
        <div className="absolute top-20 right-20 text-3xl">✝</div>
        <div className="absolute bottom-16 left-1/4 text-2xl">✟</div>
        <div className="absolute bottom-20 right-16 text-3xl">✞</div>
        <div className="absolute top-1/2 left-16 text-2xl">†</div>
      </div>

      {/* Líneas decorativas */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#779385]"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#779385]"></div>
      
      <div className="relative max-w-6xl mx-auto text-center">
        
        {/* Badge superior */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 bg-[#779385]/30 backdrop-blur-sm text-[#f0f4f0] px-6 py-3 rounded-full text-sm font-semibold border border-[#779385]/40">
            <span className="text-[#e8f0e8]">✞</span>
            Moda con Propósito Espiritual
            <span className="text-[#e8f0e8]">✞</span>
          </span>
        </div>
        
        {/* Título principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-serif">
          {title}
        </h1>
        
        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-[#f0f4f0]/90 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
          {subtitle}
        </p>
        
        {/* Versículo bíblico */}
        <div className="bg-[#779385]/30 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-[#779385]/40 shadow-lg">
          <div className="text-[#f0f4f0] text-lg italic mb-3 leading-relaxed">
            "{verse}"
          </div>
          <div className="text-[#e8f0e8] font-semibold text-sm tracking-wide">
            {verseLocation}
          </div>
        </div>

        {/* Elementos decorativos inferiores */}
        <div className="mt-12 flex justify-center items-center gap-8 text-[#779385]">
          <div className="w-12 h-px bg-[#779385]/50"></div>
          <span className="text-[#779385]">†</span>
          <div className="w-12 h-px bg-[#779385]/50"></div>
        </div>
      </div>

      {/* Olas decorativas en la parte inferior */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-12 text-[#f8faf8] fill-current"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
          opacity=".25" 
          className="shape-fill"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
          opacity=".5" 
          className="shape-fill"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
          className="shape-fill"></path>
        </svg>
      </div>
    </div>
  );
};

export default ShopHero;