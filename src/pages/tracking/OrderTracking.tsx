import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, MapPin, Clock, CheckCircle, XCircle, Loader2, Plus, ChevronRight } from 'lucide-react';
import api from '../../services/axiosConfig';
import { haptic } from '../../utils/haptics';
import Footer from '../../components/Footer';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  WAITING_PAYMENT: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  PAID:            { label: 'Payé', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle },
  STARTED:         { label: 'En cours', color: 'text-orange-600', bg: 'bg-orange-50', icon: Loader2 },
  COMPLETED:       { label: 'Terminé', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  CANCELLED:       { label: 'Annulé', color: 'text-red-500', bg: 'bg-red-50', icon: XCircle },
};

const QUICK_SERVICES = [
  { name: 'Réserver une résidence', path: '/residences', icon: '🏠' },
  { name: 'Commander un chauffeur', path: '/chauffeurs', icon: '🚗' },
  { name: 'Livraison Gaz Express', path: '/energy', icon: '⚡' },
  { name: 'Commander un repas', path: '/restaurants', icon: '🍽️' },
  { name: 'Ménage à domicile', path: '/cleaners', icon: '🧹' },
];

export default function OrderTracking() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [handshakeId, setHandshakeId] = useState<number | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [reviewMode, setReviewMode] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/reservations/my');
        setReservations(data.reservations || []);
      } catch {
        setError('Impossible de charger vos commandes. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleHandshake = async () => {
    if (!handshakeId) return;
    try {
      await api.post(`/reservations/${handshakeId}/handshake`, { otpCode });
      haptic.success();
      setReviewMode(true);
    } catch (err: any) {
      alert(err.response?.data?.error || "Code OTP incorrect");
    }
  };

  const submitReview = async () => {
    try {
      await api.post('/reviews', { 
        reservationId: handshakeId, 
        rating, 
        comment 
      });
      haptic.success();
      setReviewMode(false);
      setHandshakeId(null);
      setOtpCode('');
      // Reload orders
      const { data } = await api.get('/reservations/my');
      setReservations(data.reservations);
    } catch (err) {
      console.error("Review error:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black text-gray-900">Mes Commandes</h1>
          <p className="text-sm text-gray-500 mt-1">Suivez toutes vos réservations et livraisons</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Quick Add New Service */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-gray-800 text-lg">Ajouter un service</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {QUICK_SERVICES.map((s) => (
              <Link
                key={s.path} to={s.path}
                onClick={() => haptic.light()}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2 hover:border-blue-900 hover:bg-blue-50 transition-all group shadow-sm"
              >
                <span className="text-xl">{s.icon}</span>
                <span className="text-xs font-bold text-gray-700 group-hover:text-blue-900 whitespace-nowrap">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Reservations List */}
        <div>
          <h2 className="font-black text-gray-800 text-lg mb-3">
            Historique ({loading ? '...' : reservations.length})
          </h2>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">Chargement de vos commandes...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
              <p className="text-red-600 font-semibold text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && reservations.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="font-black text-gray-900 text-xl mb-2">Aucune commande</h3>
              <p className="text-gray-500 text-sm mb-6">Commandez un service ci-dessus pour démarrer.</p>
              <Link to="/" className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-800 transition-all">
                <Plus size={18} /> Explorer les services
              </Link>
            </div>
          )}

          {!loading && reservations.map((r) => {
            const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG['WAITING_PAYMENT'];
            const StatusIcon = cfg.icon;
            const price = r.negotiated_price || r.base_price;
            const providerPhone = r.provider_phone;
            const canCall = ['STARTED', 'PAID'].includes(r.status);

            return (
              <div key={r.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm mb-4 relative overflow-hidden">
                {/* Status strip */}
                <div className={`absolute top-0 left-0 w-1 h-full ${cfg.bg.replace('bg-', 'bg-')} border-r-4 ${cfg.color.replace('text-', 'border-')} rounded-l-3xl`}></div>
                
                <div className="flex items-start gap-3 mb-4 pl-3">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Commande #LC-{(1000 + r.id)}</p>
                    <h3 className="font-black text-gray-900 text-base mt-0.5">{r.listing_title || 'Service LocaConnecté'}</h3>
                    {r.provider_name && (
                      <p className="text-sm text-gray-500 mt-1">Prestataire : <strong>{r.provider_name}</strong></p>
                    )}
                  </div>
                  <span className={`flex items-center gap-1.5 ${cfg.color} ${cfg.bg} px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0`}>
                    <StatusIcon size={12} className={r.status === 'STARTED' ? 'animate-spin' : ''} />
                    {cfg.label}
                  </span>
                </div>

                {/* Price & Zone */}
                <div className="flex items-center gap-4 pl-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black text-orange-500">{price?.toLocaleString()} FCFA</span>
                  </div>
                  {r.zone && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin size={12} /> {r.zone}
                    </div>
                  )}
                </div>

                {/* Premium Vertical Progress Bar */}
                <div className="mx-3 mb-8 mt-4">
                  <div className="flex items-center justify-between relative px-2">
                    {/* Background Progress Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0 rounded-full"></div>
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-orange-600 -translate-y-1/2 z-10 transition-all duration-1000 rounded-full"
                      style={{ 
                        width: r.status === 'WAITING_PAYMENT' ? '15%' : 
                               r.status === 'PAID' ? '45%' : 
                               r.status === 'STARTED' ? '75%' : 
                               r.status === 'COMPLETED' ? '100%' : '0%' 
                      }}
                    ></div>

                    {[
                      { s: 'WAITING_PAYMENT', label: 'Reçu', icon: FileText },
                      { s: 'PAID', label: 'Payé', icon: DollarSign },
                      { s: 'STARTED', label: 'Service', icon: Truck },
                      { s: 'COMPLETED', label: 'Terminé', icon: CheckCircle },
                    ].map((step, idx) => {
                      const Icon = step.icon;
                      const isPast = r.status === step.s || (r.status === 'PAID' && idx < 1) || (r.status === 'STARTED' && idx < 2) || (r.status === 'COMPLETED');
                      const isCurrent = r.status === step.s;

                      return (
                        <div key={step.s} className="relative z-20 flex flex-col items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shadow-2xl ${
                            isCurrent ? 'bg-orange-600 border-orange-600 text-white scale-125 rotate-3 shadow-orange-600/40' : 
                            isPast ? 'bg-white text-orange-600 border-white' : 'bg-[#111111] border-white/5 text-gray-700'
                          }`}>
                            <Icon size={18} className={isCurrent && step.s === 'STARTED' ? 'animate-pulse' : ''} />
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest ${isPast ? 'text-white' : 'text-gray-700'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="pl-3 flex flex-wrap gap-3">
                  {canCall && providerPhone && (
                    <a 
                      href={`tel:${providerPhone}`}
                      onClick={() => haptic.medium()}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-green-600 transition-all shadow-md"
                    >
                      <PhoneCall size={14} /> Appeler
                    </a>
                  )}
                  {r.status === 'STARTED' && (
                    <button 
                      onClick={() => { haptic.medium(); setHandshakeId(r.id); }}
                      className="bg-blue-900 text-white px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2"
                    >
                      <CheckCircle size={14} /> Confirmer la prestation
                    </button>
                  )}
                  {r.status === 'COMPLETED' && (
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2.5 rounded-full text-xs font-bold hover:bg-gray-200 transition-all border border-gray-200"
                    >
                      <Download size={14} /> Reçu Fiscal
                    </button>
                  )}
                  {!canCall && providerPhone && r.status !== 'COMPLETED' && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs px-3 py-2 border border-gray-200 rounded-full">
                      Numéro masqué jusqu'à validation
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Handshake Modal (OTP + Review) */}
        {handshakeId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 animate-in slide-in-from-bottom-10 duration-500">
              {!reviewMode ? (
                <>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Code de validation</h2>
                  <p className="text-gray-500 text-sm mb-6">Saisissez le code fourni par le prestataire pour libérer les fonds.</p>
                  
                  <input 
                    type="tel" maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center text-4xl font-black tracking-[1em] py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl mb-6 focus:border-blue-900 outline-none"
                    placeholder="0000"
                  />

                  <button 
                    onClick={handleHandshake}
                    className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl"
                  >
                    Valider le service
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Service Terminé !</h2>
                  <p className="text-gray-500 text-sm mb-6">Comment s'est passée votre expérience ?</p>
                  
                  <div className="flex justify-center gap-3 mb-8">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} onClick={() => { haptic.light(); setRating(star); }}
                        className={`transition-all ${rating >= star ? 'text-yellow-400 scale-125' : 'text-gray-200'}`}
                      >
                        <Star className="fill-current" size={32} />
                      </button>
                    ))}
                  </div>

                  <textarea 
                    value={comment} onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl p-4 text-sm mb-6 focus:border-blue-900 outline-none"
                    placeholder="Un petit mot sur la prestation..."
                    rows={3}
                  />

                  <button 
                    onClick={submitReview}
                    className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl"
                  >
                    Envoyer mon avis
                  </button>
                </div>
              )}
              <button 
                onClick={() => { setHandshakeId(null); setReviewMode(false); }}
                className="w-full mt-4 text-gray-400 font-bold text-sm"
              >
                Plus tard
              </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
