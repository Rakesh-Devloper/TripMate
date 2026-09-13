import api from './api.js';
const tripService = {
  getMyTrips: async () => (await api.get('/trips/my-trips')).data,
  getById: async (id) => (await api.get(`/trips/${id}`)).data,
  create: async (data) => (await api.post('/trips', data)).data,
  update: async (id, data) => (await api.put(`/trips/${id}`, data)).data,
  remove: async (id) => (await api.delete(`/trips/${id}`)).data,
  toggleSave: async (id) => (await api.put(`/trips/${id}/save`)).data,
};
export default tripService;
