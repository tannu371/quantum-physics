# Quantum Mechanics Playground

Interactive web application for exploring quantum mechanics concepts with React + FastAPI.

## Project Structure

```
backend/     # FastAPI backend
  app/
    routers/        # API endpoints for each lab
    main.py         # FastAPI app with CORS
  requirements.txt

frontend/    # React + TypeScript frontend
  src/
    labs/           # Lab components
    api/            # API client
    App.tsx         # Main app with navigation
```

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Start production environment
docker-compose up --build

# Or use Make
make prod
```

Then open:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

For development with hot-reload:
```bash
docker-compose -f docker-compose.dev.yml up
# Or: make dev
```

See [DOCKER.md](DOCKER.md) for detailed Docker instructions.

### Option 2: Local Development

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

**Backend (Terminal 1):**
```bash
cd backend
uv venv && source .venv/bin/activate
uv pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm install && npm run dev
```

Then open http://localhost:5173

### Backend (Terminal 1)
```bash
cd backend
uv venv && source .venv/bin/activate
uv pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install && npm run dev
```

Then open http://localhost:5173

## Labs Overview

### 1. Schrödinger Lab
- Solve time-independent Schrödinger equation
- Visualize energy eigenstates
- Animate time evolution of wave packets
- Potentials: harmonic oscillator, square well, barrier

### 2. State & Operator Lab
- Generate quantum states and operators
- Compute eigenvalues and eigenvectors
- Analyze measurement probabilities
- Explore basis transformations

### 3. Dynamics Lab
- Schrödinger picture time evolution
- Heisenberg picture operator evolution
- Ehrenfest theorem verification

### 4. Spin & Angular Momentum Lab
- Spin dynamics in magnetic fields
- Two-spin coupling and Clebsch-Gordan coefficients
- Spin-orbit coupling energy levels

### 5. Symmetry Lab
- Rotation operators
- Parity transformations
- Time-reversal symmetry

### 6. Variational & WKB Lab
- Variational method for harmonic oscillator
- Variational method for helium atom
- WKB approximation for tunneling

## PHO505 Course Mapping

- **Unit 1-2**: Schrödinger Lab (wave functions, operators)
- **Unit 3**: State & Operator Lab (Hilbert space, observables)
- **Unit 4**: Dynamics Lab (time evolution, pictures)
- **Unit 5**: Spin Lab (angular momentum, coupling)
- **Unit 6**: Symmetry Lab (conservation laws)
- **Unit 7**: Variational & WKB Lab (approximation methods)
