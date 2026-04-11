import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('loca_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Auto-Redirect on 401 and Error Toasts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('loca_token');
      localStorage.removeItem('loca_user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.error || 'Une erreur réseau est survenue.';
    console.error(`[API Error] ${message}`);
    // Here we could trigger a toast notification system
    
    return Promise.reject(error);
  }
);

export default api;
