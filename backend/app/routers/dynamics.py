from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from scipy.linalg import expm

router = APIRouter()

def time_evolve_schrodinger(H, psi0, t_array):
    frames = []
    for t in t_array:
        U_t = expm(-1j * H * t)
        psi_t = U_t @ psi0
        frames.append(psi_t)
    return frames

def heisenberg_operator(A, H, t):
    U_t = expm(-1j * H * t)
    return U_t.conj().T @ A @ U_t

def ehrenfest_theorem(H, obs_list, psi0, t_array):
    expectations = {obs: [] for obs in obs_list}
    for t in t_array:
        U_t = expm(-1j * H * t)
        psi_t = U_t @ psi0
        for obs_name, obs_op in obs_list.items():
            exp_val = np.real(psi_t.conj() @ obs_op @ psi_t)
            expectations[obs_name].append(exp_val)
    return expectations

class SchrodingerRequest(BaseModel):
    H: list
    psi0: list
    tMax: float
    nSteps: int

class HeisenbergRequest(BaseModel):
    A: list
    H: list
    t: float

@router.post("/schrodinger")
def evolve_schrodinger(req: SchrodingerRequest):
    H = np.array(req.H, dtype=complex)
    psi0 = np.array(req.psi0, dtype=complex)
    t_array = np.linspace(0, req.tMax, req.nSteps)
    frames = time_evolve_schrodinger(H, psi0, t_array)
    
    # Convert complex arrays to real/imag components
    frames_real = [[float(x.real) for x in frame] for frame in frames]
    frames_imag = [[float(x.imag) for x in frame] for frame in frames]
    probabilities = [[float(abs(x)**2) for x in frame] for frame in frames]
    
    return {
        "t": t_array.tolist(),
        "frames_real": frames_real,
        "frames_imag": frames_imag,
        "probabilities": probabilities
    }

@router.post("/heisenberg")
def evolve_heisenberg(req: HeisenbergRequest):
    A = np.array(req.A, dtype=complex)
    H = np.array(req.H, dtype=complex)
    A_t = heisenberg_operator(A, H, req.t)
    
    # Convert complex matrix to real/imag components
    A_t_real = [[float(x.real) for x in row] for row in A_t]
    A_t_imag = [[float(x.imag) for x in row] for row in A_t]
    
    return {
        "A_t_real": A_t_real,
        "A_t_imag": A_t_imag
    }
