
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../../components/ImageGallery';
import { formatFCFA } from '../../utils/formatters';
import { MapPin, Star, Wifi, Wind, ShieldCheck, ChevronLeft } from 'lucide-react';

const mockResidences = {
  'r1': {
    name: 'Villa Royale Marcory',
    zone: 'Marcory Zone 4',
    description: 'Une villa spacieuse et sécurisée au coeur de la zone 4. Parfait pour les séjours professionnels ou en famille. Gardien 24/7 et concierge.',
    price: 45000,
    rating: 4.8,
    images: [
      { thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80', full: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80' },
      { thumb: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80', full: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80' }
    ]
  }
};

export default function ResidenceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const res = mockResidences[id as keyof typeof mockResidences] || mockResidences['r1'];

  const reserveEscrow = () => {
    // Navigate to shared ReservationEscrow flow with pre-filled state
    navigate('/reservation', { state: { serviceId: id, type: 'residence', expectedPrice: res.price, zone: res.zone } });
  };

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      {/* Back Button Overlay */}
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-50 bg-black/30 backdrop-blur-md text-white p-2 rounded-full">
        <ChevronLeft size={24} />
      </button>

      {/* Cloudinary Gallery */}
      <div className="w-full h-64 sm:h-80">
        <ImageGallery images={res.images} />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{res.name}</h1>
          <div className="bg-orange-50 px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-orange-600 shadow-sm">
            <Star size={14} className="fill-orange-600" /> {res.rating}
          </div>
        </div>
        
        <p className="flex items-center gap-1 text-sm text-gray-500 mb-6">
          <MapPin size={16} /> {res.zone}
        </p>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-gray-50 flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100">
            <Wifi size={20} className="text-blue-900 mb-1" />
            <span className="text-[10px] font-semibold text-gray-600">Free WiFi</span>
          </div>
          <div className="bg-gray-50 flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100">
            <Wind size={20} className="text-blue-900 mb-1" />
            <span className="text-[10px] font-semibold text-gray-600">Clim.</span>
          </div>
          <div className="bg-gray-50 flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100">
            <ShieldCheck size={20} className="text-blue-900 mb-1" />
            <span className="text-[10px] font-semibold text-gray-600">Sécurité</span>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-2 text-gray-900">Description</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {res.description}
        </p>

      </div>

      {/* Fixed Bottom CTA for Escrow Payment */}
      <div className="fixed bottom-[64px] left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs text-gray-500">Total / nuit</p>
            <p className="font-extrabold text-xl text-gray-900">{formatFCFA(res.price)}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded">Dispo. immédiate</span>
        </div>
        <button onClick={reserveEscrow} className="w-full bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-md">
          <ShieldCheck size={20} /> Réserver via Séquestre
        </button>
      </div>
    </div>
  );
}
