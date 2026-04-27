import { useState } from 'react';
import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis, LineChart, Line, ReferenceLine } from 'recharts';
import { modelMetrics, radarData, residualData, cdfData } from '../data/demoData';
import './ModelArena.css';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function ModelArena() {
  const [activeTab, setActiveTab] = useState('overview');
  const models = Object.entries(modelMetrics);
  const ranked = [...models].sort((a, b) => a[1].mae - b[1].mae);

  // Flood tier comparison data
  const tierData = [
    {
      tier: '> 5 ft',
      lstm_mae: modelMetrics.lstm.peakTiers.above5ft.mae,
      convlstm_mae: modelMetrics.convlstm.peakTiers.above5ft.mae,
      pgdl_mae: modelMetrics.pgdl.peakTiers.above5ft.mae,
    },
    {
      tier: '> 7 ft',
      lstm_mae: modelMetrics.lstm.peakTiers.above7ft.mae,
      convlstm_mae: modelMetrics.convlstm.peakTiers.above7ft.mae,
      pgdl_mae: modelMetrics.pgdl.peakTiers.above7ft.mae,
    },
    {
      tier: '≥ 9 ft',
      lstm_mae: modelMetrics.lstm.peakTiers.above9ft.mae,
      convlstm_mae: modelMetrics.convlstm.peakTiers.above9ft.mae,
      pgdl_mae: modelMetrics.pgdl.peakTiers.above9ft.mae,
    },
  ];

  // Scatter data per model
  const scatterLSTM = residualData.map(d => ({ actual: d.actual, error: d.lstm_error }));
  const scatterConvLSTM = residualData.map(d => ({ actual: d.actual, error: d.convlstm_error }));
  const scatterPGDL = residualData.map(d => ({ actual: d.actual, error: d.pgdl_error }));

  const getRankBadge = (rank) => {
    if (rank === 0) return { emoji: '🥇', class: 'gold' };
    if (rank === 1) return { emoji: '🥈', class: 'silver' };
    return { emoji: '🥉', class: 'bronze' };
  };

  // Calculate improvement percentages
  const improvements = {
    maeVsLSTM: ((1 - modelMetrics.pgdl.mae / modelMetrics.lstm.mae) * 100).toFixed(1),
    maeVsConv: ((1 - modelMetrics.pgdl.mae / modelMetrics.convlstm.mae) * 100).toFixed(1),
    peakVsLSTM: ((1 - modelMetrics.pgdl.peakError / modelMetrics.lstm.peakError) * 100).toFixed(1),
  };

  return (
    <div className="model-arena">
      {/* Tab Navigation */}
      <div className="arena-tabs">
        {[
          { key: 'overview', label: '◆ Overview', icon: '📊' },
          { key: 'diagnostics', label: '◆ Diagnostics', icon: '🔬' },
        ].map(tab => (
          <button key={tab.key}
                  className={`arena-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Podium */}
          <motion.div className="card podium-card" custom={0} initial="hidden" animate="visible" variants={fadeIn}>
            <div className="section-header">
              <h3 className="section-title">◆ Model Ranking</h3>
              <div className="improvement-badges">
                <span className="badge badge-pgdl">PGDL: {improvements.maeVsLSTM}% better MAE vs LSTM</span>
                <span className="badge badge-pgdl">Peak Error: {improvements.peakVsLSTM}% reduction</span>
              </div>
            </div>
            <div className="podium">
              {ranked.map(([key, model], i) => {
                const badge = getRankBadge(i);
                return (
                  <motion.div
                    key={key}
                    className={`podium-item podium-${badge.class}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 200 }}
                  >
                    <span className="podium-rank">{badge.emoji}</span>
                    <span className="podium-name" style={{ color: model.color }}>{model.name}</span>
                    <span className="podium-score mono">MAE: {model.mae.toFixed(3)}</span>
                    <span className="podium-r2 mono text-xs">R² = {model.r2.toFixed(3)}</span>
                    <span className="podium-nse mono text-xs">NSE = {model.nse.toFixed(3)}</span>
                    {i === 0 && <span className="badge badge-pgdl">Proposed Model</span>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Radar + Metric Cards */}
          <div className="arena-middle">
            <motion.div className="card radar-card" custom={1} initial="hidden" animate="visible" variants={fadeIn}>
              <h3 className="section-title">Multi-Metric Radar Comparison</h3>
              <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-sm)' }}>Higher values = better performance across all axes</p>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#8899aa', fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 1]} tick={false} axisLine={false} />
                  <Radar name="LSTM" dataKey="lstm" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} strokeWidth={2} />
                  <Radar name="ConvLSTM" dataKey="convlstm" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.08} strokeWidth={2} />
                  <Radar name="PGDL" dataKey="pgdl" stroke="#00d4aa" fill="#00d4aa" fillOpacity={0.15} strokeWidth={2.5} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="radar-legend">
                <span className="legend-item"><span className="legend-line" style={{ background: '#f59e0b' }}></span> LSTM</span>
                <span className="legend-item"><span className="legend-line" style={{ background: '#8b5cf6' }}></span> ConvLSTM</span>
                <span className="legend-item"><span className="legend-line" style={{ background: '#00d4aa' }}></span> PGDL-ConvLSTM</span>
              </div>
            </motion.div>

            <div className="metric-cards-column">
              {models.map(([key, model], i) => (
                <motion.div key={key} className="card metric-card" custom={i + 2} initial="hidden" animate="visible" variants={fadeIn}
                            style={{ '--card-accent': model.color }}>
                  <div className="metric-card-header">
                    <span className="metric-dot" style={{ background: model.color }}></span>
                    <h4>{model.name}</h4>
                    {key === 'pgdl' && <span className="badge badge-pgdl">Proposed</span>}
                  </div>
                  <div className="metric-grid">
                    <div className="metric-item">
                      <span className="metric-label">MAE</span>
                      <span className="metric-value mono">{model.mae.toFixed(3)}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">RMSE</span>
                      <span className="metric-value mono">{model.rmse.toFixed(3)}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">R²</span>
                      <span className="metric-value mono">{model.r2.toFixed(3)}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">NSE</span>
                      <span className="metric-value mono">{model.nse.toFixed(3)}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Peak Error</span>
                      <span className="metric-value mono">{model.peakError.toFixed(2)} ft</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Timing Error</span>
                      <span className="metric-value mono">{model.timingError.toFixed(1)} hr</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Flood Tier Performance */}
          <motion.div className="card" custom={5} initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="section-title">Performance by Flood Tier (MAE)</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-md)' }}>
              Lower MAE = better. Shows accuracy degradation as flood severity increases — PGDL maintains accuracy at extreme levels.
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={tierData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="tier" tick={{ fill: '#8899aa', fontSize: 12 }} />
                <YAxis tick={{ fill: '#8899aa', fontSize: 10 }} unit=" ft" />
                <Tooltip contentStyle={{ background: '#1a2736', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="lstm_mae" name="LSTM" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="convlstm_mae" name="ConvLSTM" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pgdl_mae" name="PGDL" fill="#00d4aa" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}

      {activeTab === 'diagnostics' && (
        <>
          {/* Residual Scatter Plot */}
          <motion.div className="card" custom={0} initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="section-title">🔬 Prediction Residuals vs Actual Water Level</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-md)' }}>
              Shows prediction error (predicted − actual) across different water levels. Closer to zero = better. PGDL shows tighter clustering at extreme levels.
            </p>
            <ResponsiveContainer width="100%" height={360}>
              <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" dataKey="actual" name="Actual" unit=" ft" tick={{ fill: '#8899aa', fontSize: 10 }} label={{ value: 'Actual Water Level (ft)', position: 'bottom', fill: '#8899aa', fontSize: 11, offset: -2 }} />
                <YAxis type="number" dataKey="error" name="Error" unit=" ft" tick={{ fill: '#8899aa', fontSize: 10 }} label={{ value: 'Prediction Error (ft)', angle: -90, position: 'left', fill: '#8899aa', fontSize: 11, offset: 10 }} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                <Tooltip contentStyle={{ background: '#1a2736', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                <Scatter name="LSTM" data={scatterLSTM} fill="#f59e0b" opacity={0.5} />
                <Scatter name="ConvLSTM" data={scatterConvLSTM} fill="#8b5cf6" opacity={0.5} />
                <Scatter name="PGDL" data={scatterPGDL} fill="#00d4aa" opacity={0.6} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>

          {/* CDF Error Distribution */}
          <motion.div className="card" custom={1} initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="section-title">📈 Cumulative Error Distribution (CDF)</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-md)' }}>
              Percentage of predictions within a given absolute error threshold. Steeper curve = more predictions with small errors.
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={cdfData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="percentile" tick={{ fill: '#8899aa', fontSize: 10 }} label={{ value: 'Percentile (%)', position: 'bottom', fill: '#8899aa', fontSize: 11, offset: -2 }} />
                <YAxis tick={{ fill: '#8899aa', fontSize: 10 }} unit=" ft" label={{ value: 'Absolute Error (ft)', angle: -90, position: 'left', fill: '#8899aa', fontSize: 11, offset: 10 }} />
                <Tooltip contentStyle={{ background: '#1a2736', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="lstm" stroke="#f59e0b" strokeWidth={2} dot={false} name="LSTM" />
                <Line type="monotone" dataKey="convlstm" stroke="#8b5cf6" strokeWidth={2} dot={false} name="ConvLSTM" />
                <Line type="monotone" dataKey="pgdl" stroke="#00d4aa" strokeWidth={2.5} dot={false} name="PGDL" />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Physics Compliance Summary */}
          <motion.div className="card physics-comparison-card" custom={2} initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="section-title">⚛️ Physics Constraint Analysis</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-md)' }}>
              Only the PGDL-ConvLSTM model incorporates physics-based constraints during training.
            </p>
            <div className="physics-comparison-grid">
              {[
                { label: 'Rise-Rate Bounds', desc: 'Max ΔH/Δt within physical channel limits', lstm: false, convlstm: false, pgdl: true },
                { label: 'ΔH Prediction', desc: 'Predicts change in water level, not absolute', lstm: false, convlstm: false, pgdl: true },
                { label: 'Asymmetric Penalty', desc: 'Penalises underprediction of floods more', lstm: false, convlstm: false, pgdl: true },
                { label: 'Mass Conservation', desc: 'Rainfall-runoff volume consistency', lstm: false, convlstm: false, pgdl: true },
                { label: 'Spatial Awareness', desc: 'Uses 32×32 spatial grid input', lstm: false, convlstm: true, pgdl: true },
              ].map((row, i) => (
                <div key={i} className="physics-row">
                  <div className="physics-info">
                    <span className="physics-name">{row.label}</span>
                    <span className="text-xs text-muted">{row.desc}</span>
                  </div>
                  <div className="physics-checks-row">
                    <span className={`physics-check ${row.lstm ? 'yes' : 'no'}`}>{row.lstm ? '✓' : '✗'}</span>
                    <span className={`physics-check ${row.convlstm ? 'yes' : 'no'}`}>{row.convlstm ? '✓' : '✗'}</span>
                    <span className={`physics-check ${row.pgdl ? 'yes' : 'no'}`}>{row.pgdl ? '✓' : '✗'}</span>
                  </div>
                </div>
              ))}
              <div className="physics-header-labels">
                <span></span>
                <div className="physics-checks-row">
                  <span className="text-xs" style={{ color: '#f59e0b' }}>LSTM</span>
                  <span className="text-xs" style={{ color: '#8b5cf6' }}>ConvLSTM</span>
                  <span className="text-xs" style={{ color: '#00d4aa' }}>PGDL</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
