import { motion } from 'framer-motion'

function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl border border-slate-700/60 bg-slate-900/60 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard
