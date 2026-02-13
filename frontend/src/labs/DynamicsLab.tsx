import { useState } from 'react'
import { apiPost } from '../api/client'

export default function DynamicsLab() {
  const [tMax, setTMax] = useState(10)
  const [nSteps, setNSteps] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runSchrodingerEvolution = async () => {
    setLoading(true)
    setError('')
    try {
      const H = [[1, 0], [0, 2]]
      const psi0 = [1, 0]
      const data = await apiPost('/api/dynamics/schrodinger', {
        H,
        psi0,
        tMax,
        nSteps
      })
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="lab">
      <h2>⚡ Quantum Dynamics Lab</h2>
      
      <div className="info-box">
        <strong>⚡ Time evolution:</strong> Explore quantum dynamics in Schrödinger and Heisenberg pictures, 
        and verify the Ehrenfest theorem. Time travel through quantum states! ⏰
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label>t Max</label>
          <input type="number" value={tMax} onChange={e => setTMax(Number(e.target.value))} />
        </div>
        
        <div className="control-group">
          <label>Steps</label>
          <input type="number" value={nSteps} onChange={e => setNSteps(Number(e.target.value))} />
        </div>
      </div>

      <div className="button-group">
        <button className="run-button" onClick={runSchrodingerEvolution} disabled={loading}>
          {loading ? '⏳ Computing...' : '▶️ Run Schrödinger Evolution'}
        </button>
      </div>

      {error && <div className="error">❌ {error}</div>}

      {result && (
        <div className="info-box success">
          ✨ <strong>Success!</strong> Evolution computed with {result.probabilities.length} frames! 
          <br />
          ⏱️ Time range: 0 to {result.t[result.t.length - 1].toFixed(2)} seconds.
          <br />
          🎯 Ready to visualize quantum dynamics!
        </div>
      )}
    </div>
  )
}
