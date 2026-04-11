import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, Tool, Star, Filter, Clock } from 'lucide-react';
import api from '../../services/axiosConfig';

export default function RepairsList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const { data } = await api.get('/listings?category=repairs');
        setItems(data.listings || []);
      } catch (e) {
        console.error("Repairs fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRepairs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Category Header */}
      <div className="bg-indigo-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="bg-indigo-500/20 inline-flex items-center gap-2 px-4 py-2 rounded-full text-indigo-200 font-bold mb-4 uppercase text-xs tracking-widest border border-indigo-400/30">
              <ShieldCheck size={16} /> Service Garanti
            </div>
            <h1 className="text-5xl font-black mb-4 leading-tight italic">Pressing &<br/>Réparations Pro</h1>
            <p className="text-indigo-200 text-lg max-w-lg opacity-80">
              Experts vérifiés pour redonner vie à vos vêtements et équipements. Collecte et livraison incluses.
            </p>
          </div>
          <div className="flex-1 w-full max-w-sm">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl">
              <p className="font-black text-xl mb-4 text-center">Estimation Rapide</p>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white/5 rounded-2xl"><span>Pressing complet</span><span className="font-bold">2500F</span></div>
                <div className="flex justify-between p-3 bg-white/5 rounded-2xl"><span>Réparation Mobile</span><span className="font-bold">5000F</span></div>
                <div className="flex justify-between p-3 bg-white/5 rounded-2xl"><span>Cordonnerie Luxe</span><span className="font-bold">3000F</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase">Nos Experts</h2>
                <p className="text-gray-500 text-sm">Chaque prestataire est validé par LocaConnecté.</p>
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-sm text-gray-600 hover:shadow-md transition-all">
                <Filter size={16} /> Filtres
            </button>
        </div>

        {loading ? (
            <div className="space-y-4 animate-pulse">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl" />)}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
                <Link key={item.id} to={`/reservation?id=${item.id}`} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase">{item.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-700 font-bold text-[10px]">
                                <Star size={12} className="fill-yellow-500" /> {item.rating}
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                <span className="flex items-center gap-1"><Clock size={14} /> 24H - 48H</span>
                                <span className="flex items-center gap-1 text-indigo-600 font-black italic">Dès {item.price} F</span>
                            </div>
                            <span className="bg-gray-100 px-3 py-1.5 rounded-xl text-[10px] font-black group-hover:bg-indigo-900 group-hover:text-white transition-all uppercase">Commander</span>
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        )}

        {!loading && items.length === 0 && (
            <div className="py-20 text-center">
                <p className="text-gray-400 font-medium italic">Service technique bientôt disponible...</p>
            </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
