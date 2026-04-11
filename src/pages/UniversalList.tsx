import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Zap, UserRound, Truck, Star, 
  Filter, ArrowRight, Clock, ShieldCheck 
} from 'lucide-react';
import api from '../services/axiosConfig';
import { formatFCFA } from '../utils/formatters';
import { haptic } from '../utils/haptics';

const categoryConfig: Record<string, { title: string, subtitle: string, icon: any, color: string }> = {
  energy: { 
    title: 'LocaEnergy', 
    subtitle: 'Gaz, Carburant & Énergie 24/7', 
    icon: Zap, 
    color: 'text-orange-500' 
  },
  chauffeurs: { 
    title: 'Chauffeurs Privés', 
    subtitle: 'Elite VTC & Chauffeurs de jour', 
    icon: UserRound, 
    color: 'text-white' 
  },
  delivery: { 
    title: 'Coursiers Express', 
    subtitle: 'Livraison urbaine garantie', 
    icon: Truck, 
    color: 'text-orange-500' 
  }
};

export default function UniversalList() {
  const location = useLocation();
  const category = location.pathname.split('/')[1];
  const config = categoryConfig[category] || { 
    title: 'Services Elite', 
    subtitle: 'Excellence LocaConnecté', 
    icon: ShieldCheck, 
    color: 'text-orange-600' 
  };

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/listings?category=${category}`);
        setItems(data.listings || []);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
    window.scrollTo(0, 0);
  }, [category]);

  const Icon = config.icon;

  return (
    <div className="bg-[#000000] min-h-screen text-white pb-32">
      <Navbar />

      {/* Premium Hero Header */}
      <div className="relative h-[40vh] flex items-center px-6 lg:px-20 overflow-hidden border-b border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10"></div>
        <div className="relative z-20 max-w-4xl animate-in slide-in-from-left duration-700">
           <div className={`bg-white/5 border border-white/10 w-20 h-20 rounded-[25px] flex items-center justify-center mb-8 ${config.color} orange-glow`}>
              <Icon size={40} />
           </div>
           <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-none mb-4">
              {config.title.split(' ')[0]} <br/>
              <span className="text-orange-600">{config.title.split(' ').slice(1).join(' ') || 'EXPERIENCE'}</span>
           </h1>
           <p className="text-orange-600 font-bold uppercase tracking-[0.4em] text-[10px] italic">{config.subtitle}</p>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 lg:px-20 py-20">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 px-2">
            <div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">SÉLECTION <span className="text-orange-600">PREMIUM</span></h2>
              <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[8px] mt-2 italic">Prestataires vérifiés LocaConnecté</p>
            </div>
            <button className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-white hover:border-orange-600/50 transition-all shadow-xl">
               <Filter size={16} /> Filter & Sort
            </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/5 h-[400px] rounded-[50px] border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {items.map((item) => (
              <Link 
                key={item.id} 
                to={`/reservation?id=${item.id}`} 
                onClick={() => haptic.light()}
                className="group relative bg-[#0a0a0a] rounded-[50px] overflow-hidden border border-white/5 transition-all duration-700 hover:border-orange-600/30 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                   <img src={item.image_url} alt={item.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                   
                   <div className="absolute top-6 left-6 bg-orange-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">Vérifié</div>
                   
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 gap-6">
                      <p className="text-sm text-gray-300 font-medium leading-[1.6] italic line-clamp-3">{item.description}</p>
                      <div className="flex items-center justify-between border-t border-white/10 pt-6">
                         <div className="flex items-center gap-2">
                            <Star size={12} className="text-orange-600 fill-orange-600" />
                            <span className="text-[10px] font-black">{item.rating || '5.0'}</span>
                         </div>
                         <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Dispo. Immediate</p>
                      </div>
                      <button className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                         Commander <ArrowRight size={14} />
                      </button>
                   </div>
                </div>

                <div className="p-8 pb-10">
                   <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">{item.title}</h3>
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                         <p className="text-3xl font-black italic text-white tracking-tight">{formatFCFA(item.price)}</p>
                         <span className="text-[10px] text-gray-600 font-bold uppercase italic mt-1 bg-white/5 w-fit px-2 py-0.5 rounded-lg">Elite Service</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 shadow-xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                         <Star size={20} />
                      </div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="py-40 text-center bg-white/5 rounded-[60px] border border-white/5 border-dashed">
            <ShieldCheck size={48} className="mx-auto text-gray-700 mb-6" />
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2 italic">Service en déploiement...</h3>
            <p className="text-gray-500 font-medium italic">De nouveaux prestataires Elite rejoignent LocaConnecté chaque jour.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
