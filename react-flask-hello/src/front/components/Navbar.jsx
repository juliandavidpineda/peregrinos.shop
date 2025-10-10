import React, { useState } from 'react';
import logo_blanco from '../assets/img/branding/logo_blanco.png'
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-[#f7f2e7] border-b border-[#2f4823]/20 sticky top-0 z-50 transition-all duration-300 shadow-sm rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo - Con rounded y color principal */}
          <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-[#2f4823] text-white px-4 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={logo_blanco}
                alt="Peregrinos Shop"
                className='h-12 w-auto'
                onClick={() => navigate('/#')}
              />
            </div>
          </div>

          {/* Menú Desktop - Con rounded y color principal */}
          <div className="hidden md:flex space-x-4">
            {[
              { name: 'Inicio', path: '/' },
              { name: 'Tienda', path: '/shop-page' },
              { name: 'Nuestra Historia', path: '/about' },
              { name: 'Santoral', path: '/santoral' },
              { name: 'Contacto', path: '/contact' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white font-medium transition-all duration-300 relative group px-4 py-2 rounded-xl"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#2f4823] transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </button>
            ))}
          </div>

          {/* Iconos - Con rounded y color principal */}
          <div className="flex items-center space-x-3">
            <button className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-110 transition-all duration-300 p-3 rounded-2xl border border-[#2f4823]/30 hover:border-transparent">
              <span className="text-lg">🔍</span>
            </button>
            <button className="text-[#2f4823] hover:bg-[#2f4823] hover:text-white transform hover:scale-110 transition-all duration-300 p-3 rounded-2xl border border-[#2f4823]/30 hover:border-transparent relative group">
              <span className="text-lg">🛒</span>
              <span className="absolute -top-1 -right-1 bg-[#779385] text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold transform group-hover:scale-110 group-hover:bg-white group-hover:text-[#2f4823] transition-all duration-300 shadow-lg">
                0
              </span>
            </button>

            {/* Botón Menú Mobile */}
            <button
              className="md:hidden text-[#2f4823] hover:bg-[#2f4823] hover:text-white p-3 rounded-2xl border border-[#2f4823]/30 hover:border-transparent transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Menú Mobile - Con rounded y color principal */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="py-4 space-y-2 bg-white/90 backdrop-blur-sm rounded-2xl mt-3 border border-[#2f4823]/20 shadow-lg">
            {['Inicio', 'Productos', 'Nuestra Historia', 'Santoral', 'Contacto'].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-[#2f4823] hover:bg-[#2f4823] hover:text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-3 mx-2"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};