import api from './api';

export const leadService = {
  getAll: (search) => api.get('/leads', { params: { search } }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  getNotes: (id) => api.get(`/leads/${id}/notes`),
  addNote: (id, data) => api.post(`/leads/${id}/notes`, data),
};