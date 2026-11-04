import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobify_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: handle 401 responses globally (e.g., redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jobify_token');
      localStorage.removeItem('jobify_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (userData) => api.post('/api/v1/auth/register', userData),
  login: (credentials) => api.post('/api/v1/auth/json-login', credentials),
  me: () => api.get('/api/v1/auth/me'),
  updateProfile: (data) => api.put('/api/v1/auth/profile', data),
};

export const jobsAPI = {
  list: (params) => api.get('/api/v1/jobs', { params }),
  get: (id) => api.get(`/api/v1/jobs/${id}`),
  create: (data) => api.post('/api/v1/jobs', data),
  update: (id, data) => api.put(`/api/v1/jobs/${id}`, data),
  remove: (id) => api.delete(`/api/v1/jobs/${id}`),
  myPostings: () => api.get('/api/v1/jobs/my/postings'),
};

export const applicationsAPI = {
  list: () => api.get('/api/v1/applications/my'),
  create: (data) => api.post('/api/v1/applications', data),
  updateStatus: (id, status) =>
    api.patch(`/api/v1/applications/${id}/status`, { status }),
  withdraw: (id) => api.delete(`/api/v1/applications/${id}`),
  byJob: (jobId) => api.get(`/api/v1/applications/job/${jobId}`),
};

export const savedJobsAPI = {
  list: () => api.get('/api/v1/saved-jobs'),
  save: (jobId) => api.post(`/api/v1/saved-jobs/${jobId}`),
  remove: (jobId) => api.delete(`/api/v1/saved-jobs/${jobId}`),
};

export const usersAPI = {
  seekers: () => api.get('/api/v1/auth/seekers'),
};

export const messagesAPI = {
  getConversations: () => api.get('/api/v1/messages/conversations'),
  createConversation: (data) => api.post('/api/v1/messages/conversations', data),
  getMessages: (conversationId, params = {}) =>
    api.get(`/api/v1/messages/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, data) =>
    api.post(`/api/v1/messages/conversations/${conversationId}/messages`, data),
  getUnreadCount: (conversationId) =>
    api.get(`/api/v1/messages/conversations/${conversationId}/unread-count`),
  getTotalUnread: () => api.get('/api/v1/messages/unread-total'),
};