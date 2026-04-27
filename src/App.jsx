import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import PredictionEngine from './pages/PredictionEngine';
import ModelArena from './pages/ModelArena';
import FloodMap from './pages/FloodMap';
import AlertCentre from './pages/AlertCentre';
import ReportGenerator from './pages/ReportGenerator';
import './styles/design-system.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<PredictionEngine />} />
          <Route path="/compare" element={<ModelArena />} />
          <Route path="/map" element={<FloodMap />} />
          <Route path="/alerts" element={<AlertCentre />} />
          <Route path="/report" element={<ReportGenerator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
