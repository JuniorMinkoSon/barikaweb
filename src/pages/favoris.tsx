import { useState } from 'react';
import { Star, MapPin, Trash2, ChevronRight, Heart } from 'lucide-react';
import { theme } from '../theme';
import Suggest from '../components/suggest';

const initialFavorites = [
  { id: 1, name: 'Toyota Corolla 2022', category: 'Voiture', price: 35000, unit: '/jour', rating: 4.8, location: 'Cocody', image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, name: 'Villa avec piscine', category: 'Résidence', price: 120000, unit: '/nuit', rating: 4.9, location: 'Bingerville', image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, name: 'Boutique Diarrassouba', category: 'Vendeur', price: 15000, unit: 'min.', rating: 4.7, location: 'Adjamé', image: 'https://images.pexels.com/photos/1482061/pexels-photo-1482061.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const CATEGORY_COLORS: Record<string, { dot: string; label: string; bg: string }> = {
  Voiture:   { dot: '#378ADD', label: '#0C447C', bg: '#E6F1FB' },
  Résidence: { dot: '#1D9E75', label: '#085041', bg: '#E1F5EE' },
  Vendeur:   { dot: '#BA7517', label: '#633806', bg: '#FAEEDA' },
};

export default function Favorites() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [activeFilter, setActiveFilter] = useState('Tout');

  const filtered = activeFilter === 'Tout'
    ? favorites
    : favorites.filter((f) => f.category === activeFilter);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.white, paddingBottom: theme.spacing['2xl'] }}>

      {/* ── HEADER ── */}
      <div style={{ padding: `${theme.spacing.xl} ${theme.spacing.md} ${theme.spacing.sm}` }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 style={{
              fontSize: theme.fontSize['2xl'],
              fontWeight: 700,
              color: theme.colors.secondary,
              fontFamily: theme.fonts.heading,
            }}>
              Mes Favoris
            </h1>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            padding: '8px 16px', 
            borderRadius: 16,
            backgroundColor: theme.colors.primaryLight 
          }}>
            <Heart size={18} style={{ color: theme.colors.primary, fill: theme.colors.primary }} />
            <span style={{ fontSize: theme.fontSize.lg, fontWeight: 900, color: theme.colors.primary }}>
              {favorites.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── FILTRES ── */}
      <div className="flex gap-3 px-6 mb-8 overflow-x-auto no-scrollbar">
        {['Tout', 'Voiture', 'Résidence', 'Vendeur'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '10px 20px',
              borderRadius: 100,
              fontSize: theme.fontSize.sm,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeFilter === f ? theme.colors.secondary : theme.colors.gray[100],
              color: activeFilter === f ? theme.colors.white : theme.colors.gray[500],
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── LISTE DES FAVORIS ── */}
      <div className="px-6 space-y-4">
        {filtered.map((item) => {
          const cat = CATEGORY_COLORS[item.category] || { bg: theme.colors.gray[100], dot: theme.colors.gray[400], label: theme.colors.gray[600] };
          return (
            <div
              key={item.id}
              className="flex items-center gap-5 p-4 rounded-[32px]"
              style={{ border: `1px solid ${theme.colors.gray[100]}`, backgroundColor: theme.colors.white }}
            >
              <div style={{ width: 100, height: 100, borderRadius: 24, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={item.image} className="w-full h-full object-cover" alt="" />
                <div style={{ 
                  position: 'absolute', bottom: 6, left: 6, 
                  display: 'flex', alignItems: 'center', gap: 4, 
                  padding: '4px 8px', borderRadius: 8, backgroundColor: cat.bg 
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cat.dot }} />
                  <span style={{ fontSize: 9, fontWeight: 800, color: cat.label, textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ 
                  fontSize: theme.fontSize.base, 
                  fontWeight: 500, 
                  color: theme.colors.secondary, 
                  fontFamily: theme.fonts.heading,
                  marginBottom: 4,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}>
                  {item.name}
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1" style={{ color: theme.colors.gray[500] }}>
                    <MapPin size={12} />
                    <span style={{ fontSize: theme.fontSize.sm, fontWeight: 500 }}>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} style={{ fill: '#FB923C', color: '#FB923C' }} />
                    <span style={{ fontSize: theme.fontSize.sm, fontWeight: 800, color: theme.colors.secondary }}>{item.rating}</span>
                  </div>
                </div>
                <p style={{ fontSize: theme.fontSize.base, fontWeight: 900, color: theme.colors.secondary, margin: 0 }}>
                  {item.price.toLocaleString()}
                  <span style={{ fontSize: theme.fontSize.base, fontWeight: 500, color: theme.colors.gray[400], marginLeft: 4 }}>
                    FCFA {item.unit}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3" style={{ flexShrink: 0 }}>
                <button
                  onClick={() => setFavorites((f) => f.filter((x) => x.id !== item.id))}
                  style={{ 
                    padding: 10, borderRadius: 14, border: `1px solid ${theme.colors.gray[100]}`, 
                    backgroundColor: 'transparent', color: theme.colors.gray[300], cursor: 'pointer' 
                  }}
                >
                  <Trash2 size={20} />
                </button>
                <button style={{ 
                  padding: 10, borderRadius: 14, border: 'none',
                  backgroundColor: theme.colors.secondary, color: theme.colors.white, 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer' 
                }}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SUGGESTIONS ── */}
      <Suggest/>

    </div>
  );
}