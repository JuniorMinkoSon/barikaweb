import DashboardLayout from '../layouts/DashboardLayout'

const Profile = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-bold text-[rgb(var(--accent))]">Profil</h1>
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm">Informations personnelles</div>
      <div className="rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm">Préférences</div>
    </div>
  </DashboardLayout>
)

export default Profile


