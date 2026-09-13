# TripMate

TripMate is a MERN travel planner with Gemini-powered itinerary generation.

## Structure

- `frontend/` — React + Vite UI
- `backend/` — Express + Mongoose API
- MongoDB and Gemini credentials are server-side only.

## Local setup

### 1. Backend

Create `backend/.env` from `backend/.env.example`:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=tripmate
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_key
AI_MODEL=gemini-3.8-flash
PORT=5000
```

Then:

```bash
cd backend
npm install
npm run dev
```

Health check: `http://localhost:5000/api/health`

### 2. Frontend

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then:

```bash
cd frontend
npm install
npm run dev
```

Vite normally uses `http://localhost:5173` and will choose another port if that port is busy.

## Authentication

Registration and login use the Express API, bcrypt password hashing, MongoDB users and JWT bearer tokens. The frontend stores the JWT locally for the current browser session and sends it as an Authorization header.

## AI planner

The browser calls `/api/ai/generate-trip`; the backend calls Gemini using `GEMINI_API_KEY`. The API key is never sent to the browser. If Gemini is unavailable, the backend has a curated fallback itinerary so the planner can still return a valid result.

## Production

Deploy frontend and backend separately. Set `VITE_API_URL` to the deployed backend API URL. On the backend, set `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL`, `AI_MODEL`, and the platform-provided `PORT`. Configure MongoDB Atlas network access for the backend host.

Never commit `.env` files or real secrets.
