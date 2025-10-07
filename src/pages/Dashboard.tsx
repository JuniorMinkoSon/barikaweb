import DashboardLayout from '../layouts/DashboardLayout'

const Dashboard = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-bold text-[rgb(var(--accent))]">Tableau de bord</h1>
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Leads', value: '128' },
        { label: 'Projets actifs', value: '24' },
        { label: 'CA du mois', value: '15 M' },
        { label: 'Tâches en retard', value: '3' }
      ].map(kpi => (
        <div key={kpi.label} className="rounded-xl bg-white ring-1 ring-black/5 p-5 shadow-sm">
          <div className="text-sm text-gray-600">{kpi.label}</div>
          <div className="mt-2 text-2xl font-bold text-[rgb(var(--brand-strong))]">{kpi.value}</div>
        </div>
      ))}
    </div>
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm h-72">Graphique (à intégrer)</div>
      <div className="rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm h-72">Activité récente</div>
    </div>
  </DashboardLayout>
)

export default Dashboard


