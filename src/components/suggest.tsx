import { Heart, MapPin } from 'lucide-react';
import { theme } from '../theme';

const CATEGORY_COLORS: Record<string, { dot: string; label: string; bg: string }> = {
  Voiture:   { dot: '#378ADD', label: '#0C447C', bg: '#E6F1FB' },
  Résidence: { dot: '#1D9E75', label: '#085041', bg: '#E1F5EE' },
  Vendeur:   { dot: '#BA7517', label: '#633806', bg: '#FAEEDA' },
};

const suggestions = [
  { id: 's1', name: 'Mercedes Classe S', price: 75000, location: 'Plateau', category: 'Voiture', image: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 's2', name: 'Appartement F3', price: 45000, location: 'Marcory', category: 'Résidence', image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

type Props = {
  onExplore?: () => void;
  onFavorite?: (id: string | number) => void;
};

export default function Suggest({ onExplore, onFavorite }: Props) {
  return (
    <div style={{ marginTop: theme.spacing.xl, paddingLeft: theme.spacing.md, paddingRight: theme.spacing.md }}>
      <div className="flex items-center justify-between mb-5 px-2">
        <span style={{ fontFamily: theme.fonts.heading, fontWeight: 900, fontSize: theme.fontSize.xl, color: theme.colors.secondary }}>
          Vous aimerez aussi
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
        {suggestions.map((s) => {
          const cat = CATEGORY_COLORS[s.category] || { bg: theme.colors.gray[100], dot: theme.colors.gray[400], label: theme.colors.gray[600] };
          return (
            <div
              key={s.id}
              style={{
                flexShrink: 0,
                width: 190,
                backgroundColor: theme.colors.white,
                borderRadius: 24,
                border: `1px solid ${theme.colors.gray[100]}`,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: 130, overflow: 'hidden' }}>
                <img src={s.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                <button
                  onClick={() => onFavorite?.(s.id)}
                  style={{
                    position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%',
                    background: theme.colors.white, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <Heart size={14} style={{ color: theme.colors.gray[300] }} />
                </button>
                <div style={{
                  position: 'absolute', bottom: 10, left: 10, backgroundColor: cat.bg,
                  borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cat.dot }} />
                  <span style={{ fontSize: 9, fontWeight: 800, color: cat.label, textTransform: 'uppercase' }}>
                    {s.category}
                  </span>
                </div>
              </div>

              <div style={{ padding: '16px' }}>
                <p style={{
                  fontFamily: theme.fonts.heading,
                  fontWeight: 800,
                  fontSize: theme.fontSize.base,
                  color: theme.colors.secondary,
                  marginBottom: 4,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}>
                  {s.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                  <MapPin size={12} style={{ color: theme.colors.gray[400] }} />
                  <span style={{ fontSize: theme.fontSize.xs, color: theme.colors.gray[500], fontWeight: 500 }}>
                    {s.location}
                  </span>
                </div>
                <p style={{ fontSize: theme.fontSize.lg, fontWeight: 900, color: theme.colors.primary, margin: 0 }}>
                  {s.price.toLocaleString()} <span style={{ fontSize: theme.fontSize.xs }}>FCFA</span>
                </p>
              </div>
            </div>
          );
        })}

        {/* Carte "Explorer" */}
        <div
          onClick={onExplore}
          style={{
            flexShrink: 0,
            width: 190,
            minHeight: 220,
            backgroundColor: theme.colors.gray[50],
            borderRadius: 24,
            border: `2px dashed ${theme.colors.gray[200]}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            gap: 12,
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: '50%', backgroundColor: theme.colors.primaryLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 24, color: theme.colors.primary, fontWeight: 700 }}>+</span>
          </div>
          <span style={{ fontSize: theme.fontSize.sm, fontWeight: 800, color: theme.colors.primary }}>
            Explorer
          </span>
        </div>
      </div>
    </div>
  );
}