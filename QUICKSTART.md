# Quick Start Guide

## Prerequisites

- **Option 1 (Docker)**: Docker and Docker Compose installed
- **Option 2 (Local)**: Python 3.13+ with `uv` and Node.js 24+

## Docker Setup (Recommended)

### Production Mode

```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Development Mode (with hot-reload)

```bash
docker-compose -f docker-compose.dev.yml up
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

See [DOCKER.md](../DOCKER.md) for more Docker commands.

---

## Local Development Setup

If you prefer running without Docker:

## Start Backend (Terminal 1)

```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs

## Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Quick Test

1. Open http://localhost:5173 in your browser
2. Click on "Schrödinger" tab
3. Click "Run Spectrum" to see harmonic oscillator energy levels
4. Try different potential types and parameters

## Available Labs

1. **Schrödinger Lab** - Solve quantum systems, visualize eigenstates
2. **State & Operator Lab** - Explore quantum states and observables
3. **Dynamics Lab** - Time evolution in different pictures
4. **Spin Lab** - Spin dynamics and angular momentum coupling
5. **Symmetry Lab** - Symmetry operations and transformations
6. **Variational & WKB Lab** - Approximation methods

## Troubleshooting

If backend fails to start:
- Make sure port 8000 is not in use
- Check that all dependencies installed correctly

If frontend fails to start:
- Delete `node_modules` and run `npm install` again
- Make sure port 5173 is not in use
