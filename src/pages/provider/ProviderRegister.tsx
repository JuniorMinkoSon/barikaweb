import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, Car, Utensils, Shirt, Sparkles, Waves, Zap, Truck, ShieldCheck, 
  UserRound, ChevronRight, ArrowLeft, Upload, Check, Star, Award, TrendingUp, X
} from 'lucide-react';
import api from '../../services/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { haptic } from '../../utils/haptics';
import Navbar from '../../components/Navbar';

const BUSINESS_TYPES = [
  { id: 'residences', label: 'Résidences & Hôtels', icon: Home },
  { id: 'chauffeurs', label: 'Chauffeurs Privés', icon: UserRound },
  { id: 'cars', label: 'Location de Voitures', icon: Car },
  { id: 'restaurants', label: 'Restaurants & Cafés', icon: Utensils },
  { id: 'clothes', label: 'Blanchisserie Pro', icon: Shirt },
  { id: 'lingerie', label: 'Lingerie Fine', icon: Sparkles },
  { id: 'cleaners', label: 'Service de Ménage', icon: Waves },
  { id: 'energy', label: 'LocaEnergy (Gaz)', icon: Zap },
  { id: 'repairs', label: 'Dépannage & Réparations', icon: ShieldCheck },
  { id: 'delivery', label: 'Livraison Express', icon: Truck },
];

type Step = 'role' | 'business_type' | 'details' | 'phone' | 'otp' | 'success';

export default function ProviderRegister() {
  const [step, setStep] = useState<Step>('role');
  const [selectedType, setSelectedType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSelectType = (id: string) => {
    haptic.light();
    setSelectedType(id);
  };

  const handleRequestOTP = async () => {
    if (phone.length < 8) return setError('Numéro invalide');
    setLoading(true); setError('');
    try {
      await api.post('/auth/otp/request', { phone: `+225${phone}` });
      haptic.medium();
      setStep('otp');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Erreur réseau');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    setLoading(true); setError('');
    try {
      const fullPhone = `+225${phone}`;
      const { data } = await api.post('/auth/otp/verify', { 
        phone: fullPhone, 
        otp, 
        role: 'provider',
        companyName,
        businessType: selectedType
      });
      login(data.token, data.user);
      haptic.success();
      setStep('success');
      setTimeout(() => navigate('/provider/dashboard'), 2000);
    } catch (e: any) {
      haptic.error();
      setError(e.response?.data?.error || 'Code invalide');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-orange-600/30">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24 relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Hero Section / Punchlines */}
          <div className="flex-1 space-y-10 order-2 lg:order-1">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-600/20 px-4 py-2 rounded-full mb-4">
                   <Star size={14} className="text-orange-600 fill-orange-600" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 italic">Élite Partner Network</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">
                  Rejoignez <br/> <span className="text-orange-600">L'Élite</span> Pro
                </h1>
                <p className="text-gray-500 font-medium text-lg max-w-md leading-relaxed">
                  Passez à la vitesse supérieure. Digitalisez votre business avec LocaConnecté et accédez à une clientèle premium.
                </p>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-[30px] border border-white/5 hover:border-orange-600/20 transition-all group">
                   <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <TrendingUp size={24} className="text-white" />
                   </div>
                   <div>
                      <h4 className="font-black italic uppercase tracking-tighter text-lg leading-tight">Zéro Frais Fixes</h4>
                      <p className="text-xs text-gray-500 mt-1">Vous ne payez que lorsque vous vendez. Inscription 100% gratuite.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white/5 rounded-[30px] border border-white/5 hover:border-orange-600/20 transition-all group">
                   <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ShieldCheck size={24} className="text-white" />
                   </div>
                   <div>
                      <h4 className="font-black italic uppercase tracking-tighter text-lg leading-tight">Séquestre Sécurisé</h4>
                      <p className="text-xs text-gray-500 mt-1">Paiements garantis par notre système Escrow. Plus d'impayés.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Registration Card */}
          <div className="w-full max-w-[450px] order-1 lg:order-2">
             <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[50px] border border-white/10 shadow-2xl relative">
                
                {/* Internal Navigation Header */}
                <div className="flex items-center justify-between mb-10">
                   {step !== 'role' && step !== 'success' ? (
                     <button onClick={() => setStep('role')} className="text-orange-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                        <ArrowLeft size={16} /> Retour
                     </button>
                   ) : (
                     <Link to="/" className="text-gray-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <ArrowLeft size={16} /> Boutique
                     </Link>
                   )}
                   <div className="flex gap-1">
                      {['role', 'business_type', 'details', 'phone'].map((s, i) => (
                        <div key={s} className={`w-6 h-1 rounded-full ${(['role', 'business_type', 'details', 'phone', 'otp', 'success'] as Step[]).indexOf(step) >= i ? 'bg-orange-600' : 'bg-white/10'}`} />
                      ))}
                   </div>
                </div>

                {/* Steps Content */}
                <div className="space-y-8 animate-in fade-in duration-700">
                  
                  {step === 'role' && (
                    <div className="space-y-8">
                       <div>
                          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Devenir <span className="text-orange-600">Pro</span></h2>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Commencez l'aventure Élite en quelques secondes.</p>
                       </div>
                       <button 
                         onClick={() => { haptic.medium(); setStep('business_type'); }}
                         className="w-full bg-orange-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-xl shadow-orange-600/20"
                       >
                         Lancer mon business <ChevronRight size={18} />
                       </button>
                    </div>
                  )}

                  {step === 'business_type' && (
                    <div className="space-y-6">
                       <h2 className="text-2xl font-black italic tracking-tighter uppercase">Secteur d'activité</h2>
                       <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                          {BUSINESS_TYPES.map(({ id, label, icon: Icon }) => (
                            <button
                              key={id}
                              onClick={() => handleSelectType(id)}
                              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[30px] border-2 transition-all ${
                                selectedType === id 
                                  ? 'border-orange-600 bg-orange-600/10 text-white' 
                                  : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/10'
                              }`}
                            >
                              <Icon size={24} className={selectedType === id ? 'text-orange-600' : ''} />
                              <span className="text-[9px] font-black uppercase text-center leading-tight tracking-widest">{label}</span>
                            </button>
                          ))}
                       </div>
                       <button 
                         disabled={!selectedType}
                         onClick={() => { haptic.medium(); setStep('details'); }}
                         className="w-full bg-white text-black py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-orange-600 hover:text-white disabled:opacity-20"
                       >
                         Continuer
                       </button>
                    </div>
                  )}

                  {step === 'details' && (
                    <div className="space-y-6">
                       <h2 className="text-2xl font-black italic tracking-tighter uppercase">Votre Entreprise</h2>
                       <div className="space-y-4">
                          <div className="group">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block group-focus-within:text-orange-600 transition-colors">Nom de l'enseigne *</label>
                             <input
                               type="text" value={companyName}
                               onChange={(e) => setCompanyName(e.target.value)}
                               placeholder="Ex: Transport VIP Abidjan"
                               className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold text-white outline-none focus:border-orange-600/50 transition-all placeholder:text-gray-600"
                             />
                          </div>
                          <div className="border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-orange-600/30 hover:bg-orange-600/5 transition-all group">
                             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-all">
                                <Upload size={20} className="text-gray-400 group-hover:text-white" />
                             </div>
                             <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest">Logo Boutique</p>
                                <p className="text-[8px] text-gray-500 font-bold uppercase mt-1 italic tracking-widest">PNG, JPG — max 5 Mo</p>
                             </div>
                          </div>
                       </div>
                       <button 
                         disabled={!companyName.trim()}
                         onClick={() => { haptic.medium(); setStep('phone'); }}
                         className="w-full bg-orange-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-black disabled:opacity-20"
                       >
                         Créer mon profil
                       </button>
                    </div>
                  )}

                  {step === 'phone' && (
                    <div className="space-y-6">
                       <h2 className="text-2xl font-black italic tracking-tighter uppercase">Ligne de Paiement</h2>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic italic">Numéro utilisé pour vos retraits Wave / Mobile Money.</p>
                       {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-4">{error}</div>}
                       <div className="flex bg-white/5 border border-white/10 rounded-3xl overflow-hidden focus-within:border-orange-600/50 transition-all">
                          <div className="bg-white/5 px-6 py-5 border-r border-white/10 flex items-center font-black text-orange-600 text-xs italic">CI +225</div>
                          <input
                            type="tel" maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="flex-1 bg-transparent px-6 py-5 outline-none font-black text-xl tracking-widest"
                            placeholder="0102030405"
                            autoFocus
                          />
                       </div>
                       <button 
                         disabled={phone.length < 8 || loading}
                         onClick={handleRequestOTP}
                         className="w-full bg-orange-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-black"
                       >
                         {loading ? 'Séquence en cours...' : 'Demander mon OTP Elite'}
                       </button>
                    </div>
                  )}

                  {step === 'otp' && (
                    <div className="space-y-6">
                       <h2 className="text-2xl font-black italic tracking-tighter uppercase">Vérification</h2>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Code envoyé au +225 {phone}.</p>
                       {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-xs font-bold mb-4">{error}</div>}
                       <input
                         type="tel" maxLength={6}
                         value={otp}
                         onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                         className="w-full bg-white/5 border border-white/10 rounded-[30px] py-8 text-center text-4xl font-black tracking-[1.5rem] outline-none focus:border-orange-600/50 transition-all mb-6 text-orange-600"
                         placeholder="······"
                         autoFocus
                       />
                       <button 
                         disabled={otp.length < 4 || loading}
                         onClick={handleVerifyOTP}
                         className="w-full bg-white text-black py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-orange-600 hover:text-white transition-all shadow-2xl"
                       >
                         {loading ? 'Authentification...' : 'Activer Profil Élite'}
                       </button>
                    </div>
                  )}

                  {step === 'success' && (
                    <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-500">
                       <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.32)] border-4 border-white">
                          <Check size={48} className="text-white" strokeWidth={4} />
                       </div>
                       <div>
                          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Bienvenue <span className="text-orange-600">Champion</span></h2>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">Votre empire LocaConnecté commence ici.</p>
                       </div>
                       <div className="pt-4">
                          <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                       </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
