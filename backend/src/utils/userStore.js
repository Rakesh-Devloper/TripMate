import bcrypt from 'bcryptjs';

// Pre-seeded users with valid bcrypt hashed passwords ('password123')
export const inMemoryUsers = [
  {
    _id: 'user-demo-1',
    id: 'user-demo-1',
    name: 'Rakesh Kondela',
    email: 'kondelarakesh12@gmail.com',
    passwordHash: '$2b$10$mPQznGS1vdtnV0aAe4B9wO6ubGwQRA.mEiEgMg7kdiVbOgr15iY9W', // 'password123'
    profileImage: '',
    role: 'user',
    bio: 'Avid explorer of hidden coastlines, cultural festivals, and alpine routes.',
    travelStyle: 'Adventure',
    preferredCurrency: 'USD',
    homeAirport: 'HYD / BLR',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    _id: 'user-admin-1',
    id: 'user-admin-1',
    name: 'TripMate Administrator',
    email: 'admin@tripmate.com',
    passwordHash: '$2b$10$mPQznGS1vdtnV0aAe4B9wO6ubGwQRA.mEiEgMg7kdiVbOgr15iY9W', // 'password123'
    profileImage: '',
    role: 'admin',
    bio: 'TripMate Platform System Administrator and Curator.',
    travelStyle: 'Luxury',
    preferredCurrency: 'USD',
    homeAirport: 'SFO',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
];

export const findUserById = (id) => {
  return inMemoryUsers.find((u) => u._id === id || u.id === id);
};

export const findUserByEmail = (email) => {
  if (!email) return null;
  return inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (user) => {
  inMemoryUsers.push(user);
  return user;
};

export const updateUserInStore = (id, updates) => {
  const index = inMemoryUsers.findIndex((u) => u._id === id || u.id === id);
  if (index !== -1) {
    inMemoryUsers[index] = { ...inMemoryUsers[index], ...updates };
    return inMemoryUsers[index];
  }
  return null;
};
