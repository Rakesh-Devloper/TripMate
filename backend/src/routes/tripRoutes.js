import express from 'express';
import {
  createTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  toggleSaveTrip,
} from '../controllers/tripController.js';
import { optionalProtect, protect } from '../middleware/authMiddleware.js';
import { validateTripCreate } from '../validators/tripValidator.js';

const router = express.Router();

router.route('/')
  .get(optionalProtect, getMyTrips)
  .post(optionalProtect, validateTripCreate, createTrip);

router.get('/my-trips', optionalProtect, getMyTrips);

router.route('/:id')
  .get(optionalProtect, getTripById)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

router.put('/:id/save', protect, toggleSaveTrip);

export default router;
