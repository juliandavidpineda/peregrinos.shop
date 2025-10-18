import React, { useState, useEffect } from 'react';
import { orderService } from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderList from './OrderList';
import OrderFilters from './OrderFilters';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token || !isAuthenticated) {
        navigate('/admin/login');
        return;
      }

      const result = await orderService.getAllOrders(token);
      const ordersData = result.orders || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await orderService.updateOrderStatus(orderId, newStatus, token);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar el estado');
    }
  };

  const handleFilterChange = (filteredData) => {
    setFilteredOrders(filteredData);
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-2xl mb-4">⏳</div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#2f4823]">Gestión de Órdenes</h1>
          <p className="text-[#779385] text-sm">
            Conectado como: {user?.email} • {orders.length} órdenes totales
          </p>
        </div>
        <button 
          onClick={fetchOrders}
          className="bg-[#779385] text-white px-4 py-2 rounded hover:bg-[#5a7265] transition-colors flex items-center gap-2"
        >
          <span>🔄</span>
          Actualizar
        </button>
      </div>

      <OrderFilters 
        orders={orders} 
        onFilterChange={handleFilterChange}
      />

      <OrderList 
        orders={filteredOrders}
        loading={loading}
        onStatusUpdate={updateStatus}
        onRefresh={fetchOrders}
      />
    </div>
  );
};

export default AdminOrders;