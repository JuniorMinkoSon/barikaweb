import { useState } from 'react';
import Navbar from './components/Navbar';
import Stories from './components/Stories';
import Categories from './components/Categories';
import Products from './components/Providers';
import BottomNav from './components/BottomNav';
import Hero from './components/Hero';
import Favorites from './pages/favoris';
import Orders from './pages/commandes';
import Cart from './pages/panier';
import Profile from './pages/profil';
import ProductDetailPage from './pages/detail';
import SellerProfilePage from './pages/Sellerprofilepage';
import { theme } from './theme';
import type { Product } from './productTypes';
import type { Seller } from './pages/Sellerprofilepage';
import FloatingChat from './components/FloatingChat';

// ── Vendeur mock — remplace par ta vraie source de données ───────────────────
const MOCK_SELLER: Seller = {
  id: 'seller-1',
  name: 'Aminata Diallo',
  avatar: 'https://i.pravatar.cc/150?img=47',
  tagline: 'Spécialiste mode & lifestyle africain · Abidjan',
  verified: true,
  rating: 4.8,
  reviews: 312,
  totalSales: 1840,
  responseTime: '< 1h',
  bio: "Passionnée de mode et de créations artisanales, je propose des produits soigneusement sélectionnés pour allier authenticité et qualité. Basée à Abidjan, je livre partout en Côte d'Ivoire.",
  badges: ['Top vendeur 2024', 'Livraison express', 'Satisfaction garantie'],
  location: '',
  memberSince: '',
  responseRate: 0,
  categories: []
};

// ── Utilitaire : retrouve le vendeur lié à un produit ────────────────────────
// Remplace cette logique par ton vrai store/API quand il sera prêt
function getSellerForProduct(_product: Product): Seller {
  return MOCK_SELLER;
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(null);

  const openDetail = (product: Product) => {
    setCurrentProduct(product);
    setCurrentSeller(null);
  };

  const closeDetail = () => setCurrentProduct(null);

  const openSellerProfile = (seller: Seller) => setCurrentSeller(seller);

  // ── Page profil vendeur complète ─────────────────────────────────────────
  if (currentSeller) {
    return (
      <SellerProfilePage
        seller={currentSeller}
        onBack={() => setCurrentSeller(null)} products={[]} onProductClick={function (product: Product): void {
          throw new Error('Function not implemented.');
        } }      />
    );
  }

  // ── Page détail produit ───────────────────────────────────────────────────
  if (currentProduct) {
    const seller = getSellerForProduct(currentProduct);
    return (
      <ProductDetailPage
        product={currentProduct}
        seller={seller}
        onBack={closeDetail}
        onSellerClick={() => openSellerProfile(seller)}
      />
    );
  }

  // ── App principale ────────────────────────────────────────────────────────
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
            <Stories />
            <Categories />
            <Products onOpenDetail={openDetail} />
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