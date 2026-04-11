import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../../components/ImageGallery';
import { formatFCFA } from '../../utils/formatters';
import { User, ShieldCheck, ChevronLeft, MapPin } from 'lucide-react';

const mockCars = {
  'c1': {
    name: 'Range Rover Evoque',
    type: 'SUV LUXE',
    description: 'Profitez dun confort absolu avec notre chauffeur professionnel. Climatisation, bouteilles deau, chargeurs inclus.',
    price: 80000,
    rating: 4.9,
    images: [
      { thumb: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80', full: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80' },
      { thumb: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80', full: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80' }
    ]
  }
};

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = mockCars[id as keyof typeof mockCars] || mockCars['c1'];

  const reserveEscrow = () => {
    // Navigate to ReservationEscrow flow with transport state
    navigate('/reservation', { state: { serviceId: id, type: 'transport', expectedPrice: car.price, zone: 'Inconnue' } });
  };

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-50 bg-black/30 text-white p-2 rounded-full">
        <ChevronLeft size={24} />
      </button>

      <div className="w-full h-64 sm:h-80">
        <ImageGallery images={car.images} />
      </div>

      <div className="p-4">
        <div className="inline-block bg-stone-800 text-white px-2 py-1 rounded text-[10px] font-bold mb-2 tracking-widest">{car.type}</div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{car.name}</h1>
        
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 border-2 border-white shadow-sm">
              <User size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Ahmed S.</p>
              <p className="text-xs text-gray-500">Chauffeur assigné</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-orange-500">4.9 ★</p>
            <p className="text-[10px] text-gray-500">142 courses</p>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-2 text-gray-900">À propos de la course</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {car.description}
        </p>

        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg text-sm">
          <MapPin size={20} />
          <span>Suivi GPS en temps réel inclus</span>
        </div>
      </div>

      <div className="fixed bottom-[64px] left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs text-gray-500">Total / jour</p>
            <p className="font-extrabold text-xl text-gray-900">{formatFCFA(car.price)}</p>
          </div>
        </div>
        <button onClick={reserveEscrow} className="w-full bg-stone-800 hover:bg-stone-900 text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors">
          <ShieldCheck size={20} /> Réserver ce véhicule
        </button>
      </div>
    </div>
  );
}
