import React from 'react';

export const ProductGrid = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Camiseta San José",
      price: 145000,
      image: "/assets/images/products/san-jose.webp",
      description: "Algodón 100% • Serigrafía artesanal",
      badge: "Más Vendido"
    },
    {
      id: 2,
      name: "Sudadera Virgen María",
      price: 185000,
      image: "/assets/images/products/virgen-maria.webp",
      description: "Algodón premium • Bordado especial",
      badge: "Nuevo"
    },
    {
      id: 3,
      name: "Camiseta Jesús Misericordioso",
      price: 148000,
      image: "/assets/images/products/jesus-misericordioso.webp",
      description: "Algodón 100% • Diseño exclusivo",
      badge: "En Oferta"
    },
    {
      id: 4,
      name: "Camiseta Ángel de la Guarda",
      price: 142000,
      image: "/assets/images/products/angel-guarda.webp",
      description: "Algodón suave • Perfecta para niños",
      badge: "Popular"
    }
  ];

  return (
    <section className="py-20 bg-[#f7f2e7] rounded-3xl mx-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2f4823] font-serif mb-6">
            Nuestra <span className="text-[#779385]">Colección</span>
          </h2>
          <p className="text-xl text-[#2f4823]/80 max-w-2xl mx-auto">
            Piezas únicas confeccionadas con devoción y el mejor algodón natural
          </p>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group"
            >
              
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#2f4823] text-white px-3 py-1 rounded-full text-xs font-bold">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Imagen del Producto */}
              <div className="relative overflow-hidden">
                <div className="h-80 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">🖼️ Imagen de {product.name}</span>
                </div>
                {/* <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                /> */}
                
                {/* Overlay de Acciones */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="bg-[#f7f2e7] text-[#2f4823] hover:bg-white transform hover:scale-110 transition-all duration-300 font-bold py-3 px-6 rounded-2xl shadow-lg">
                    Ver Detalles
                  </button>
                </div>
              </div>

              {/* Información del Producto */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2f4823] mb-2 font-serif">
                  {product.name}
                </h3>
                <p className="text-[#779385] text-sm mb-4">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#2f4823]">
                    ${product.price.toLocaleString()}
                  </span>
                  <button className="bg-[#2f4823] hover:bg-[#1f371c] text-white p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg">
                    <span className="text-lg">🛒</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón Ver Todos */}
        <div className="text-center mt-12">
          <button className="bg-[#2f4823] hover:bg-[#1f371c] text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
            Ver Colección Completa
          </button>
        </div>

      </div>
    </section>
  );
};