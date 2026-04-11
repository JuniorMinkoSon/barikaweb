import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, MapPin, Edit3, Car, Home, ArrowRight, X, ShoppingBag } from 'lucide-react';
import { formatFCFA } from '../utils/formatters';
import { haptic } from '../utils/haptics';
import Navbar from '../components/Navbar';

const initialCart = [
  {
    id: 1,
    name: 'Toyota Corolla 2022',
    category: 'Voiture',
    price: 35000,
    details: 'Location du 12 au 14 Avril (2 jours)',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Cocody, Abidjan',
    description: 'Berline confortable, climatisée, idéale pour vos déplacements en ville.',
    dateDebut: '2024-04-12',
    dateFin: '2024-04-14',
    options: { gps: true, chauffeur: false, siegeBebe: false },
    notes: '',
  },
  {
    id: 2,
    name: 'Villa avec piscine',
    category: 'Résidence',
    price: 120000,
    details: 'Séjour du 15 au 18 Avril (3 nuits)',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Bingerville',
    description: 'Villa luxueuse avec piscine privée, jardin et vue panoramique.',
    dateDebut: '2024-04-15',
    dateFin: '2024-04-18',
    personnes: 2,
    options: { petitDejeuner: false, menage: true, piscine: true },
    notes: '',
  }
];

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialCart);
  
  const total = items.reduce((acc: number, item: any) => acc + item.price, 0);
  const serviceFee = 2500;

  const handleCheckout = () => {
    haptic.success();
    navigate('/checkout', { state: { price: total + serviceFee } });
  };

  const removeItem = (id: number) => {
    haptic.medium();
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="bg-[#000000] min-h-screen text-white pb-60">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-600/10 blur-[100px] rounded-full -z-10"></div>
        
        <div className="flex items-center gap-4 mb-12">
           <div className="w-16 h-16 bg-orange-600 rounded-[20px] flex items-center justify-center shadow-lg rotate-3">
              <ShoppingBag size={32} />
           </div>
           <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">MON <span className="text-orange-600">PANIER</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">{items.length} article(s) sélectionné(s)</p>
           </div>
        </div>

        {/* Cart Items List */}
        <div className="space-y-6">
          {items.length > 0 ? items.map((item: any) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col md:flex-row gap-8 hover:border-orange-600/30 transition-all transition-duration-500 group">
              <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                <img src={item.image} className="w-full h-full rounded-[25px] object-cover grayscale-[30%] group-hover:grayscale-0 transition-all" alt={item.name} />
                <div className="absolute -top-3 -left-3 bg-orange-600 text-white p-2 rounded-xl shadow-xl">
                  {item.category === 'Voiture' ? <Car size={14} /> : <Home size={14} />}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <MapPin size={14} className="text-orange-600" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{item.location}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="w-10 h-10 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl flex items-center justify-center transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-auto">
                   <div className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                      {item.details}
                   </div>
                   <p className="text-3xl font-black italic tracking-tight text-white">
                      {formatFCFA(item.price)}
                   </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center bg-white/5 border border-dashed border-white/10 rounded-[60px]">
               <ShoppingBag size={64} className="mx-auto mb-6 opacity-10" />
               <p className="text-2xl font-black italic text-gray-600">Votre sélection est vide.</p>
               <button onClick={() => navigate('/shop')} className="mt-8 bg-orange-600 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">Retourner Boutique</button>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="mt-16 bg-white/5 border border-orange-600/30 p-10 rounded-[50px] relative overflow-hidden">
             <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-600/5 blur-[100px] rounded-full"></div>
             
             <div className="space-y-4 mb-10 pb-10 border-b border-white/10">
                <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                   <span className="uppercase tracking-[0.2em]">Sous-total</span>
                   <span>{formatFCFA(total)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                   <span className="uppercase tracking-[0.2em]">Service & Séquestre</span>
                   <span>{formatFCFA(serviceFee)}</span>
                </div>
             </div>

             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                   <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.4em] mb-2 italic">Total de la Commande</p>
                   <p className="text-6xl font-black italic tracking-tighter text-white">
                      {formatFCFA(total + serviceFee)}
                   </p>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="bg-white text-black hover:bg-orange-600 hover:text-white px-12 py-6 rounded-[30px] font-black text-2xl flex items-center justify-center gap-4 group shadow-2xl transition-all active:scale-95"
                >
                   Confirmer <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
/div>
      )}
    </div>
  );
}