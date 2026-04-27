import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import GlassCard from '../components/common/GlassCard'
import PageTitle from '../components/common/PageTitle'
import { finalPrediction, pipelineSteps } from '../data/mockData'

function AIPredictionPage() {
  const [running, setRunning] = useState(false)

  const runPrediction = () => {
    setRunning(true)
    setTimeout(() => setRunning(false), 1500)
  }

  return (
    <div>
      <PageTitle
        title="AI Prediction Pipeline"
        description="Simulation of the physics-guided ConvLSTM processing workflow for next-hour river stage prediction."
      />

      <GlassCard className="p-5">
        <p className="text-sm font-medium text-slate-200">Input Sequence Summary</p>
        <p className="mt-2 text-lg font-semibold text-cyan-200">24 Hour Hydrological Window Loaded</p>
      </GlassCard>

      <section className="mt-6">
        <p className="mb-3 text-sm font-medium text-slate-300">Model Processing Flow</p>
        <div className="grid gap-3 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {pipelineSteps.map((step, index) => (
            <div key={step} className="contents">
              <GlassCard className="p-4 text-center">
                <p className="text-sm text-slate-200">{step}</p>
              </GlassCard>
              {index < pipelineSteps.length - 1 && (
                <div className="hidden items-center justify-center xl:flex">
                  <ArrowRight className="text-cyan-300" size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <GlassCard className="mt-6 p-5">
        <p className="text-sm font-medium text-slate-200">Final Prediction Output</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Output label="Predicted Water Level" value={finalPrediction.predictedWaterLevel} />
          <Output label="Expected Rise/Fall" value={finalPrediction.expectedTrend} />
          <Output label="Threshold Breach Probability" value={finalPrediction.thresholdBreachProbability} />
          <Output label="Event Confidence" value={finalPrediction.eventConfidence} />
        </div>
      </GlassCard>

      <div className="mt-6">
        <button
          type="button"
          onClick={runPrediction}
          className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Run Prediction
        </button>
        {running && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-slate-800"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5 }}
              className="h-full bg-cyan-400"
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}

function Output({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-cyan-200">{value}</p>
    </div>
  )
}

export default AIPredictionPage
