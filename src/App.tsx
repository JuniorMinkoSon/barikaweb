import { useState } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Hero from './components/Hero';
import Favorites from './pages/favoris';
import Orders from './pages/commandes';
import Cart from './pages/panier';
import Profile from './pages/profil';
import { theme } from './theme';
import FloatingChat from './components/FloatingChat';
import SearchExperience from './features/search/SearchExperience';
import { AuthProvider, useAuth } from './lib/auth-context';
import AuthPage from './features/auth/AuthPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: theme.colors.white }}>
        <p className="text-sm text-slate-400 font-['DM_Sans']">Chargement…</p>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        backgroundColor: theme.colors.white,
        overflow: 'hidden',
      }}
    >
      {activeTab === 'home' && <Navbar />}

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 96,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {activeTab === 'home' ? (
          <>
            <Hero />
            <SearchExperience />
          </>
        ) : activeTab === 'favorites' ? (
          <Favorites />
        ) : activeTab === 'orders' ? (
          <Orders />
        ) : activeTab === 'cart' ? (
          <Cart />
        ) : activeTab === 'profile' ? (
          <Profile />
        ) : (
          <div className="flex items-center justify-center h-[60vh] font-['Syne'] text-slate-400">
            Page {activeTab} en cours de développement
          </div>
        )}
      </main>

      <BottomNav active={activeTab} setActive={setActiveTab} />
      <FloatingChat />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
