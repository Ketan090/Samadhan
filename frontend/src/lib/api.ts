import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('samadhanhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('samadhanhub_token');
        localStorage.removeItem('samadhanhub_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

// Challenges API
export const challengesAPI = {
  getAll: (params?: any) => api.get('/challenges', { params }),
  getById: (id: string) => api.get(`/challenges/${id}`),
  create: (data: any) => api.post('/challenges', data),
  update: (id: string, data: any) => api.patch(`/challenges/${id}`, data),
  delete: (id: string) => api.delete(`/challenges/${id}`)
};

// Solutions API
export const solutionsAPI = {
  getAll: (params?: any) => api.get('/solutions', { params }),
  getById: (id: string) => api.get(`/solutions/${id}`),
  create: (data: any) => api.post('/solutions', data),
  update: (id: string, data: any) => api.patch(`/solutions/${id}`, data)
};

// Organizations API
export const organizationsAPI = {
  getAll: (params?: any) => api.get('/organizations', { params }),
  getById: (id: string) => api.get(`/organizations/${id}`)
};

// Collaborations API
export const collaborationsAPI = {
  getAll: (params?: any) => api.get('/collaborations', { params }),
  getById: (id: string) => api.get(`/collaborations/${id}`),
  create: (data: any) => api.post('/collaborations', data),
  update: (id: string, data: any) => api.patch(`/collaborations/${id}`, data)
};

// Evaluations API
export const evaluationsAPI = {
  getBySolution: (solutionId: string) => api.get(`/evaluations/solution/${solutionId}`),
  create: (data: any) => api.post('/evaluations', data)
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getDashboard: () => api.get('/analytics/dashboard')
};

// AI API
export const aiAPI = {
  analyzeChallenge: (data: any) => api.post('/ai/analyze-challenge', data),
  matchCollaborators: (data: any) => api.post('/ai/match-collaborators', data)
};

export default api;
