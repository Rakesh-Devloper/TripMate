import api from './api.js';
const aiService = { generateTrip: async (data) => (await api.post('/ai/generate-trip', data)).data };
export default aiService;
