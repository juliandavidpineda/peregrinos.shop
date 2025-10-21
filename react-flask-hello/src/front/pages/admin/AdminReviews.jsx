import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import ReviewList from '../../components/admin/reviews/ReviewList';
import ReviewFilters from '../../components/admin/reviews/ReviewFilters';
import ReviewAnalytics from '../../components/admin/reviews/ReviewAnalytics';

const AdminReviews = () => {
  const { user, isSuperAdmin } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [filters, setFilters] = useState({
    status: 'pending',
    page: 1,
    per_page: 10
  });

  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });

  const [analytics, setAnalytics] = useState(null);

  // Cargar reviews
  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getAdminReviews(filters);
      setReviews(response.reviews);
      setPagination({
        page: response.current_page,
        per_page: filters.per_page,
        total: response.total,
        pages: response.pages
      });

      // Calcular estadísticas básicas
      const stats = {
        total: response.total,
        pending: response.reviews.filter(r => !r.is_approved).length,
        approved: response.reviews.filter(r => r.is_approved).length
      };
      
      // Cargar analytics completos para Content Manager+
      if (isSuperAdmin() || user?.role === 'content_manager') {
        const analyticsData = await reviewService.getReviewAnalytics();
        setAnalytics(analyticsData);
      }

    } catch (error) {
      console.error('Error loading reviews:', error);
      setMessage('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [filters]);

  // Manejar cambio de filtros
  const handleFiltersChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1
    }));
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      page: 1,
      per_page: 10
    });
  };

  // Manejar paginación
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Moderar review
  const handleModerate = async (reviewId, approved) => {
    try {
      await reviewService.moderateReview(reviewId, approved);
      setMessage(`Reseña ${approved ? 'aprobada' : 'rechazada'} correctamente`);
      loadReviews(); // Recargar lista
    } catch (error) {
      setMessage('Error al moderar la reseña');
    }
  };

  // Eliminar review
  const handleDelete = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      setMessage('Reseña eliminada correctamente');
      loadReviews(); // Recargar lista
    } catch (error) {
      setMessage('Error al eliminar la reseña');
    }
  };

  // Si no tiene permisos
  if (!user?.role) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-red-600 text-lg mb-2">No autorizado</div>
          <div className="text-gray-500">
            No tienes permisos para acceder a la gestión de reseñas.
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: pagination.total,
    pending: reviews.filter(r => !r.is_approved).length,
    approved: reviews.filter(r => r.is_approved).length
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Reseñas</h1>
          <p className="text-gray-600">Modera y gestiona las reseñas de productos</p>
        </div>
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`p-4 rounded-md mb-6 ${
          message.includes('correctamente') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
          <button 
            onClick={() => setMessage('')}
            className="float-right text-sm font-medium"
          >
            ×
          </button>
        </div>
      )}

      {/* Analytics para Content Manager+ */}
      {(isSuperAdmin() || user?.role === 'content_manager') && (
        <div className="mb-6">
          <ReviewAnalytics analytics={analytics} />
        </div>
      )}

      {/* Filtros */}
      <ReviewFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        stats={stats}
      />

      {/* Lista de Reviews */}
      <ReviewList
        reviews={reviews}
        loading={loading}
        onModerate={handleModerate}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminReviews;