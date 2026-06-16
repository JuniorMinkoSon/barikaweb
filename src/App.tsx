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

function App() {
  const [activeTab, setActiveTab] = useState('home');

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

export default App;
