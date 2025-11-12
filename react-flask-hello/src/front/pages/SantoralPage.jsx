import React, { useState, useEffect } from 'react';
import { saintService } from '../services/saintService';
import { useNavigate } from 'react-router-dom';

const SantoralPage = () => {
    const [saints, setSaints] = useState([]);
    const [filteredSaints, setFilteredSaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadSaints();
    }, []);

    useEffect(() => {
        // Filtrar santos cuando cambia el término de búsqueda
        if (searchTerm.trim() === '') {
            setFilteredSaints(saints);
        } else {
            const filtered = saints.filter(saint =>
                saint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (saint.summary && saint.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (saint.feast_day && saint.feast_day.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredSaints(filtered);
        }
    }, [searchTerm, saints]);

    const loadSaints = async () => {
        try {
            setLoading(true);
            const response = await saintService.getSaints();

            if (response.success) {
                setSaints(response.saints);
                setFilteredSaints(response.saints);
            } else {
                setError('Error al cargar el santoral');
            }
        } catch (error) {
            console.error('Error loading saints:', error);
            setError('No se pudo cargar la información');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (dateString && dateString.includes('de')) {
            return dateString;
        }
        return dateString || 'Fecha no especificada';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2f4823] mx-auto mb-4"></div>
                    <p className="text-[#779385] text-lg">Cargando santoral...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
                <div className="text-center max-w-md mx-4">
                    <div className="text-6xl mb-4 text-[#779385]">⚠️</div>
                    <h2 className="text-2xl font-serif font-bold text-[#2f4823] mb-4">Error al cargar</h2>
                    <p className="text-[#779385] mb-6">{error}</p>
                    <button
                        onClick={loadSaints}
                        className="bg-[#2f4823] text-white px-6 py-3 rounded-lg hover:bg-[#1f3219] transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f2e7]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#2f4823] to-[#1f3219] text-white py-20 px-4 text-center">
                <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
                    Santoral
                </h1>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    "Cada santo es una historia única de fe y dedicación que inspira nuestro camino"
                </p>
                <p className="opacity-80 mt-2">Reflexión espiritual</p>
            </div>

            <div className="py-12">
                <div className="container mx-auto px-4">

                    {/* Buscador */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar santos por nombre, fecha o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 pl-14 bg-white border border-[#779385]/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2f4823]/50 focus:border-[#2f4823] text-[#2f4823] placeholder-[#779385]/60 font-serif text-lg"
                            />
                            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#779385]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#779385] hover:text-[#2f4823] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {searchTerm && (
                            <p className="text-center text-[#779385] mt-3">
                                {filteredSaints.length === 0 ? 'No se encontraron santos' : `${filteredSaints.length} santo${filteredSaints.length !== 1 ? 's' : ''} encontrado${filteredSaints.length !== 1 ? 's' : ''}`}
                            </p>
                        )}
                    </div>

                    {/* Introducción */}
                    <div className="text-center mb-12">
                        <p className="text-xl text-[#779385] max-w-2xl mx-auto">
                            Descubre las vidas ejemplares que iluminan nuestro camino con su ejemplo de virtud y entrega
                        </p>
                    </div>

                    {/* Grid de Santos */}
                    {filteredSaints.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4 text-[#779385]">🔍</div>
                            <h3 className="text-xl font-semibold text-[#2f4823] mb-2">
                                {searchTerm ? 'No se encontraron resultados' : 'Santoral en preparación'}
                            </h3>
                            <p className="text-[#779385]">
                                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Estamos trabajando en contenido inspirador para ti'}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 bg-[#2f4823] text-white px-6 py-2 rounded-lg hover:bg-[#1f3219] transition-colors"
                                >
                                    Ver todos los santos
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {filteredSaints.map((saint) => (
                                <div key={saint.id} className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 overflow-hidden hover:shadow-md transition-shadow group">
                                    <div className="h-48 bg-[#f7f2e7] overflow-hidden">
                                        <img
                                            src={saint.image || 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=400&fit=crop'}
                                            alt={saint.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=400&fit=crop';
                                            }}
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-2 line-clamp-2">
                                            {saint.name}
                                        </h3>
                                        <p className="text-[#779385] text-sm mb-3 font-medium">
                                            ✨ {formatDate(saint.feast_day)}
                                        </p>
                                        <p className="text-[#2f4823] text-sm leading-relaxed line-clamp-3">
                                            {saint.summary}
                                        </p>
                                        <button
                                            onClick={() => navigate(`/saint/${saint.id}`)}
                                            className="w-full mt-4 bg-[#2f4823] text-white py-2 rounded-lg font-semibold hover:bg-[#1f3219] transition-colors group-hover:scale-105 transform transition-transform"
                                        >
                                            Conocer Historia
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Mensaje espiritual */}
                    <div className="text-center mt-12">
                        <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-8 max-w-2xl mx-auto">
                            <p className="text-[#2f4823] italic text-lg mb-4">
                                "La verdadera grandeza se encuentra en las acciones simples realizadas con amor extraordinario"
                            </p>
                            <p className="text-[#779385] text-sm">
                                Reflexión diaria
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SantoralPage;