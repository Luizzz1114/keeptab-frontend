import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error con respuesta del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // No autorizado - limpiar sesión y redirigir
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          // Prohibido
          console.warn('Acceso prohibido:', data.message);
          break;
        case 404:
          // No encontrado
          console.warn('Recurso no encontrado:', data.message);
          break;
        case 500:
          // Error del servidor
          console.error('Error del servidor:', data.message);
          break;
        default:
          console.error('Error de API:', data.message);
      }
    } else if (error.request) {
      // Error sin respuesta (problema de red)
      console.error('Error de conexión: No se pudo comunicar con el servidor');
    } else {
      // Error al configurar la petición
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;