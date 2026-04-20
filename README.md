# QuickBite

Restaurant ordering app with real-time order tracking.

Full-stack project for Trends in Technology W2026.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Socket.IO
- Frontend: React, Vite
- Deployment: Render

## Setup

### Backend

```
cd backend
cp .env.example .env
npm install
npm run dev
```

Runs on http://localhost:5000

### Frontend

```
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173

## Structure

```
quickbite/
├── backend/
│   ├── src/server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```
