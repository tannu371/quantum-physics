# Contributing Guide

Thank you for your interest in contributing to the Quantum Mechanics Playground!

## Development Setup

### Prerequisites
- Docker and Docker Compose (recommended)
- OR: Python 3.13+ with uv, Node.js 24+

### Quick Start

1. Fork and clone the repository
```bash
git clone https://github.com/yourusername/quantum-physics.git
cd quantum-physics
```

2. Start development environment
```bash
make dev
# Or: docker-compose -f docker-compose.dev.yml up
```

3. Access the application
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure

```
quantum-physics/
├── quantum-backend/          # FastAPI backend
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   │   ├── schrodinger.py
│   │   │   ├── operators.py
│   │   │   ├── dynamics.py
│   │   │   ├── spin_angmom.py
│   │   │   ├── symmetry.py
│   │   │   └── variational_wkb.py
│   │   └── main.py          # FastAPI app
│   ├── Dockerfile
│   └── requirements.txt
│
├── quantum-frontend/         # React frontend
│   ├── src/
│   │   ├── labs/            # Lab components
│   │   ├── api/             # API client
│   │   ├── App.tsx          # Main app
│   │   └── App.css
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Production
├── docker-compose.dev.yml    # Development
└── Makefile                  # Common commands
```

## Making Changes

### Backend Changes

1. Navigate to backend directory
```bash
cd quantum-backend
```

2. Activate virtual environment (local dev)
```bash
source .venv/bin/activate
```

3. Make your changes in `app/routers/`

4. Test your changes
```bash
uvicorn app.main:app --reload
```

### Frontend Changes

1. Navigate to frontend directory
```bash
cd quantum-frontend
```

2. Make your changes in `src/labs/`

3. Test your changes
```bash
npm run dev
```

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Add docstrings for functions
- Keep functions focused and small

### TypeScript (Frontend)
- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Keep components modular

## Adding a New Lab

### 1. Backend Router

Create `quantum-backend/app/routers/new_lab.py`:

```python
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class NewLabRequest(BaseModel):
    param1: float
    param2: int

@router.post("/endpoint")
def compute_something(req: NewLabRequest):
    # Your quantum mechanics logic
    result = {"data": []}
    return result
```

Register in `app/main.py`:
```python
from app.routers import new_lab
app.include_router(new_lab.router, prefix="/api/new-lab", tags=["New Lab"])
```

### 2. Frontend Component

Create `quantum-frontend/src/labs/NewLab.tsx`:

```typescript
import { useState } from 'react'
import Plot from 'react-plotly.js'
import { apiPost } from '../api/client'

export default function NewLab() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runComputation = async () => {
    setLoading(true)
    try {
      const data = await apiPost('/api/new-lab/endpoint', {
        param1: 1.0,
        param2: 10
      })
      setResult(data)
    } catch (err: any) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="lab">
      <h2>New Lab</h2>
      <button onClick={runComputation} disabled={loading}>
        Run
      </button>
      {result && <Plot data={[/* your plot data */]} />}
    </div>
  )
}
```

Add to `App.tsx`:
```typescript
import NewLab from './labs/NewLab'
// Add to tabs array and render logic
```

## Testing

### Backend Tests
```bash
cd quantum-backend
pytest  # When tests are implemented
```

### Frontend Tests
```bash
cd quantum-frontend
npm test  # When tests are implemented
```

## Submitting Changes

1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit
```bash
git add .
git commit -m "Add: description of your changes"
```

3. Push to your fork
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

## Pull Request Guidelines

- Provide a clear description of changes
- Reference any related issues
- Ensure code follows style guidelines
- Add tests if applicable
- Update documentation if needed

## Questions?

Open an issue or reach out to the maintainers!
