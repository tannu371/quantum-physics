import { useState } from 'react'
import Plot from 'react-plotly.js'
import { apiPost } from '../api/client'

export default function VariationalWkbLab() {
  const [mode, setMode] = useState('oscillator')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runVariationalOscillator = async () => {
    setLoading(true)
    setError('')
    try {
      const alphaArray = Array.from({ length: 50 }, (_, i) => 0.1 + i * 0.1)
      const data = await apiPost('/api/variational/oscillator', {
        alphaArray,
        potentialType: 'harmonic',
        potentialParams: { omega: 1.0 }
      })
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="lab">
      <h2>📊 Variational & WKB Lab</h2>
      
      <div className="info-box">
        <strong>📊 Approximation methods:</strong> Use variational principles to find ground state energies 
        and apply WKB approximation for tunneling calculations. Quantum shortcuts! 🚀
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label>Method</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="oscillator">Variational Oscillator</option>
            <option value="helium">Variational Helium</option>
            <option value="tunneling">WKB Tunneling</option>
          </select>
        </div>
      </div>

      <div className="button-group">
        <button className="run-button" onClick={runVariationalOscillator} disabled={loading}>
          {loading ? '⏳ Computing...' : '▶️ Run Variational Method'}
        </button>
      </div>

      {error && <div className="error">❌ {error}</div>}

      {result && (
        <div className="plot-container">
          <Plot
            data={[
              {
                x: result.alphaArray,
                y: result.energies,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'E(α)',
                line: { color: '#667eea', width: 3 },
                marker: { size: 6, color: '#764ba2' }
              }
            ]}
            layout={{ 
              title: 'Variational Energy vs Parameter',
              xaxis: { title: 'Variational Parameter α' },
              yaxis: { title: 'Energy E' },
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
