import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');

        return api(originalRequest);
      } catch (refreshError) {
        console.error('La sesión ha expirado definitivamente');
        // --- login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;