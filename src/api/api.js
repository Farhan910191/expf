import axios from 'axios';

// Read API URL from environment variable
const envApiUrl = import.meta.env.VITE_API_URL;

// Determine the base API URL
let rawBaseURL = envApiUrl;

if (!rawBaseURL || rawBaseURL.trim() === '') {
  if (import.meta.env.DEV) {
    rawBaseURL = 'http://127.0.0.1:8000/api/';
  } else {
    // In production, fallback to relative /api/
    console.error(
      'CRITICAL: VITE_API_URL environment variable is not defined in Vercel! ' +
      'Please add VITE_API_URL=https://<your-backend-domain>/api/ to your Vercel Project Settings.'
    );
    rawBaseURL = '/api/';
  }
}

// In production, warn if pointing to localhost
if (import.meta.env.PROD && (rawBaseURL.includes('127.0.0.1') || rawBaseURL.includes('localhost'))) {
  console.error(
    `CRITICAL MISCONFIGURATION: Production frontend is configured with a localhost API URL: "${rawBaseURL}". ` +
    'Mobile devices and external users CANNOT reach localhost. ' +
    'Update VITE_API_URL in Vercel Project Settings with your production backend HTTPS URL.'
  );
}

// Ensure the baseURL ends with /api/
let baseURL = rawBaseURL.trim();
if (!baseURL.endsWith('/')) {
  baseURL += '/';
}
if (!baseURL.endsWith('api/')) {
  baseURL += 'api/';
}

console.log('[API] Initialized with baseURL:', baseURL);

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Attach JWT token to every request if available
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
      localStorage.removeItem('refreshToken');
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
