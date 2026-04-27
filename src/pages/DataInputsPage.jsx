import { CheckCircle2 } from 'lucide-react'
import GlassCard from '../components/common/GlassCard'
import PageTitle from '../components/common/PageTitle'
import { dataIntegrity, gaugeFeed } from '../data/mockData'

function LayerCard({ title, subtitle }) {
  return (
    <GlassCard className="p-5">
      <p className="text-sm font-medium text-slate-200">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      <div className="mt-4 h-44 rounded-lg border border-slate-700 bg-gradient-to-br from-cyan-900/40 via-slate-900 to-slate-800" />
    </GlassCard>
  )
}

function DataInputsPage() {
  return (
    <div>
      <PageTitle
        title="Data Input Monitoring"
        description="Visual status of incoming hydrometeorological layers feeding the ConvLSTM model."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <LayerCard title="Rainfall Radar Input" subtitle="Radar heatmap placeholder" />
        <LayerCard title="Soil Moisture Layer 1" subtitle="Raster layer placeholder" />
        <LayerCard title="Soil Moisture Layer 2" subtitle="Raster layer placeholder" />

        <GlassCard className="p-5">
          <p className="text-sm font-medium text-slate-200">River Gauge Stage Feed</p>
          <p className="mt-4 text-3xl font-semibold text-cyan-200">{gaugeFeed.value}</p>
          <p className="mt-2 text-sm text-slate-300">{gaugeFeed.station}</p>
          <p className="mt-1 text-xs text-slate-500">{gaugeFeed.quality}</p>
        </GlassCard>
      </div>

      <GlassCard className="mt-6 p-5">
        <p className="text-sm font-medium text-slate-200">Data Integrity Status</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {dataIntegrity.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
              <span className="text-sm text-slate-300">{item.label}</span>
              <span className={`inline-flex items-center gap-1 text-xs ${item.status ? 'text-emerald-300' : 'text-rose-300'}`}>
                <CheckCircle2 size={14} />
                {item.status ? 'Ready' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

export default DataInputsPage
