
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Clock, Plus, Minus, Info } from 'lucide-react';
import { formatFCFA } from '../../utils/formatters';

const mockMenu = [
  { id: 101, name: 'Garba Royal', desc: 'Attiéké, poisson thon frit, piment grillé, oignons, tomates.', price: 2000, img: 'https://images.unsplash.com/photo-1544062088-755743b353dd?w=200&h=200&fit=crop' },
  { id: 102, name: 'Poulet Braisé Entier', desc: 'Poulet mariné aux épices locales, braisé au feu de bois. Accompagnement au choix.', price: 8000, img: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=200&h=200&fit=crop' },
  { id: 103, name: 'Alloco Portion', desc: 'Bananes plantains frites, dorées à souhait.', price: 1000, img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200&h=200&fit=crop' },
  { id: 104, name: 'Jus de Bissap (50cl)', desc: 'Jus de fleurs d\'hibiscus, rafraîchissant et mentholé.', price: 500, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&h=200&fit=crop' },
];

export default function MenuDetails() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Record<number, number>>({});

  const handleUpdateCart = (itemId: number, delta: number) => {
    setCart((prev: Record<number, number>) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      if (next === 0) {
        delete newCart[itemId];
      } else {
        newCart[itemId] = next;
      }
      return newCart;
    });
  };

  const cartTotalAmount = mockMenu.reduce((total, item) => {
    return total + (item.price * (cart[item.id] || 0));
  }, 0);
  
  const cartTotalItems = (Object.values(cart) as number[]).reduce((sum: number, qty: number) => sum + qty, 0);

  const handleCheckout = () => {
    // Redirection vers le flux Escrow / Checkout
    navigate('/checkout', { state: { amount: cartTotalAmount, title: 'Commande Repas' } });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-28">
      {/* Dynamic Header Image */}
      <div className="h-56 relative bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop" 
          className="w-full h-full object-cover opacity-70"
          alt="Cover"
        />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Restaurant Meta Overlay */}
      <div className="px-4 -mt-8 relative z-10 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Le Nid d'Abidjan</h1>
          <p className="text-sm text-gray-500 mb-4 mt-1">Cuisine Ivoirienne Authentique</p>
          
          <div className="flex bg-gray-50 rounded-xl p-3 justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center text-orange-500 font-bold mb-1">
                <Star size={16} className="fill-orange-500 mr-1" />
                4.8
              </div>
              <span className="text-[10px] text-gray-500">124 avis</span>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <div className="flex items-center text-blue-900 font-bold mb-1">
                <Clock size={16} className="mr-1" />
                30-45
              </div>
              <span className="text-[10px] text-gray-500">min. estimé</span>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex justify-center text-center items-center">
              <div className="text-[10px] text-gray-500 cursor-pointer flex flex-col items-center">
                <Info size={16} className="mb-1 text-gray-400" />
                Infos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">À la carte</h2>
        <div className="space-y-4">
          {mockMenu.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-2xl flex gap-3 shadow-sm border border-gray-50">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-blue-900">{formatFCFA(item.price)}</span>
                  
                  {/* Selectors */}
                  {cart[item.id] > 0 ? (
                    <div className="flex items-center bg-gray-100 rounded-full h-8 px-1">
                      <button 
                        onClick={() => handleUpdateCart(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 bg-white rounded-full shadow-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center font-bold text-sm">{cart[item.id]}</span>
                      <button 
                        onClick={() => handleUpdateCart(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-white bg-blue-900 rounded-full shadow-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleUpdateCart(item.id, 1)}
                      className="bg-blue-50 text-blue-900 font-bold px-4 h-8 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PANIER LIVE FLOTTANT - UX Rule #1,3 */}
      {cartTotalItems > 0 && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <button 
            onClick={handleCheckout}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all text-white p-4 rounded-2xl shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-3 py-1 rounded-full font-bold text-sm backdrop-blur-sm">
                {cartTotalItems}
              </div>
              <span className="font-bold tracking-tight">Voir le panier</span>
            </div>
            <span className="font-bold bg-white/20 px-3 py-1 rounded-xl backdrop-blur-sm">
              {formatFCFA(cartTotalAmount)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
