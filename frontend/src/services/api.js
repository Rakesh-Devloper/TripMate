import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' }, timeout: 30000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tripmate_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tripmate_token');
      localStorage.removeItem('tripmate_user');
    }
    return Promise.reject(error);
  }
);
export default api;
