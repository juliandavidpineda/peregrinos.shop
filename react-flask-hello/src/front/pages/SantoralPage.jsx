import React from 'react';

const SantoralPage = () => {
    const saints = [
        {
            id: 1,
            name: "San Francisco de Asís",
            feastDay: "4 de Octubre",
            summary: "Fundador de la orden franciscana, patrono de los animales y la ecología.",
            image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=400&fit=crop"
        },
        {
            id: 2,
            name: "Santa Teresa de Calcuta",
            feastDay: "5 de Septiembre",
            summary: "Misionera de la caridad, dedicada a servir a los más pobres.",
            image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=400&fit=crop"
        },
        {
            id: 3,
            name: "San Juan Pablo II",
            feastDay: "22 de Octubre",
            summary: "El Papa peregrino, promotor del amor y la misericordia divina.",
            image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=400&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f7f2e7]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#2f4823] to-[#1f3219] text-white py-20 px-4 text-center">
                <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
                    Santoral Católico
                </h1>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    "Los santos son el espejo en que se mira la Iglesia para caminar hacia la santidad"
                </p>
                <p className="opacity-80 mt-2">Papa Francisco</p>
            </div>

            <div className="py-12">
                <div className="container mx-auto px-4">

                    {/* Introducción */}
                    <div className="text-center mb-12">
                        <p className="text-xl text-[#779385] max-w-2xl mx-auto">
                            Descubre las vidas ejemplares de los santos que iluminan nuestro camino de fe
                        </p>
                    </div>

                    {/* Grid de Santos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {saints.map((saint) => (
                            <div key={saint.id} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 overflow-hidden hover:shadow-md transition-shadow">
                                <img
                                    src={saint.image}
                                    alt={saint.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-2">
                                        {saint.name}
                                    </h3>
                                    <p className="text-[#779385] text-sm mb-3">
                                        Fiesta: {saint.feastDay}
                                    </p>
                                    <p className="text-[#2f4823] text-sm leading-relaxed">
                                        {saint.summary}
                                    </p>
                                    <button className="w-full mt-4 bg-[#2f4823] text-white py-2 rounded-lg font-semibold hover:bg-[#1f3219] transition-colors">
                                        Leer Biografía
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mensaje espiritual */}
                    <div className="text-center mt-12">
                        <p className="text-[#2f4823] italic text-lg">
                            "Los santos nos muestran que la santidad es posible para todos"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SantoralPage;