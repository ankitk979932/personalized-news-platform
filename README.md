# Nuzio AI News Assignment

Nuzio AI is a focused full-stack web application that implements the two required flows from the provided Figma reference: user login/authentication and a personalized news playing/reading experience.

## Features

- JWT authentication with bcrypt password verification
- Protected personalized news route
- MongoDB and Mongoose data models
- Personalized feed ranking by user interests
- Figma-inspired responsive login and dark news player UI
- Loading, empty, validation, API, and invalid article states
- Seed script with a demo user and 15 realistic news articles

## Tech Stack

Frontend: React.js, Vite, React Router, CSS3, lucide-react

Backend: Node.js, Express.js, JWT, bcryptjs

Database: MongoDB with Mongoose

## Installation

Install all dependencies from the project root:

```bash
npm install
npm run install:all
```

Create environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Update `server/.env` if your MongoDB URL or JWT secret differs.

Seed the database:

```bash
npm run seed
```

Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Environment Variables

Server:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nuzio-ai
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Client:

```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

- `POST /api/auth/login` authenticates a user and returns a JWT
- `GET /api/auth/me` returns the authenticated user profile
- `GET /api/news` returns all news articles
- `GET /api/news/personalized` returns interest-ranked news for the authenticated user
- `GET /api/news/:id` returns one full article

## Demo Credentials

Email: `ankit@example.com`

Password: `password123`

## Deployment

This repo is prepared for a common split deployment:

- Frontend: Vercel, using the `client` folder
- Backend: Render, using the `server` folder
- Database: MongoDB Atlas

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial deployment-ready version"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Deploy Backend on Render

Create a new Render Web Service from the GitHub repo.

Recommended settings:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

Environment variables:

```env
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<strong random secret>
JWT_EXPIRES_IN=7d
CLIENT_URLS=http://localhost:5173,https://your-vercel-app.vercel.app
```

You can also use the included `render.yaml` as a Render Blueprint.

### 3. Deploy Frontend on Vercel

Import the same GitHub repo in Vercel and set the project root to `client`.

Recommended settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

After Vercel gives you the frontend URL, add it to Render's `CLIENT_URLS` value and redeploy the backend.
