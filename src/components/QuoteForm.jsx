import { useState, useEffect, useRef } from 'react';
import { Send, Phone, User, Mail, FileText, Link2, DollarSign, AlertCircle } from 'lucide-react';
import { useQuoteForm } from '../hooks/useQuoteForm';
import SuccessModal from './SuccessModal';

const QuoteForm = ({ preselectedService, services }) => {
  const { formData, errors, loading, handleChange, handleSubmit } = useQuoteForm();
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef(null);

  // Scroll al formulario cuando se selecciona un servicio desde las tarjetas
  useEffect(() => {
    if (preselectedService && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [preselectedService]);

  const onSubmit = async (e) => {
    const result = await handleSubmit(e);
    if (result?.success) {
      setShowModal(true);
    }
  };

  return (
    <>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
      
      <section id="cotizar" className="py-20 bg-mariscos-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" ref={formRef}>
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl text-brass mb-2">
              SOLICITA TU COTIZACIÓN
            </h2>
            <p className="text-mariscos-300">
              Cuéntanos tu idea y te contactamos por WhatsApp con propuesta y precio.
            </p>
          </div>

          <form 
            onSubmit={onSubmit}
            className="bg-mariscos-900 rounded-2xl p-6 md:p-8 border border-mariscos-700 shadow-2xl"
          >
            {/* Servicio de Interés */}
            <div className="mb-6">
              <label className="block text-mariscos-200 text-sm font-medium mb-2">
                Servicio de Interés *
              </label>
              <div className="relative">
                <select
                  name="service"
                  value={formData.service || preselectedService || ''}
                  onChange={handleChange}
                  className={`w-full bg-mariscos-800 border ${errors.service ? 'border-red-500' : 'border-mariscos-600'} rounded-lg px-4 py-3 text-mariscos-100 focus:outline-none focus:border-brass transition-colors appearance-none`}
                >
                  <option value="">Selecciona un servicio...</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              {errors.service && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.service}
                </p>
              )}
            </div>

            {/* Nombre y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-mariscos-200 text-sm font-medium mb-2">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-mariscos-500" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className={`w-full bg-mariscos-800 border ${errors.full_name ? 'border-red-500' : 'border-mariscos-600'} rounded-lg pl-10 pr-4 py-3 text-mariscos-100 focus:outline-none focus:border-brass transition-colors`}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-mariscos-200 text-sm font-medium mb-2">
                  Teléfono / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-mariscos-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+52 669 123 4567"
                    className={`w-full bg-mariscos-800 border ${errors.phone ? 'border-red-500' : 'border-mariscos-600'} rounded-lg pl-10 pr-4 py-3 text-mariscos-100 focus:outline-none focus:border-brass transition-colors`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Correo Electrónico */}
            <div className="mb-6">
              <label className="block text-mariscos-200 text-sm font-medium mb-2">
                Correo Electrónico <span className="text-mariscos-500">(opcional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-mariscos-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full bg-mariscos-800 border border-mariscos-600 rounded-lg pl-10 pr-4 py-3 text-mariscos-100 focus:outline-none focus:border-brass transition-colors"
                />
              </div>
            </div>

            {/* Detalles del Proyecto */}
            <div className="mb-6">
              <label className="block text-mariscos-200 text-sm font-medium mb-2">
                Detalles de tu Proyecto *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-mariscos-500" />
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Cuéntanos tu historia, los datos del negocio, la dedicatoria, el estilo que buscas..."
                  className={`w-full bg-mariscos-800 border ${errors.details ? 'border-red-500' : 'border-mariscos-600'} rounded-lg pl-10 pr-4 py-3 text-mariscos-100 focus:outline-none focus:border-brass transition-colors resize-none`}
                />
              </div>
              {errors.details && (
                <p className="text-red-400 text-xs mt-1">{errors.details}</p>
              )}
            </div>

            {/* Links de Referencia */}
            <div className="mb-6">
              <label className="block text-mariscos-200 text-sm font-medium mb-2">
                Links de Referencia <span className="text-mariscos-500">(opcional)</span>
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 w-5 h-5 text-mariscos-500" />
                <textarea
                  name="reference_links"
                  value={formData.reference_links}
                  onChange={handleChange}
                  rows={2}
                  placeholder="YouTube, Spotify, ejemplos de estilo que te gustaría..."
                  className="w-full bg-mariscos-800 border border-mariscos-600 rounded-lg pl-10 pr-4 py-3 text-mariscos-100 focus:outline-none focus:border-brass transition-colors resize-none"
                />
              </div>
            </div>

            {/* Presupuesto y Urgencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-mariscos-200 text-sm font-medium mb-2">
                  Presupuesto Aproximado
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-mariscos-500" />
                  <input
                    type="text"
                    name="budget_hint"
                    value={formData.budget_hint}
                    onChange={handleChange}
                    placeholder="Ej: $4,000 - $8,000 MXN"
                    className="w-full bg-mariscos-800 border border-mariscos-600 rounded-lg pl-10 pr-4 py-3 text-mariscos-100 focus:outline-none focus:border-brass transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-mariscos-200 text-sm font-medium mb-2">
                  Urgencia
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full bg-mariscos-800 border border-mariscos-600 rounded-lg px-4 py-3 text-mariscos-100 focus:outline-none focus:border-brass transition-colors"
                >
                  <option value="low">Sin prisa</option>
                  <option value="normal">Normal (1-2 semanas)</option>
                  <option value="high">Urgente (menos de 1 semana)</option>
                </select>
              </div>
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brass hover:bg-brass-light text-mariscos-900 font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-mariscos-900 border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Solicitud
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default QuoteForm;
