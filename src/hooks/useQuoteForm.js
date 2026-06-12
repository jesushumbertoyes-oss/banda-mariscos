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
    e.preventDefault();
    if (!validate()) return null;

    setLoading(true);
    try {
      const response = await submitQuote(formData);
      setFormData(INITIAL_STATE);
      setErrors({});
      
      // EL CAMBIO REAL: Le regresamos el éxito al formulario en limpio
      return { success: true, data: response.data };
      
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      return { 
        success: false, 
        message: error.friendlyMessage || 'Error al enviar la solicitud' 
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
  };
};
