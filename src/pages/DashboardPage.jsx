import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageTitle from '../components/common/PageTitle'
import SummaryCard from '../components/dashboard/SummaryCard'
import FloodSeverityIndicator from '../components/dashboard/FloodSeverityIndicator'
import PhysicsConstraintPanel from '../components/dashboard/PhysicsConstraintPanel'
import PredictionLogsTable from '../components/dashboard/PredictionLogsTable'
import GlassCard from '../components/common/GlassCard'
import {
  constraints,
  predictionLogs,
  severity,
  stageSeries,
  summaryCards,
} from '../data/mockData'

function DashboardPage() {
  return (
    <div>
      <PageTitle
        title="Main Monitoring Dashboard"
        description="Live monitoring of river-stage behavior and next-hour physics-guided AI forecasts."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <GlassCard className="p-5 xl:col-span-2">
          <p className="mb-4 text-sm font-medium text-slate-200">River Stage Forecast (Past 24h + Next 1h)</p>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={stageSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[3, 5]} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
                <Legend />
                <Line type="monotone" dataKey="observed" stroke="#38bdf8" strokeWidth={2.5} name="Observed" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2.5} name="Predicted" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Warning Threshold" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <FloodSeverityIndicator severity={severity} />
          <PhysicsConstraintPanel constraints={constraints} />
        </div>
      </section>

      <section className="mt-6">
        <PredictionLogsTable rows={predictionLogs} />
      </section>
    </div>
  )
}

export default DashboardPage
