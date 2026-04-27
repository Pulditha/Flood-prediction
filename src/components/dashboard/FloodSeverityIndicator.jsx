import GlassCard from '../common/GlassCard'

const levelStyles = {
  Normal: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  'Moderate Risk': 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  'High Flood Risk': 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  Critical: 'bg-red-600/20 text-red-300 border-red-600/50',
}

function FloodSeverityIndicator({ severity }) {
  const chipClass = levelStyles[severity.level] || levelStyles['Moderate Risk']

  return (
    <GlassCard className="p-5">
      <p className="text-sm font-medium text-slate-200">Flood Severity Indicator</p>
      <div className={`mt-4 inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold ${chipClass}`}>
        {severity.level}
      </div>
      <p className="mt-3 text-sm text-slate-400">{severity.message}</p>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
          style={{ width: `${severity.score}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">Severity score: {severity.score}%</p>
    </GlassCard>
  )
}

export default FloodSeverityIndicator
