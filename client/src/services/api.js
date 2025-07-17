import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// === REQUEST/RESPONSE INTERCEPTORS ===
api.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  res => res,
  error => {
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
// DOCUMENT ROUTES (for Uploads, Inbox, QuickBox, etc.)
// ==============================

/** GET: Your uploaded documents (Uploads.jsx) */
export const getDocuments = () => api.get('/api/documents');

/** GET: Documents received/shared-with-you (Inbox.jsx) */
export const getInbox = () => api.get('/api/inbox');

/** GET: Priority-flagged documents (QuickBox.jsx) */
export const getPriority = () => api.get('/api/quickbox'); // adjust if your backend uses another route

/** POST: Upload a document (authenticated) */
export const uploadDocument = (formData) =>
  api.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

/** DELETE: Delete a document (by ID) */
export const deleteDocument = (docId) =>
  api.delete(`/api/documents/${docId}`);

/** GET: Download a document (triggers download in browser) */
export const downloadDocument = (docId) => {
  // Open download in new tab, works for direct server/file or proxied cloud links
  window.open(`${API_BASE}/api/documents/${docId}/download`, "_blank");
};

/** POST: Share a document with another user */
export const shareDocument = (docId, recipientPhone, message) =>
  api.post(`/api/documents/${docId}/share`, {
    recipient: recipientPhone,
    message,
  });

/** PATCH: Set/unset document priority (toggle QuickBox) */
export const setDocumentPriority = (docId, isPriority) =>
  api.patch(`/api/documents/${docId}/priority`, { priority: !!isPriority });

// ==============================
// ANONYMOUS UPLOAD (LANDING PAGE)
// ==============================
export const anonymousUpload = (formData) => {
  const apiNoAuth = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return apiNoAuth.post('/api/upload', formData); // This must match backend anonymous route
};

export default api;