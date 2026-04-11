import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Target, Sparkles } from 'lucide-react';
import { haptic } from '../utils/haptics';

const PROMOS = [
  {
    id: 1,
    title: "LOCAENERGY 🔥",
    subtitle: "Gaz & Carburant 24/7",
    desc: "Livraison de bouteilles de gaz et carburant en moins de 20 minutes partout à Abidjan.",
    image: "/images/energy_delivery.png",
    color: "from-orange-600 to-red-600",
    icon: Zap
  },
  {
    id: 2,
    title: "ÉLITE CHAUFFEUR",
    subtitle: "Prestige et Sécurité",
    desc: "Voyagez dans le plus grand confort avec nos chauffeurs certifiés et véhicules premium.",
    image: "/images/affiche_chauffeur_journee.jpg",
    color: "from-blue-900 to-indigo-900",
    icon: Target
  },
  {
    id: 3,
    title: "BLANCHISSERIE PRO",
    subtitle: "Soin de votre linge",
    desc: "Nettoyage expert, repassage et livraison à domicile. La propreté sans effort.",
    image: "/images/affiche_services.jpg",
    color: "from-emerald-600 to-teal-600",
    icon: Sparkles
  }
];

export default function PromoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROMOS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => { haptic.light(); setIndex((prev) => (prev + 1) % PROMOS.length); };
  const prev = () => { haptic.light(); setIndex((prev) => (prev - 1 + PROMOS.length) % PROMOS.length); };

  const current = PROMOS[index];
  const Icon = current.icon;

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-[60px] border border-white/10 group mb-20 animate-in fade-in duration-1000">
      {/* Background with crossfade transition */}
      <div className="absolute inset-0 transition-all duration-1000 overflow-hidden">
        <img 
          key={current.id}
          src={current.image} 
          alt={current.title} 
          className="w-full h-full object-cover opacity-40 scale-105 group-hover:scale-100 transition-transform duration-[10s] grayscale-[20%]" 
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${current.color} opacity-40 mix-blend-multiply`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-12 lg:p-20">
        <div className="max-w-2xl animate-in slide-in-from-bottom-10 duration-700">
           <div className="flex items-center gap-3 mb-6 bg-white/10 w-fit px-5 py-2 rounded-full backdrop-blur-xl border border-white/10">
              <Icon size={20} className="text-orange-600" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white">{current.subtitle}</span>
           </div>
           <h2 className="text-6xl lg:text-8xl font-black italic text-white leading-none tracking-tighter mb-6 uppercase drop-shadow-2xl">
              {current.title}
           </h2>
           <p className="text-xl text-white/70 font-medium leading-relaxed max-w-lg mb-10 italic">
              "{current.desc}"
           </p>
           <button className="bg-white text-black font-black py-5 px-12 rounded-full hover:bg-orange-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 uppercase tracking-tighter text-lg shadow-2xl">
              Profiter maintenant
           </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
         <button onClick={prev} className="w-16 h-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <ChevronLeft size={32} />
         </button>
         <button onClick={next} className="w-16 h-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <ChevronRight size={32} />
         </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-12 right-12 flex gap-3">
         {PROMOS.map((_, i) => (
           <div 
             key={i} 
             onClick={() => setIndex(i)}
             className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${index === i ? 'w-12 bg-orange-600' : 'w-4 bg-white/20 hover:bg-white/40'}`}
           ></div>
         ))}
      </div>
    </div>
  );
}
