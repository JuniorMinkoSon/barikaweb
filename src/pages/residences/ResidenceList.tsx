import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { formatFCFA } from '../../utils/formatters';
import { MapPin, Star } from 'lucide-react';

const mockResidences = [
  {
    id: 'r1',
    name: 'Villa Royale Marcory',
    zone: 'Marcory Zone 4',
    price: 45000,
    rating: 4.8,
    thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80'
  },
  {
    id: 'r2',
    name: 'Appartement Vue Mer',
    zone: 'Cocody',
    price: 60000,
    rating: 4.9,
    thumb: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80'
  }
];

export default function ResidenceList() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <Navbar />
      
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">Nos Hébergements</h1>
        <p className="text-sm text-gray-500 mb-6">Paiement sécurisé par Séquestre.</p>
        
        {/* Filtres Rapides */}
        <div className="flex gap-2 overflow-x-auto pb-4 snap-x hide-scrollbar">
          <button className="bg-blue-900 text-white px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap snap-start">Tous</button>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap snap-start">Marcory</button>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap snap-start">Cocody</button>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap snap-start">- de 50 000 FCFA</button>
        </div>

        {/* Grille responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockResidences.map(res => (
            <Link key={res.id} to={`/residences/${res.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={res.thumb} alt={res.name} className="w-full h-48 object-cover" loading="lazy" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-gray-800 shadow-sm">
                  <Star size={12} className="text-orange-500 fill-orange-500" /> {res.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-lg text-gray-900 line-clamp-1">{res.name}</h2>
                  <p className="font-extrabold text-orange-500 text-sm whitespace-nowrap ml-2">{formatFCFA(res.price)}<span className="text-xs text-gray-400 font-normal">/nuit</span></p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 lowercase">
                  <MapPin size={14} /> {res.zone}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
