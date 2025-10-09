import { NavLink } from 'react-router-dom'

const Navbar = () => (
  <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 px-4 py-4 flex justify-center gap-6 sm:gap-8 border-b border-gray-200">
    <NavLink 
      to="/dashboard" 
      className={({ isActive }) => `text-sm sm:text-base font-medium transition-all duration-500 hover:scale-110 hover:-translate-y-0.5 border-b-2 pb-1 ${isActive ? 'text-[rgb(var(--brand))] border-[rgb(var(--brand))]' : 'text-white border-transparent hover:text-[rgb(var(--brand))] hover:border-[rgb(var(--brand))]'}`}
    >
      Dashboard
    </NavLink>
    <NavLink 
      to="/" 
      end
      className={({ isActive }) => `text-sm sm:text-base font-medium transition-all duration-500 hover:scale-110 hover:-translate-y-0.5 border-b-2 pb-1 ${isActive ? 'text-[rgb(var(--brand))] border-[rgb(var(--brand))]' : 'text-white border-transparent hover:text-[rgb(var(--brand))] hover:border-[rgb(var(--brand))]'}`}
    >
      Accueil
    </NavLink>
    <NavLink 
      to="/about" 
      className={({ isActive }) => `text-sm sm:text-base font-medium transition-all duration-500 hover:scale-110 hover:-translate-y-0.5 border-b-2 pb-1 ${isActive ? 'text-[rgb(var(--brand))] border-[rgb(var(--brand))]' : 'text-white border-transparent hover:text-[rgb(var(--brand))] hover:border-[rgb(var(--brand))]'}`}
    >
    
      Services
    </NavLink>
    <NavLink 
      to="/objectives" 
      className={({ isActive }) => `text-sm sm:text-base font-medium transition-all duration-500 hover:scale-110 hover:-translate-y-0.5 border-b-2 pb-1 ${isActive ? 'text-[rgb(var(--brand))] border-[rgb(var(--brand))]' : 'text-white border-transparent hover:text-[rgb(var(--brand))] hover:border-[rgb(var(--brand))]'}`}
    >
      Objectifs
    </NavLink>
    <NavLink 
      to="/projects" 
      className={({ isActive }) => `text-sm sm:text-base font-medium transition-all duration-500 hover:scale-110 hover:-translate-y-0.5 border-b-2 pb-1 ${isActive ? 'text-[rgb(var(--brand))] border-[rgb(var(--brand))]' : 'text-white border-transparent hover:text-[rgb(var(--brand))] hover:border-[rgb(var(--brand))]'}`}
    >
      Projets
    </NavLink>
    <NavLink 
      to="/contact" 
      className={({ isActive }) => `text-sm sm:text-base font-medium transition-all duration-500 hover:scale-110 hover:-translate-y-0.5 border-b-2 pb-1 ${isActive ? 'text-[rgb(var(--brand))] border-[rgb(var(--brand))]' : 'text-white border-transparent hover:text-[rgb(var(--brand))] hover:border-[rgb(var(--brand))]'}`}
    >
      Contact
    </NavLink>
  </nav>
)

export default Navbar