# Schrödinger Equation Solver

A comprehensive computational exploration of quantum mechanics using Python, NumPy, SciPy, and Matplotlib.

## 📚 Notebooks

| Notebook | Topic | Key Concepts |
|----------|-------|--------------|
| `01_setup_and_grid.ipynb` | Setup & Grid | Finite-difference method, kinetic energy matrix |
| `02_harmonic_oscillator.ipynb` | Harmonic Oscillator | Stationary states, energy quantization |
| `03_finite_well.ipynb` | Finite Square Well | Bound states, quantum tunneling |
| `04_time_evolution.ipynb` | Time Evolution | Wave packets, Ehrenfest theorem, animation |
| `05_hydrogen_radial.ipynb` | Hydrogen Atom | Radial wavefunctions, atomic orbitals |

## 🚀 Getting Started

### Requirements
```bash
pip install numpy scipy matplotlib
```

### Run Notebooks
```bash
jupyter notebook
# Then open any .ipynb file
```

## 🧮 Mathematical Background

### The Schrödinger Equation
$$\hat{H}\psi = E\psi$$

where $\hat{H} = -\frac{\hbar^2}{2m}\frac{d^2}{dx^2} + V(x)$

### Finite Difference Method
We discretize the second derivative:
$$\frac{d^2\psi}{dx^2} \approx \frac{\psi_{i+1} - 2\psi_i + \psi_{i-1}}{\Delta x^2}$$

This converts the differential equation into a **matrix eigenvalue problem**.

## 📊 Example Outputs

Each notebook produces:
- Wavefunction plots $|\psi(x)|^2$
- Energy level comparisons (numerical vs analytical)
- Interactive animations (Part 4)
- Comparison tables validating the method

## 🎯 Learning Objectives

1. Understand finite-difference methods for quantum mechanics
2. Visualize wavefunctions and probability densities
3. Observe quantum tunneling in finite wells
4. Animate wave packet dynamics
5. Solve the hydrogen atom radial equation

## 📝 License

Educational use - feel free to modify and extend!
