import { useState } from 'react'
import Plot from 'react-plotly.js'
import { apiPost } from '../api/client'

export default function SpinLab() {
  const [Bx, setBx] = useState(0)
  const [By, setBy] = useState(0)
  const [Bz, setBz] = useState(1)
  const [theta0] = useState(Math.PI / 4)
  const [phi0] = useState(0)
  const [tMax] = useState(10)
  const [nSteps] = useState(100)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runSpinDynamics = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiPost('/api/spin/dynamics', {
        Bx, By, Bz, theta0, phi0, tMax, nSteps
      })
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="lab">
      <h2>🌀 Spin & Angular Momentum Lab</h2>
      
      <div className="info-box">
        <strong>🌀 Spin dynamics:</strong> Simulate spin precession in magnetic fields, 
        explore angular momentum coupling, and visualize spin-orbit interactions. 
        Watch particles spin! 🎡
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label>Bx (Tesla)</label>
          <input type="number" value={Bx} onChange={e => setBx(Number(e.target.value))} step="0.1" />
        </div>
        <div className="control-group">
          <label>By (Tesla)</label>
          <input type="number" value={By} onChange={e => setBy(Number(e.target.value))} step="0.1" />
        </div>
        <div className="control-group">
          <label>Bz (Tesla)</label>
          <input type="number" value={Bz} onChange={e => setBz(Number(e.target.value))} step="0.1" />
        </div>
      </div>

      <div className="button-group">
        <button className="run-button" onClick={runSpinDynamics} disabled={loading}>
          {loading ? '⏳ Computing...' : '▶️ Run Spin Dynamics'}
        </button>
      </div>

      {error && <div className="error">❌ {error}</div>}

      {result && (
        <div className="plot-container">
          <Plot
            data={[
              { x: result.t, y: result.sx, type: 'scatter', mode: 'lines', name: '⟨Sx⟩', line: { color: '#667eea' } },
              { x: result.t, y: result.sy, type: 'scatter', mode: 'lines', name: '⟨Sy⟩', line: { color: '#764ba2' } },
              { x: result.t, y: result.sz, type: 'scatter', mode: 'lines', name: '⟨Sz⟩', line: { color: '#f093fb' } }
            ]}
            layout={{ 
              title: 'Spin Expectation Values',
              xaxis: { title: 'Time (s)' },
              yaxis: { title: '⟨S⟩ (ℏ/2)' },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)'
            }}
            style={{ width: '100%', height: '500px' }}
          />
        </div>
      )}
    </div>
  )
}
