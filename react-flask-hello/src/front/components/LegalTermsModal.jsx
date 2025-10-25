import React, { useState } from 'react';

const LegalTermsModal = ({ 
  isOpen, 
  onClose, 
  onAccept, 
  userData,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    terms_accepted: false,
    privacy_policy_accepted: false,
    marketing_emails: false
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que los campos obligatorios estén marcados
    if (!formData.terms_accepted || !formData.privacy_policy_accepted) {
      alert('Debes aceptar los términos y condiciones y la política de privacidad para continuar.');
      return;
    }

    onAccept(formData);
  };

  const allRequiredAccepted = formData.terms_accepted && formData.privacy_policy_accepted;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#2f4823] text-white p-6 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-center">
            ¡Bienvenido a Peregrinos Shop!
          </h2>
          <p className="text-center text-[#e8dfca] mt-2">
            Completa tu registro aceptando nuestros términos
          </p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <img 
              src={userData.picture} 
              alt={userData.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">{userData.name}</p>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Términos y Condiciones */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="terms_accepted"
                checked={formData.terms_accepted}
                onChange={handleCheckboxChange}
                className="mt-1 w-5 h-5 text-[#2f4823] border-gray-300 rounded focus:ring-[#2f4823]"
                required
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  Acepto los Términos y Condiciones *
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  He leído y acepto los términos y condiciones de uso de Peregrinos Shop.
                </p>
                <button 
                  type="button"
                  className="text-sm text-[#779385] hover:text-[#2f4823] mt-1"
                  onClick={() => window.open('/terminos', '_blank')}
                >
                  Ver términos y condiciones
                </button>
              </div>
            </label>
          </div>

          {/* Política de Privacidad */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="privacy_policy_accepted"
                checked={formData.privacy_policy_accepted}
                onChange={handleCheckboxChange}
                className="mt-1 w-5 h-5 text-[#2f4823] border-gray-300 rounded focus:ring-[#2f4823]"
                required
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  Acepto la Política de Privacidad *
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Acepto el tratamiento de mis datos según la política de privacidad.
                </p>
                <button 
                  type="button"
                  className="text-sm text-[#779385] hover:text-[#2f4823] mt-1"
                  onClick={() => window.open('/privacidad', '_blank')}
                >
                  Ver política de privacidad
                </button>
              </div>
            </label>
          </div>

          {/* Marketing Emails */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="marketing_emails"
                checked={formData.marketing_emails}
                onChange={handleCheckboxChange}
                className="mt-1 w-5 h-5 text-[#2f4823] border-gray-300 rounded focus:ring-[#2f4823]"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  Recibir correos de marketing
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Deseo recibir información sobre nuevos productos, ofertas especiales y contenido de fe. Puedes cambiar esta opción en cualquier momento.
                </p>
              </div>
            </label>
          </div>

          {/* Required Fields Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <p className="text-sm text-yellow-800">
              * Campos obligatorios para completar el registro
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!allRequiredAccepted || loading}
              className={`flex-1 py-3 px-4 font-semibold rounded-2xl transition-all duration-300 ${
                allRequiredAccepted && !loading
                  ? 'bg-[#2f4823] hover:bg-[#1f3723] text-white transform hover:scale-105 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Procesando...
                </div>
              ) : (
                'Completar Registro'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LegalTermsModal;