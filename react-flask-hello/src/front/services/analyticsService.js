import { getBackendUrl } from '../utils/backendConfig';

const API_BASE_URL = getBackendUrl();

export const analyticsService = {
  async getProfitAnalytics(period = 'all', compare = false) {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('No authentication token found');

    const params = new URLSearchParams({
      period: period,
      compare: compare.toString()
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/analytics/profits?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching profit analytics');
    }

    return await response.json();
  },

  async exportToPDF(period = 'all') {
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error('No authentication token found');

    // En una implementación real, esto generaría un PDF en el backend
    // Por ahora simulamos la exportación
    const data = await this.getProfitAnalytics(period);
    
    // Crear contenido para el PDF
    const pdfContent = this.generatePDFContent(data);
    
    // Descargar como archivo
    this.downloadAsFile(pdfContent, `reporte-utilidades-${period}.txt`, 'text/plain');
    
    return { success: true, message: 'Reporte generado exitosamente' };
  },

  generatePDFContent(data) {
    const { metrics, comparison, weekly_trends, period } = data;
    
    let content = `📊 REPORTE DE UTILIDADES - PERIODO: ${period.toUpperCase()}\n`;
    content += `============================================\n\n`;
    
    // Métricas principales
    content += `MÉTRICAS PRINCIPALES:\n`;
    content += `Ingresos Totales: $${this.formatNumber(metrics.total_revenue)}\n`;
    content += `Costos Totales: $${this.formatNumber(metrics.total_cost)}\n`;
    content += `Utilidad Bruta: $${this.formatNumber(metrics.gross_profit)}\n`;
    content += `Margen: ${metrics.profit_margin}%\n`;
    content += `Órdenes: ${metrics.total_orders}\n`;
    content += `Valor Promedio: $${this.formatNumber(metrics.avg_order_value)}\n\n`;
    
    // Comparación
    if (comparison) {
      content += `COMPARACIÓN CON PERIODO ANTERIOR:\n`;
      const revenueChange = ((metrics.total_revenue - comparison.total_revenue) / comparison.total_revenue * 100) || 0;
      const profitChange = ((metrics.gross_profit - comparison.gross_profit) / comparison.gross_profit * 100) || 0;
      
      content += `Ingresos: ${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%\n`;
      content += `Utilidad: ${profitChange >= 0 ? '+' : ''}${profitChange.toFixed(1)}%\n\n`;
    }
    
    // Productos top
    content += `PRODUCTOS MÁS RENTABLES:\n`;
    metrics.top_products.forEach((product, index) => {
      content += `${index + 1}. ${product.name} - $${this.formatNumber(product.total_profit)} (${product.margin.toFixed(1)}%)\n`;
    });
    
    return content;
  },

  downloadAsFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  formatNumber(num) {
    return new Intl.NumberFormat('es-CO').format(Math.round(num));
  }
};