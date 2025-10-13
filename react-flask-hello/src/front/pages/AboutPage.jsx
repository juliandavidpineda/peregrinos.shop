import React from 'react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#f7f2e7]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#2f4823] to-[#1f3219] text-white py-20 px-4 text-center rounded-b-lg

">
                <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
                    Nuestra Historia
                </h1>
                <div className="mb-6">
                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30">
                        <span className="text-amber-200">✞</span>
                        Fe en Acción
                        <span className="text-amber-200">✞</span>
                    </span>
                </div>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    "Cada prenda cuenta una historia de fe, conversión y propósito espiritual"
                </p>
            </div>
            

            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">

                        {/* Historia principal */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-8 mb-8">
                            <div className="prose prose-lg max-w-none">
                                <p className="text-[#2f4823] text-lg leading-relaxed mb-6">
                                    Todo comenzó como un pequeño llamado en el corazón. Una inquietud espiritual
                                    que nos llevó a buscar más significado en nuestra vida diaria. Lo que empezó
                                    como una búsqueda personal se transformó en una misión compartida.
                                </p>

                                <p className="text-[#2f4823] text-lg leading-relaxed mb-6">
                                    En medio de un mundo que a menudo prioriza lo material, descubrimos la belleza
                                    de vestir nuestra fe. Cada prenda se convirtió en una oportunidad para expresar
                                    nuestra identidad católica con modestia y elegancia.
                                </p>

                                <p className="text-[#2f4823] text-lg leading-relaxed">
                                    Hoy, nuestra tienda es más que un negocio; es una comunidad de personas que
                                    buscan integrar su fe en cada aspecto de la vida, empezando por cómo se visten
                                    y cómo se presentan ante el mundo.
                                </p>
                            </div>
                        </div>

                        {/* Valores */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
                                <div className="text-3xl text-[#2f4823] mb-3">✞</div>
                                <h3 className="font-serif font-bold text-lg text-[#2f4823] mb-2">Fe</h3>
                                <p className="text-[#779385] text-sm">
                                    Cada producto está inspirado en valores católicos
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
                                <div className="text-3xl text-[#2f4823] mb-3">❤️</div>
                                <h3 className="font-serif font-bold text-lg text-[#2f4823] mb-2">Amor</h3>
                                <p className="text-[#779385] text-sm">
                                    Servimos con amor a nuestra comunidad espiritual
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
                                <div className="text-3xl text-[#2f4823] mb-3">🌱</div>
                                <h3 className="font-serif font-bold text-lg text-[#2f4823] mb-2">Esperanza</h3>
                                <p className="text-[#779385] text-sm">
                                    Creemos en un futuro lleno de bendiciones
                                </p>
                            </div>
                        </div>

                        {/* Mensaje final */}
                        <div className="bg-[#f7f2e7] rounded-2xl border border-[#779385]/20 p-8 text-center">
                            <p className="text-[#2f4823] italic text-lg mb-4">
                                "Porque nosotros somos colaboradores de Dios, y vosotros sois labranza de Dios, edificio de Dios"
                            </p>
                            <p className="text-[#779385]">1 Corintios 3:9</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;