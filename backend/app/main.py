from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Quantum Mechanics Playground API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Quantum Mechanics Playground API"}

# Import routers
from app.routers import schrodinger, operators, dynamics, spin_angmom, symmetry, variational_wkb

app.include_router(schrodinger.router, prefix="/api/schrodinger", tags=["Schrödinger"])
app.include_router(operators.router, prefix="/api/operators", tags=["Operators"])
app.include_router(dynamics.router, prefix="/api/dynamics", tags=["Dynamics"])
app.include_router(spin_angmom.router, prefix="/api/spin", tags=["Spin & Angular Momentum"])
app.include_router(symmetry.router, prefix="/api/symmetry", tags=["Symmetry"])
app.include_router(variational_wkb.router, prefix="/api/variational", tags=["Variational"])
app.include_router(variational_wkb.wkb_router, prefix="/api/wkb", tags=["WKB"])
