import DashboardLayout from '../layouts/DashboardLayout'

const Settings = () => (
  <DashboardLayout>
    <h1 className="text-2xl font-bold text-[rgb(var(--accent))]">Paramètres</h1>
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="rounded-xl bg-white ring-1 ring-black/5 p-4 shadow-sm">
        <ul className="space-y-2 text-sm">
          <li className="text-[rgb(var(--brand-strong))]">Général</li>
          <li className="text-gray-700">Comptes & équipes</li>
          <li className="text-gray-700">Sécurité</li>
          <li className="text-gray-700">Notifications</li>
          <li className="text-gray-700">Thème</li>
        </ul>
      </aside>
      <section className="lg:col-span-3 rounded-xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Général</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de l’organisation</label>
            <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]" placeholder="Votre société" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
            <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]">
              <option>GMT</option>
              <option>UTC</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button className="inline-flex items-center rounded-md bg-[rgb(var(--brand-strong))] text-white px-4 py-2 text-sm font-medium shadow hover:shadow-xl hover:bg-[rgb(var(--brand))] transition">Enregistrer</button>
        </div>
      </section>
    </div>
  </DashboardLayout>
)

export default Settings


