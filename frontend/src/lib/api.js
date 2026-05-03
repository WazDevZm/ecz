import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Dashboard
export const dashboard = {
  getOverview: (timeRange) => api.get('/dashboard/overview', { params: { timeRange } }),
  getSentimentTrends: (timeRange, partyIds) => 
    api.get('/dashboard/sentiment-trends', { params: { timeRange, partyIds } }),
  getPartyComparison: (timeRange) => 
    api.get('/dashboard/party-comparison', { params: { timeRange } }),
  getCandidateLeaderboard: (timeRange, limit) => 
    api.get('/dashboard/candidate-leaderboard', { params: { timeRange, limit } }),
  getWordCloud: (timeRange, limit) => 
    api.get('/dashboard/word-cloud', { params: { timeRange, limit } }),
  getRecentPosts: (limit, page) => 
    api.get('/dashboard/recent-posts', { params: { limit, page } }),
};

// Parties
export const parties = {
  getAll: () => api.get('/parties'),
  getById: (id) => api.get(`/parties/${id}`),
  create: (data) => api.post('/parties', data),
  update: (id, data) => api.put(`/parties/${id}`, data),
  delete: (id) => api.delete(`/parties/${id}`),
};

// Candidates
export const candidates = {
  getAll: (partyId, position) => 
    api.get('/candidates', { params: { partyId, position } }),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (data) => api.post('/candidates', data),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
};

// Posts
export const posts = {
  getAll: (filters) => api.get('/posts', { params: filters }),
  getById: (id) => api.get(`/posts/${id}`),
};

// Provinces
export const provinces = {
  getAll: () => api.get('/provinces'),
  getAnalytics: (timeRange) => 
    api.get('/provinces/analytics', { params: { timeRange } }),
};

// Alerts
export const alerts = {
  getAll: () => api.get('/alerts'),
  create: (data) => api.post('/alerts', data),
  update: (id, data) => api.put(`/alerts/${id}`, data),
  delete: (id) => api.delete(`/alerts/${id}`),
};

// Reports
export const reports = {
  generate: (data) => api.post('/reports/generate', data),
};

// Users (Admin only)
export const users = {
  getAll: () => api.get('/users'),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
