import React from 'react';
import stella2 from '../assets/img/aboutSection/stella2.webp';

export const AboutSection = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl mx-4 my-8">
      
      {/* Imagen de fondo CON overlay verde */}
      <div className="absolute inset-0 z-0">
        <img 
          src={stella2} 
          alt="Familia Peregrinos" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2f4823] opacity-60 rounded-3xl"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-8">
          Una Familia, <span className="text-[#f7f2e7]">Una Misión</span>
        </h2>

        {/* Introducción */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <p className="text-lg md:text-xl text-white leading-relaxed mb-6">
            Somos una familia católica que ha decidido entrelazar 
            <span className="text-[#f7f2e7] font-semibold"> la necesidad del sustento diario </span>
            con el llamado a 
            <span className="text-[#f7f2e7] font-semibold"> la evangelización</span>.
          </p>
          
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            En medio de nuestros desafíos, encontramos en la ropa católica 
            no solo un medio de vida, sino un 
            <span className="text-[#f7f2e7] font-semibold"> instrumento para tocar almas </span> 
            y sembrar semillas de fe.
          </p>
        </div>

        {/* Botón */}
        <div className="mt-8">
          <button className="bg-[#f7f2e7] hover:bg-white text-[#2f4823] font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg shadow-lg">
            Conoce Nuestra Historia
          </button>
        </div>

      </div>
    </section>
  );
};