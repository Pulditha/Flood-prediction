import { CheckCircle2 } from 'lucide-react'
import GlassCard from '../common/GlassCard'

function PhysicsConstraintPanel({ constraints }) {
  return (
    <GlassCard className="p-5">
      <p className="text-sm font-medium text-slate-200">Physics Constraint Monitor</p>
      <div className="mt-4 space-y-3">
        {constraints.map((constraint) => (
          <div key={constraint.name} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
            <span className="text-sm text-slate-300">{constraint.name}</span>
            <span className={`inline-flex items-center gap-1 text-xs ${constraint.active ? 'text-emerald-300' : 'text-slate-500'}`}>
              <CheckCircle2 size={14} />
              {constraint.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

export default PhysicsConstraintPanel
