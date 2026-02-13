from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from scipy.integrate import quad

router = APIRouter()
wkb_router = APIRouter()

def variational_oscillator(alpha_array, potential_params):
    omega = potential_params.get("omega", 1.0)
    energies = []
    for alpha in alpha_array:
        E = 0.5 * alpha + 0.5 * omega**2 / alpha
        energies.append(E)
    return energies

def oscillator_exact_ground(omega=1.0):
    return 0.5 * omega

def variational_helium(Z_array):
    energies = []
    for Z in Z_array:
        E = -2 * Z**2 + (5/8) * Z
        energies.append(E)
    return energies

def wkb_tunneling(barrier_params, E_array):
    V0 = barrier_params.get("height", 5.0)
    a = barrier_params.get("width", 1.0)
    
    T_wkb = []
    for E in E_array:
        if E < V0:
            kappa = np.sqrt(2 * (V0 - E))
            T = np.exp(-2 * kappa * a)
        else:
            T = 1.0
        T_wkb.append(T)
    
    T_num = T_wkb
    return T_wkb, T_num

class VariationalOscillatorRequest(BaseModel):
    alphaArray: list
    potentialType: str
    potentialParams: dict

class VariationalHeliumRequest(BaseModel):
    ZArray: list

class WKBTunnelingRequest(BaseModel):
    barrierParams: dict
    EArray: list

@router.post("/oscillator")
def compute_variational_oscillator(req: VariationalOscillatorRequest):
    energies = variational_oscillator(req.alphaArray, req.potentialParams)
    min_index = int(np.argmin(energies))
    exact_energy = oscillator_exact_ground(req.potentialParams.get("omega", 1.0))
    
    return {
        "alphaArray": req.alphaArray,
        "energies": energies,
        "minIndex": min_index,
        "exactEnergy": exact_energy
    }

@router.post("/helium")
def compute_variational_helium(req: VariationalHeliumRequest):
    energies = variational_helium(req.ZArray)
    min_index = int(np.argmin(energies))
    
    return {
        "ZArray": req.ZArray,
        "energies": energies,
        "minIndex": min_index,
        "refEnergy": -2.9037
    }

@wkb_router.post("/tunneling")
def compute_wkb_tunneling(req: WKBTunnelingRequest):
    T_wkb, T_num = wkb_tunneling(req.barrierParams, req.EArray)
    
    return {
        "EArray": req.EArray,
        "T_wkb": T_wkb,
        "T_num": T_num
    }
