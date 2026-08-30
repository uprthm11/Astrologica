# 🌌 Astrologica: The Cosmic & Cognitive Blueprint

A full-stack web application built with the **FARM** stack that synthesizes precise astronomical calculations and MBTI psychological profiling into unique, shareable personality dossiers.

- **F**astAPI (Python 3.11+ async backend with `flatlib` for celestial calculations)
- **A**sync PyMongo (MongoDB Atlas cloud driver with `AsyncMongoClient`)
- **R**eact 19 + Vite (Modern frontend with Tailwind CSS, Framer Motion, Axios, and React Router)
- **M**ongoDB (NoSQL database with dynamic UUID routing for shared profiles)

---

## Workspace Structure

```
Astrologica/
├── .gitignore               # Root gitignore (ignores venv, node_modules, dist, .env, __pycache__)
├── README.md                # Project documentation and setup guide
├── client/                  # Frontend (Vite + React)
│   ├── src/
│   │   ├── App.jsx          # Root component with routing, animations, and API check
│   │   ├── index.css        # Tailwind CSS styling
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Includes tailwindcss, framer-motion, axios, react-router-dom
│   └── vite.config.js       # Vite configuration with Tailwind CSS plugin
└── server/                  # Backend (FastAPI + Python)
    ├── .env                 # Server environment variables (ignored by Git)
    ├── .env.example         # Example environment template
    ├── database.py          # Async MongoDB connection setup using AsyncMongoClient
    ├── main.py              # FastAPI server with CORS middleware for http://localhost:5173
    ├── requirements.txt     # Python package requirements
    └── venv/                # Python virtual environment (ignored by Git)
```

---

## Quick Start

### 1. Backend Server (FastAPI)

1. Open a terminal in the `server` directory:
   ```bash
   cd server
   ```

2. Activate the virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD):**
     ```cmd
     .\venv\Scripts\activate.bat
     ```

3. Ensure MongoDB is running locally or configure `MONGODB_URL` in `server/.env`:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=personality_app
   ```

4. Start the FastAPI server with live reload:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   - API Docs (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
   - Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### 2. Frontend Client (Vite + React)

1. Open a new terminal in the `client` directory:
   ```bash
   cd client
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.
