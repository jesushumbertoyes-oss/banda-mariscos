import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para manejar errores globalmente de forma segura
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message 
      || error.response?.data?.detail 
      || 'Error de conexión. Intenta de nuevo.';
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);

export const fetchBandInfo = () => api.get('/core/band-info/');
export const fetchVideos = () => api.get('/core/videos/all/');
export const fetchServices = () => api.get('/services/services/');

// Forzamos a que retorne la respuesta limpia de Axios para que el hook lea el .data
export const submitQuote = (data) => api.post('/services/quote/', data);

export default api;
