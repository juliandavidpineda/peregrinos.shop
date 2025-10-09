import React from 'react';
import san_jose from '../assets/img/hero/san_jose.webp'

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden rounded-b-3xl">

      {/* Video de Fondo */}
      <div className="absolute inset-0 z-0">
        <div className="bg-[#2f4823] opacity-50 absolute inset-0 z-10"></div>
          {/* imagen temporal */}
          <img 
            src={san_jose} 
            alt="San José - Peregrinos Shop"
            className='w-full h-full object-cover'
          />

        {/* <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-person-sewing-with-a-sewing-machine-41537-large.mp4" 
            type="video/mp4" />
        </video> */}
      </div>

      {/* Contenido Principal */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        {/* Badge Artesanal */}
        <div className="inline-flex items-center bg-[#f7f2e7] text-[#2f4823] px-6 py-3 rounded-full mb-8 shadow-lg">
          <span className="w-2 h-2 bg-[#779385] rounded-full mr-2 animate-pulse"></span>
          <span className="font-semibold">Hecho a Mano • 100% Algodón</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif leading-tight">
          No es <span className="italic font-normal">moda</span>
          <br />
          <span className="text-[#f7f2e7]">
            es <span className="text-[#c08410]">Fe</span> en
          </span>
          <br />
          <span className="text-[#c08410]">Acción</span>
        </h1>

        {/* Descripción */}
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Confeccionamos  <span className="text-[#f7f2e7] font-semibold"> símbolos de fe </span>
          con amor católico, oración y algodón 100% puro.
          <span className="block mt-2">Tu estilo, tu credo, tu legado.</span>
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button className="bg-[#f7f2e7] text-[#2f4823] hover:bg-white hover:scale-105 transform transition-all duration-300 font-bold text-lg px-12 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
            <span>🛍️</span>
            <span>Descubrir Colección</span>
          </button>

          <button className="border-2 border-white text-white hover:bg-white hover:text-[#2f4823] transform hover:scale-105 transition-all duration-300 font-bold text-lg px-12 py-4 rounded-2xl flex items-center space-x-3">
            <span>📖</span>
            <span>Nuestra Historia</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          {[
            { number: '100%', label: 'Algodón Natural' },
            { number: '8', label: 'Tintas Artesanales' },
            { number: '1K+', label: 'Almas Impactadas' },
            { number: '☆5.0', label: 'Calificación' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-sm text-white/70 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>

    </section>
  );
};