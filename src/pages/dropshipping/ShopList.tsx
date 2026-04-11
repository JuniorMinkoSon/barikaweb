import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatFCFA } from '../../utils/formatters';
import { ShoppingCart, Star, Info, Filter, ArrowRight, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { haptic } from '../../utils/haptics';

const mockProducts = [
   { id: 1, name: 'AirPods Pro 2', price: 25000, rating: 4.9, reviews: 128, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80', description: 'Réduction de bruit active, son spatial.' },
   { id: 2, name: 'Montre Connectée S8', price: 15000, rating: 4.7, reviews: 85, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80', description: 'Capteur oxygène, ECG, Écran Retina.' },
   { id: 3, name: 'Batterie Externe 20000mAh', price: 10000, rating: 4.8, reviews: 210, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80', description: 'Charge ultra-rapide 65W, 3 ports.' },
   { id: 4, name: 'iPhone 15 Pro Case', price: 5000, rating: 4.6, reviews: 45, image: 'https://images.unsplash.com/photo-1541814144362-790176b6dd93?w=500&q=80', description: 'Protection MagSafe en silicone liquide.' },
];

const filters = ['Tous', 'High-Tech', 'Accessoires', 'Populaire', 'Prix Bas'];

export default function ShopList() {
   const navigate = useNavigate();
   const [selectedProduct, setSelectedProduct] = useState<any>(null);
   const [activeFilter, setActiveFilter] = useState('Tous');

   const buyNow = () => {
      haptic.success();
      alert("Produit ajouté au panier !");
      navigate('/checkout');
   };
   return (
      <div className="bg-[#000000] min-h-screen text-white pb-32">
         <Navbar />

         <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
               <div>
                  <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">LA <span className="text-orange-600">BOUTIQUE.</span></h1>
                  <p className="text-orange-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic shadow-orange-600/20">SÉLECTION ÉLITE ABIDJAN</p>
               </div>
               {/* Filters Chips Scrollable */}
               <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {filters.map(f => (
                     <button
                        key={f}
                        onClick={() => { haptic.light(); setActiveFilter(f); }}
                        className={`px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${activeFilter === f ? 'bg-orange-600 border-orange-600 text-white shadow-[0_10px_30px_rgba(234,88,12,0.4)]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}
                     >
                        {f}
                     </button>
                  ))}
               </div>
            </div>
            {/* Intelligence Board: Suggestions do jour */}
            <div className="mb-16 animate-in slide-in-from-left duration-700">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-4">
                  <span className="w-12 h-[1px] bg-white/10" /> SUGGESTIONS DU JOUR
               </p>
               <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
                  {['iPhone 15 Pro', 'Elite Chauffeurs', 'Gaz B6', 'Blanchisserie Rapide'].map(s => (
                     <div key={s} className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3 hover:border-orange-600/40 transition-all cursor-pointer group">
                        <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{s}</span>
                     </div>
                  ))}
               </div>
            </div>

            {!selectedProduct ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-in fade-in duration-700">
                  {mockProducts.map(p => (
                     <div
                        key={p.id}
                        className="group relative bg-[#0a0a0a] rounded-[50px] overflow-hidden border border-white/5 transition-all duration-700 hover:border-orange-600/30 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
                     >
                        {/* Image Container */}
                        <div className="aspect-[4/5] overflow-hidden relative" onClick={() => setSelectedProduct(p)}>
                           <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />

                           {/* Badge */}
                           <div className="absolute top-6 left-6 bg-orange-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">Top Vente</div>

                           {/* Hover Overlay - Extreme Detail */}
                           <div className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 gap-6">
                              <div>
                                 <p className="text-orange-600 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Info size={12} /> Détails Premium
                                 </p>
                                 <p className="text-sm text-gray-300 font-medium leading-[1.6] italic">{p.description}</p>
                              </div>

                              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                 <div className="flex items-center gap-2">
                                    <div className="flex text-orange-600">
                                       {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={i <= 4 ? "currentColor" : "none"} />)}
                                    </div>
                                    <span className="text-[10px] font-black">{p.rating}</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En Stock • 24H</p>
                              </div>

                              <button className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 group/btn hover:bg-orange-600 hover:text-white transition-all shadow-2xl">
                                 Aperçu Rapide <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                           </div>

                           {/* Heart Icon always visible but fancy */}
                           <div className="absolute top-6 right-6 p-4 bg-black/40 backdrop-blur-3xl rounded-[20px] border border-white/10 text-white cursor-pointer hover:bg-white hover:text-black transition-all group-hover:scale-110 active:scale-95 shadow-xl">
                              <Heart size={20} className="group-hover:fill-current" />
                           </div>
                        </div>

                        {/* Visible Info */}
                        <div className="p-8 pb-10">
                           <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-3 group-hover:text-orange-600 transition-colors">{p.name}</h3>
                           <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                 <p className="text-3xl font-black italic text-white tracking-tight">{formatFCFA(p.price)}</p>
                                 <span className="text-[10px] text-gray-600 font-bold uppercase italic mt-1 bg-white/5 w-fit px-2 py-0.5 rounded-lg">Elite Choice</span>
                              </div>
                              <button className="bg-white/5 border border-white/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white transition-all shadow-xl">
                                 <ShoppingCart size={22} />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
                  <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-3 text-orange-600 font-black text-xs uppercase tracking-widest mb-10 group">
                     <div className="w-10 h-10 rounded-full border border-orange-600/20 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <Filter size={16} className="rotate-180" />
                     </div>
                     Retour au catalogue
                  </button>

                  <div className="flex flex-col lg:flex-row gap-16">
                     <div className="flex-1">
                        <div className="aspect-square rounded-[60px] overflow-hidden border border-white/10 relative orange-glow">
                           <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                        </div>
                     </div>

                     <div className="flex-1 flex flex-col justify-center">
                        <div className="bg-orange-600/10 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-full w-fit tracking-[0.2em] uppercase mb-6 border border-orange-600/20">
                           SÉLECTION ÉLITE
                        </div>
                        <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-2">{selectedProduct.name}</h2>
                        <div className="flex items-center gap-4 mb-8">
                           <div className="flex items-center gap-1 text-orange-600">
                              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill={i <= Math.floor(selectedProduct.rating) ? "currentColor" : "none"} />)}
                           </div>
                           <span className="text-sm font-bold text-gray-500">({selectedProduct.reviews} avis vérifiés)</span>
                        </div>

                        <p className="text-gray-400 text-lg mb-10 leading-relaxed italic">{selectedProduct.description}</p>

                        <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 mb-10">
                           <div className="flex justify-between items-end">
                              <div>
                                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Prix Livraison Incluse</p>
                                 <p className="text-5xl font-black italic text-orange-600">{formatFCFA(selectedProduct.price)}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-xs font-bold text-green-500 flex items-center gap-1 justify-end"><CheckCircle size={14} /> En stock 24H</p>
                              </div>
                           </div>
                        </div>

                        <button onClick={buyNow} className="w-full bg-white text-black hover:bg-orange-600 hover:text-white py-6 rounded-[30px] font-black text-2xl transition-all flex items-center justify-center gap-4 group active:scale-95 shadow-2xl shadow-white/5">
                           <ShoppingCart size={24} /> Commander maintenant <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

function CheckCircle({ size }: { size: number }) {
   return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
   );
}
