import { useState } from 'react';
import { submitQuote } from '../services/api';

const INITIAL_STATE = {
  service: '',
  full_name: '',
  phone: '',
  email: '',
  details: '',
  reference_links: '',
  budget_hint: '',
  urgency: 'normal',
};

export const useQuoteForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.service) newErrors.service = 'Selecciona un servicio';
    if (!formData.full_name.trim()) newErrors.full_name = 'Ingresa tu nombre';
    if (!formData.phone.trim()) newErrors.phone = 'Ingresa tu teléfono / WhatsApp';
    if (!formData.details.trim() || formData.details.length < 20) {
      newErrors.details = 'Describe tu proyecto con al menos 20 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // CRUCIAL: Detener el comportamiento de HTML de recargar la página y limpiar todo
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!validate()) return { success: false, validationFailed: true };

    setLoading(true);
    try {
      // Intentamos mandar los datos reales al Backend de Django
      const response = await submitQuote(formData);
      
      // SÓLO si Django responde con éxito, limpiamos los datos del formulario
      setFormData(INITIAL_STATE);
      setErrors({});
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error en la petición del formulario:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      return { 
        success: false, 
        message: error.friendlyMessage || 'Error al conectar con el servidor. Verifica que Django esté encendido.' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setFormData // Lo exponemos por si se selecciona un servicio desde las tarjetas
  };
};
