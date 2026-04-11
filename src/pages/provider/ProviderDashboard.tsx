import { useEffect, useState } from 'react';
import { 
  Store, PlusCircle, Package, TrendingUp, Settings, 
  Bell, EyeOff, Star,
  Zap, Camera, LogOut, CheckCircle, DollarSign, AlertCircle, Download
} from 'lucide-react';
import api from '../../services/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { haptic } from '../../utils/haptics';
import { formatFCFA } from '../../utils/formatters';

export default function ProviderDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0, active: 0 });
  const [reservations, setReservations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'stories' | 'services' | 'profile'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // Negotiation state
  const [negotiatingId, setNegotiatingId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<string>('');

  const [profileData, setProfileData] = useState({
    companyName: (user as any)?.companyName || '',
    blogContent: (user as any)?.blogContent || '',
    profileImage: (user as any)?.photo || ''
  });

  const loadData = async () => {
    try {
      const { data } = await api.get('/reservations/provider');
      const resas = data.reservations || [];
      setReservations(resas);
      setStats({
        total: resas.length,
        pending: resas.filter((r: any) => r.status === 'EN_COURS').length,
        revenue: resas
          .filter((r: any) => r.status === 'TERMINE')
          .reduce((s: number, r: any) => s + Number(r.negotiated_price || r.base_price || 0), 0),
        active: resas.filter((r: any) => ['PAYE', 'DEMARRE'].includes(r.status)).length,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCounterOffer = async (id: string) => {
    if (!counterPrice) return;
    try {
      await api.post(`/reservations/${id}/counter`, { counterPrice: Number(counterPrice) });
      haptic.success();
      setNegotiatingId(null);
      setCounterPrice('');
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleStartService = async (id: string) => {
    haptic.medium();
    try {
      await api.post(`/reservations/${id}/start`);
      loadData();
    } catch (e) { console.error(e); }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.patch('/auth/profile', profileData);
      haptic.success();
      setIsEditing(false);
    } catch (e) { console.error(e); }
  };

  const TABS = [
    { id: 'overview', label: 'Dashboard', icon: TrendingUp },
    { id: 'orders', label: 'Négociations', icon: Package },
    { id: 'services', label: 'Mes Services', icon: Store },
    { id: 'stories', label: 'Stories', icon: Camera },
    { id: 'profile', label: 'Profil Pro', icon: Settings },
  ] as const;

  return (
    <div className="bg-[#000000] min-h-screen pb-32 text-white">
      {/* Premium Header */}
      <div className="bg-gradient-to-b from-orange-600/20 to-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-orange-600 rounded-[20px] flex items-center justify-center text-white font-black text-2xl shadow-[0_0_30px_rgba(234,88,12,0.3)] rotate-3">
                {profileData.profileImage ? <img src={profileData.profileImage} className="w-full h-full object-cover rounded-[20px]" /> : 'LC'}
              </div>
              <div>
                <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.3em]">LocaConnecté Business</p>
                <h1 className="font-black text-3xl italic tracking-tighter">{profileData.companyName || 'Mon Entreprise'}</h1>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 bg-white/5 backdrop-blur-3xl rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all">
                <Bell size={24} />
              </button>
              <button onClick={logout} className="w-12 h-12 bg-white/5 backdrop-blur-3xl rounded-2xl flex items-center justify-center border border-white/10 hover:bg-red-500/20 transition-all group">
                <LogOut size={24} className="group-hover:text-red-500" />
              </button>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Demandes', value: stats.total, icon: <Package size={20} />, color: 'text-white' },
              { label: 'Attente Client', value: stats.pending, icon: <Zap size={20} />, color: 'text-orange-600' },
              { label: 'Actives', value: stats.active, icon: <TrendingUp size={20} />, color: 'text-green-500' },
              { label: 'Wallet Total', value: `${formatFCFA(stats.revenue)}`, icon: <DollarSign size={20} />, color: 'text-orange-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-3xl rounded-[35px] p-8 border border-white/10 glass-premium group hover:border-orange-600/30 transition-all">
                <div className={`${s.color} mb-4 bg-black/40 w-10 h-10 rounded-xl flex items-center justify-center`}>{s.icon}</div>
                <p className="font-black text-3xl leading-none italic">{s.value}</p>
                <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Sub Nav */}
        <div className="flex max-w-7xl mx-auto px-6 gap-2 sm:gap-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { haptic.light(); setActiveTab(tab.id); }}
                className={`py-6 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-orange-600' : 'text-gray-500 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                   <Icon size={16} /> {tab.label}
                </span>
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full shadow-[0_0_15px_rgba(234,88,12,0.8)]" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">VOS OFFRES ELITE</h2>
                <p className="text-orange-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">Gérez vos prestations et multimédia</p>
              </div>
              <button className="bg-orange-600 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black hover:scale-105 transition-all flex items-center gap-2 shadow-2xl">
                 <PlusCircle size={20} /> Ajouter un service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[50px] p-12 flex flex-col items-center justify-center text-center group hover:border-orange-600/30 transition-all cursor-pointer">
                  <div className="w-20 h-20 bg-white/5 rounded-[30px] flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <PlusCircle size={40} />
                  </div>
                  <p className="font-black italic text-xl">Nouveau Service</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Images HD & Vidéo obligatoires</p>
               </div>
               
               <div className="bg-white/5 border border-white/10 rounded-[50px] overflow-hidden group hover:border-orange-600/30 transition-all">
                  <div className="h-56 relative overflow-hidden">
                     <img src="/images/energy_delivery.png" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="Energy" />
                     <div className="absolute top-6 right-6 bg-green-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">Actif</div>
                  </div>
                  <div className="p-8">
                     <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">LocaEnergy Premium</h3>
                     <p className="text-sm text-gray-500 italic mb-6">4 Photos • 1 Vidéo HD • 4.9 ★</p>
                     <div className="flex gap-4">
                        <button className="flex-1 bg-white/5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white hover:text-black transition-all">Editer</button>
                        <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500/20 transition-all"><EyeOff size={20}/></button>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-[60px] p-10 lg:p-20 relative overflow-hidden">
               <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-600/5 blur-[100px] rounded-full"></div>
               <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-10">Détails Multimédia de l'Offre</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-[35px] flex flex-col items-center justify-center gap-3 group hover:border-orange-600 hover:bg-orange-600/5 transition-all cursor-pointer">
                       <Camera size={32} className="text-gray-600 group-hover:text-orange-600 transition-all" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Image {i}</p>
                    </div>
                  ))}
               </div>
               <div className="bg-black/50 border border-white/10 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="w-32 h-32 bg-orange-600 rounded-[30px] flex items-center justify-center shadow-2xl">
                     <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="flex-1">
                     <p className="text-orange-600 font-black text-xs uppercase tracking-widest mb-2">Vidéo de Présentation (Max 10Mo)</p>
                     <p className="text-gray-400 text-sm italic font-medium">Une vidéo courte (30s) attire 3x plus de clients. Formats acceptés: MP4, MOV, AVI.</p>
                  </div>
                  <button className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-orange-600 hover:text-white transition-all whitespace-nowrap">Charger Vidéo</button>
               </div>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               <div>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                    <AlertCircle className="text-orange-600" size={24} /> Action Requise
                  </h2>
                  <div className="grid gap-4">
                    {reservations.filter(r => r.status === 'EN_COURS').map(r => (
                      <div key={r.id} className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-orange-600/20 transition-all group">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-[20px] overflow-hidden border border-white/10">
                              <img src={r.image_url || '/images/default_service.png'} className="w-full h-full object-cover" alt={r.listing_title} />
                           </div>
                           <div>
                              <p className="font-black text-xl italic tracking-tighter leading-none">{r.listing_title}</p>
                              <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest">Client: {r.client_phone}</p>
                              <p className="text-orange-600 font-bold text-lg mt-1 italic">{formatFCFA(r.base_price)}</p>
                           </div>
                        </div>
                        
                        {negotiatingId === r.id ? (
                           <div className="flex items-center gap-4 animate-in slide-in-from-right-4">
                              <input 
                                type="number" value={counterPrice} onChange={(e) => setCounterPrice(e.target.value)} 
                                placeholder="Nouveau prix (FCFA)"
                                className="bg-black/50 border border-orange-600/30 rounded-2xl p-4 text-white font-black outline-none w-48"
                              />
                              <button onClick={() => handleCounterOffer(r.id)} className="bg-orange-600 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all">Envoyer</button>
                           </div>
                        ) : (
                          <div className="flex gap-4">
                            <button onClick={() => setNegotiatingId(r.id)} className="bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 hover:text-white transition-all">Contre-Offre</button>
                            <button onClick={() => handleStartService(r.id)} className="bg-white/5 hover:bg-green-600/20 text-green-500 border border-white/10 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Accepter direct</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {reservations.filter(r => r.status === 'EN_COURS').length === 0 && (
                      <div className="bg-white/5 rounded-[40px] border border-dashed border-white/10 p-16 text-center text-gray-500">
                        <CheckCircle size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-black italic text-xl">Tout est calme sur Abidjan.</p>
                        <p className="text-xs uppercase tracking-widest mt-2">Aucune nouvelle demande en cours.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="bg-orange-600 rounded-[45px] p-8 text-white orange-glow shadow-[0_20px_50px_rgba(234,88,12,0.2)]">
                  <h3 className="font-black text-2xl mb-4 italic leading-none">VOTRE IMPACT <br/>V2.0</h3>
                  <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed italic">Vous êtes à 5000 points du badge "Elite Abidjan".</p>
                  <button className="w-full bg-white text-black py-5 rounded-[25px] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                    Booster Visibilité <Zap size={16} />
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB V2 */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic tracking-tighter mb-8">HISTORIQUE DES NÉGOCIATIONS</h2>
            {reservations.map((r: any) => (
              <div key={r.id} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 glass-premium">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[30px] overflow-hidden border-2 border-white/5">
                        <img src={r.image_url || '/images/default_service.png'} className="w-full h-full object-cover" alt={r.listing_title} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-black text-2xl italic tracking-tighter">{r.listing_title}</h3>
                          <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border ${
                            r.status === 'TERMINE' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            r.status === 'PAYE' ? 'bg-orange-600/10 text-orange-600 border-orange-600/20' :
                            'bg-gray-500/10 text-gray-500 border-gray-500/20'
                          }`}>{r.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Réf: #LC-V2-{r.id}</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <p className="text-3xl font-black italic text-orange-600">{formatFCFA(r.negotiated_price || r.base_price)}</p>
                      <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-widest">Commission (8%) incluse</p>
                   </div>
                </div>
                
                {r.status === 'PAYE' && (
                  <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="bg-orange-600/10 border border-orange-600/20 p-6 rounded-3xl md:flex-1">
                      <p className="text-orange-600 font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-2"><CheckCircle size={14}/> Client a payé !</p>
                      <p className="text-sm text-gray-400">Demandez l'OTP au client dès que le service est terminé pour débloquer les fonds.</p>
                    </div>
                    <button onClick={() => handleStartService(r.id)} className="bg-white text-black px-10 py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 hover:text-white transition-all flex items-center gap-2">Démarrer le service</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PROFILE TAB V2 */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="bg-white/5 rounded-[60px] overflow-hidden border border-white/10 glass-premium p-10 lg:p-20 text-center relative">
               <div className="w-40 h-40 mx-auto rounded-[50px] border-4 border-orange-600 mb-8 overflow-hidden bg-white/5 group relative shadow-[0_0_50px_rgba(234,88,12,0.2)]">
                  <img src={profileData.profileImage || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="Profile" />
                  <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all">
                    <Camera size={32} />
                  </button>
               </div>
               
               {isEditing ? (
                 <div className="space-y-6">
                    <input 
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                      className="w-full bg-black/40 border border-orange-600/30 rounded-3xl p-6 text-3xl font-black italic text-center outline-none focus:border-white transition-all"
                    />
                    <textarea 
                      rows={4}
                      value={profileData.blogContent}
                      onChange={(e) => setProfileData({...profileData, blogContent: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-[40px] p-10 text-lg font-medium text-gray-400 outline-none text-center italic"
                      placeholder="Décrivez votre excellence..."
                    />
                    <div className="flex gap-4">
                       <button onClick={() => setIsEditing(false)} className="flex-1 bg-white/5 py-6 rounded-full font-black uppercase text-xs tracking-widest border border-white/10">Annuler</button>
                       <button onClick={handleUpdateProfile} className="flex-1 bg-orange-600 py-6 rounded-full font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-600/20">Sauvegarder</button>
                    </div>
                 </div>
               ) : (
                 <>
                   <h1 className="text-5xl font-black italic tracking-tighter mb-4 leading-none uppercase">{profileData.companyName || 'Mon Entreprise'}</h1>
                   <div className="inline-flex items-center gap-2 bg-orange-600/10 px-4 py-2 rounded-full border border-orange-600/20 mb-10">
                      <Star size={14} className="text-orange-600 fill-orange-600" />
                      <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest">Prestataire Elite V2</span>
                   </div>
                   <p className="text-xl text-gray-400 leading-[1.6] italic font-medium max-w-xl mx-auto mb-12">
                     "{profileData.blogContent || 'Appliquez l\'excellence LocaConnecté au quotidien.'}"
                   </p>
                   <button onClick={() => setIsEditing(true)} className="bg-white text-black px-12 py-6 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 hover:text-white transition-all">Editer mon profil Pro</button>
                 </>
               )}
            </div>

            {/* Bilan Financier Section */}
            <div className="bg-white/5 border border-white/10 rounded-[60px] p-10 lg:p-20 relative overflow-hidden mt-12">
               <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-600/5 blur-[100px] rounded-full"></div>
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">BILAN FINANCIER</h3>
                    <p className="text-orange-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">Récapitulatif de votre performance</p>
                  </div>
                  <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2">
                     <Download size={18} /> Télécharger Rapport PDF
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-black/40 p-10 rounded-[40px] border border-white/5">
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Total Revenus Bruts</p>
                     <p className="text-3xl font-black italic text-white">{formatFCFA(stats.revenue)}</p>
                  </div>
                  <div className="bg-black/40 p-10 rounded-[40px] border border-white/5">
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Commission Plateforme (8%)</p>
                     <p className="text-3xl font-black italic text-orange-600">-{formatFCFA(stats.revenue * 0.08)}</p>
                  </div>
                  <div className="bg-orange-600 p-10 rounded-[40px] orange-glow">
                     <p className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-2">Net à Recevoir</p>
                     <p className="text-3xl font-black italic text-white">{formatFCFA(stats.revenue * 0.92)}</p>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-white/10">
                           <th className="py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Période</th>
                           <th className="py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Commandes</th>
                           <th className="py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4">Volume (GMV)</th>
                           <th className="py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest px-4 text-right">Commission</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        <tr className="hover:bg-white/5 transition-colors">
                           <td className="py-6 px-4 font-black italic">Avril 2026</td>
                           <td className="py-6 px-4 font-medium text-gray-400">{stats.total}</td>
                           <td className="py-6 px-4 font-black text-white">{formatFCFA(stats.revenue)}</td>
                           <td className="py-6 px-4 font-black text-orange-600 text-right">-{formatFCFA(stats.revenue * 0.08)}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
