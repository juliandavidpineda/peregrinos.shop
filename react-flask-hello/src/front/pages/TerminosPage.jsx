import React from 'react';
import { Link } from 'react-router-dom';

const TerminosPage = () => {
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
          <h1 className="text-4xl font-bold text-[#2f4823] mb-4">Términos y Condiciones</h1>
          <p className="text-lg text-gray-600">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[#2f4823]/20">
          <div className="prose max-w-none text-gray-700">
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">1. Aceptación de los Términos</h2>
              <p className="mb-4">
                Al acceder y utilizar los servicios de Peregrinos Shop, usted acepta estar sujeto a estos términos y condiciones. 
                Si no está de acuerdo con alguna parte de estos términos, no podrá acceder a nuestros servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">2. Servicios Ofrecidos</h2>
              <p className="mb-4">
                Peregrinos Shop es una plataforma dedicada a la venta de productos religiosos y artículos de fe, 
                incluyendo pero no limitado a:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Ropas y accesorios religiosos</li>
                <li>Artículos de devoción personal</li>
                <li>Productos inspirados en la fe católica</li>
                <li>Materiales educativos religiosos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">3. Registro de Usuario</h2>
              <p className="mb-4">
                Para realizar compras en nuestra plataforma, deberá registrarse proporcionando información 
                veraz y completa. Es responsable de mantener la confidencialidad de su cuenta y contraseña.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">4. Compras y Pagos</h2>
              <p className="mb-4">
                Todas las compras están sujetas a disponibilidad. Nos reservamos el derecho de rechazar 
                cualquier pedido. Los precios están sujetos a cambio sin previo aviso.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">5. Propiedad Intelectual</h2>
              <p className="mb-4">
                Todo el contenido de este sitio web, incluyendo logos, textos, gráficos e imágenes, 
                es propiedad de Peregrinos Shop y está protegido por las leyes de propiedad intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">6. Limitación de Responsabilidad</h2>
              <p className="mb-4">
                Peregrinos Shop no será responsable por daños indirectos, incidentales o consecuentes 
                resultantes del uso o la imposibilidad de uso de nuestros servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">7. Modificaciones</h2>
              <p className="mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Las changes serán efectivas inmediatamente después de su publicación en el sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#2f4823] mb-4">8. Contacto</h2>
              <p className="mb-4">
                Para cualquier pregunta sobre estos términos, puede contactarnos a:
              </p>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="font-semibold">Email: legal@peregrinos.shop</p>
                <p className="text-sm text-gray-600">Respondemos en un plazo máximo de 48 horas.</p>
              </div>
            </section>

            <div className="bg-[#f7f2e7] border border-[#2f4823]/20 rounded-2xl p-6 mt-8">
              <p className="text-center text-gray-700">
                Al utilizar nuestros servicios, usted confirma que ha leído, entendido y aceptado 
                estos términos y condiciones en su totalidad.
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

export default TerminosPage;