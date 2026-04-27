import { useEffect, useState } from 'react';
import './WaterGauge.css';

export default function WaterGauge({ value = 0, min = 0, max = 12, thresholds }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = ((animatedValue - min) / (max - min)) * 100;
  const angle = -135 + (percentage / 100) * 270; // -135 to +135 degrees

  const getColor = () => {
    if (animatedValue >= thresholds.emergency) return '#ef4444';
    if (animatedValue >= thresholds.warning) return '#f97316';
    if (animatedValue >= thresholds.advisory) return '#f59e0b';
    return '#00d4aa';
  };

  // Arc path for the gauge background
  const createArc = (startAngle, endAngle, radius) => {
    const cx = 120, cy = 120;
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (cx, cy, radius, angleInDegrees) => {
    const rad = (angleInDegrees - 90) * Math.PI / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const bgArc = createArc(-135, 135, 90);
  const valueArc = createArc(-135, angle, 90);

  // Threshold markers
  const thresholdMarkers = [
    { value: thresholds.advisory, color: '#f59e0b', label: '5ft' },
    { value: thresholds.warning, color: '#f97316', label: '7ft' },
    { value: thresholds.emergency, color: '#ef4444', label: '9ft' },
  ];

  return (
    <div className="water-gauge">
      <svg viewBox="0 0 240 180" className="gauge-svg">
        {/* Background glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4aa" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="80%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path d={bgArc} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />

        {/* Value arc */}
        <path d={valueArc} fill="none" stroke={getColor()} strokeWidth="12" strokeLinecap="round"
              filter="url(#glow)" className="gauge-arc-animated" />

        {/* Threshold markers */}
        {thresholdMarkers.map((t, i) => {
          const tAngle = -135 + ((t.value / max) * 270);
          const outer = polarToCartesian(120, 120, 100, tAngle);
          const inner = polarToCartesian(120, 120, 82, tAngle);
          const labelPos = polarToCartesian(120, 120, 108, tAngle);
          return (
            <g key={i}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                    stroke={t.color} strokeWidth="2" opacity="0.6" />
              <text x={labelPos.x} y={labelPos.y} fill={t.color} fontSize="8"
                    textAnchor="middle" dominantBaseline="middle" fontWeight="600">
                {t.label}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        {(() => {
          const needleTip = polarToCartesian(120, 120, 75, angle);
          const needleBase1 = polarToCartesian(120, 120, 6, angle - 90);
          const needleBase2 = polarToCartesian(120, 120, 6, angle + 90);
          return (
            <g className="gauge-needle">
              <polygon
                points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
                fill={getColor()}
                opacity="0.9"
              />
              <circle cx="120" cy="120" r="8" fill="var(--bg-card)" stroke={getColor()} strokeWidth="2" />
            </g>
          );
        })()}

        {/* Center value display */}
        <text x="120" y="155" textAnchor="middle" fill={getColor()} fontSize="28" fontWeight="800"
              fontFamily="'JetBrains Mono', monospace">
          {animatedValue.toFixed(2)}
        </text>
        <text x="120" y="170" textAnchor="middle" fill="#8899aa" fontSize="10" fontWeight="500">
          GAGE HEIGHT (ft)
        </text>
      </svg>

      {/* Scale labels */}
      <div className="gauge-scale">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
