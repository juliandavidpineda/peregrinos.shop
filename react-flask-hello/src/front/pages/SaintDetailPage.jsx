import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saintService } from '../services/saintService';

const SaintDetailPage = () => {
    const { saintId } = useParams();
    const navigate = useNavigate();
    const [saint, setSaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [featuredSaints, setFeaturedSaints] = useState([]);

    useEffect(() => {
        loadSaintData();
        loadFeaturedSaints();
    }, [saintId]);

    const loadSaintData = async () => {
        try {
            setLoading(true);
            const response = await saintService.getSaint(saintId);
            
            if (response.success) {
                setSaint(response.saint);
            } else {
                setError('Santo no encontrado');
            }
        } catch (error) {
            console.error('Error loading saint:', error);
            setError('Error al cargar la información del santo');
        } finally {
            setLoading(false);
        }
    };

    const loadFeaturedSaints = async () => {
        try {
            const response = await saintService.getFeaturedSaints();
            if (response.success) {
                setFeaturedSaints(response.saints.slice(0, 3)); // Solo 3 santos destacados
            }
        } catch (error) {
            console.error('Error loading featured saints:', error);
        }
    };

    const formatDate = (dateString) => {
        if (dateString && dateString.includes('de')) {
            return dateString;
        }
        return dateString || 'No especificada';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2f4823] mx-auto mb-4"></div>
                    <p className="text-[#779385] text-lg">Cargando información...</p>
                </div>
            </div>
        );
    }

    if (error || !saint) {
        return (
            <div className="min-h-screen bg-[#f7f2e7] flex items-center justify-center">
                <div className="text-center max-w-md mx-4">
                    <div className="text-6xl mb-4 text-[#779385]">📖</div>
                    <h2 className="text-2xl font-serif font-bold text-[#2f4823] mb-4">Santo no encontrado</h2>
                    <p className="text-[#779385] mb-6">{error || 'El santo que buscas no existe'}</p>
                    <button 
                        onClick={() => navigate('/santoral')}
                        className="bg-[#2f4823] text-white px-6 py-3 rounded-lg hover:bg-[#1f3219] transition-colors"
                    >
                        Volver al Santoral
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f2e7]">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#2f4823] to-[#1f3219] text-white py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <button 
                        onClick={() => navigate('/santoral')}
                        className="flex items-center gap-2 text-[#779385] hover:text-white transition-colors mb-6"
                    >
                        ← Volver al Santoral
                    </button>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Imagen */}
                        <div className="flex justify-center">
                            <img
                                src={saint.image || 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=500&fit=crop'}
                                alt={saint.name}
                                className="w-full max-w-md h-96 object-cover rounded-2xl shadow-lg"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=500&fit=crop';
                                }}
                            />
                        </div>

                        {/* Información principal */}
                        <div className="text-center lg:text-left">
                            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
                                {saint.name}
                            </h1>
                            
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                                <p className="text-xl mb-4">✨ <strong>Festividad:</strong> {formatDate(saint.feast_day)}</p>
                                
                                {saint.birth_date && (
                                    <p className="text-lg mb-2">📅 <strong>Nacimiento:</strong> {formatDate(saint.birth_date)}</p>
                                )}
                                
                                {saint.death_date && (
                                    <p className="text-lg mb-2">✝️ <strong>Fallecimiento:</strong> {formatDate(saint.death_date)}</p>
                                )}
                                
                                {saint.canonization_date && (
                                    <p className="text-lg mb-2">🌟 <strong>Canonización:</strong> {formatDate(saint.canonization_date)}</p>
                                )}
                                
                                {saint.patronage && (
                                    <p className="text-lg">🛡️ <strong>Patronazgo:</strong> {saint.patronage}</p>
                                )}
                            </div>

                            <p className="text-xl opacity-90 leading-relaxed">
                                {saint.summary}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="py-12">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Biografía */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-8">
                                <h2 className="font-serif font-bold text-2xl text-[#2f4823] mb-6">Biografía</h2>
                                
                                {saint.biography ? (
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-[#2f4823] leading-relaxed whitespace-pre-line">
                                            {saint.biography}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-[#779385] text-lg">Biografía en preparación</p>
                                        <p className="text-[#779385] text-sm mt-2">
                                            Estamos trabajando en contenido más detallado
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Santos destacados sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
                                <h3 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Santos Destacados</h3>
                                
                                {featuredSaints.length > 0 ? (
                                    <div className="space-y-4">
                                        {featuredSaints.map((featuredSaint) => (
                                            <div 
                                                key={featuredSaint.id}
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f7f2e7] transition-colors cursor-pointer"
                                                onClick={() => navigate(`/saint/${featuredSaint.id}`)}
                                            >
                                                <img
                                                    src={featuredSaint.image || 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=100&h=100&fit=crop'}
                                                    alt={featuredSaint.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-semibold text-[#2f4823] text-sm">
                                                        {featuredSaint.name}
                                                    </p>
                                                    <p className="text-[#779385] text-xs">
                                                        {formatDate(featuredSaint.feast_day)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[#779385] text-sm text-center py-4">
                                        Cargando santos destacados...
                                    </p>
                                )}
                            </div>

                            {/* Mensaje inspirador */}
                            <div className="bg-[#2f4823] text-white rounded-2xl p-6 text-center">
                                <p className="italic mb-2">
                                    "La santidad no es un lujo para pocos, sino una vocación para todos"
                                </p>
                                <p className="text-sm opacity-80">Reflexión espiritual</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaintDetailPage;