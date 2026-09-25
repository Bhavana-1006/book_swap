import axios from 'axios';

// Normalize base URL: strip trailing slashes to avoid double-slash routes
const rawBaseURL = import.meta.env.VITE_API_URL || '';
const cleanBaseURL = rawBaseURL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: cleanBaseURL,
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

    // When sending FormData (e.g. avatar or book image upload), remove explicit Content-Type
    // so the browser automatically supplies the multipart/form-data boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
      const isAuthCheck = error.config.url?.includes('/api/auth/me');
      const isAuthLogin = error.config.url?.includes('/api/auth/login');
      const isAuthRegister = error.config.url?.includes('/api/auth/register');

      if (!isAuthCheck && !isAuthLogin && !isAuthRegister) {
        // Token expired or invalid during an authenticated user session
        localStorage.removeItem('bookswap_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
