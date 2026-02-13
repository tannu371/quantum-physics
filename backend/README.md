# Backend

FastAPI backend for quantum mechanics simulations.

## Setup with uv

```bash
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
```

## Run Server

```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### Schrödinger Lab
- `POST /api/schrodinger/spectrum` - Compute energy eigenvalues and eigenfunctions
- `POST /api/schrodinger/time-evolution` - Simulate time evolution

### State & Operator Lab
- `POST /api/operators/observable` - Analyze quantum observables
- `POST /api/operators/basis-change` - Transform between bases

### Dynamics Lab
- `POST /api/dynamics/schrodinger` - Schrödinger picture evolution
- `POST /api/dynamics/heisenberg` - Heisenberg picture evolution

### Spin & Angular Momentum Lab
- `POST /api/spin/dynamics` - Spin precession in magnetic field
- `POST /api/spin/coupling` - Two-spin coupling and CG coefficients
- `POST /api/spin/spin-orbit` - Spin-orbit coupling spectrum

### Symmetry Lab
- `POST /api/symmetry/rotation` - Rotation operators
- `POST /api/symmetry/parity` - Parity transformations

### Variational & WKB Lab
- `POST /api/variational/oscillator` - Variational method for oscillator
- `POST /api/variational/helium` - Variational method for helium
- `POST /api/wkb/tunneling` - WKB tunneling calculations

## API Documentation

Interactive docs: http://localhost:8000/docs
