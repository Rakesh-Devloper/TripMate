import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT authentication token for a user.
 * @param {string|object} userOrId - The MongoDB User ObjectId or user object
 * @returns {string} Signed JWT token
 */
export const generateToken = (userOrId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('CRITICAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing.');
  }
  const payload =
    typeof userOrId === 'object' && userOrId !== null
      ? {
          id: (userOrId._id || userOrId.id).toString(),
          email: userOrId.email,
          role: userOrId.role || 'user',
        }
      : { id: userOrId.toString() };

  return jwt.sign(payload, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;
