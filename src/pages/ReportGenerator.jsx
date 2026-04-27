import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modelMetrics, stationInfo, alertHistory, floodThresholds } from '../data/demoData';
import './ReportGenerator.css';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function ReportGenerator() {
  const [config, setConfig] = useState({
    title: 'Flood Situation Report',
    dateRange: '2018-07-15 to 2018-07-28',
    includePredictions: true,
    includeAlerts: true,
    includeMap: true,
    includeMetrics: true,
    includePhysics: true,
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  const reportRef = useRef(null);

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 12 + 3;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setGenerating(false);
        setGenerated(true);
      }, 300);
    }, 2500);
  };

  const handleDownload = async () => {
    // Generate HTML content for download as styled HTML file
    const reportHTML = reportRef.current?.innerHTML;
    if (!reportHTML) return;

    const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${config.title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
    .report-header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #00d4aa; padding-bottom: 12px; margin-bottom: 24px; }
    .report-logo { font-weight: 900; font-size: 1.5rem; color: #00d4aa; }
    .report-system-name { color: #666; font-size: 0.875rem; }
    h1 { font-size: 1.75rem; color: #0a0e17; margin-bottom: 12px; }
    h2 { font-size: 1.25rem; color: #0a0e17; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 32px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #f3f4f6; padding: 8px 12px; text-align: left; font-size: 0.8125rem; border-bottom: 2px solid #e5e7eb; }
    td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; font-size: 0.875rem; }
    .report-meta { display: flex; gap: 24px; color: #6b7280; font-size: 0.8125rem; margin-bottom: 24px; flex-wrap: wrap; }
    .report-footer { border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 40px; display: flex; justify-content: space-between; color: #9ca3af; font-size: 0.75rem; }
    p { margin: 8px 0; color: #374151; }
    .badge-pgdl { background: #00d4aa22; color: #00996b; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
  </style>
</head>
<body>${reportHTML}</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const sectionCount = [config.includePredictions, config.includeAlerts, config.includeMap, config.includeMetrics, config.includePhysics].filter(Boolean).length;

  return (
    <div className="report-generator">
      {/* Config Panel */}
      <motion.div className="card config-panel" custom={0} initial="hidden" animate="visible" variants={fadeIn}>
        <div className="config-header">
          <h3 className="section-title">■ Report Configuration</h3>
          <span className="text-xs text-muted">{sectionCount + 1} sections selected</span>
        </div>
        <div className="config-grid">
          <div className="config-group">
            <label className="input-label">Report Title</label>
            <input type="text" className="config-input" value={config.title}
                   onChange={e => setConfig({ ...config, title: e.target.value })} />
          </div>
          <div className="config-group">
            <label className="input-label">Date Range</label>
            <input type="text" className="config-input" value={config.dateRange}
                   onChange={e => setConfig({ ...config, dateRange: e.target.value })} />
          </div>
          <div className="config-group">
            <label className="input-label">Include Sections</label>
            <div className="checkbox-group">
              {[
                { key: 'includePredictions', label: 'AI Predictions & Metrics' },
                { key: 'includeAlerts', label: 'Alert History' },
                { key: 'includeMap', label: 'Risk Assessment' },
                { key: 'includeMetrics', label: 'Model Comparison' },
                { key: 'includePhysics', label: 'Physics Compliance' },
              ].map(opt => (
                <label key={opt.key} className="checkbox-label">
                  <input type="checkbox" checked={config[opt.key]}
                         onChange={() => setConfig({ ...config, [opt.key]: !config[opt.key] })} />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="config-actions">
            <button className={`btn btn-primary generate-btn ${generating ? 'running' : ''}`}
                    onClick={handleGenerate} disabled={generating}>
              {generating ? <><span className="spinner"></span> Generating Report...</> : '📄 Generate Report'}
            </button>
          </div>
        </div>

        {/* Progress */}
        <AnimatePresence>
          {generating && (
            <motion.div className="generate-progress"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="progress-bar-bg">
                <motion.div className="progress-bar-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted">Compiling report sections...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Preview */}
      <motion.div className="card preview-panel" custom={1} initial="hidden" animate="visible" variants={fadeIn}>
        <div className="section-header">
          <h3 className="section-title">Report Preview</h3>
          {generated && (
            <div className="preview-actions">
              <span className="badge badge-success">✓ Ready to Download</span>
            </div>
          )}
        </div>
        <div className="report-preview">
          <div className="report-page" ref={reportRef}>
            <div className="report-header-bar">
              <span className="report-logo">PGDL</span>
              <span className="report-system-name">Physics-Guided Flood Prediction System</span>
            </div>

            <h1 className="report-title">{config.title}</h1>
            <div className="report-meta">
              <span>Generated: {now}</span>
              <span>Period: {config.dateRange}</span>
              <span>Station: USGS {stationInfo.id} — {stationInfo.name}</span>
            </div>

            <hr className="report-divider" />

            <h2 className="report-section-title">1. Executive Summary</h2>
            <p className="report-text">
              This report presents flood prediction analysis for the {stationInfo.name} monitoring station
              during the period {config.dateRange}. Three deep learning models were deployed: LSTM (baseline),
              ConvLSTM (baseline), and the proposed Physics-Guided Deep Learning ConvLSTM (PGDL-ConvLSTM).
              The PGDL model demonstrated superior performance with an R² of {modelMetrics.pgdl.r2} and
              MAE of {modelMetrics.pgdl.mae} ft, representing a {((1 - modelMetrics.pgdl.mae / modelMetrics.lstm.mae) * 100).toFixed(1)}% improvement
              over the LSTM baseline, particularly during extreme flood events exceeding {floodThresholds.emergency} ft.
            </p>

            {config.includePredictions && (
              <>
                <h2 className="report-section-title">2. Model Performance Comparison</h2>
                <table className="report-table">
                  <thead>
                    <tr><th>Model</th><th>MAE (ft)</th><th>RMSE (ft)</th><th>R²</th><th>NSE</th><th>Peak Error (ft)</th></tr>
                  </thead>
                  <tbody>
                    {Object.values(modelMetrics).map(m => (
                      <tr key={m.name}>
                        <td><strong>{m.name}</strong> {m.name === 'PGDL-ConvLSTM' && <span className="badge-pgdl">Proposed</span>}</td>
                        <td>{m.mae.toFixed(3)}</td><td>{m.rmse.toFixed(3)}</td>
                        <td>{m.r2.toFixed(3)}</td><td>{m.nse.toFixed(3)}</td><td>{m.peakError.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {config.includeAlerts && (
              <>
                <h2 className="report-section-title">{config.includePredictions ? '3' : '2'}. Alert History</h2>
                <p className="report-text">
                  During the analysis period, {alertHistory.filter(a => a.level === 'EMERGENCY').length} emergency-level
                  breach(es), {alertHistory.filter(a => a.level === 'WARNING').length} warning-level breach(es), and {' '}
                  {alertHistory.filter(a => a.level === 'ADVISORY').length} advisory-level events were recorded.
                  The peak gage height of 9.21 ft was recorded on 2018-07-22 at 03:15, triggering the emergency flood protocol.
                </p>
                <table className="report-table">
                  <thead>
                    <tr><th>Timestamp</th><th>Level</th><th>Recorded (ft)</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    {alertHistory.slice(0, 5).map(a => (
                      <tr key={a.id}>
                        <td>{a.timestamp}</td><td><strong>{a.level}</strong></td>
                        <td>{a.value}</td><td>{a.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {config.includeMap && (
              <>
                <h2 className="report-section-title">{config.includeAlerts ? '4' : '3'}. Flood Risk Assessment</h2>
                <p className="report-text">
                  Flood risk analysis centred on the USGS gauge station at {stationInfo.name} ({stationInfo.state}),
                  with coordinates {stationInfo.lat}°N, {Math.abs(stationInfo.lng)}°W and a drainage area of {stationInfo.drainageArea}.
                  Three alert tiers are configured: Advisory ({floodThresholds.advisory} ft), Warning ({floodThresholds.warning} ft), 
                  and Emergency ({floodThresholds.emergency} ft). During the 2018 flood event, all three thresholds were breached,
                  with the maximum recorded stage reaching 9.21 ft above datum.
                </p>
              </>
            )}

            {config.includePhysics && (
              <>
                <h2 className="report-section-title">{config.includeMap ? '5' : '4'}. Physics Compliance</h2>
                <p className="report-text">
                  The PGDL-ConvLSTM model achieved a physics constraint compliance score of{' '}
                  {modelMetrics.pgdl.physicsCompliance.constraintScore}, with valid rise-rate bounds and
                  ΔH predictions within physical limits. Mass conservation score: {modelMetrics.pgdl.physicsCompliance.massConservation}.
                  The model enforces asymmetric underprediction penalties to ensure flood peaks are not underestimated,
                  which is critical for early warning systems.
                </p>
              </>
            )}

            <div className="report-conclusions">
              <h2 className="report-section-title">{config.includePhysics ? '6' : '5'}. Conclusions & Recommendations</h2>
              <p className="report-text">
                The PGDL-ConvLSTM model is recommended for operational deployment due to its superior performance across all metrics,
                particularly during extreme flood events. The physics-guided approach ensures predictions remain physically plausible
                even under unprecedented conditions, making it suitable for real-time flood early warning applications.
              </p>
            </div>

            <div className="report-footer">
              <span>Physics-Guided Flood Prediction System — Generated Report</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>

        {generated && (
          <motion.div className="download-bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button className="btn btn-primary" onClick={handleDownload}>
              ⬇ Download Report (HTML)
            </button>
            <button className="btn btn-secondary" onClick={() => {
              navigator.clipboard.writeText(reportRef.current?.innerText || '');
            }}>
              📋 Copy Text
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
