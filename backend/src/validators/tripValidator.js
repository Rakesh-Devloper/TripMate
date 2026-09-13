/**
 * Request validation middlewares for Trip endpoints
 */

export const validateTripCreate = (req, res, next) => {
  const { destination, title, startDate, endDate } = req.body;

  if (!destination && !title) {
    return res.status(400).json({
      success: false,
      message: 'Please provide at least a destination or title for the trip.',
    });
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be earlier than start date.',
      });
    }
  }

  next();
};

export default {
  validateTripCreate,
};
