import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://gabriel-disena-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Projects
export const createProject = (data) => api.post('/projects/create', data);
export const getProject = (token) => api.get(`/projects/${token}`);
export const getAllProjects = () => api.get('/projects');
export const addProjectUpdate = (id, data) => api.post(`/projects/${id}/update`, data);
export const uploadFile = (id, data) => api.post(`/projects/${id}/upload`, data);

// Admin
export const updateProjectStatus = (id, data) => api.put(`/admin/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/admin/projects/${id}`);

// Payments
export const createCheckout = (data) => api.post('/payments/create-checkout', data);

export default api;