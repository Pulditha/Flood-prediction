import GlassCard from '../common/GlassCard'

function PredictionLogsTable({ rows }) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-slate-800 px-5 py-4">
        <p className="text-sm font-medium text-slate-200">Recent Prediction Logs</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Timestamp</th>
              <th className="px-5 py-3 text-left font-medium">Current Stage</th>
              <th className="px-5 py-3 text-left font-medium">Predicted Stage</th>
              <th className="px-5 py-3 text-left font-medium">Risk Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.time} className="border-t border-slate-800 text-slate-300">
                <td className="px-5 py-3">{row.time}</td>
                <td className="px-5 py-3">{row.currentStage}</td>
                <td className="px-5 py-3">{row.predictedStage}</td>
                <td className="px-5 py-3">{row.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

export default PredictionLogsTable
