import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserCircle, Search, Bell, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { haptic } from '../utils/haptics';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    haptic.light();
    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'fr', name: 'FR', flag: '🇫🇷' },
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'zh', name: 'ZH', flag: '🇨🇳' }
  ];

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:rotate-6 group-hover:scale-110">
            L
          </div>
          <span className="font-black text-2xl tracking-tighter text-gray-900 hidden sm:inline-block italic">
            Loca<span className="text-orange-600">Connecté</span>
          </span>
        </Link>

        {/* Global Search (Visible on Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un service, une zone..." 
            className="w-full bg-gray-100 border-none rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-orange-600 focus:bg-white transition-all shadow-inner"
          />
        </form>

        {/* Global Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Language Selector */}
          <div className="relative group px-2 py-1 flex items-center gap-1 cursor-pointer hover:bg-gray-50 rounded-lg">
            <Globe size={18} className="text-gray-600" />
            <span className="text-sm font-bold text-gray-700 uppercase">{i18n.language}</span>
            <div className="hidden group-hover:block absolute top-[100%] right-0 bg-white shadow-xl rounded-xl border p-1 min-w-[100px] animate-in fade-in slide-in-from-top-2">
              {languages.map((lang) => (
                <button 
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 ${i18n.language === lang.code ? 'font-bold text-blue-900 bg-blue-50' : 'text-gray-700'}`}
                >
                  <span>{lang.flag}</span> {lang.name}
                </button>
              ))}
            </div>
          </div>

          <button className="text-gray-600 hover:text-orange-500 transition-colors relative p-1 md:hidden">
            <Search size={22} />
          </button>
          
          <button className="text-gray-600 hover:text-orange-500 transition-colors relative p-1">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          {user ? (
            <div className="relative group cursor-pointer inline-flex items-center gap-2">
              <UserCircle size={28} className="text-gray-800" />
              <div className="hidden group-hover:block absolute top-[120%] right-0 bg-white shadow-xl rounded-xl border p-2 min-w-[200px] animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b text-sm mb-2">
                  <p className="font-bold text-gray-900 line-clamp-1">{user.phone}</p>
                  <p className="text-xs text-gray-500 capitalize px-2 py-0.5 bg-blue-50 rounded-full inline-block mt-1">{user.role}</p>
                </div>
                {user.role === 'provider' ? (
                  <Link to="/provider/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-semibold text-blue-900">
                    Dashboard Prestataire
                  </Link>
                ) : (
                  <Link to="/provider/register" className="block px-3 py-2 text-sm text-blue-900 hover:bg-blue-50 rounded-lg font-bold">
                    {t('common.become_provider')}
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1">
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-white bg-blue-900 px-4 py-2 rounded-lg hover:bg-blue-800 transition-all shadow-md">
              {t('common.become_provider')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}