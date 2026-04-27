import GlassCard from '../components/common/GlassCard'
import PageTitle from '../components/common/PageTitle'

function SettingsPage() {
  return (
    <div>
      <PageTitle
        title="Settings"
        description="Frontend placeholder for future backend-integrated configuration and station management."
      />
      <GlassCard className="p-5">
        <p className="text-sm text-slate-300">
          This research prototype is frontend-only and backend-ready for future FastAPI model endpoint integration.
        </p>
      </GlassCard>
    </div>
  )
}

export default SettingsPage
