import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatFCFA } from '../utils/formatters';
import { ShieldCheck, Calendar, MapPin, FileText, CheckCircle, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { haptic } from '../utils/haptics';
import api from '../services/axiosConfig';
import Navbar from '../components/Navbar';

export default function ReservationFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, type, basePrice, title } = location.state || {};

  const [step, setStep] = useState(1);
  const [clothingCount, setClothingCount] = useState(1);
  const [diagnostic, setDiagnostic] = useState('');
  
  const isBlanchisserie = title?.toLowerCase().includes('blanchisserie');
  const isDepannage = title?.toLowerCase().includes('dépannage') || title?.toLowerCase().includes('répa');

  // Logic for pricing calculation
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setDays(diffDays);
      
      let base = diffDays * (basePrice || 0);
      if (isBlanchisserie) {
        base = clothingCount * (basePrice || 0); // Price per item for laundry usually
      }
      setTotalPrice(base);
    }
  }, [startDate, endDate, basePrice, clothingCount, isBlanchisserie]);

  const handleBooking = async () => {
    if (!contractAccepted) return alert("Veuillez accepter le contrat de médiation.");
    
    setLoading(true);
    try {
      const { data } = await api.post('/reservations', {
        listingId: serviceId,
        zone,
        checkIn: startDate,
        checkOut: endDate,
        expectedPrice: totalPrice,
        contractAccepted: true,
        metadata: {
          clothingCount: isBlanchisserie ? clothingCount : undefined,
          diagnostic: isDepannage ? diagnostic : undefined
        }
      });
      haptic.success();
      navigate('/commandes', { state: { reservationId: data.reservation.id, justCreated: true } });
    } catch (error) {
      console.error("Booking error:", error);
      alert("Erreur lors de la réservation. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId) {
    return <div className="p-20 text-center text-gray-500 font-bold bg-[#000000] min-h-screen">Aucun service sélectionné. <br/><Link to="/" className="text-orange-600 underline">Retourner à l'accueil</Link></div>;
  }

  return (
    <div className="bg-[#000000] min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-20 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full -z-10"></div>
        
        {/* Progress Bar Final */}
        <div className="flex items-center justify-between mb-16 px-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all border-2 ${step >= i ? 'bg-orange-600 border-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-white/5 text-gray-600 border-white/10'}`}>
                {step > i ? <CheckCircle size={22} /> : i}
              </div>
              {i < 3 && <div className={`h-1 flex-1 mx-4 rounded-full ${step > i ? 'bg-orange-600' : 'bg-white/5'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Configuration & Dates */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 glass-premium">
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 italic tracking-tighter uppercase">
                <Calendar className="text-orange-600" size={32} /> Ma Commande <span className="text-orange-600">Sur-mesure</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Début du service</label>
                  <input 
                    type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border-2 border-white/5 rounded-2xl p-5 font-bold text-white bg-white/5 focus:border-orange-600 outline-none"
                  />
                </div>
                {!isBlanchisserie && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Fin du service</label>
                    <input 
                      type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border-2 border-white/5 rounded-2xl p-5 font-bold text-white bg-white/5 focus:border-orange-600 outline-none"
                    />
                  </div>
                )}
              </div>

              {isBlanchisserie && (
                 <div className="bg-white/5 p-8 rounded-[35px] border border-orange-600/20 mb-8">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-4">NOMBRE D'HABITS / ARTICLES</label>
                    <div className="flex items-center gap-6">
                       <button onClick={() => setClothingCount(Math.max(1, clothingCount - 1))} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black">-</button>
                       <span className="text-4xl font-black text-orange-600">{clothingCount}</span>
                       <button onClick={() => setClothingCount(clothingCount + 1)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-black">+</button>
                       <p className="text-xs text-gray-400 font-bold uppercase italic ml-auto">Articles à traiter</p>
                    </div>
                 </div>
              )}

              {isDepannage && (
                 <div className="space-y-2 mb-8">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">DIAGNOSTIC PRÉALABLE (DESCRIPTION)</label>
                    <textarea 
                      value={diagnostic} onChange={(e) => setDiagnostic(e.target.value)}
                      className="w-full border-2 border-white/5 rounded-3xl p-5 font-bold text-white bg-white/5 focus:border-orange-600 outline-none min-h-[120px]"
                      placeholder="Décrivez précisément votre problème (ex: L'écran est cassé, la batterie chauffe...)"
                    />
                 </div>
              )}

              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Zone de prestation</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-5 text-orange-600" size={20} />
                  <input 
                    type="text" value={zone} onChange={(e) => setZone(e.target.value)}
                    className="w-full border-2 border-white/5 rounded-2xl p-5 pl-14 font-bold text-white bg-white/5 focus:border-orange-600 outline-none"
                    placeholder="Votre quartier ou ville..."
                  />
                </div>
              </div>

              <div className="bg-orange-600 p-8 rounded-[35px] text-white orange-glow">
                <div className="flex justify-between items-center mb-4 opacity-70">
                   <p className="text-xs uppercase font-black tracking-widest">{title}</p>
                   <p className="text-xs font-bold text-orange-200">{isBlanchisserie ? `${clothingCount} articles` : `${days} jour(s)`}</p>
                </div>
                <div className="flex justify-between items-end">
                   <p className="text-lg font-bold opacity-80">Offre Initiale</p>
                   <p className="text-4xl font-black italic">{formatFCFA(totalPrice)}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => { haptic.medium(); setStep(2); }}
              className="w-full bg-white text-black hover:bg-orange-600 hover:text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-white/5 transition-all flex items-center justify-center gap-3 group"
            >
              Consulter le Contrat <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}

        {/* Step 2: Contract Acceptance */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 glass-premium">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 italic tracking-tighter uppercase">
                <FileText className="text-orange-600" size={32} /> Contrat de Médiation
              </h2>
              <div className="bg-black/40 rounded-3xl p-6 h-72 overflow-y-auto text-sm text-gray-400 space-y-5 mb-8 leading-relaxed border border-white/5 scrollbar-hide">
                <p className="font-black text-orange-600 uppercase tracking-widest text-[10px]">1. Objet de la protection</p>
                <p>LocaConnecté version V2 agit en tant que séquestre numérique. L'argent est sécurisé et n'est libéré qu'au prestataire après exécution conforme prouvée par OTP.</p>
                
                <p className="font-black text-orange-600 uppercase tracking-widest text-[10px]">2. La Négociation</p>
                <p>En initiant ce contrat, vous acceptez d'entrer en phase de négociation. Le prestataire peut accepter votre prix ou faire une contre-proposition.</p>
                
                <p className="font-black text-orange-600 uppercase tracking-widest text-[10px]">3. Médiation Obligatoire</p>
                <p>Toute contestation doit passer par l'arbitrage LocaConnecté avant toute action tierce.</p>
                
                <p>En cochant la case, vous signez électroniquement l'engagement de respect des conditions générales de la plateforme.</p>
              </div>

              <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={contractAccepted}
                    onChange={(e) => { haptic.light(); setContractAccepted(e.target.checked); }}
                    className="w-6 h-6 rounded-lg border-white/20 bg-transparent text-orange-600 focus:ring-orange-600 checked:bg-orange-600"
                  />
                </div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors leading-relaxed">
                  J'accepte les termes du contrat V2 et autorise le blocage des fonds sous séquestre après validation de la négociation.
                </span>
              </label>
            </div>

            <div className="flex gap-4">
               <button onClick={() => setStep(1)} className="flex-1 bg-white/5 border border-white/10 text-gray-400 py-6 rounded-3xl font-bold hover:text-white hover:bg-white/10 transition-all">Retour</button>
               <button 
                disabled={!contractAccepted}
                onClick={() => { haptic.medium(); setStep(3); }}
                className="flex-[2] bg-orange-600 hover:bg-orange-700 disabled:opacity-20 text-white py-6 rounded-3xl font-black text-xl shadow-xl shadow-orange-600/20 transition-all"
              >
                Vérifier & Envoyer
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Final Pre-Negotiation Handshake */}
        {step === 3 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[50px] border border-orange-600/20 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600/10 blur-[50px] rounded-full"></div>
              
              <div className="w-24 h-24 bg-orange-600 text-white rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(234,88,12,0.4)] rotate-12">
                 <ShieldCheck size={48} />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">Félicitations !</h2>
              <p className="text-gray-400 mb-10 leading-relaxed font-medium">Votre demande pour <span className="text-white font-black">{title}</span> va être transmise au prestataire. Le cycle de négociation commence maintenant.</p>
              
              <div className="space-y-4 mb-10 border-y border-white/5 py-8">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Statut Initial</span>
                    <span className="font-black text-orange-600 uppercase italic">En Attente V2</span>
                 </div>
                 <div className="flex justify-between text-base">
                    <span className="text-gray-400">Total à proposer</span>
                    <span className="font-black text-white text-2xl">{formatFCFA(totalPrice)}</span>
                 </div>
              </div>

              <button 
                disabled={loading}
                onClick={handleBooking}
                className="w-full bg-orange-600 hover:bg-white hover:text-black text-white py-6 rounded-[30px] font-black text-2xl shadow-2xl shadow-orange-600/30 flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {loading ? 'Transmissions...' : 'Envoyer ma demande'}
                {!loading && <CheckCircle size={28} />}
              </button>
              
              <p className="text-[10px] text-gray-600 mt-6 font-bold uppercase tracking-widest">Le prestataire a 24h pour répondre ou contre-proposer.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
