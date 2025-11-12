import React, { useState } from 'react';
import { contactService } from '../services/contactService';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message_type: 'sugerencia',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await contactService.sendMessage(formData);
            
            if (response.success) {
                setMessage('¡Gracias por tu mensaje! Te responderemos pronto.');
                setFormData({ name: '', email: '', message_type: 'sugerencia', message: '' });
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            setMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-[#f7f2e7]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#2f4823] to-[#1f3219] text-white py-20 px-4 text-center">
                <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
                    Contáctanos
                </h1>
                <div className="mb-6">
                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/30">
                        <span className="text-amber-200">✞</span>
                        Tu Voz Importa
                        <span className="text-amber-200">✞</span>
                    </span>
                </div>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    "Estamos aquí para escucharte, servirte y construirnos juntos"
                </p>
            </div>

            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                        {/* Formulario */}
                        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-8">
                            <h2 className="font-serif font-bold text-2xl text-[#2f4823] mb-6">
                                Envíanos un Mensaje
                            </h2>

                            {/* Mensaje de estado */}
                            {message && (
                                <div className={`p-4 rounded-lg mb-6 ${
                                    message.includes('Error') 
                                        ? 'bg-red-50 text-red-700 border border-red-200' 
                                        : 'bg-green-50 text-green-700 border border-green-200'
                                }`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[#2f4823] font-semibold mb-2">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] transition-all"
                                        placeholder="Tu nombre completo"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#2f4823] font-semibold mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] transition-all"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#2f4823] font-semibold mb-2">
                                        Tipo de Mensaje
                                    </label>
                                    <select
                                        name="message_type"
                                        value={formData.message_type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] transition-all"
                                    >
                                        <option value="sugerencia">Sugerencia</option>
                                        <option value="opinion">Opinión</option>
                                        <option value="oracion">Pedir una oración</option>
                                        <option value="reclamo">Reclamo</option>
                                        <option value="info">Solicitud de Info</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[#2f4823] font-semibold mb-2">
                                        Mensaje *
                                    </label>
                                    <textarea
                                        name="message"
                                        required
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-[#779385]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f4823] transition-all"
                                        placeholder="Escribe tu mensaje aquí..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#2f4823] text-white py-4 rounded-xl font-semibold hover:bg-[#1f3219] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Enviando...' : 'Enviar Mensaje'}
                                </button>
                            </form>
                        </div>

                        {/* Información de contacto */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
                                <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
                                    Información de Contacto
                                </h3>
                                <div className="space-y-3 text-[#2f4823]">
                                    <p>📧 hola@peregrinos.shop</p>
                                    <p>📞 +57 350 527 9066</p>
                                    <p>📍 Bogotá, Colombia</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
                                <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-4">
                                    Horarios de Atención
                                </h3>
                                <div className="space-y-2 text-[#2f4823] text-sm">
                                    <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                                    <p>Sábados: 9:00 AM - 2:00 PM</p>
                                    <p>Domingos: Día del señor</p>
                                </div>
                            </div>

                            {/* Mensaje espiritual */}
                            <div className="bg-[#f7f2e7] rounded-2xl border border-[#779385]/20 p-6 text-center">
                                <p className="text-[#2f4823] italic">
                                    "En todo momento, por medio de la oración y la súplica, con acción de gracias, presenten sus peticiones a Dios"
                                </p>
                                <p className="text-[#779385] text-sm mt-2">Filipenses 4:6</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;