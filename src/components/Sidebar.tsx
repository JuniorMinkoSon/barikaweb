import { NavLink } from 'react-router-dom'

const Sidebar = () => (
  <aside className="hidden md:block fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-black/10 z-40">
    <nav className="p-4 space-y-1">
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[rgb(var(--brand))/0.1] text-[rgb(var(--brand-strong))] border border-[rgb(var(--brand))/0.3]' : 'text-[rgb(var(--accent))] hover:bg-black/5'}`}
      >
        <span>Tableau de bord</span>
      </NavLink>
      <NavLink
        to="/dashboard/profile"
        className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[rgb(var(--brand))/0.1] text-[rgb(var(--brand-strong))] border border-[rgb(var(--brand))/0.3]' : 'text-[rgb(var(--accent))] hover:bg-black/5'}`}
      >
        <span>Profil</span>
      </NavLink>
      <NavLink
        to="/dashboard/settings"
        className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[rgb(var(--brand))/0.1] text-[rgb(var(--brand-strong))] border border-[rgb(var(--brand))/0.3]' : 'text-[rgb(var(--accent))] hover:bg-black/5'}`}
      >
        <span>Paramètres</span>
      </NavLink>
    </nav>
  </aside>
)

export default Sidebar


