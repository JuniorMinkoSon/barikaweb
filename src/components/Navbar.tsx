// Navbar.tsx
import { Search, Menu, X } from 'lucide-react';
import { theme } from '../theme';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 font-['DM_Sans']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer active:scale-95 transition-transform">
            <span className="text-xl font-black tracking-tight text-slate-900">
              LocalConnect
            </span>
          </div>

          {/* Barre de recherche — Desktop (Visible, contrastée) */}
          <div className="hidden sm:flex flex-1 max-w-md ml-4">
            <div className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-gray-100 border border-transparent focus-within:border-orange-500/30 focus-within:bg-white focus-within:shadow-md transition-all w-full">
              <Search size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent flex-1 outline-none text-sm text-slate-800 placeholder:text-gray-500 font-medium"
              />
            </div>
          </div>

          {/* Actions Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              className="px-6 py-2.5 rounded-full text-white font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
              style={{ 
                backgroundColor: theme.colors.primary,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.colors.primaryHover)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = theme.colors.primary)}
            >
              Se connecter
            </button>
          </div>

          {/* Icônes Mobile */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition-colors ${searchOpen ? 'bg-orange-50 text-orange-500' : 'text-gray-600'}`}
            >
              <Search size={22} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 rounded-full active:bg-gray-100"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Barre de recherche mobile (Dépliante avec contraste) */}
      <div 
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${searchOpen ? 'max-h-20 border-t border-gray-50' : 'max-h-0'}`}
      >
        <div className="p-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-100 border border-gray-200 focus-within:bg-white focus-within:border-orange-500 transition-all">
            <Search size={18} className="text-gray-400" />
            <input
              autoFocus={searchOpen}
              type="text"
              placeholder="Rechercher un prestataire..."
              className="bg-transparent flex-1 outline-none text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Menu mobile (Simple & Pro) */}
      <div 
        className={`sm:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-60 border-t border-gray-100' : 'max-h-0'}`}
      >
        <div className="p-4 flex flex-col gap-3">
          <button
            className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-md active:scale-[0.98] transition-transform"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Se connecter
          </button>
          <p className="text-center text-xs text-gray-400 font-medium py-2">
            Connectez-vous pour gérer vos réservations
          </p>
        </div>
      </div>
    </nav>
  );
}