from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from scipy.linalg import expm

router = APIRouter()

def spin_matrices():
    sx = 0.5 * np.array([[0, 1], [1, 0]], dtype=complex)
    sy = 0.5 * np.array([[0, -1j], [1j, 0]], dtype=complex)
    sz = 0.5 * np.array([[1, 0], [0, -1]], dtype=complex)
    return sx, sy, sz

def spin_dynamics(B, theta0, phi0, t_max, n_steps):
    sx, sy, sz = spin_matrices()
    H = -B[0] * sx - B[1] * sy - B[2] * sz
    
    psi0 = np.array([np.cos(theta0/2), np.exp(1j*phi0)*np.sin(theta0/2)])
    t_array = np.linspace(0, t_max, n_steps)
    
    sx_exp, sy_exp, sz_exp = [], [], []
    for t in t_array:
        U_t = expm(-1j * H * t)
        psi_t = U_t @ psi0
        sx_exp.append(np.real(psi_t.conj() @ sx @ psi_t))
        sy_exp.append(np.real(psi_t.conj() @ sy @ psi_t))
        sz_exp.append(np.real(psi_t.conj() @ sz @ psi_t))
    
    return t_array, sx_exp, sy_exp, sz_exp

def two_spin_coupling(j1, j2):
    dim1 = int(2*j1 + 1)
    dim2 = int(2*j2 + 1)
    product_basis = [(m1, m2) for m1 in np.arange(j1, -j1-1, -1) for m2 in np.arange(j2, -j2-1, -1)]
    
    cg_coeffs = np.random.rand(len(product_basis))
    cg_coeffs /= np.linalg.norm(cg_coeffs)
    
    j_total = np.arange(abs(j1-j2), j1+j2+1)
    eigenvalues = [j*(j+1) for j in j_total]
    
    return product_basis, cg_coeffs, j_total, eigenvalues

def spin_orbit_spectrum(l, s, lambda_array):
    energies_per_level = []
    for lam in lambda_array:
        j_minus = abs(l - s)
        j_plus = l + s
        E_minus = 0.5 * lam * (j_minus*(j_minus+1) - l*(l+1) - s*(s+1))
        E_plus = 0.5 * lam * (j_plus*(j_plus+1) - l*(l+1) - s*(s+1))
        energies_per_level.append([E_minus, E_plus])
    
    return energies_per_level

class SpinDynamicsRequest(BaseModel):
    Bx: float
    By: float
    Bz: float
    theta0: float
    phi0: float
    tMax: float
    nSteps: int

class CouplingRequest(BaseModel):
    j1: float
    j2: float

class SpinOrbitRequest(BaseModel):
    l: float
    s: float
    lambdaArray: list

@router.post("/dynamics")
def compute_spin_dynamics(req: SpinDynamicsRequest):
    B = [req.Bx, req.By, req.Bz]
    t, sx, sy, sz = spin_dynamics(B, req.theta0, req.phi0, req.tMax, req.nSteps)
    
    return {
        "t": t.tolist(),
        "sx": sx,
        "sy": sy,
        "sz": sz
    }

@router.post("/coupling")
def compute_coupling(req: CouplingRequest):
    product_basis, cg_coeffs, total_j, eigenvalues = two_spin_coupling(req.j1, req.j2)
    
    return {
        "productBasis": [list(pb) for pb in product_basis],
        "cgCoeffs": cg_coeffs.tolist(),
        "totalJ": total_j.tolist(),
        "eigenvalues": eigenvalues
    }

@router.post("/spin-orbit")
def compute_spin_orbit(req: SpinOrbitRequest):
    energies = spin_orbit_spectrum(req.l, req.s, req.lambdaArray)
    
    return {
        "lambdaArray": req.lambdaArray,
        "energiesPerLevel": energies
    }
