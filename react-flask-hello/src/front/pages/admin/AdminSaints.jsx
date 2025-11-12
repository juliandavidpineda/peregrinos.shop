import React, { useState, useEffect } from 'react';
import { saintService } from '../../services/saintService';
import SaintForm from '../../components/admin/SaintForm';

const AdminSaints = () => {
    const [saints, setSaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSaint, setEditingSaint] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadSaints();
    }, []);

    const loadSaints = async () => {
        try {
            setLoading(true);
            const response = await saintService.getSaints();
            if (response.success) {
                setSaints(response.saints);
            }
        } catch (error) {
            console.error('Error loading saints:', error);
            setMessage('Error al cargar la lista');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingSaint(null);
        setShowForm(true);
    };

    const handleEdit = async (saint) => {
        try {
            console.log('🔍 Editando santo con ID:', saint.id);

            // ✅ CARGAR DATOS COMPLETOS del endpoint individual
            const response = await saintService.getSaint(saint.id);

            if (response.success) {
                console.log('✅ Datos completos del santo:', response.saint);
                setEditingSaint(response.saint);
                setShowForm(true);
            } else {
                console.error('❌ Error cargando datos completos del santo');
                setEditingSaint(saint); // Fallback a datos básicos
                setShowForm(true);
            }
        } catch (error) {
            console.error('❌ Error cargando santo para editar:', error);
            setEditingSaint(saint); // Fallback a datos básicos
            setShowForm(true);
        }
    };

    const handleDelete = async (saintId, saintName) => {
        if (!window.confirm(`¿Estás seguro de eliminar a ${saintName}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await saintService.deleteSaint(saintId, token);

            if (response.success) {
                setMessage(`${saintName} eliminado correctamente`);
                loadSaints();
            }
        } catch (error) {
            console.error('Error deleting saint:', error);
            setMessage('Error al eliminar');
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingSaint(null);
    };

    const handleFormSuccess = () => {
        setMessage(editingSaint ? 'Santo actualizado correctamente' : 'Santo creado correctamente');
        setShowForm(false);
        setEditingSaint(null);
        loadSaints();
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f4823] mx-auto"></div>
                <p className="text-center mt-4 text-[#779385]">Cargando santos...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#2f4823]">Gestión de Santos</h1>
                    <p className="text-[#779385]">Administra el contenido del santoral</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-[#2f4823] text-white px-6 py-2 rounded-lg hover:bg-[#1f3219] transition-colors font-medium"
                >
                    + Nuevo Santo
                </button>
            </div>

            {/* Mensaje */}
            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                    {message}
                </div>
            )}

            {/* Lista de Santos */}
            <div className="bg-white rounded-lg shadow-sm border border-[#779385]/20 overflow-hidden">
                {saints.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[#779385] text-lg">No hay santos registrados</p>
                        <p className="text-[#779385] text-sm mt-2">Comienza agregando el primero</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f7f2e7] border-b border-[#779385]/20">
                                <tr>
                                    <th className="text-left p-4 text-[#2f4823] font-semibold">Nombre</th>
                                    <th className="text-left p-4 text-[#2f4823] font-semibold">Festividad</th>
                                    <th className="text-left p-4 text-[#2f4823] font-semibold">Destacado</th>
                                    <th className="text-left p-4 text-[#2f4823] font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {saints.map((saint, index) => (
                                    <tr key={saint.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {saint.image && (
                                                    <img
                                                        src={saint.image}
                                                        alt={saint.name}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-[#2f4823]">{saint.name}</p>
                                                    <p className="text-sm text-[#779385] line-clamp-1">{saint.summary}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[#2f4823]">{saint.feast_day}</td>
                                        <td className="p-4">
                                            {saint.featured ? (
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    Destacado
                                                </span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                                    Normal
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(saint)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(saint.id, saint.name)}
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal del Formulario */}
            {showForm && (
                <SaintForm
                    saint={editingSaint}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default AdminSaints;