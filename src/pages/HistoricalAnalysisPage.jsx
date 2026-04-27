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
import GlassCard from '../components/common/GlassCard'
import PageTitle from '../components/common/PageTitle'
import { historicalComparison, modelMetrics } from '../data/mockData'

function HistoricalAnalysisPage() {
  return (
    <div>
      <PageTitle
        title="Historical Analysis"
        description="Model performance metrics and actual vs predicted stage comparisons from historical flood events."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {modelMetrics.map((metric) => (
          <GlassCard key={metric.label} className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-200">{metric.value}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-6 p-5">
        <p className="mb-4 text-sm font-medium text-slate-200">Historical Event Comparison</p>
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={historicalComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="event" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[3.5, 5.4]} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={2.5} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2.5} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  )
}

export default HistoricalAnalysisPage
