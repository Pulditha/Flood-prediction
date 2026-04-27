import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DataInputsPage from './pages/DataInputsPage'
import AIPredictionPage from './pages/AIPredictionPage'
import HistoricalAnalysisPage from './pages/HistoricalAnalysisPage'
import AlertsReportsPage from './pages/AlertsReportsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/data-inputs" element={<DataInputsPage />} />
        <Route path="/ai-prediction" element={<AIPredictionPage />} />
        <Route path="/historical-analysis" element={<HistoricalAnalysisPage />} />
        <Route path="/alerts-reports" element={<AlertsReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
