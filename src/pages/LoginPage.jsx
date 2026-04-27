import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(14,116,144,0.2),transparent_40%)]" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70 shadow-2xl backdrop-blur lg:grid-cols-2"
      >
        <div className="p-8 lg:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
            <ShieldCheck size={14} /> Authorized Research Monitoring Access
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Physics-Guided Flood Prediction System</h1>
          <p className="mt-2 text-sm text-slate-400">
            Intelligent Real-Time Flood Forecasting and Hydrological Risk Monitoring Dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="analyst" className="mb-2 block text-sm text-slate-300">
                Analyst ID
              </label>
              <input
                id="analyst"
                name="analyst"
                required
                placeholder="Enter analyst ID"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </div>
            <div className="rounded-lg border border-cyan-900/60 bg-cyan-950/30 p-3 text-xs text-cyan-100">
              <p className="font-semibold">Demo login details</p>
              <ul className="mt-2 space-y-1">
                <li>
                  Supervisor: ID <span className="font-medium">supervisor</span> / Password{' '}
                  <span className="font-medium">any value</span>
                </li>
                <li>
                  Assessor: ID <span className="font-medium">assessor</span> / Password{' '}
                  <span className="font-medium">any value</span>
                </li>
              </ul>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="relative hidden border-l border-slate-700 bg-slate-900 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(34,211,238,0.35),transparent_35%),radial-gradient(circle_at_70%_65%,rgba(59,130,246,0.25),transparent_45%)]" />
          <div className="absolute inset-0 p-8 text-slate-300">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Hydrological Intelligence Map</p>
            <div className="mt-5 h-full rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-950 p-4">
              <div className="h-full rounded-lg border border-cyan-800/40 bg-[linear-gradient(120deg,rgba(30,41,59,0.8),rgba(2,132,199,0.22))]" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
