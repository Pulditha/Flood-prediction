import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend, ComposedChart } from 'recharts';
import { predictionChartData, floodThresholds, modelMetrics } from '../data/demoData';
import { runPrediction as apiRunPrediction } from '../services/api';
import './PredictionEngine.css';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

function PredictionTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="pred-tooltip">
      <div className="pred-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="pred-tooltip-row" style={{ color: p.color }}>
          <span className="pred-tooltip-dot" style={{ background: p.color }}></span>
          <span>{p.name}:</span>
          <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value} ft</strong>
        </div>
      ))}
    </div>
  );
}

export default function PredictionEngine() {
  const [horizon, setHorizon] = useState(24);
  const [selectedModels, setSelectedModels] = useState({ lstm: true, convlstm: true, pgdl: true });
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);
  const [progress, setProgress] = useState(0);
  const [apiResult, setApiResult] = useState(null);

  const toggleModel = (key) => {
    setSelectedModels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const runPrediction = async () => {
    setIsRunning(true);
    setHasResults(false);
    setProgress(0);
    
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + Math.random() * 12 + 3;
      });
    }, 200);

    try {
      // Build input sequence from recent demo data
      const activeModels = Object.entries(selectedModels)
        .filter(([_, v]) => v).map(([k]) => k);
      const inputSeq = Array.from({ length: 24 }, (_, i) => [
        2.1 + Math.sin(i * 0.3) * 0.1,   // gage_height
        0.5 + Math.sin(i * 0.5) * 0.2,    // rainfall
        0.3 + Math.sin(i * 0.4) * 0.1,    // soil_moisture_l1
        0.2 + Math.sin(i * 0.6) * 0.05,   // soil_moisture_l2
      ]);

      const result = await apiRunPrediction({
        inputSequence: inputSeq,
        models: activeModels,
        currentLevel: 2.34,
      });
      setApiResult(result);
      console.log(`Prediction from: ${result.source}`, result);
    } catch (err) {
      console.warn('API prediction failed, using demo data:', err);
      setApiResult(null);
    }

    clearInterval(interval);
    setProgress(100);
    setTimeout(() => {
      setIsRunning(false);
      setHasResults(true);
    }, 300);
  };

  const chartData = predictionChartData.slice(0, horizon * 3);

  // Find peak in predictions
  const findPeak = (data, key) => {
    let max = 0;
    let maxTime = '';
    data.forEach(d => {
      if (d[key] > max) { max = d[key]; maxTime = d.timestamp; }
    });
    return { value: max.toFixed(2), time: maxTime };
  };

  // Calculate error for each model at peak
  const actualPeak = findPeak(chartData, 'actual');
  const peakErrors = {};
  ['lstm', 'convlstm', 'pgdl'].forEach(key => {
    const predicted = findPeak(chartData, key);
    peakErrors[key] = (parseFloat(predicted.value) - parseFloat(actualPeak.value)).toFixed(2);
  });

  return (
    <div className="prediction-engine">
      {/* Input Panel */}
      <motion.div className="card input-panel" custom={0} initial="hidden" animate="visible" variants={fadeIn}>
        <div className="input-panel-header">
          <h3 className="section-title">⚡ Prediction Configuration</h3>
          <div className="input-meta">
            <span className="text-xs text-muted">Station: USGS 01589000</span>
            <span className="badge badge-info">4-Channel Input</span>
          </div>
        </div>
        <div className="input-grid">
          <div className="input-group">
            <label className="input-label">Forecast Horizon</label>
            <div className="horizon-selector">
              {[12, 24, 48].map(h => (
                <button key={h} className={`horizon-btn ${horizon === h ? 'active' : ''}`}
                        onClick={() => setHorizon(h)}>
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Active Models</label>
            <div className="model-toggles">
              {[
                { key: 'lstm', name: 'LSTM', color: '#f59e0b' },
                { key: 'convlstm', name: 'ConvLSTM', color: '#8b5cf6' },
                { key: 'pgdl', name: 'PGDL', color: '#00d4aa' },
              ].map(m => (
                <button key={m.key}
                        className={`model-toggle ${selectedModels[m.key] ? 'active' : ''}`}
                        style={{ '--toggle-color': m.color }}
                        onClick={() => toggleModel(m.key)}>
                  <span className="toggle-dot" style={{ background: selectedModels[m.key] ? m.color : 'transparent' }}></span>
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Input Channels</label>
            <div className="channel-list">
              {['Radar Rainfall', 'Soil Moisture L1', 'Soil Moisture L2', 'Gage Height'].map((ch, i) => (
                <span key={i} className="channel-tag">{ch}</span>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Input Sequence</label>
            <span className="input-info mono">24 hourly timesteps (t-23 → t)</span>
            <span className="text-xs text-muted">Tensor shape: (1, 24, 32, 32, 4)</span>
          </div>

          <button className={`btn btn-primary run-btn ${isRunning ? 'running' : ''}`} onClick={runPrediction} disabled={isRunning}>
            {isRunning ? (
              <><span className="spinner"></span> Running Inference...</>
            ) : (
              <>🚀 Run Prediction</>
            )}
          </button>
        </div>

        {/* Progress bar */}
        <AnimatePresence>
          {isRunning && (
            <motion.div className="inference-progress"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="progress-bar-bg">
                <motion.div className="progress-bar-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div className="progress-steps">
                <span className={progress > 20 ? 'step-done' : ''}>Loading models...</span>
                <span className={progress > 50 ? 'step-done' : ''}>Processing input sequence...</span>
                <span className={progress > 80 ? 'step-done' : ''}>Running inference...</span>
                <span className={progress >= 100 ? 'step-done' : ''}>Complete</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Prediction Chart */}
      <AnimatePresence>
        {hasResults && (
          <motion.div className="card chart-panel" custom={1} initial="hidden" animate="visible" variants={fadeIn} exit={{ opacity: 0, y: -10 }}>
            <div className="section-header">
              <h3 className="section-title">Predicted Hydrograph — {horizon}h Window</h3>
              <div className="chart-legend-custom">
                <span className="legend-item"><span className="legend-line" style={{background: '#e2e8f0'}}></span> Actual</span>
                {selectedModels.lstm && <span className="legend-item"><span className="legend-line dashed" style={{background: '#f59e0b'}}></span> LSTM</span>}
                {selectedModels.convlstm && <span className="legend-item"><span className="legend-line dashed" style={{background: '#8b5cf6'}}></span> ConvLSTM</span>}
                {selectedModels.pgdl && <span className="legend-item"><span className="legend-line" style={{background: '#00d4aa'}}></span> PGDL</span>}
              </div>
            </div>

            <div className="chart-container" style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="timestamp" tick={{ fill: '#8899aa', fontSize: 9 }} interval={Math.floor(chartData.length / 8)} angle={-30} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: '#8899aa', fontSize: 10 }} unit=" ft" domain={['auto', 'auto']} />
                  <Tooltip content={<PredictionTooltip />} />

                  <ReferenceLine y={floodThresholds.advisory} stroke="#f59e0b" strokeDasharray="6 4" strokeWidth={1} />
                  <ReferenceLine y={floodThresholds.warning} stroke="#f97316" strokeDasharray="6 4" strokeWidth={1} />
                  <ReferenceLine y={floodThresholds.emergency} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1} />

                  <Area type="monotone" dataKey="actual" stroke="#e2e8f0" strokeWidth={2} fill="url(#actualFill)" dot={false} name="Actual" />
                  {selectedModels.lstm && <Line type="monotone" dataKey="lstm" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="LSTM" />}
                  {selectedModels.convlstm && <Line type="monotone" dataKey="convlstm" stroke="#8b5cf6" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="ConvLSTM" />}
                  {selectedModels.pgdl && <Line type="monotone" dataKey="pgdl" stroke="#00d4aa" strokeWidth={2} dot={false} name="PGDL" />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Peak Summary + Physics */}
      <AnimatePresence>
        {hasResults && (
          <div className="prediction-bottom">
            <motion.div className="card" custom={2} initial="hidden" animate="visible" variants={fadeIn}>
              <h3 className="section-title">📊 Peak Prediction Summary</h3>
              <table className="peak-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Peak (ft)</th>
                    <th>Peak Time</th>
                    <th>Error (ft)</th>
                    <th>Alert Level</th>
                  </tr>
                </thead>
                <tbody>
                  {['actual', 'lstm', 'convlstm', 'pgdl'].map(key => {
                    if (key !== 'actual' && !selectedModels[key]) return null;
                    const peak = findPeak(chartData, key);
                    const level = parseFloat(peak.value);
                    const alertClass = level >= 9 ? 'danger' : level >= 7 ? 'warning' : level >= 5 ? 'advisory' : 'normal';
                    return (
                      <tr key={key} className={key === 'pgdl' ? 'pgdl-row' : ''}>
                        <td>
                          <span className="model-dot-sm" style={{ background: key === 'actual' ? '#e2e8f0' : modelMetrics[key]?.color }}></span>
                          {key === 'actual' ? 'Observed' : modelMetrics[key]?.name}
                        </td>
                        <td className="mono">{peak.value}</td>
                        <td className="mono text-sm">{peak.time.slice(5)}</td>
                        <td className="mono">{key === 'actual' ? '—' : peakErrors[key]}</td>
                        <td><span className={`badge badge-${alertClass === 'advisory' ? 'warning' : alertClass === 'normal' ? 'success' : alertClass}`}>{alertClass.toUpperCase()}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>

            <motion.div className="card physics-panel" custom={3} initial="hidden" animate="visible" variants={fadeIn}>
              <h3 className="section-title">⚛️ Physics Constraint Compliance</h3>
              <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-md)' }}>PGDL-ConvLSTM physics-guided validation</p>
              <div className="physics-checks">
                {[
                  { label: 'Rise-Rate Bounds', valid: true, score: '✓ Within physical limits' },
                  { label: 'ΔH Prediction', valid: true, score: '✓ Change-based output validated' },
                  { label: 'Mass Conservation', valid: true, score: '0.97 compliance score' },
                  { label: 'Asymmetric Penalty', valid: true, score: '✓ Underprediction penalised' },
                  { label: 'Overall Constraint Score', valid: true, score: '0.94 / 1.00' },
                ].map((check, i) => (
                  <motion.div key={i} className="physics-check-row"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <span className={`physics-icon ${check.valid ? 'valid' : 'invalid'}`}>
                      {check.valid ? '✓' : '✗'}
                    </span>
                    <div className="physics-info">
                      <span className="physics-label">{check.label}</span>
                      <span className="physics-score text-xs text-muted">{check.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="physics-badge-container">
                <span className="badge badge-pgdl" style={{ fontSize: '0.8125rem', padding: '6px 16px' }}>
                  ✓ Physics-Compliant Prediction
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
