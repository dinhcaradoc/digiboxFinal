import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

// 🔐 Axios instance for authenticated requests
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// 🔐 Axios interceptor: Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔐 Axios interceptor: Handle 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==============================
// AUTHENTICATION
// ==============================
export const login = (data) => api.post('/api/login', data);
export const logout = () => api.delete('/api/logout');
export const register = (data) => api.post('/api/register', data);
export const getUser = () => api.get('/api/user');

// ==============================
// AUTHENTICATED DOCUMENT ROUTES
// ==============================
export const getInbox = () => api.get('/api/inbox');
export const getDocuments = () => api.get('/api/documents');

export const uploadDocument = (formData) =>
  api.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// ==============================
// ANONYMOUS UPLOAD (LANDING PAGE)
// ==============================
export const anonymousUpload = (formData) => {
  const apiNoAuth = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return apiNoAuth.post('/api/upload', formData); // This must match backend anonymous route precisely
};

export default api;