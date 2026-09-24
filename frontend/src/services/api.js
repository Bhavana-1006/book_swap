import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bookswap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login or register check
      const isAuthCheck = error.config.url?.includes('/api/auth/me');
      if (!isAuthCheck) {
        // Token expired or invalid
        // localStorage.removeItem('bookswap_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
