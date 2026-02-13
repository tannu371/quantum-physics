# Frontend

React + TypeScript frontend for interactive quantum mechanics visualization.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

## Project Structure

```
src/
  api/
    client.ts          # API client utilities
  labs/
    SchrodingerLab.tsx
    StateOperatorLab.tsx
    DynamicsLab.tsx
    SpinLab.tsx
    SymmetryLab.tsx
    VariationalWkbLab.tsx
  App.tsx              # Main app with navigation
  App.css              # Styling
```

## Technologies

- React 18
- TypeScript
- Vite
- React-Plotly.js for visualizations
- FastAPI backend proxy
