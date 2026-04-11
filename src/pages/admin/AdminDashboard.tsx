import React, { useEffect, useState } from 'react';
import api from '../../services/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, Users, CheckCircle, XCircle, TrendingUp, Search, 
  DollarSign, Gavel, AlertTriangle, ArrowRight, BarChart3, Lock
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { formatFCFA } from '../../utils/formatters';
import { haptic } from '../../utils/haptics';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [providers, setProviders] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    escrowVolume: 12500000, 
    activeDisputes: 3, 
    totalProviders: 0,
    pendingVerifications: 0 
  });
  const [activeTab, setActiveTab] = useState<'providers' | 'disputes' | 'finances'>('providers');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats({
          escrowVolume: data.totalGMV,
          activeDisputes: data.activeDisputes,
          totalProviders: data.verifiedProviders + data.pendingReview,
          pendingVerifications: data.pendingReview,
          totalCommission: data.totalCommission
        });

        const providersRes = await api.get('/admin/providers');
        setProviders(providersRes.data || []);
        
        // Mocking disputes for the demo of V2 UI
        setDisputes([
          { id: '1', reservationId: 'RES-99', client: '07070707', provider: 'AutoPlus', amount: 35000, reason: 'Véhicule en panne', status: 'OPEN' },
          { id: '2', reservationId: 'RES-102', client: '05050505', provider: 'VillaLuxe', amount: 120000, reason: 'Piscine non nettoyée', status: 'IN_MEDIATION' },
        ]);
      } catch (error) {
        console.error("Admin error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchAdminData();
  }, [user]);

  const handleVerify = async (providerId: number) => {
    haptic.success();
    try {
      await api.patch(`/admin/verify-provider/${providerId}`);
      setProviders(prev => prev.map(p => p.id === providerId ? { ...p, professional_verified: 1 } : p));
    } catch (error) { console.error(error); }
  };

  const handleResolveDispute = (id: string, winner: 'client' | 'provider') => {
    haptic.impact();
    alert(`Litige #${id} résolu en faveur du ${winner === 'client' ? 'Client' : 'Prestataire'}. Les fonds vont être transférés.`);
    setDisputes(prev => prev.filter(d => d.id !== id));
  };

  if (user?.role !== 'admin') {
    return <div className="p-20 text-center font-black text-white bg-black min-h-screen flex flex-col items-center justify-center">
      <AlertTriangle size={60} className="text-orange-600 mb-6" />
      <h1 className="text-3xl italic uppercase tracking-tighter">Accès Restreint</h1>
      <p className="text-gray-500 mt-2">Section confidentielle LocaConnecté Admin V2</p>
    </div>;
  }

  return (
    <div className="bg-[#000000] min-h-screen text-white pb-32">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* En-tête V2 Premium */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
          <div>
            <div className="bg-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full w-fit tracking-[0.2em] uppercase mb-4 orange-glow">
               Super-Admin Privilege
            </div>
            <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-none uppercase">COMITÉ DE <br/><span className="text-orange-600">DIRECTION.</span></h1>
            <p className="text-gray-500 mt-4 font-bold text-sm italic">Arbitrage des litiges, Flux Escrow & Certification Elite.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="bg-white/5 backdrop-blur-3xl p-6 rounded-[35px] border border-white/10 glass-premium">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Volume Séquestre</p>
                <p className="text-2xl font-black italic text-orange-600">{formatFCFA(stats.escrowVolume)}</p>
             </div>
             <div className="bg-white text-black p-6 rounded-[35px] shadow-2xl">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Gavel size={12} /> Litiges Actifs</p>
                <p className="text-2xl font-black italic">{stats.activeDisputes}</p>
             </div>
             <div className="bg-orange-600 p-6 rounded-[35px] shadow-xl hidden lg:block">
                <p className="text-orange-200 text-[10px] font-black uppercase tracking-widest mb-2">Providers V2</p>
                <p className="text-2xl font-black italic text-white">{stats.totalProviders}</p>
             </div>
          </div>
        </div>

        {/* Global Tabs SubNav */}
        <div className="flex gap-10 border-b border-white/5 mb-12">
           {[
             { id: 'providers', label: 'Certifications', icon: ShieldCheck },
             { id: 'disputes', label: 'Arbitrage', icon: Gavel },
             { id: 'finances', label: 'Flux Escrow', icon: BarChart3 },
           ].map(tab => {
             const Icon = tab.icon;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`pb-6 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-all relative ${activeTab === tab.id ? 'text-orange-600' : 'text-gray-500 hover:text-white'}`}
               >
                 <Icon size={16} /> {tab.label}
                 {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full" />}
               </button>
             );
           })}
        </div>

        {/* LOADING STATE */}
        {loading && <div className="flex justify-center py-24"><div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>}

        {/* PROVIDERS CERTIFICATION TAB */}
        {activeTab === 'providers' && !loading && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="bg-white/5 rounded-[45px] overflow-hidden border border-white/10 glass-premium p-8">
                <div className="flex items-center gap-4 mb-8">
                   <div className="relative flex-1">
                      <Search className="absolute left-6 top-5 text-gray-500" size={20} />
                      <input 
                        type="text" placeholder="Rechercher un dossier prestataire..." 
                        className="w-full bg-black/40 border border-white/5 rounded-3xl pl-16 pr-6 py-5 text-sm font-bold outline-none focus:border-orange-600 transition-all"
                      />
                   </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full">
                      <thead>
                         <tr className="text-left py-4 border-b border-white/5">
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Dossier #ID</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Identité Corporate</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Secteur</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Statut Elite</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Mise en conformité</th>
                         </tr>
                      </thead>
                      <tbody>
                         {providers.map(p => (
                           <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                              <td className="p-6 font-mono text-xs text-gray-500">#P-V2-{p.id}</td>
                              <td className="p-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-orange-600 border border-white/10 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                       {p.company_name?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                       <p className="font-black italic uppercase tracking-tighter text-lg leading-none">{p.company_name}</p>
                                       <p className="text-xs text-gray-500 font-bold mt-1 tracking-widest">{p.phone}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-6 font-bold text-gray-400 italic text-sm">{p.business_type}</td>
                              <td className="p-6">
                                 {p.professional_verified ? (
                                   <span className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                                      <CheckCircle size={14} /> Certifié Elite
                                   </span>
                                 ) : (
                                   <span className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest bg-orange-600/10 px-3 py-1.5 rounded-full border border-orange-600/20">
                                      <Lock size={14} /> En Examen
                                   </span>
                                 )}
                              </td>
                              <td className="p-6 text-right">
                                 {!p.professional_verified && (
                                   <button 
                                     onClick={() => handleVerify(p.id)}
                                     className="bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all"
                                   >
                                      Valider Dossier
                                   </button>
                                 )}
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* DISPUTES ARBITRATION TAB */}
        {activeTab === 'disputes' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {disputes.map(d => (
                  <div key={d.id} className="bg-white/5 backdrop-blur-3xl border border-red-900/20 rounded-[45px] p-10 glass-premium group">
                     <div className="flex justify-between items-start mb-8">
                        <div>
                           <div className="bg-red-600/10 text-red-500 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border border-red-600/20">Litige Ouvert</div>
                           <h3 className="text-2xl font-black italic tracking-tighter uppercase">{d.reason}</h3>
                           <p className="text-sm text-gray-500 font-bold mt-1">Conflit sur l'Ordre #{d.reservationId}</p>
                        </div>
                        <p className="text-2xl font-black italic text-orange-600">{formatFCFA(d.amount)}</p>
                     </div>
                     
                     <div className="bg-black/50 rounded-3xl p-6 space-y-4 mb-10 border border-white/5">
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-gray-500 font-bold uppercase tracking-widest">Client</span>
                           <span className="font-black text-white">{d.client}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-gray-500 font-bold uppercase tracking-widest">Prestataire</span>
                           <span className="font-black text-orange-600 font-italic">{d.provider}</span>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <button onClick={() => handleResolveDispute(d.id, 'client')} className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all">Rembourser Client</button>
                        <button onClick={() => handleResolveDispute(d.id, 'provider')} className="flex-1 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all">Payer Prestataire</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
