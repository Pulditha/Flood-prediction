import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkHealth } from '../../services/api';
import './Layout.css';

const navItems = [
  { path: '/', label: 'Command Centre', icon: '◉' },
  { path: '/predict', label: 'Prediction Engine', icon: '⚡' },
  { path: '/compare', label: 'Model Arena', icon: '◆' },
  { path: '/map', label: 'Flood Risk Map', icon: '◎' },
  { path: '/alerts', label: 'Alert Centre', icon: '▲' },
  { path: '/report', label: 'Report Generator', icon: '■' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ online: false, models_loaded: [] });
  const location = useLocation();

  const currentPage = navItems.find(item => item.path === location.pathname);

  // Poll backend health every 15 seconds
  useEffect(() => {
    const check = async () => {
      const status = await checkHealth();
      setBackendStatus(status);
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  const modelCount = backendStatus.models_loaded?.length || 0;
  const isOnline = backendStatus.online;

  return (
    <div className={`layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="#00d4aa" strokeWidth="2" fill="none" />
                <path d="M14 6 L14 22 M8 10 L14 6 L20 10 M8 14 L14 10 L20 14 M8 18 L14 14 L20 18" 
                      stroke="#00d4aa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
              </svg>
            </div>
            {sidebarOpen && (
              <div className="brand-text">
                <span className="brand-name">PGDL Flood</span>
                <span className="brand-sub">Prediction System</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}
                  title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className={`status-dot ${isOnline ? 'online' : 'warning'}`}></span>
            {sidebarOpen && (
              <div className="status-details">
                <span className="status-text" style={{ color: isOnline ? 'var(--alert-normal)' : 'var(--alert-advisory)' }}>
                  {isOnline ? 'Backend Online' : 'Demo Mode'}
                </span>
                <span className="status-sub">
                  {isOnline
                    ? modelCount > 0 ? `${modelCount}/3 models loaded` : 'Demo mode'
                    : 'Using local data'}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">{currentPage?.label || 'Dashboard'}</h1>
            <span className="page-breadcrumb">Physics-Guided Flood Prediction System</span>
          </div>
          <div className="header-right">
            <div className={`header-badge ${isOnline ? 'badge-success' : 'badge-warning'}`}>
              <span className={`status-dot ${isOnline ? 'online' : 'warning'}`}></span>
              {isOnline
                ? modelCount > 0 ? `${modelCount} Models Loaded` : 'Demo Mode'
                : 'Offline — Demo Data'}
            </div>
            <div className="header-station">
              <span className="station-label">USGS 01589000</span>
              <span className="station-name">Patapsco River, MD</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
