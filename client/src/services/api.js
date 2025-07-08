// client/src/services/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add token to headers
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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = (data) => api.post('/api/login', data);
export const logout = () => api.delete('/api/logout');
export const register = (data) => api.post('/api/register', data);
export const getUser = () => api.get('/api/user');

// Documents
export const getInbox = () => api.get('/api/inbox');
export const getDocuments = () => api.get('/api/documents');
export const uploadDocument = (formData) => api.post('/api/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;