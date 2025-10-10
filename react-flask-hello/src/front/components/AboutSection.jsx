import React, { useState, useEffect, useRef } from 'react';
import stella2 from '../assets/img/aboutSection/stella2.webp';

export const AboutSection = () => {
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = -rect.top;
        setOffset(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden rounded-3xl mx-4 my-8"
    >

      {/* Contenedor Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <div
          className="absolute w-full inset-0"
          style={
            isMobile
              ? {
                // Estrategia móvil: transform con contenedor más grande
                height: '130%',
                top: '-15%',
                backgroundImage: `url(${stella2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                transform: `translateY(${offset * 0.4}px)`,
                willChange: 'transform'
              }
              : {
                // Estrategia desktop: tamaño personalizado 120%
                height: '100%',
                top: '0',
                backgroundImage: `url(${stella2})`,
                backgroundSize: '50%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `center calc(50% + ${offset * 0.3}px)`,
                willChange: 'background-position'
              }
          }
        />
        <div className="absolute inset-0 bg-[#2f4823] opacity-80 rounded-3xl"></div>
      </div>

      {/* Contenido */}
      <div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8"
      >

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-serif mb-6 md:mb-8">
          Una Familia, <span className="text-[#f7f2e7]">Una Misión</span>
        </h2>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
          <p className="text-base md:text-lg lg:text-xl text-white leading-relaxed mb-4 md:mb-6">
            Somos una familia católica con un propósito claro:
            <span className="text-[#f7f2e7] font-semibold"> hacer visible la fe en lo cotidiano</span>.
          </p>

          <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed">
            Creemos que cada prenda puede ser un
            <span className="text-[#f7f2e7] font-semibold"> testimonio silencioso</span>,
            una invitación a la reflexión, un puente entre quien la viste y quienes la ven,
            <span className="text-[#f7f2e7] font-semibold"> sembrando preguntas que abren puertas al Evangelio</span>.
          </p>
        </div>

        <div className="mt-6 md:mt-8">
          <button className="bg-[#f7f2e7] hover:bg-white text-[#2f4823] font-bold py-3 md:py-4 px-6 md:px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 text-base md:text-lg shadow-lg">
            Conoce Nuestra Historia
          </button>
        </div>

      </div>
    </section>
  );
};