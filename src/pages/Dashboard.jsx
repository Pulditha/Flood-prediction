import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import WaterGauge from '../components/Charts/WaterGauge';
import { recentWaterLevels, dashboardKPIs, systemFeed, floodThresholds, modelMetrics, predictionChartData } from '../data/demoData';
import './Dashboard.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  }),
};

// Animated counter hook
function useCountUp(end, duration = 1500, decimals = 2) {
  const [value, setValue] = useState(0);
  const startTime = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    startTime.current = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  return value.toFixed(decimals);
}

// Mini sparkline component
function Sparkline({ data, color = '#00d4aa', width = 80, height = 28 }) {
  if (!data || data.length === 0) return null;
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="sparkline" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      <polygon fill={`url(#spark-${color.replace('#','')})`}
               points={`0,${height} ${points} ${width},${height}`} />
    </svg>
  );
}

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="tooltip-value" style={{ color: p.color }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value} ft</strong>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [currentLevel, setCurrentLevel] = useState(2.34);
  const [time, setTime] = useState(new Date());

  const animatedLevel = useCountUp(currentLevel, 1200, 2);
  const animatedPeak = useCountUp(dashboardKPIs.peakToday.value, 1400, 2);
  const animatedR2 = useCountUp(modelMetrics.pgdl.r2, 1600, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      // Simulate minor fluctuation
      setCurrentLevel(prev => {
        const delta = (Math.sin(Date.now() / 5000) * 0.02);
        return Math.round((2.34 + delta) * 100) / 100;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const chartData = recentWaterLevels.map(d => ({
    time: d.datetime.slice(5, 16),
    value: d.value,
    date: d.datetime.slice(0, 10),
  }));

  // Take every 4th point for readability
  const sparseData = chartData.filter((_, i) => i % 4 === 0);

  // Sparkline data samples
  const last24h = recentWaterLevels.slice(-24);
  const last48h = recentWaterLevels.slice(-48);

  const getAlertLevel = (level) => {
    if (level >= floodThresholds.emergency) return { text: 'EMERGENCY', class: 'danger', icon: '🔴' };
    if (level >= floodThresholds.warning) return { text: 'WARNING', class: 'warning', icon: '🟠' };
    if (level >= floodThresholds.advisory) return { text: 'ADVISORY', class: 'advisory', icon: '🟡' };
    return { text: 'NORMAL', class: 'normal', icon: '🟢' };
  };

  const alert = getAlertLevel(currentLevel);

  // Recent prediction accuracy mini-chart (last 48 predictions)
  const recentPredictions = predictionChartData.slice(0, 48).filter((_, i) => i % 2 === 0);

  return (
    <div className="dashboard">
      {/* KPI Cards Row */}
      <div className="grid-4">
        <motion.div className="kpi-card" custom={0} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="kpi-header-row">
            <span className="kpi-label">Current Water Level</span>
            <span className="kpi-icon">🌊</span>
          </div>
          <div className="kpi-main">
            <span className="kpi-value">{animatedLevel} <span className="kpi-unit">ft</span></span>
            <Sparkline data={last24h} color="#00d4aa" />
          </div>
          <span className={`kpi-change neutral`}>
            <span>↕</span> {dashboardKPIs.currentLevel.change} ft/hr  •  Last 24h
          </span>
        </motion.div>

        <motion.div className="kpi-card" custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="kpi-header-row">
            <span className="kpi-label">24h Peak</span>
            <span className="kpi-icon">📈</span>
          </div>
          <div className="kpi-main">
            <span className="kpi-value">{animatedPeak} <span className="kpi-unit">ft</span></span>
            <Sparkline data={last48h} color="#0ea5e9" />
          </div>
          <span className={`kpi-change ${dashboardKPIs.peakToday.trend === 'down' ? 'down' : 'up'}`}>
            <span>{dashboardKPIs.peakToday.trend === 'down' ? '↓' : '↑'}</span> {dashboardKPIs.peakToday.change} from yesterday
          </span>
        </motion.div>

        <motion.div className={`kpi-card alert-card-${alert.class}`} custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="kpi-header-row">
            <span className="kpi-label">Alert Status</span>
            <span className="kpi-icon">⚠️</span>
          </div>
          <span className={`alert-value alert-${alert.class}`}>
            {alert.icon} {alert.text}
          </span>
          <span className="kpi-change neutral">Thresholds: 5 / 7 / 9 ft</span>
        </motion.div>

        <motion.div className="kpi-card" custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="kpi-header-row">
            <span className="kpi-label">Best Model R²</span>
            <span className="kpi-icon">🧠</span>
          </div>
          <span className="kpi-value">{animatedR2}</span>
          <span className="kpi-change neutral">
            <span className="badge badge-pgdl">PGDL-ConvLSTM</span>
          </span>
        </motion.div>
      </div>

      {/* Main Content Row */}
      <div className="dashboard-main">
        {/* Water Level Gauge */}
        <motion.div className="card gauge-card" custom={4} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="section-header">
            <h3 className="section-title">
              <span className="status-dot online"></span>
              Live Water Level
            </h3>
            <span className="text-xs text-muted mono live-clock">
              <span className="live-dot"></span>
              {time.toLocaleTimeString()}
            </span>
          </div>
          <WaterGauge value={currentLevel} min={0} max={12} thresholds={floodThresholds} />
          <div className="gauge-footer">
            <div className="gauge-stat">
              <span className="text-xs text-muted">Station</span>
              <span className="text-sm mono">USGS 01589000</span>
            </div>
            <div className="gauge-stat">
              <span className="text-xs text-muted">Location</span>
              <span className="text-sm">Patapsco River, MD</span>
            </div>
          </div>
        </motion.div>

        {/* 7-Day Hydrograph */}
        <motion.div className="card chart-card" custom={5} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="section-header">
            <h3 className="section-title">7-Day Hydrograph</h3>
            <span className="badge badge-info">168 observations</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={sparseData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: '#8899aa', fontSize: 10 }} interval={11} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#8899aa', fontSize: 10 }} unit=" ft" />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={floodThresholds.advisory} stroke="#f59e0b" strokeDasharray="6 4" label={{ value: "Advisory 5ft", fill: "#f59e0b", fontSize: 10, position: "right" }} />
                <ReferenceLine y={floodThresholds.warning} stroke="#f97316" strokeDasharray="6 4" label={{ value: "Warning 7ft", fill: "#f97316", fontSize: 10, position: "right" }} />
                <Area type="monotone" dataKey="value" stroke="#00d4aa" strokeWidth={2} fill="url(#waterGradient)" dot={false} name="Gage Height" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-bottom">
        {/* Model Summary */}
        <motion.div className="card" custom={6} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="section-header">
            <h3 className="section-title">🏆 Model Performance Summary</h3>
          </div>
          <div className="model-summary-list">
            {Object.entries(modelMetrics).map(([key, model]) => {
              const barWidth = model.r2 * 100;
              const isProposed = key === 'pgdl';
              return (
                <div key={key} className={`model-summary-row ${isProposed ? 'proposed' : ''}`}>
                  <div className="model-indicator" style={{ '--model-color': model.color }}>
                    <span className="model-dot" style={{ background: model.color }}></span>
                    <span className="model-name">{model.name}</span>
                    {isProposed && <span className="badge badge-pgdl" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>Proposed</span>}
                  </div>
                  <div className="model-stats">
                    <div className="stat-item">
                      <span className="stat-label">MAE</span>
                      <span className="stat-value mono">{model.mae.toFixed(3)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">RMSE</span>
                      <span className="stat-value mono">{model.rmse.toFixed(3)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">R²</span>
                      <span className="stat-value mono">{model.r2.toFixed(3)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">NSE</span>
                      <span className="stat-value mono">{model.nse.toFixed(3)}</span>
                    </div>
                  </div>
                  <div className="model-bar-container">
                    <motion.div
                      className="model-bar"
                      style={{ background: model.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    ></motion.div>
                    <span className="bar-label mono">{(barWidth).toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* System Feed */}
        <motion.div className="card" custom={7} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="section-header">
            <h3 className="section-title">📡 System Activity</h3>
            <span className="status-dot online"></span>
          </div>
          <div className="feed-list">
            {systemFeed.map((item, i) => (
              <motion.div
                key={i}
                className="feed-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
              >
                <span className={`feed-dot feed-${item.type}`}></span>
                <span className="feed-time mono text-xs">{item.time}</span>
                <span className="feed-text text-sm">{item.event}</span>
              </motion.div>
            ))}
          </div>
          <div className="feed-footer">
            <span className="text-xs text-muted">Last sync: {time.toLocaleTimeString()}</span>
            <span className="badge badge-success">System Healthy</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
