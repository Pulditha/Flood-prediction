import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { alertHistory, floodThresholds } from '../data/demoData';
import './AlertCentre.css';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const alertConfig = {
  NORMAL: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: '🟢', border: 'rgba(16, 185, 129, 0.3)' },
  ADVISORY: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: '🟡', border: 'rgba(245, 158, 11, 0.3)' },
  WARNING: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', icon: '🟠', border: 'rgba(249, 115, 22, 0.3)' },
  EMERGENCY: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: '🔴', border: 'rgba(239, 68, 68, 0.3)' },
};

// Simulated breach frequency by year
const breachData = [
  { year: '2016', advisory: 12, warning: 4, emergency: 1 },
  { year: '2017', advisory: 8, warning: 3, emergency: 0 },
  { year: '2018', advisory: 18, warning: 7, emergency: 3 },
  { year: '2019', advisory: 10, warning: 5, emergency: 1 },
];

export default function AlertCentre() {
  const currentAlert = 'NORMAL';
  const config = alertConfig[currentAlert];

  return (
    <div className="alert-centre">
      {/* Current Status Banner */}
      <motion.div className="alert-banner" custom={0} initial="hidden" animate="visible" variants={fadeIn}
                  style={{ background: config.bg, borderColor: config.border }}>
        <div className="banner-left">
          <span className="banner-icon">{config.icon}</span>
          <div className="banner-text">
            <h2 className="banner-title" style={{ color: config.color }}>
              STATUS: {currentAlert}
            </h2>
            <p className="banner-subtitle">
              All water levels within normal operating range. No flood advisories active.
            </p>
          </div>
        </div>
        <div className="banner-right">
          <div className="banner-stat">
            <span className="text-xs text-muted">Current Level</span>
            <span className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: config.color }}>2.34 ft</span>
          </div>
          <div className="banner-stat">
            <span className="text-xs text-muted">Next Threshold</span>
            <span className="mono" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{floodThresholds.advisory} ft</span>
          </div>
        </div>
      </motion.div>

      {/* Threshold Config */}
      <motion.div className="card" custom={1} initial="hidden" animate="visible" variants={fadeIn}>
        <h3 className="section-title">▲ Threshold Configuration</h3>
        <div className="threshold-grid">
          {[
            { label: 'Advisory', value: floodThresholds.advisory, color: '#f59e0b', desc: 'Minor flooding possible' },
            { label: 'Warning', value: floodThresholds.warning, color: '#f97316', desc: 'Moderate flooding expected' },
            { label: 'Emergency', value: floodThresholds.emergency, color: '#ef4444', desc: 'Major/extreme flooding imminent' },
          ].map((t, i) => (
            <div key={i} className="threshold-card" style={{ '--t-color': t.color }}>
              <div className="threshold-header">
                <span className="threshold-dot" style={{ background: t.color }}></span>
                <span className="threshold-name">{t.label}</span>
              </div>
              <span className="threshold-value mono">{t.value} ft</span>
              <span className="threshold-desc text-xs text-muted">{t.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="alert-bottom">
        {/* Alert Timeline */}
        <motion.div className="card" custom={2} initial="hidden" animate="visible" variants={fadeIn}>
          <h3 className="section-title">Alert Timeline (2018 Flood Event)</h3>
          <div className="timeline">
            {alertHistory.map((alert, i) => {
              const ac = alertConfig[alert.level];
              return (
                <div key={alert.id} className="timeline-item">
                  <div className="timeline-marker" style={{ background: ac.color, boxShadow: `0 0 8px ${ac.color}40` }}></div>
                  <div className="timeline-content">
                    <div className="timeline-header-row">
                      <span className="badge" style={{ background: ac.bg, color: ac.color }}>{ac.icon} {alert.level}</span>
                      <span className="mono text-xs text-muted">{alert.timestamp}</span>
                    </div>
                    <p className="timeline-message">{alert.message}</p>
                    <span className="mono text-xs" style={{ color: ac.color }}>
                      Recorded: {alert.value} ft
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Breach Frequency */}
        <motion.div className="card" custom={3} initial="hidden" animate="visible" variants={fadeIn}>
          <h3 className="section-title">Annual Breach Frequency</h3>
          <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-md)' }}>
            Number of threshold breaches per year (2016–2019)
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={breachData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: '#8899aa', fontSize: 12 }} />
              <YAxis tick={{ fill: '#8899aa', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1a2736', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="advisory" name="Advisory" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="warning" name="Warning" fill="#f97316" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="emergency" name="Emergency" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
