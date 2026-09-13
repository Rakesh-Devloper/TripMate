import api from '../services/api.js';
import authService from '../services/authService.js';
import tripService from '../services/tripService.js';
import destinationService from '../services/destinationService.js';
import aiService from '../services/aiService.js';

/**
 * Unified API & Services Module
 * Provides access to the configured Axios client and domain services.
 */
export {
  api,
  authService,
  tripService,
  destinationService,
  aiService,
};

export default api;
