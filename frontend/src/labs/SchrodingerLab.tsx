import { useState } from 'react'
import Plot from 'react-plotly.js'
import { apiPost } from '../api/client'

export default function SchrodingerLab() {
  const [potentialType, setPotentialType] = useState('harmonic')
  const [omega, setOmega] = useState(1.0)
  const [xMin, setXMin] = useState(-5)
  const [xMax, setXMax] = useState(5)
  const [nPoints] = useState(200)
  const [nLevels, setNLevels] = useState(5)
  const [tMax] = useState(10)
  const [nFrames] = useState(50)
  
  const [spectrumData, setSpectrumData] = useState<any>(null)
  const [timeData, setTimeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [frameIndex, setFrameIndex] = useState(0)

  const runSpectrum = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await apiPost('/api/schrodinger/spectrum', {
        potentialType,
        params: { omega },
        xMin,
        xMax,
        nPoints,
        nLevels
      })
      setSpectrumData(result)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  const runTimeEvolution = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await apiPost('/api/schrodinger/time-evolution', {
        potentialType,
        params: { omega },
        xMin,
        xMax,
        nPoints,
        psi0: { n: 0 },
        tMax,
        nFrames
      })
      setTimeData(result)
      setFrameIndex(0)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="lab">
      <h2>🌊 Schrödinger Equation Lab</h2>
      
      <div className="info-box">
        <strong>🌊 Explore quantum systems:</strong> Solve the time-independent Schrödinger equation 
        for different potentials and visualize energy eigenstates and time evolution. 
        See the wave function dance! 💃
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label>Potential Type</label>
          <select value={potentialType} onChange={e => setPotentialType(e.target.value)}>
            <option value="harmonic">Harmonic Oscillator</option>
            <option value="square_well">Square Well</option>
            <option value="barrier">Barrier</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>ω (omega)</label>
          <input type="number" value={omega} onChange={e => setOmega(Number(e.target.value))} step="0.1" />
        </div>
        
        <div className="control-group">
          <label>x Min</label>
          <input type="number" value={xMin} onChange={e => setXMin(Number(e.target.value))} />
        </div>
        
        <div className="control-group">
          <label>x Max</label>
          <input type="number" value={xMax} onChange={e => setXMax(Number(e.target.value))} />
        </div>
        
        <div className="control-group">
          <label>Energy Levels</label>
          <input type="number" value={nLevels} onChange={e => setNLevels(Number(e.target.value))} min="1" max="10" />
        </div>
      </div>

      <div className="button-group">
        <button className="run-button" onClick={runSpectrum} disabled={loading}>
          {loading ? '⏳ Computing...' : '▶️ Run Spectrum'}
        </button>
        
        <button className="run-button" onClick={runTimeEvolution} disabled={loading}>
          {loading ? '⏳ Computing...' : '🎬 Run Time Evolution'}
        </button>
      </div>

      {error && <div className="error">❌ {error}</div>}

      {spectrumData && (
        <div className="plot-container">
          <Plot
            data={[
              {
                x: spectrumData.x,
                y: spectrumData.V,
                type: 'scatter',
                mode: 'lines',
                name: 'V(x)',
                line: { color: '#667eea', width: 3 }
              }
            ]}
            layout={{ 
              title: 'Potential and Energy Levels',
              xaxis: { title: 'Position x' },
              yaxis: { title: 'V(x)' },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)'
            }}
            style={{ width: '100%', height: '500px' }}
          />
        </div>
      )}

      {timeData && (
        <div className="plot-container">
          <Plot
            data={[
              {
                x: timeData.x,
                y: timeData.densityFrames[frameIndex],
                type: 'scatter',
                mode: 'lines',
                name: '|ψ|²',
                fill: 'tozeroy',
                line: { color: '#764ba2', width: 2 }
              }
            ]}
            layout={{ 
              title: `Time Evolution (t = ${timeData.t[frameIndex].toFixed(2)})`,
              xaxis: { title: 'Position x' },
              yaxis: { title: 'Probability Density |ψ|²' },
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
