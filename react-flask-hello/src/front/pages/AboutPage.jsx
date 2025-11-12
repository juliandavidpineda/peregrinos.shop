import React from 'react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#f7f2e7]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#2f4823] to-[#1f3219] text-white py-20 px-4 text-center rounded-b-lg">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif leading-tight">
 
  <br />
  <span className="text-[#f7f2e7]">
    De <span className="text-[#c08410]">Heridas</span> a
  </span>
  <br />
  <span className="text-[#c08410]">Esperanza</span>
</h1>
                <div className="mb-6">
                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30">
                        <span className="text-amber-200">✞</span>
                        Una Familia en Búsqueda
                        <span className="text-amber-200">✞</span>
                    </span>
                </div>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    "Ustedes no me eligieron a mí; soy yo quien los ha elegido a ustedes" - Juan 15:16
                </p>
            </div>

            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">

                        {/* Introducción familiar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-8 mb-8 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="bg-amber-100 text-amber-800 px-6 py-3 rounded-full text-sm font-semibold">
                                    👨‍👩‍👧‍👦 Familia con 3 hijos en la tierra y 1 en el cielo
                                </div>
                            </div>
                            <p className="text-[#2f4823] text-lg leading-relaxed">
                                Nuestra historia no es la de emprendedores expertos, sino la de <strong>una familia en búsqueda, </strong> 
                                cuyo camino espiritual ha sido marcado por heridas, búsquedas y finalmente, <strong>encuentro</strong>.
                            </p>
                        </div>

                        {/* El Camino de Búsqueda */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-8 mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-600 text-xl">🛤️</span>
                                </div>
                                <h2 className="font-serif font-bold text-2xl text-[#2f4823]">El Camino de Búsqueda</h2>
                            </div>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-[#2f4823] text-lg leading-relaxed mb-6">
                                    Durante años, exploramos diferentes corrientes espirituales buscando respuestas para nuestro corazón inquieto. 
                                    Cada búsqueda, aunque sincera, dejaba <strong>heridas que nos hacían sentir más lejos de Dios</strong>. 
                                    Eran caminos que prometían paz pero nos dejaban vacíos.
                                </p>
                                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                                    <p className="text-amber-800 italic">
                                        "Buscábamos en muchos lugares lo que solo podía encontrarse en Uno"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* El Encuentro Inesperado */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-8 mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-xl">✨</span>
                                </div>
                                <h2 className="font-serif font-bold text-2xl text-[#2f4823]">El Encuentro Inesperado</h2>
                            </div>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-[#2f4823] text-lg leading-relaxed mb-6">
                                    En medio de nuestra confusión, <strong>la Iglesia Católica</strong> se nos reveló no como una institución más, 
                                    sino como <strong>casa y hospital</strong>. Aquí encontramos lo que tanto buscábamos:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <span className="text-green-600">⛪</span>
                                        <span className="text-[#2f4823] font-medium">Sacramentos que sanan</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <span className="text-green-600">🤝</span>
                                        <span className="text-[#2f4823] font-medium">Comunidad que acoge</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <span className="text-green-600">📜</span>
                                        <span className="text-[#2f4823] font-medium">Tradición que une</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <span className="text-green-600">🔓</span>
                                        <span className="text-[#2f4823] font-medium">Verdad que libera</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* El Nacimiento de Peregrinos */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-8 mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-xl">🕊️</span>
                                </div>
                                <h2 className="font-serif font-bold text-2xl text-[#2f4823]">El Nacimiento de Peregrinos</h2>
                            </div>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-[#2f4823] text-lg leading-relaxed mb-6">
                                    De esta <strong>conversión nació Peregrinos.shop</strong>. No como un negocio, sino como <strong>extensión de nuestro camino de fe</strong>. 
                                    Cada prenda representa una parte de nuestra historia:
                                </p>
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <span className="text-amber-600 mt-1">💖</span>
                                        <div>
                                            <strong className="text-[#2f4823]">Sanación</strong> de nuestras propias heridas espirituales
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-600 mt-1">🎉</span>
                                        <div>
                                            <strong className="text-[#2f4823]">Alegría</strong> de haber encontrado el camino de regreso a casa
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-blue-600 mt-1">📣</span>
                                        <div>
                                            <strong className="text-[#2f4823]">Testimonio</strong> que la belleza de la fe puede vestirse con dignidad
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-purple-600 mt-1">🌟</span>
                                        <div>
                                            <strong className="text-[#2f4823]">Esperanza</strong> para otros que, como nosotros, buscan con corazón sincero
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nuestra Misión Hoy */}
                        <div className="bg-gradient-to-br from-[#2f4823] to-[#1f3219] rounded-2xl p-8 mb-8 text-white">
                            <h2 className="font-serif font-bold text-2xl mb-4 text-center">Nuestra Misión Hoy</h2>
                            <p className="text-xl text-center leading-relaxed opacity-90">
                                <strong>No vendemos productos; compartimos nuestro camino.</strong><br />
                                Cada diseño nace de la oración, cada detalle lleva nuestra historia de conversión,<br />
                                y cada prenda es una invitación a <strong>vestir la fe con la alegría de quien ha sido encontrado</strong>.
                            </p>
                        </div>

                        {/* Valores transformados */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
                                <div className="text-3xl text-amber-600 mb-3">🛤️</div>
                                <h3 className="font-serif font-bold text-lg text-[#2f4823] mb-2">Búsqueda</h3>
                                <p className="text-[#779385] text-sm">
                                    Entendemos el corazón que busca significado espiritual
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
                                <div className="text-3xl text-green-600 mb-3">💖</div>
                                <h3 className="font-serif font-bold text-lg text-[#2f4823] mb-2">Sanación</h3>
                                <p className="text-[#779385] text-sm">
                                    Creemos en el poder transformador del encuentro con Dios
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6 text-center">
                                <div className="text-3xl text-blue-600 mb-3">🕊️</div>
                                <h3 className="font-serif font-bold text-lg text-[#2f4823] mb-2">Testimonio</h3>
                                <p className="text-[#779385] text-sm">
                                    Compartimos nuestra historia para inspirar a otros
                                </p>
                            </div>
                        </div>

                        {/* Mensaje final */}
                        <div className="bg-[#f7f2e7] rounded-2xl border border-[#779385]/20 p-8 text-center">
                            <p className="text-[#2f4823] italic text-lg mb-4">
                                "El que cree en mí, como dice la Escritura, de su interior correrán ríos de agua viva"
                            </p>
                            <p className="text-[#779385]">Juan 7:38</p>
                            <div className="mt-4 pt-4 border-t border-[#779385]/20">
                                <p className="text-[#779385] text-sm">
                                    Con amor,<br />
                                    <strong>La Familia Peregrinos</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;