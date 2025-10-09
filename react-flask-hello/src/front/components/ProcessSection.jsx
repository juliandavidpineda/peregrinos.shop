import React from 'react';
// import materialesImg from '../assets/img/process/algodon.jpg';
// import artistaImg from '../assets/img/process/artista.jpg';
// import serigrafiaImg from '../assets/img/process/serigrafia.jpg';

export const ProcessSection = () => {
  const sections = [
    {
      //image: materialesImg,
      title: "Materiales de las Prendas",
      description: "Algodón 100% natural de la más alta calidad",
      details: [
        "Tejido suave y respirable",
        "Hipoalergénico y durable", 
        "Cuidado con el medio ambiente",
        "Comodidad que honra la creación"
      ]
    },
    {
      //image: artistaImg,
      title: "Creación por Artista Especializada",
      description: "Diseños originales con formación en arquitectura y arte",
      details: [
        "Composición equilibrada y armoniosa",
        "Simbolismo católico bien fundamentado",
        "Cada diseño nace en oración",
        "Arte con propósito evangelizador"
      ]
    },
    {
      //image: serigrafiaImg, 
      title: "Serigrafía Artesanal 8 Tintas",
      description: "Proceso premium para máxima durabilidad y detalle",
      details: [
        "7 capas de color para profundidad",
        "Resistente a lavados repetidos",
        "Colores vibrantes que perduran",
        "Técnica que valora lo artesanal"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2f4823] font-serif mb-4">
            Calidad con <span className="text-[#779385]">Propósito</span>
          </h2>
          <p className="text-xl text-[#2f4823]/80 max-w-2xl mx-auto">
            Cada prenda es el resultado de un proceso cuidadoso que combina fe, arte y artesanía
          </p>
        </div>

        {/* Secciones en Zig-Zag */}
        <div className="space-y-20">
          {sections.map((section, index) => (
            <div 
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-12 items-center`}
            >
              
              {/* Imagen */}
              <div className="lg:w-1/2">
                <div className="bg-gray-200 rounded-2xl overflow-hidden h-80 flex items-center justify-center">
                  <span className="text-gray-400">🖼️ {section.title}</span>
                </div>
                {/* <img 
                  src={section.image} 
                  alt={section.title}
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                /> */}
              </div>

              {/* Contenido */}
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-bold text-[#2f4823] font-serif mb-4">
                  {section.title}
                </h3>
                <p className="text-xl text-[#779385] mb-6 font-medium">
                  {section.description}
                </p>
                <ul className="space-y-3">
                  {section.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-3">
                      <span className="text-[#2f4823] mt-1">✓</span>
                      <span className="text-[#2f4823]/80">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-[#2f4823] hover:bg-[#1f371c] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg">
            Ver Proceso Completo
          </button>
        </div>

      </div>
    </section>
  );
};