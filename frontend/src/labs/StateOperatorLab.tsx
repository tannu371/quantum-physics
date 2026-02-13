import { useState } from 'react'
import Plot from 'react-plotly.js'
import { apiPost } from '../api/client'

export default function StateOperatorLab() {
  const [N, setN] = useState(5)
  const [operatorType, setOperatorType] = useState('position')
  const [stateType, setStateType] = useState('superposition')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runObservable = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiPost('/api/operators/observable', {
        N,
        operatorType,
        stateType
      })
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="lab">
      <h2>🎯 State & Operator Lab</h2>
      
      <div className="info-box">
        <strong>🎯 Quantum observables:</strong> Generate quantum states and operators, 
        compute eigenvalues, and analyze measurement probabilities. Watch quantum mechanics in action!
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label>Dimension N</label>
          <input type="number" value={N} onChange={e => setN(Number(e.target.value))} min="2" max="20" />
        </div>
        
        <div className="control-group">
          <label>Operator Type</label>
          <select value={operatorType} onChange={e => setOperatorType(e.target.value)}>
            <option value="position">Position</option>
            <option value="momentum">Momentum</option>
            <option value="random_hermitian">Random Hermitian</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>State Type</label>
          <select value={stateType} onChange={e => setStateType(e.target.value)}>
            <option value="basis">Basis State</option>
            <option value="superposition">Equal Superposition</option>
            <option value="random">Random</option>
          </select>
        </div>
      </div>

      <div className="button-group">
        <button className="run-button" onClick={runObservable} disabled={loading}>
          {loading ? '⏳ Computing...' : '▶️ Run Observable Analysis'}
        </button>
      </div>

      {error && <div className="error">❌ {error}</div>}

      {result && (
        <div className="plot-container">
          <Plot
            data={[
              {
                x: result.eigenvalues.map((_: any, i: number) => `State ${i}`),
                y: result.probabilities,
                type: 'bar',
                name: 'Measurement Probabilities',
                marker: { color: '#667eea' }
              }
            ]}
            layout={{ 
              title: 'Measurement Probabilities',
              xaxis: { title: 'Eigenstate' },
              yaxis: { title: 'Probability' },
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
