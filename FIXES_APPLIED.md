# API Fixes Applied ✅

## Issue
Dynamics and Symmetry labs were returning "Failed to fetch" errors due to complex number serialization issues.

## Root Cause
FastAPI cannot serialize Python complex numbers to JSON. The endpoints were trying to return complex numpy arrays directly, which caused serialization errors.

## Solution

### Backend Changes

#### 1. Dynamics Router (`backend/app/routers/dynamics.py`)
- Split complex arrays into separate real and imaginary components
- Convert numpy arrays to Python lists with explicit float conversion
- Return structured JSON with `frames_real`, `frames_imag`, and `probabilities`

**Before:**
```python
return {
    "t": t_array.tolist(),
    "frames": [frame.tolist() for frame in frames]  # ❌ Complex numbers
}
```

**After:**
```python
frames_real = [[float(x.real) for x in frame] for frame in frames]
frames_imag = [[float(x.imag) for x in frame] for frame in frames]
probabilities = [[float(abs(x)**2) for x in frame] for frame in frames]

return {
    "t": t_array.tolist(),
    "frames_real": frames_real,
    "frames_imag": frames_imag,
    "probabilities": probabilities
}
```

#### 2. Symmetry Router (`backend/app/routers/symmetry.py`)
- Split rotation operator into real and imaginary components
- Added eigenvalue computation for visualization
- Proper float conversion for all numeric values

**Before:**
```python
return {"operator": R.tolist()}  # ❌ Complex matrix
```

**After:**
```python
R_real = [[float(x.real) for x in row] for row in R]
R_imag = [[float(x.imag) for x in row] for row in R]

return {
    "operator_real": R_real,
    "operator_imag": R_imag,
    "eigenvalues": np.linalg.eigvals(R).real.tolist()
}
```

### Frontend Changes

#### 1. DynamicsLab.tsx
- Updated to handle new response format with `probabilities` array
- Better success message showing time range

#### 2. SymmetryLab.tsx
- Added `result` state to store API response
- Display eigenvalues in success message
- Better conditional rendering

## Testing

### Dynamics Endpoint
```bash
curl -X POST http://localhost:8000/api/dynamics/schrodinger \
  -H "Content-Type: application/json" \
  -d '{"H":[[1,0],[0,2]],"psi0":[1,0],"tMax":10,"nSteps":5}'
```

✅ Returns proper JSON with real/imag components

### Symmetry Endpoint
```bash
curl -X POST http://localhost:8000/api/symmetry/rotation \
  -H "Content-Type: application/json" \
  -d '{"angle":1.57,"axis":"z","N":3}'
```

✅ Returns rotation operator with eigenvalues

## Status
Both labs now work correctly without "Failed to fetch" errors! 🎉
