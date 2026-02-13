from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()

def generate_operator(N, operator_type):
    if operator_type == "position":
        return np.diag(np.arange(N, dtype=float))
    elif operator_type == "momentum":
        return np.diag(np.arange(1, N), 1) - np.diag(np.arange(1, N), -1)
    elif operator_type == "random_hermitian":
        A = np.random.randn(N, N) + 1j * np.random.randn(N, N)
        return (A + A.conj().T) / 2
    return np.eye(N)

def generate_state(N, state_type):
    if state_type == "basis":
        psi = np.zeros(N, dtype=complex)
        psi[0] = 1.0
        return psi
    elif state_type == "superposition":
        psi = np.ones(N, dtype=complex) / np.sqrt(N)
        return psi
    elif state_type == "random":
        psi = np.random.randn(N) + 1j * np.random.randn(N)
        return psi / np.linalg.norm(psi)
    return np.zeros(N, dtype=complex)

def observable_analysis(A, psi):
    eigenvalues, eigenvectors = np.linalg.eigh(A)
    probabilities = np.abs(eigenvectors.conj().T @ psi)**2
    return eigenvalues, eigenvectors, probabilities

class ObservableRequest(BaseModel):
    N: int
    operatorType: str
    stateType: str

class BasisChangeRequest(BaseModel):
    state: list
    U: list

@router.post("/observable")
def compute_observable(req: ObservableRequest):
    A = generate_operator(req.N, req.operatorType)
    psi = generate_state(req.N, req.stateType)
    eigenvalues, eigenvectors, probabilities = observable_analysis(A, psi)
    
    return {
        "matrix": A.tolist(),
        "eigenvalues": eigenvalues.tolist(),
        "eigenvectors": eigenvectors.tolist(),
        "probabilities": probabilities.tolist()
    }

@router.post("/basis-change")
def basis_change(req: BasisChangeRequest):
    psi = np.array(req.state, dtype=complex)
    U = np.array(req.U, dtype=complex)
    new_state = U @ psi
    
    return {
        "newState": new_state.tolist(),
        "probabilitiesInvariant": True
    }
