import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import { stationInfo, floodThresholds } from '../data/demoData';
import 'leaflet/dist/leaflet.css';
import './FloodMap.css';
import { useState } from 'react';

// Fix Leaflet default marker icon issue
import L from 'leaflet';
const customIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="width:20px;height:20px;background:#00d4aa;border:3px solid #0a0e17;border-radius:50%;box-shadow:0 0 12px rgba(0,212,170,0.5);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

// Simplified Patapsco River path (approximate coordinates)
const riverPath = [
  [39.335, -76.85], [39.328, -76.84], [39.318, -76.83], [39.308, -76.82],
  [39.300, -76.81], [39.295, -76.80], [39.290, -76.79], [39.288, -76.787],
  [39.285, -76.78], [39.280, -76.77], [39.275, -76.76], [39.270, -76.75],
  [39.265, -76.74], [39.260, -76.73], [39.255, -76.72], [39.250, -76.71],
];

export default function FloodMap() {
  const [currentLevel] = useState(2.34);
  const [selectedRisk, setSelectedRisk] = useState('current');

  const getRiskColor = (level) => {
    if (level >= 9) return '#ef4444';
    if (level >= 7) return '#f97316';
    if (level >= 5) return '#f59e0b';
    return '#00d4aa';
  };

  const simulatedLevel = selectedRisk === 'current' ? currentLevel
    : selectedRisk === 'advisory' ? 5.5
    : selectedRisk === 'warning' ? 7.5
    : 9.5;

  const riskRadius = Math.max(200, simulatedLevel * 120);

  return (
    <div className="flood-map-page">
      <div className="map-layout">
        {/* Map */}
        <motion.div className="map-container-wrapper" custom={0} initial="hidden" animate="visible" variants={fadeIn}>
          <MapContainer
            center={[stationInfo.lat, stationInfo.lng]}
            zoom={13}
            className="flood-map"
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            {/* River path */}
            <Polyline positions={riverPath} color="#0ea5e9" weight={4} opacity={0.6} />

            {/* Flood risk zone */}
            <Circle
              center={[stationInfo.lat, stationInfo.lng]}
              radius={riskRadius}
              pathOptions={{
                color: getRiskColor(simulatedLevel),
                fillColor: getRiskColor(simulatedLevel),
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '8 4',
              }}
            />

            {/* Inner zone */}
            <Circle
              center={[stationInfo.lat, stationInfo.lng]}
              radius={riskRadius * 0.5}
              pathOptions={{
                color: getRiskColor(simulatedLevel),
                fillColor: getRiskColor(simulatedLevel),
                fillOpacity: 0.25,
                weight: 1,
              }}
            />

            {/* Station marker */}
            <Marker position={[stationInfo.lat, stationInfo.lng]} icon={customIcon}>
              <Popup>
                <div style={{ color: '#0a0e17', fontSize: '12px' }}>
                  <strong>{stationInfo.name}</strong><br />
                  USGS {stationInfo.id}<br />
                  Current: {simulatedLevel.toFixed(2)} ft<br />
                  Drainage: {stationInfo.drainageArea}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </motion.div>

        {/* Map Controls Panel */}
        <div className="map-sidebar">
          <motion.div className="card" custom={1} initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="section-title">◎ Station Info</h3>
            <div className="station-details">
              <div className="detail-row">
                <span className="detail-label">Station ID</span>
                <span className="detail-value mono">{stationInfo.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">River</span>
                <span className="detail-value">{stationInfo.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">State</span>
                <span className="detail-value">{stationInfo.state}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Drainage</span>
                <span className="detail-value">{stationInfo.drainageArea}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Coordinates</span>
                <span className="detail-value mono text-xs">{stationInfo.lat}°N, {Math.abs(stationInfo.lng)}°W</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="card" custom={2} initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="section-title">Risk Scenario</h3>
            <div className="risk-buttons">
              {[
                { key: 'current', label: 'Current', level: currentLevel },
                { key: 'advisory', label: 'Advisory (5+ ft)', level: 5.5 },
                { key: 'warning', label: 'Warning (7+ ft)', level: 7.5 },
                { key: 'emergency', label: 'Emergency (9+ ft)', level: 9.5 },
              ].map(r => (
                <button key={r.key}
                        className={`risk-btn ${selectedRisk === r.key ? 'active' : ''}`}
                        style={{ '--risk-color': getRiskColor(r.level) }}
                        onClick={() => setSelectedRisk(r.key)}>
                  <span className="risk-dot" style={{ background: getRiskColor(r.level) }}></span>
                  {r.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div className="card" custom={3} initial="hidden" animate="visible" variants={fadeIn}>
            <h3 className="section-title">Flood Risk Legend</h3>
            <div className="risk-legend">
              <div className="legend-row"><span className="legend-swatch" style={{ background: '#00d4aa' }}></span> Normal ({"<"} 5 ft)</div>
              <div className="legend-row"><span className="legend-swatch" style={{ background: '#f59e0b' }}></span> Advisory (5–7 ft)</div>
              <div className="legend-row"><span className="legend-swatch" style={{ background: '#f97316' }}></span> Warning (7–9 ft)</div>
              <div className="legend-row"><span className="legend-swatch" style={{ background: '#ef4444' }}></span> Emergency (≥ 9 ft)</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
