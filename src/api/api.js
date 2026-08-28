import axios from 'axios';

// In development, fall back to localhost. In production, VITE_API_URL must be set.
const baseURL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? 'http://127.0.0.1:8000/api/' : '/api/');

const API = axios.create({ baseURL });

// Attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle 401 (expired token) — redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      // HashRouter uses #/ paths
      const hashPath = window.location.hash.replace('#', '');
      if (hashPath !== '/login' && hashPath !== '/signup') {
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(err);
  }
);

export default API;
