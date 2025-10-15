import React from 'react';

const TopProducts = ({ products, orders }) => {
  const getTopProducts = () => {
    const productSales = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product_id;
        if (!productSales[productId]) {
          productSales[productId] = {
            product: products.find(p => p.id === productId) || { name: 'Producto no encontrado', images: [] },
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);
  };

  const topProducts = getTopProducts();
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!topProducts.length) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
        <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Productos Más Vendidos</h2>
        <div className="text-center py-8 text-[#779385]">
          <div className="text-4xl mb-2">🎯</div>
          <p>No hay datos de ventas</p>
          <p className="text-sm mt-1">Los productos más vendidos aparecerán aquí</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-[#779385]/20 p-6">
      <h2 className="font-serif font-bold text-xl text-[#2f4823] mb-4">Productos Más Vendidos</h2>
      
      <div className="space-y-4">
        {topProducts.map((item, index) => (
          <article key={index} className="flex items-center justify-between p-3 bg-[#f7f2e7] rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-[#2f4823] text-white rounded-full text-sm font-bold">
                {index + 1}
              </div>
              <img 
                src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop'} 
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium text-[#2f4823]">{item.product.name}</p>
                <p className="text-sm text-[#779385]">{item.quantity} unidades vendidas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#2f4823]">{formatPrice(item.revenue)}</p>
              <p className="text-xs text-[#779385]">Ingresos</p>
            </div>
          </article>
        ))}
      </div>

      {products.length > 0 && (
        <footer className="mt-4 pt-4 border-t border-[#779385]/20 text-center">
          <p className="text-sm text-[#779385]">
            {products.length} productos en total • {topProducts.length} destacados
          </p>
        </footer>
      )}
    </section>
  );
};

export default TopProducts;