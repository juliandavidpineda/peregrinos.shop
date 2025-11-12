import React from 'react';
import logo_blanco from '../assets/img/branding/logo_blanco.png'
import { useNavigate } from 'react-router-dom';


export const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#2f4823] text-white mt-20 rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sección Principal del Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo y Descripción */}
          <div className="md:col-span-2">
            <div className="bg-[#2f4823] text-[#f7f2e7] px-6 py-4 rounded-2xl inline-block mb-6">
              <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300 border rounded-2xl">
                          <div className="bg-[#2f4823] text-white px-4 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <img
                              src={logo_blanco}
                              alt="Peregrinos Shop"
                              className='h-12 w-auto'
                              onClick={() => navigate('/')}
                            />
                          </div>
                        </div>
              <p className="text-sm opacity-80 mt-1 text-center">Vistiendo la Fe con Amor</p>
            </div>
            <p className="text-[#f7f2e7]/80 text-lg leading-relaxed max-w-md">
              Creemos que la moda puede ser una forma de evangelización. Cada prenda está confeccionada con amor, fe y el mejor algodón 100% natural.
            </p>
            
            {/* Redes Sociales */}
            <div className="flex space-x-4 mt-6">
              {['📱', '📷', '📘', '🎵'].map((icon, index) => (
                <button 
                  key={index}
                  className="bg-[#779385] hover:bg-[#f7f2e7] hover:text-[#2f4823] transform hover:scale-110 transition-all duration-300 w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-lg"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
<div>
  <h3 className="text-xl font-bold font-serif mb-6 text-[#f7f2e7]">Navegación</h3>
  <ul className="space-y-3">
    {[
      { name: 'Inicio', path: '/' },
      { name: 'Productos', path: '/shop-page' },
      { name: 'Nuestra Historia', path: '/about' },
      { name: 'Santoral', path: '/santoral' },
      { name: 'Contacto', path: '/contact' }
    ].map((item) => (
      <li key={item.name}>
        <button 
          onClick={() => navigate(item.path)}
          className="text-[#f7f2e7]/80 hover:text-white transition-all duration-300 hover:translate-x-2 block py-1 rounded-lg hover:bg-white/10 px-3 w-full text-left"
        >
          {item.name}
        </button>
      </li>
    ))}
  </ul>
</div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-xl font-bold font-serif mb-6 text-[#f7f2e7]">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-[#f7f2e7]/80">
                <span className="bg-[#779385] w-8 h-8 rounded-lg flex items-center justify-center">📧</span>
                <span>hola@peregrinos.shop</span>
              </div>
              <div className="flex items-center space-x-3 text-[#f7f2e7]/80">
                <span className="bg-[#779385] w-8 h-8 rounded-lg flex items-center justify-center">📞</span>
                <span>+57 350 527 9066</span>
              </div>
              <div className="flex items-center space-x-3 text-[#f7f2e7]/80">
                <span className="bg-[#779385] w-8 h-8 rounded-lg flex items-center justify-center">📍</span>
                <span>Colombia</span>
              </div>
            </div>

            {/* Botón de Oración */}
            <button className="mt-6 bg-[#f7f2e7] text-[#2f4823] hover:bg-white hover:scale-105 transform transition-all duration-300 font-bold py-3 px-6 rounded-2xl shadow-lg w-full"
              onClick={() => navigate('/contact')}
            >
              🙏 Pedir una Oración
            </button>
          </div>
        </div>

        {/* Línea Separadora */}
        <div className="border-t border-[#779385]/30"></div>

        {/* Copyright */}
        <div className="py-8 text-center">
          <p className="text-[#f7f2e7]/60">
            © 2025 Peregrinos.Shop - Todos los derechos reservados. 
            <span className="block mt-2 text-sm">Hecho con ❤️‍🔥 y Fe</span>
            <span className="block mt-2 text-sm">Desarrollado por 🖥️ StormTech</span>
          </p>
        </div>

      </div>
    </footer>
  );
};