import { useState } from 'react'
import './App.css'
import SchrodingerLab from './labs/SchrodingerLab'
import StateOperatorLab from './labs/StateOperatorLab'
import DynamicsLab from './labs/DynamicsLab'
import SpinLab from './labs/SpinLab'
import SymmetryLab from './labs/SymmetryLab'
import VariationalWkbLab from './labs/VariationalWkbLab'

function App() {
  const [activeTab, setActiveTab] = useState('schrodinger')

  const tabs = [
    { id: 'schrodinger', label: 'Schrödinger' },
    { id: 'operators', label: 'State & Operators' },
    { id: 'dynamics', label: 'Dynamics' },
    { id: 'spin', label: 'Spin & Angular Momentum' },
    { id: 'symmetry', label: 'Symmetry' },
    { id: 'variational', label: 'Variational & WKB' },
  ]

  return (
    <div className="app">
      <header>
        <h1>⚛️ Quantum Mechanics Playground ⚡</h1>
        <p>🚀 Interactive simulations for quantum physics exploration 🌌</p>
      </header>
      
      <nav className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === 'schrodinger' && <SchrodingerLab />}
        {activeTab === 'operators' && <StateOperatorLab />}
        {activeTab === 'dynamics' && <DynamicsLab />}
        {activeTab === 'spin' && <SpinLab />}
        {activeTab === 'symmetry' && <SymmetryLab />}
        {activeTab === 'variational' && <VariationalWkbLab />}
      </main>
    </div>
  )
}

export default App
