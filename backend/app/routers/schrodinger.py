from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from scipy.linalg import eigh_tridiagonal
from scipy.integrate import odeint

router = APIRouter()

def build_potential(x, potential_type, params):
    if potential_type == "harmonic":
        omega = params.get("omega", 1.0)
        return 0.5 * omega**2 * x**2
    elif potential_type == "square_well":
        width = params.get("width", 2.0)
        return np.where(np.abs(x) < width/2, 0, params.get("height", 100))
    elif potential_type == "barrier":
        width = params.get("width", 1.0)
        height = params.get("height", 5.0)
        return np.where(np.abs(x) < width/2, height, 0)
    return np.zeros_like(x)

def solve_spectrum(x, V, n_levels):
    dx = x[1] - x[0]
    N = len(x)
    diag = 1.0/dx**2 + V
    off_diag = -0.5/dx**2 * np.ones(N-1)
    energies, eigenvecs = eigh_tridiagonal(diag, off_diag, select='i', select_range=(0, n_levels-1))
    eigenvecs = eigenvecs / np.sqrt(dx)
    return energies, eigenvecs.T

def time_evolution(x, V, psi0_params, t_max, n_frames):
    dx = x[1] - x[0]
    energies, eigenfuncs = solve_spectrum(x, V, 20)
    
    n = psi0_params.get("n", 0)
    psi0 = eigenfuncs[n]
    
    t_array = np.linspace(0, t_max, n_frames)
    frames = []
    for t in t_array:
        psi_t = psi0 * np.exp(-1j * energies[n] * t)
        frames.append(np.abs(psi_t)**2)
    
    return t_array, frames

class SpectrumRequest(BaseModel):
    potentialType: str
    params: dict
    xMin: float
    xMax: float
    nPoints: int
    nLevels: int

class TimeEvolutionRequest(BaseModel):
    potentialType: str
    params: dict
    xMin: float
    xMax: float
    nPoints: int
    psi0: dict
    tMax: float
    nFrames: int

@router.post("/spectrum")
def compute_spectrum(req: SpectrumRequest):
    x = np.linspace(req.xMin, req.xMax, req.nPoints)
    V = build_potential(x, req.potentialType, req.params)
    energies, eigenfuncs = solve_spectrum(x, V, req.nLevels)
    
    return {
        "x": x.tolist(),
        "V": V.tolist(),
        "energies": energies.tolist(),
        "eigenfuncs": [ef.tolist() for ef in eigenfuncs]
    }

@router.post("/time-evolution")
def compute_time_evolution(req: TimeEvolutionRequest):
    x = np.linspace(req.xMin, req.xMax, req.nPoints)
    V = build_potential(x, req.potentialType, req.params)
    t_array, frames = time_evolution(x, V, req.psi0, req.tMax, req.nFrames)
    
    return {
        "x": x.tolist(),
        "t": t_array.tolist(),
        "densityFrames": [frame.tolist() for frame in frames]
    }
