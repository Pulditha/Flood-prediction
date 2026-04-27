import GlassCard from '../common/GlassCard'

function SummaryCard({ label, value, status }) {
  return (
    <GlassCard className="p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-cyan-200">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{status}</p>
    </GlassCard>
  )
}

export default SummaryCard
