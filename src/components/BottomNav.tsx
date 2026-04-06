// BottomNav.tsx
import { Home, ShoppingBag, Heart, User, ShoppingCart } from 'lucide-react';
import { theme } from '../theme';

const navItems = [
  { id: 'favorites', label: 'Favoris',    icon: Heart },
  { id: 'orders',    label: 'Commandes',  icon: ShoppingBag },
  { id: 'home',      label: 'Accueil',    icon: Home, isMain: true },
  { id: 'cart',      label: 'Panier',     icon: ShoppingCart },
  { id: 'profile',   label: 'Profil',     icon: User },
];

interface BottomNavProps {
  active: string;
  setActive: (id: string) => void;
}

export default function BottomNav({ active, setActive }: BottomNavProps) {
  const cartCount = 3;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center px-4 pb-6 pointer-events-none bg-gradient-to-t from-white/95 via-white/20 to-transparent">
      
      <nav className="pointer-events-auto flex items-center justify-around bg-white/95 backdrop-blur-2xl border rounded-[40px] px-2 py-2 w-full max-w-2xl relative"
           style={{ borderColor: theme.colors.gray[100], boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}>
        
        {navItems.map(({ id, label, icon: Icon, isMain }) => {
          const isActive = active === id;
          
          if (isMain) {
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className="relative -translate-y-7 flex flex-col items-center group pointer-events-auto transition-transform duration-300 active:scale-90"
              >
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border-4`}
                  style={{ 
                    backgroundColor: isActive ? theme.colors.primary : theme.colors.white,
                    borderColor: theme.colors.white,
                    boxShadow: isActive 
                      ? `0 15px 30px ${theme.colors.primary}40` 
                      : '0 10px 25px rgba(0,0,0,0.08)' 
                  }}
                >
                  <Icon 
                    size={28} 
                    strokeWidth={2.5} 
                    className="transition-colors duration-500"
                    style={{ color: isActive ? theme.colors.white : theme.colors.secondary }}
                  />
                </div>
                
                <span className="absolute -bottom-8 text-[11px] font-bold tracking-tight" 
                      style={{ color: theme.colors.secondary, fontFamily: 'DM Sans' }}>
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-3 px-1 rounded-3xl transition-all duration-300 active:scale-95"
            >
              <div className={`relative transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-colors duration-300"
                  style={{
                    color: isActive ? theme.colors.primary : theme.colors.gray[400],
                    fill: isActive && id === 'favorites' ? theme.colors.primary : 'none'
                  }}
                />
                
                {id === 'cart' && cartCount > 0 && (
                  <span 
                    className="absolute -top-1.5 -right-2 text-[9px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center border-2"
                    style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.white }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              <span 
                className="text-[10px] font-bold tracking-tight transition-colors duration-300"
                style={{ 
                    color: isActive ? theme.colors.primary : theme.colors.gray[400],
                    fontFamily: 'DM Sans'
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}