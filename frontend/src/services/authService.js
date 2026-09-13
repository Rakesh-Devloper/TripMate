import api from './api.js';
const authService = {
  register: async (data) => (await api.post('/auth/register', data)).data,
  login: async (data) => (await api.post('/auth/login', data)).data,
  me: async () => (await api.get('/auth/me')).data,
  updateProfile: async (data) => (await api.put('/auth/profile', data)).data,
  changePassword: async (data) => (await api.put('/auth/change-password', data)).data,
  logout: async () => (await api.post('/auth/logout')).data,
};
export default authService;
