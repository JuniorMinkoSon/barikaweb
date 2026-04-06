import { Star, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { theme } from '../theme';
import { useState } from 'react';
import { toDetailProduct } from '../productTypes';
import type { Product, MockProduct } from '../productTypes';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const mockProducts: MockProduct[] = [
  { id: 1,  name: 'Toyota Corolla 2022',        category: 'Voiture',    price: 35000,  unit: '/jour',       rating: 4.8, reviews: 43,  location: 'Cocody, Abidjan',     tags: ['Climatisé', 'Automatique'],        image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 2,  name: 'Villa avec piscine',          category: 'Résidence',  price: 120000, unit: '/nuit',       rating: 4.9, reviews: 27,  location: 'Bingerville',          tags: ['Piscine', 'Wifi', 'Gardien'],      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 3,  name: 'Boutique Diarrassouba',       category: 'Vendeur',    price: 15000,  unit: 'min.',        rating: 4.7, reviews: 88,  location: 'Adjamé, Abidjan',      tags: ['Électronique', 'Négociable'],      image: 'https://images.pexels.com/photos/1482061/pexels-photo-1482061.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 4,  name: 'Groupe électrogène 10KVA',    category: 'Matériel',   price: 25000,  unit: '/jour',       rating: 4.6, reviews: 19,  location: 'Yopougon, Abidjan',    tags: ['Livraison', 'Puissant'],           image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 5,  name: 'Excursion Grand-Bassam',      category: 'Expérience', price: 18000,  unit: '/pers.',      rating: 4.9, reviews: 62,  location: 'Grand-Bassam',         tags: ['Plage', 'Guide', 'Repas'],         image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 6,  name: 'Mercedes Classe C 2021',      category: 'Voiture',    price: 75000,  unit: '/jour',       rating: 4.9, reviews: 31,  location: 'Plateau, Abidjan',     tags: ['Luxe', 'Chauffeur'],               image: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 7,  name: 'Appartement meublé F3',       category: 'Résidence',  price: 65000,  unit: '/nuit',       rating: 4.7, reviews: 45,  location: 'Marcory, Abidjan',     tags: ['Meublé', 'Climatisé', 'Parking'],  image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 8,  name: 'Fashion Store Konaté',        category: 'Vendeur',    price: 5000,   unit: 'min.',        rating: 4.8, reviews: 134, location: 'Treichville, Abidjan', tags: ['Mode', 'Wax'],                     image: 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 9,  name: 'Sono & Éclairage pro',        category: 'Matériel',   price: 80000,  unit: '/événement',  rating: 4.5, reviews: 28,  location: 'Abobo, Abidjan',       tags: ['Événement', 'Livraison'],          image: 'https://images.pexels.com/photos/1537637/pexels-photo-1537637.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 10, name: 'Atelier poterie & Art',       category: 'Expérience', price: 12000,  unit: '/pers.',      rating: 4.8, reviews: 41,  location: 'Cocody, Abidjan',      tags: ['Artisanat', 'Créatif'],            image: 'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 11, name: 'Renault Kangoo utilitaire',   category: 'Voiture',    price: 20000,  unit: '/jour',       rating: 4.6, reviews: 17,  location: 'Port-Bouët, Abidjan',  tags: ['Utilitaire', 'Grand volume'],      image: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 12, name: 'Studio moderne centre-ville', category: 'Résidence',  price: 40000,  unit: '/nuit',       rating: 4.7, reviews: 56,  location: 'Plateau, Abidjan',     tags: ['Vue mer', 'Wifi', 'Neuf'],         image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

const categories = ['Voiture', 'Résidence', 'Vendeur', 'Matériel', 'Expérience'];

const priceRanges = [
  { label: 'Moins de 25 000 FCFA', min: 0,      max: 25000   },
  { label: '25 000 – 75 000 FCFA', min: 25000,  max: 75000   },
  { label: '75 000 – 150 000 FCFA',min: 75000,  max: 150000  },
  { label: 'Plus de 150 000 FCFA', min: 150000, max: Infinity },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

const SidebarContent = ({
  selectedCategories, toggleCategory,
  selectedPrice, setSelectedPrice,
  sortBy, setSortBy,
}: {
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  selectedPrice: { min: number; max: number } | null;
  setSelectedPrice: (r: { label: string; min: number; max: number } | null) => void;
  sortBy: 'rating' | 'price';
  setSortBy: (v: 'rating' | 'price') => void;
}) => (
  <>
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.colors.gray[400], marginBottom: 12 }}>
        Catégories
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {categories.map(cat => {
          const active = selectedCategories.includes(cat);
          return (
            <button key={cat} onClick={() => toggleCategory(cat)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              backgroundColor: active ? '#FFF5F2' : 'transparent',
              color: active ? theme.colors.primary : theme.colors.gray[600],
              fontWeight: active ? 600 : 400, fontSize: 14,
              transition: 'all 0.15s', textAlign: 'left',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, backgroundColor: active ? theme.colors.primary : theme.colors.gray[300], transition: 'background 0.15s' }} />
              {cat}
            </button>
          );
        })}
      </div>
    </div>

    <div style={{ height: 1, backgroundColor: theme.colors.gray[100], marginBottom: 28 }} />

    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.colors.gray[400], marginBottom: 12 }}>
        Tarif (FCFA)
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {priceRanges.map(range => {
          const active = selectedPrice?.min === range.min && selectedPrice?.max === range.max;
          return (
            <label key={range.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, cursor: 'pointer', backgroundColor: active ? '#FFF5F2' : 'transparent', transition: 'background 0.15s' }}>
              <input type="radio" name="price" checked={active} onChange={() => setSelectedPrice(range)} style={{ accentColor: theme.colors.primary, width: 14, height: 14 }} />
              <span style={{ fontSize: 13, color: active ? theme.colors.primary : theme.colors.gray[600], fontWeight: active ? 600 : 400 }}>
                {range.label}
              </span>
            </label>
          );
        })}
        {selectedPrice && (
          <button onClick={() => setSelectedPrice(null)} style={{ fontSize: 12, color: theme.colors.primary, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px 12px', textDecoration: 'underline' }}>
            Réinitialiser
          </button>
        )}
      </div>
    </div>

    <div style={{ height: 1, backgroundColor: theme.colors.gray[100], marginBottom: 28 }} />

    <div>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.colors.gray[400], marginBottom: 12 }}>
        Trier par
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {(['rating', 'price'] as const).map(val => (
          <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, cursor: 'pointer', backgroundColor: sortBy === val ? '#FFF5F2' : 'transparent', transition: 'background 0.15s' }}>
            <input type="radio" name="sort" checked={sortBy === val} onChange={() => setSortBy(val)} style={{ accentColor: theme.colors.primary, width: 14, height: 14 }} />
            <span style={{ fontSize: 13, color: sortBy === val ? theme.colors.primary : theme.colors.gray[600], fontWeight: sortBy === val ? 600 : 400 }}>
              {val === 'rating' ? 'Meilleure note' : 'Prix (bas au haut)'}
            </span>
          </label>
        ))}
      </div>
    </div>
  </>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

interface ProductsProps {
  onOpenDetail: (product: Product) => void;
}

export default function Products({ onOpenDetail }: ProductsProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice]           = useState<{ label: string; min: number; max: number } | null>(null);
  const [sortBy, setSortBy]                         = useState<'rating' | 'price'>('rating');
  const [drawerOpen, setDrawerOpen]                 = useState(false);

  // ── Ouvrir la page détail via le parent App ──
  const openDetail = (p: MockProduct) => onOpenDetail(toDetailProduct(p));

  // ── Filtres & tri ──
  const filteredProducts = mockProducts
    .filter(p => {
      const catOk   = selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const priceOk = !selectedPrice || (p.price >= selectedPrice.min && p.price <= selectedPrice.max);
      return catOk && priceOk;
    })
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : a.price - b.price);

  const toggleCategory = (cat: string) =>
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const activeFiltersCount = selectedCategories.length + (selectedPrice ? 1 : 0);

  return (
    <>
      <style>{`
        .products-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          min-height: 100vh;
        }
        .sidebar-desktop { display: block; }
        .fab-filter { display: none; }
        @media (max-width: 768px) {
          .products-layout { grid-template-columns: 1fr; }
          .sidebar-desktop { display: none; }
          .fab-filter { display: flex; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr !important; }
        }
        .voir-btn:hover { background-color: ${theme.colors.primaryHover} !important; }
        .product-card { transition: transform 0.2s, box-shadow 0.2s; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.08); }
      `}</style>

      <div style={{ backgroundColor: theme.colors.gray[50], minHeight: '100vh' }}>
        <div className="products-layout">

          {/* ── SIDEBAR DESKTOP ── */}
          <aside className="sidebar-desktop" style={{
            backgroundColor: '#fff',
            borderRight: `1px solid ${theme.colors.gray[200]}`,
            padding: '28px 20px',
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
            borderRadius: '0 16px 16px 0',
          }}>
            <SidebarContent
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </aside>

          {/* ── MAIN ── */}
          <main style={{ padding: '28px 20px' }}>

            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.colors.gray[400], marginBottom: 4 }}>
                Découvrez
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: theme.colors.secondary, margin: 0 }}>
                Nos produits
              </h2>
            </div>

            {/* Active filter chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
              {selectedCategories.map(cat => (
                <span key={cat} onClick={() => toggleCategory(cat)} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, backgroundColor: '#FFF5F2', color: theme.colors.primary, fontWeight: 600, cursor: 'pointer', border: `1px solid ${theme.colors.primary}30` }}>
                  {cat} ×
                </span>
              ))}
              {selectedPrice && (
                <span onClick={() => setSelectedPrice(null)} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, backgroundColor: '#FFF5F2', color: theme.colors.primary, fontWeight: 600, cursor: 'pointer', border: `1px solid ${theme.colors.primary}30` }}>
                  {selectedPrice.label} ×
                </span>
              )}
            </div>

            {/* Grid */}
            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => openDetail(product)}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: `1px solid ${theme.colors.gray[100]}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ position: 'relative', height: 170, overflow: 'hidden' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{
                      position: 'absolute', top: 12, left: 12,
                      fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                      backgroundColor: 'rgba(26,26,26,0.75)', color: '#fff',
                      letterSpacing: '0.04em', backdropFilter: 'blur(4px)',
                    }}>
                      {product.category}
                    </span>
                  </div>

                  <div style={{ padding: '14px 16px 16px' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.colors.secondary, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} style={{ width: 13, height: 13, color: i < Math.floor(product.rating) ? theme.colors.primary : theme.colors.gray[200], fill: i < Math.floor(product.rating) ? theme.colors.primary : theme.colors.gray[200] }} />
                        ))}
                        <span style={{ fontSize: 12, color: theme.colors.gray[500], marginLeft: 4 }}>{product.rating} ({product.reviews})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin style={{ width: 12, height: 12, color: theme.colors.gray[400] }} />
                        <span style={{ fontSize: 11, color: theme.colors.gray[400] }}>{product.location}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                      {product.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, backgroundColor: theme.colors.gray[100], color: theme.colors.gray[600], border: `1px solid ${theme.colors.gray[200]}` }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${theme.colors.gray[100]}` }}>
                      <div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: theme.colors.primary }}>
                          {product.price.toLocaleString('fr-FR')}
                        </span>
                        <span style={{ fontSize: 12, color: theme.colors.gray[400], marginLeft: 4 }}>
                          FCFA {product.unit}
                        </span>
                      </div>
                      <button
                        className="voir-btn"
                        onClick={e => { e.stopPropagation(); openDetail(product); }}
                        style={{
                          padding: '8px 18px', borderRadius: 10, border: 'none',
                          backgroundColor: theme.colors.primary, color: '#fff',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px 0', color: theme.colors.gray[400], fontSize: 14 }}>
                Aucun produit ne correspond à vos critères
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── FAB FILTRES MOBILE ── */}
      <button
        className="fab-filter"
        onClick={() => setDrawerOpen(true)}
        style={{
          position: 'fixed', bottom: 130, left: 20, zIndex: 1001,
          alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '14px 24px', borderRadius: 999, border: 'none',
          backgroundColor: theme.colors.primary, color: '#fff',
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
        }}
      >
        <SlidersHorizontal size={16} />
        Filtres
        {activeFiltersCount > 0 && (
          <span style={{ backgroundColor: '#fff', color: theme.colors.primary, borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* ── DRAWER MOBILE ── */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            backgroundColor: '#fff', borderRadius: '20px 20px 0 0',
            padding: '24px 20px 40px', zIndex: 300, maxHeight: '85vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: theme.colors.secondary }}>Filtres</p>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.gray[500] }}>
                <X size={20} />
              </button>
            </div>
            <SidebarContent
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            <button
              onClick={() => setDrawerOpen(false)}
              style={{ width: '100%', marginTop: 24, padding: '14px', borderRadius: 12, border: 'none', backgroundColor: theme.colors.primary, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
            >
              Voir {filteredProducts.length} produits
            </button>
          </div>
        </>
      )}
    </>
  );
}