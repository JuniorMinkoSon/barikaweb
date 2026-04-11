import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatFCFA } from '../../utils/formatters';
import { 
  ShieldCheck, MapPin, CreditCard, Lock, 
  CheckCircle, ArrowRight, Smartphone, AlertCircle,
  Navigation
} from 'lucide-react';
import { haptic } from '../../utils/haptics';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function CheckoutFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fetchingGPS, setFetchingGPS] = useState(false);

  // Auth protection for Checkout
  useEffect(() => {
    if (!user) {
      haptic.medium();
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  const handleGPS = () => {
    setFetchingGPS(true);
    haptic.light();
    if (!navigator.geolocation) {
       alert("Géolocalisation non supportée par votre navigateur.");
       setFetchingGPS(false);
       return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(`Coordonnées GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setFetchingGPS(false);
        haptic.success();
      },
      (err) => {
        console.error(err);
        alert("Impossible de récupérer la position.");
        setFetchingGPS(false);
      }
    );
  };

  const confirmStep = (next: number, confirmMsg?: string) => {
    if (confirmMsg) {
      if (window.confirm(confirmMsg)) {
         haptic.medium();
         setStep(next);
      }
    } else {
      haptic.light();
      setStep(next);
    }
  };

  const handleFinish = () => {
    haptic.success();
    navigate('/tracking');
  };

  if (!user) return null;

  return (
    <div className="bg-[#000000] min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-6 py-12 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-600/10 blur-[120px] rounded-full -z-10"></div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-16 px-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex items-center flex-1 last:flex-none">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all border-2 ${step >= i ? 'bg-orange-600 border-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-white/5 border-white/10 text-gray-600'}`}>
                 {step > i ? <CheckCircle size={18} /> : i}
               </div>
               {i < 3 && <div className={`h-0.5 flex-1 mx-4 rounded-full ${step > i ? 'bg-orange-600' : 'bg-white/5'}`} />}
             </div>
           ))}
        </div>

        {/* STEP 1: LOGISTICS */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 glass-premium">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-8 flex items-center gap-3">
                 <MapPin className="text-orange-600" /> Destination <span className="text-orange-600">Elite</span>
              </h2>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Lieu de livraison / Service</label>
                    <div className="relative mt-2">
                       <input 
                         className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 pl-5 pr-14 text-white font-bold outline-none focus:border-orange-600 transition-all placeholder:text-gray-600" 
                         placeholder="Votre adresse ou quartier..."
                         value={address}
                         onChange={(e) => setAddress(e.target.value)}
                       />
                       <button 
                         onClick={handleGPS}
                         className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${fetchingGPS ? 'bg-orange-600 animate-pulse' : 'bg-white/5 hover:bg-orange-600'}`}
                       >
                          <Navigation size={18} className={fetchingGPS ? 'animate-spin' : ''} />
                       </button>
                    </div>
                    <p className="text-[9px] text-gray-500 mt-3 italic">Utilisez le bouton GPS pour une précision maximale en zone urbaine.</p>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Notes Particulières</label>
                    <textarea 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 mt-2 text-white font-medium outline-none focus:border-orange-600 transition-all min-h-[100px]" 
                      placeholder="Codes portails, instructions étage..."
                    />
                 </div>
              </div>
            </div>

            <button 
              onClick={() => confirmStep(2)} 
              disabled={!address}
              className="w-full bg-white text-black hover:bg-orange-600 hover:text-white py-6 rounded-[30px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all disabled:opacity-20"
            >
              Procéder au Paiement <ArrowRight size={22} />
            </button>
          </div>
        )}

        {/* STEP 2: ESCROW PAYMENT */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 glass-premium">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                 <CreditCard className="text-orange-600" /> SÉCURISEZ VOS FONDS
              </h2>
              
              <div className="bg-orange-600 p-8 rounded-[35px] text-white orange-glow mb-8">
                 <div className="flex justify-between items-center mb-4 opacity-70">
                    <p className="text-[10px] font-black uppercase tracking-widest">Garantie LocaConnecté</p>
                    <Lock size={16} />
                 </div>
                 <p className="text-xs font-bold text-orange-100 mb-1">Montant sous séquestre</p>
                 <p className="text-4xl font-black italic">{formatFCFA(location.state?.price || 5000)}</p>
              </div>

              <div className="space-y-6">
                 <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-orange-600 pl-4 py-1">
                    Les fonds ne seront libérés au prestataire qu'après votre validation par code de sécurité.
                 </p>
                 
                 <div>
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">Numéro Mobile Money</label>
                    <div className="relative mt-2">
                       <Smartphone className="absolute left-5 top-5 text-gray-500" size={20} />
                       <input 
                         type="tel" 
                         className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 pl-14 text-white font-black text-xl outline-none focus:border-orange-600 transition-all" 
                         placeholder="07 00 00 00 00" 
                         value={phone} 
                         onChange={(e) => setPhone(e.target.value)}
                       />
                    </div>
                 </div>
              </div>
            </div>

            <button 
              onClick={() => confirmStep(3, "Confirmer l'envoi de la requête de paiement sur votre téléphone ?")} 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-[30px] font-black text-2xl shadow-xl shadow-orange-600/20 active:scale-95 transition-all"
            >
              Payer {formatFCFA(location.state?.price || 5000)}
            </button>
          </div>
        )}

        {/* STEP 3: OTP CONFIRMATION */}
        {step === 3 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[50px] border border-orange-600/30 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-600/10 blur-[50px] rounded-full"></div>
              
              <div className="w-20 h-20 bg-green-500 text-white rounded-[25px] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-12">
                 <ShieldCheck size={40} />
              </div>
              
              <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Paiement Sécurisé</h2>
              <p className="text-gray-400 mb-10 text-sm font-medium leading-relaxed italic">
                 Le prestataire a reçu la confirmation. <br/> Communiquez-lui ce code **uniquement** à la fin du service.
              </p>

              <div className="bg-black/40 border border-white/10 p-10 rounded-[40px] mb-10 relative group">
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Votre Code de Validation</p>
                 <div className="text-6xl font-black italic tracking-[0.4em] text-white">
                    8492
                 </div>
                 <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px]" />
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-5 rounded-3xl mb-10 text-left">
                 <AlertCircle className="text-orange-600 shrink-0" size={24} />
                 <p className="text-[10px] font-bold text-gray-500 uppercase leading-normal tracking-wide">
                    Ne partagez jamais ce code par téléphone. Il fait office de signature de fin de service.
                 </p>
              </div>

              <button 
                onClick={handleFinish} 
                className="w-full bg-white text-black hover:bg-orange-600 hover:text-white py-6 rounded-[30px] font-black text-2xl shadow-2xl transition-all"
              >
                Suivre ma commande
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
