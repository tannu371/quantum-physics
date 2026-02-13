import { useState } from 'react'
import { apiPost } from '../api/client'

export default function SymmetryLab() {
  const [N, setN] = useState(5)
  const [angle, setAngle] = useState(Math.PI / 4)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

  const runRotation = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiPost('/api/symmetry/rotation', { angle, axis: 'z', N })
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="lab">
      <h2>🔄 Symmetry Lab</h2>
      
      <div className="info-box">
        <strong>🔄 Symmetry operations:</strong> Apply rotation, parity, and time-reversal transformations 
        to quantum states and explore conservation laws. Flip, rotate, and reverse! 🔁
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label>Dimension N</label>
          <input type="number" value={N} onChange={e => setN(Number(e.target.value))} />
        </div>
        <div className="control-group">
          <label>Rotation Angle (rad)</label>
          <input type="number" value={angle} onChange={e => setAngle(Number(e.target.value))} step="0.1" />
        </div>
      </div>

      <div className="button-group">
        <button className="run-button" onClick={runRotation} disabled={loading}>
          {loading ? '⏳ Computing...' : '▶️ Apply Rotation'}
        </button>
      </div>

      {error && <div className="error">❌ {error}</div>}
      
      {result && (
        <div className="info-box success">
          ✨ <strong>Rotation Complete!</strong> Operator computed for N={N} dimensional space.
          <br />
          🎲 Eigenvalues: {result.eigenvalues.map((e: number) => e.toFixed(3)).join(', ')}
          <br />
          🌟 Symmetry transformation applied successfully!
        </div>
      )}
      
      {!result && !error && !loading && (
        <div className="info-box">
          💡 Configure symmetry parameters and click "Apply Rotation" to see transformations.
        </div>
      )}
    </div>
  )
}
