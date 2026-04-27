function PageTitle({ title, description }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-100">{title}</h1>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  )
}

export default PageTitle
