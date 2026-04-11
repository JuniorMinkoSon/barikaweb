import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShoppingBag, Star, Filter, Heart } from 'lucide-react';
import api from '../../services/axiosConfig';

export default function LingerieList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLingerie = async () => {
      try {
        const { data } = await api.get('/listings?category=lingerie');
        setItems(data.listings || []);
      } catch (e) {
        console.error("Lingerie fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLingerie();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Category Header */}
      <div className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <img src="/images/lingerie_chic.png" alt="Lingerie" className="absolute w-full h-full object-cover brightness-75 transition-transform duration-[20s] hover:scale-110" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-black text-white italic tracking-tighter">Lingerie & Élégance</h1>
          <p className="text-pink-100 font-bold mt-2 uppercase tracking-widest text-sm">Collection Prémium LocaConnecté</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 border-l-4 border-pink-500 pl-4 uppercase">Articles Disponibles</h2>
          <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 transition-all">
            <Filter size={16} /> Filtres
          </button>
        </div>

        {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-100 rounded-3xl" />)}
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {items.map((item) => (
                <Link key={item.id} to={`/reservation?id=${item.id}`} className="group cursor-pointer">
                    <div className="relative rounded-3xl overflow-hidden aspect-[3/4] mb-4 bg-gray-50">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-gray-900 hover:bg-white transition-all">
                            <Heart size={20} />
                        </button>
                        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                            <button className="w-full bg-pink-500 text-white py-2 rounded-xl font-black text-xs uppercase tracking-widest">Voir Détails</button>
                        </div>
                    </div>
                    <div className="px-1">
                        <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                        <div className="flex items-center justify-between mt-1">
                            <p className="font-black text-pink-600 italic">{(item.price).toLocaleString()} F</p>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                <Star size={10} className="text-yellow-500 fill-yellow-500" /> {item.rating || '5.0'}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        )}

        {!loading && items.length === 0 && (
            <div className="py-20 text-center">
                <p className="text-gray-400 font-medium italic">Bientôt de nouveaux articles dans cette catégorie...</p>
            </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
