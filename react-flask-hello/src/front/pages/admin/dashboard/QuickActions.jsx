import React from 'react';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      icon: '➕',
      title: 'Agregar Producto',
      description: 'Crear nuevo producto en la tienda',
      action: 'add-product'
    },
    {
      icon: '📁',
      title: 'Gestionar Categorías',
      description: 'Organizar categorías de productos',
      action: 'manage-categories'
    },
    {
      icon: '📊',
      title: 'Ver Reportes',
      description: 'Analizar órdenes y ventas',
      action: 'view-reports'
    }
  ];

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Acciones Rápidas</h2>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => onAction(action.action)}
            className="w-full p-4 border-2 border-dashed border-[#779385]/30 rounded-xl text-[#779385] hover:border-[#2f4823] hover:text-[#2f4823] transition-colors text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl group-hover:scale-110 transition-transform">{action.icon}</div>
              <div>
                <div className="font-medium">{action.title}</div>
                <div className="text-sm">{action.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;