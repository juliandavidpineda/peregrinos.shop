import React from 'react';
import { Link } from 'react-router-dom';

const PrivacidadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f2e7] to-[#e8dfca] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-6">
            <img 
              src="/assets/img/branding/Logo_blanco.png" 
              alt="Peregrinos Shop" 
              className="h-16 mx-auto"
            />
          </Link>
          <h1 className="text-4xl font-bold text-[#2f4823] mb-4">Política de Privacidad</h1>
          <p className="text-lg text-gray-600">Comprometidos con la protección de sus datos</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[#2f4823]/20">
          <div className="prose max-w-none text-gray-700">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">1. Información que Recopilamos</h2>
              <p className="mb-4">
                En Peregrinos Shop recopilamos la siguiente información para proporcionarle nuestros servicios:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Información personal:</strong> nombre, email, dirección de envío</li>
                <li><strong>Información de perfil:</strong> foto de perfil (si usa Google Login)</li>
                <li><strong>Datos de transacciones:</strong> historial de compras y pagos</li>
                <li><strong>Preferencias:</strong> aceptación de términos y preferencias de marketing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">2. Uso de la Información</h2>
              <p className="mb-4">
                Utilizamos su información para:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Procesar sus pedidos y gestionar su cuenta</li>
                <li>Enviar actualizaciones sobre sus pedidos</li>
                <li>Mejorar nuestros servicios y experiencia de usuario</li>
                <li>Enviar comunicaciones de marketing (solo si las acepta)</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">3. Protección de Datos</h2>
              <p className="mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos 
                personales contra accesos no autorizados, pérdida o destrucción.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">4. Compartir Información</h2>
              <p className="mb-4">
                No vendemos ni alquilamos su información personal a terceros. Solo compartimos 
                información cuando es necesario para:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Proveedores de servicios (pasarelas de pago, transporte)</li>
                <li>Cumplir con requisitos legales</li>
                <li>Proteger nuestros derechos y seguridad</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">5. Sus Derechos</h2>
              <p className="mb-4">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Acceder a sus datos personales</li>
                <li>Rectificar información inexacta</li>
                <li>Eliminar sus datos personales</li>
                <li>Oponerse al tratamiento de sus datos</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">6. Cookies y Tecnologías Similares</h2>
              <p className="mb-4">
                Utilizamos cookies para mejorar su experiencia en nuestro sitio web. 
                Puede configurar su navegador para rechazar cookies, aunque esto puede 
                afectar la funcionalidad de algunos servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">7. Conservación de Datos</h2>
              <p className="mb-4">
                Conservamos sus datos personales durante el tiempo necesario para cumplir 
                con los fines descritos en esta política, a menos que la ley requiera un 
                período de conservación más largo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">8. Contacto</h2>
              <p className="mb-4">
                Para ejercer sus derechos o realizar consultas sobre privacidad:
              </p>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="font-semibold">Email: hola@peregrinos.shop</p>
                <p className="text-sm text-gray-600">Nos comprometemos a responder en 24 horas hábiles.</p>
              </div>
            </section>

            <div className="bg-[#f7f2e7] border border-[#2f4823]/20 rounded-2xl p-6 mt-8">
              <p className="text-center text-gray-700">
                Su privacidad es importante para nosotros. Esta política puede actualizarse 
                periódicamente, le recomendamos revisarla regularmente.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-[#2f4823] text-white font-semibold rounded-2xl hover:bg-[#1f3723] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ← Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacidadPage;