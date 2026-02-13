from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()

def rotation_operator(angle, axis, N=10):
    if axis == 'z':
        return np.diag(np.exp(1j * angle * np.arange(N)))
    return np.eye(N, dtype=complex)

def parity_operator(N):
    P = np.zeros((N, N))
    for i in range(N):
        P[i, N-1-i] = 1
    return P

def time_reversal(H, psi):
    psi_reversed = np.conj(psi)
    H_check = np.conj(H)
    return psi_reversed, np.allclose(H, H_check)

class RotationRequest(BaseModel):
    angle: float
    axis: str
    N: int

class ParityRequest(BaseModel):
    N: int

@router.post("/rotation")
def compute_rotation(req: RotationRequest):
    R = rotation_operator(req.angle, req.axis, req.N)
    
    # Convert complex matrix to real/imag components
    R_real = [[float(x.real) for x in row] for row in R]
    R_imag = [[float(x.imag) for x in row] for row in R]
    
    return {
        "operator_real": R_real,
        "operator_imag": R_imag,
        "eigenvalues": np.linalg.eigvals(R).real.tolist()
    }

@router.post("/parity")
def compute_parity(req: ParityRequest):
    P = parity_operator(req.N)
    
    return {
        "operator": P.tolist(),
        "eigenvalues": np.linalg.eigvals(P).tolist()
    }
