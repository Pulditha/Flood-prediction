import { Download } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import PageTitle from '../components/common/PageTitle'
import { alerts, floodEventLogs, reportCards } from '../data/mockData'

function AlertsReportsPage() {
  return (
    <div>
      <PageTitle
        title="Alerts & Reports"
        description="Threshold exceedance notifications, flood event logs, downloadable reports, and model decision traces."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard className="overflow-hidden">
          <div className="border-b border-slate-800 px-5 py-4">
            <p className="text-sm font-medium text-slate-200">Threshold Exceedance Alerts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Timestamp</th>
                  <th className="px-5 py-3 text-left font-medium">Alert</th>
                  <th className="px-5 py-3 text-left font-medium">Station</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((row) => (
                  <tr key={`${row.time}-${row.alert}`} className="border-t border-slate-800 text-slate-300">
                    <td className="px-5 py-3">{row.time}</td>
                    <td className="px-5 py-3">{row.alert}</td>
                    <td className="px-5 py-3">{row.station}</td>
                    <td className="px-5 py-3">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="border-b border-slate-800 px-5 py-4">
            <p className="text-sm font-medium text-slate-200">Recent Model Decisions / Flood Event Logs</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Timestamp</th>
                  <th className="px-5 py-3 text-left font-medium">Stage</th>
                  <th className="px-5 py-3 text-left font-medium">Action</th>
                  <th className="px-5 py-3 text-left font-medium">Decision</th>
                </tr>
              </thead>
              <tbody>
                {floodEventLogs.map((row) => (
                  <tr key={row.timestamp} className="border-t border-slate-800 text-slate-300">
                    <td className="px-5 py-3">{row.timestamp}</td>
                    <td className="px-5 py-3">{row.stage}</td>
                    <td className="px-5 py-3">{row.action}</td>
                    <td className="px-5 py-3">{row.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportCards.map((card) => (
          <GlassCard key={card.title} className="p-5">
            <p className="text-sm font-medium text-slate-100">{card.title}</p>
            <p className="mt-2 text-xs text-slate-400">Date: {card.date}</p>
            <p className="mt-1 text-xs text-slate-500">Format: {card.type}</p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300"
            >
              <Download size={14} /> Download Report
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export default AlertsReportsPage
