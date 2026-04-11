import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { 
  User as UserIcon, Smartphone, Mail, Lock, 
  ArrowRight, CheckCircle2, Ticket, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { haptic } from '../../utils/haptics';

type AuthMode = 'login' | 'register';
type UserRole = 'ROLE_USER' | 'ROLE_FOURNISSEUR' | 'ROLE_LIVREUR';

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('ROLE_USER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 8) return alert('Numéro invalide');
    
    setLoading(true);
    try {
      if (mode === 'login' && loginMethod === 'email') {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        login(token, user);
        haptic.success();
        navigate('/');
      } else {
        const fullPhone = phone.startsWith('+') ? phone : `+225${phone}`;
        const payload = { 
          phone: fullPhone,
          role,
          ...(mode === 'register' && {
            email, password, firstName, lastName, referralCode,
            companyName: role === 'ROLE_FOURNISSEUR' ? companyName : null,
            businessType: role === 'ROLE_FOURNISSEUR' ? businessType : null
          })
        };

        await api.post('/auth/otp/request', { phone: fullPhone });
        haptic.medium();
        navigate('/verify-otp', { state: { phone: fullPhone, registrationData: mode === 'register' ? payload : null } });
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-1000">
      
      <div className="w-full max-w-[380px] space-y-4">
        
        {/* Main Brand Card */}
        <div className="bg-white border border-gray-200 p-8 sm:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black tracking-tighter italic text-black mb-1 select-none">
              Loca<span className="text-orange-600">Connecté</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Elite Experience</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Login Method Switcher */}
            {mode === 'login' && (
              <div className="flex bg-gray-50 p-1 rounded-xl mb-6 border border-gray-100">
                <button 
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${loginMethod === 'phone' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
                >
                  Téléphone
                </button>
                <button 
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
                >
                  Email
                </button>
              </div>
            )}

            <div className="space-y-3">
               {mode === 'login' && loginMethod === 'phone' ? (
                  <div className="relative group">
                     <input
                       type="tel" required
                       value={phone}
                       onChange={(e) => {
                          haptic.light();
                          setPhone(e.target.value.replace(/\D/g, ''));
                       }}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:border-orange-600/30 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-bold"
                       placeholder="Téléphone (+225)"
                     />
                  </div>
               ) : (
                  <div className="space-y-3">
                     <input 
                       required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:border-orange-600/30 focus:bg-white outline-none font-medium" 
                       placeholder="Email Professionnel" 
                     />
                     <input 
                       required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:border-orange-600/30 focus:bg-white outline-none font-medium" 
                       placeholder="Mot de passe" 
                     />
                  </div>
               )}

               {mode === 'register' && (
                 <div className="space-y-3 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-2 gap-3">
                       <input 
                         required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:border-orange-600/30 focus:bg-white outline-none font-medium" 
                         placeholder="Prénom" 
                       />
                       <input 
                         required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:border-orange-600/30 focus:bg-white outline-none font-medium" 
                         placeholder="Nom" 
                       />
                    </div>
                    <input 
                      required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:border-orange-600/30 focus:bg-white outline-none font-medium" 
                      placeholder="Email Professionnel" 
                    />
                    <input 
                      required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:border-orange-600/30 focus:bg-white outline-none font-medium" 
                      placeholder="Mot de passe" 
                    />
                    
                    {/* Role Selection Tabs */}
                    <div className="bg-gray-50 p-1.5 rounded-2xl flex gap-1 border border-gray-100">
                       {[
                         { id: 'ROLE_USER', label: 'Client' },
                         { id: 'ROLE_FOURNISSEUR', label: 'Pro' },
                         { id: 'ROLE_LIVREUR', label: 'Elite' }
                       ].map((r) => (
                         <button
                           key={r.id} type="button"
                           onClick={() => { haptic.light(); setRole(r.id as any); }}
                           className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${role === r.id ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
                         >
                           {r.label}
                         </button>
                       ))}
                    </div>

                    {/* Referral Optional */}
                    <div className="relative group">
                       <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                       <input 
                         type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)}
                         className="w-full bg-gray-100/50 border border-transparent rounded-xl px-12 py-4 text-[10px] font-bold uppercase tracking-widest focus:bg-white focus:border-gray-200 outline-none transition-all placeholder:text-gray-400" 
                         placeholder="Code Parrain (Optionnel)" 
                       />
                    </div>

                    {/* Pro Specific Fields */}
                    {role === 'ROLE_FOURNISSEUR' && (
                       <div className="pt-4 space-y-3 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-700">
                          <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest pl-1">Informations Professionnelles</p>
                          <input 
                            required type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm focus:border-orange-600 outline-none font-bold" 
                            placeholder="Nom de l'entreprise (Ex: VIP Transport)" 
                          />
                          <select 
                            required value={businessType} onChange={(e) => setBusinessType(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm focus:border-orange-600 outline-none font-medium appearance-none"
                          >
                             <option value="">-- Type d'activité --</option>
                             <option value="transport">Transport & VTC</option>
                             <option value="residence">Hôtellerie & Résidence</option>
                             <option value="cuisine">Restauration & Gastronomie</option>
                             <option value="energie">Energie & Gaz</option>
                             <option value="services">Services & Conciergerie</option>
                          </select>
                       </div>
                    )}
                 </div>
               )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-orange-600 disabled:opacity-50 mt-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)] active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                   {mode === 'login' ? 'Accéder Elite' : "Créer l'expérience"} 
                   <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 py-8">
             <div className="h-[1px] bg-gray-100 flex-1"></div>
             <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">Sécurisé</span>
             <div className="h-[1px] bg-gray-100 flex-1"></div>
          </div>

          <div className="flex justify-center gap-8">
             <div className="flex flex-col items-center gap-2 opacity-30">
                <Shield size={20} className="text-gray-400" />
                <span className="text-[8px] font-bold uppercase tracking-tighter">AES-256</span>
             </div>
             <div className="flex flex-col items-center gap-2 opacity-30">
                <CheckCircle2 size={20} className="text-gray-400" />
                <span className="text-[8px] font-bold uppercase tracking-tighter">Verified</span>
             </div>
          </div>
        </div>

        {/* Alternative Switch */}
        <div className="bg-white border border-gray-200 p-8 rounded-2xl text-center shadow-sm">
           <p className="text-sm text-gray-400 font-medium">
             {mode === 'login' ? "Nouveau sur LocaConnecté ?" : "Déjà membre de l'élite ?"}
             <button 
               onClick={() => {
                  haptic.medium();
                  setMode(mode === 'login' ? 'register' : 'login');
               }}
               className="ml-2 text-orange-600 font-black uppercase text-[10px] tracking-widest hover:underline"
             >
               {mode === 'login' ? "S'inscrire" : "Se connecter"}
             </button>
           </p>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-center text-[10px] text-gray-400 font-medium px-8 leading-relaxed">
           En continuant, vous acceptez nos <span className="underline cursor-pointer">Conditions</span> et notre <span className="underline cursor-pointer">Politique</span>.
        </p>

      </div>

      <div className="mt-16 text-[10px] text-gray-300 flex flex-wrap justify-center gap-6 uppercase font-bold tracking-widest opacity-60">
         <span className="cursor-pointer hover:text-black transition-colors">Abidjan</span>
         <span className="cursor-pointer hover:text-black transition-colors">Dakar</span>
         <span className="cursor-pointer hover:text-black transition-colors">Paris</span>
         <span className="cursor-pointer hover:text-black transition-colors">Partners</span>
      </div>
    </div>
  );
}
