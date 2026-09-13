import api from './api.js';
const destinationService = {
  list: async (params={}) => (await api.get('/destinations', { params })).data,
  getById: async (id) => (await api.get(`/destinations/${id}`)).data,
};
export default destinationService;
