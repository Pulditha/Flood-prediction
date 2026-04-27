import { Bell, Gauge, History, LogOut, Settings, ShieldAlert, UserCircle2, Waves, Workflow } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { systemInfo } from '../../data/mockData'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/data-inputs', label: 'Data Inputs', icon: Waves },
  { to: '/ai-prediction', label: 'AI Prediction', icon: Workflow },
  { to: '/historical-analysis', label: 'Historical Analysis', icon: History },
  { to: '/alerts-reports', label: 'Alerts & Reports', icon: ShieldAlert },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function MainLayout() {
  const [clock, setClock] = useState(new Date())
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-800 bg-slate-900/70 p-6 lg:block">
          <h2 className="text-lg font-semibold">Physics-Guided Flood Prediction System</h2>
          <p className="mt-2 text-xs text-slate-400">Research Monitoring Interface</p>
          <nav className="mt-8 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-10 flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-slate-800 bg-slate-900/70 px-6 py-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cyan-300">{systemInfo.title}</p>
                <p className="text-xs text-slate-400">{systemInfo.subtitle}</p>
              </div>
              <div className="flex items-center gap-5 text-sm text-slate-300">
                <div>
                  <p className="text-xs text-slate-400">Current Station</p>
                  <p className="font-medium text-slate-100">{systemInfo.station}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Date & Time</p>
                  <p className="font-medium text-slate-100">{clock.toLocaleString()}</p>
                </div>
                <Bell className="text-slate-300" size={18} />
                <UserCircle2 className="text-slate-300" size={22} />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
