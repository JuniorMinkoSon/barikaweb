import React, { useState, useEffect } from 'react';
import {
  Clock, CheckCircle2, XCircle, Package, RefreshCcw,
  Zap, ShieldCheck, CreditCard, MessageCircle, AlertCircle
} from 'lucide-react';
import api from '../services/axiosConfig';
import { Order, OrderStatus } from '../components/Commande/types';
import { haptic } from '../utils/haptics';
import { formatFCFA } from '../utils/formatters';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContractViewer from '../components/Contract/ContractViewer';

export default function Orders() {
  const [reservations, setReservations] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedContract, setSelectedContract] = useState<Order | null>(null);
  const [viewerMode, setViewerMode] = useState<'contract' | 'receipt'>('contract');

  const fetchReservations = async () => {
    try {
      const { data } = await api.get('/reservations/user');
      setReservations(data.reservations || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleAcceptProposition = async (id: string) => {
    haptic.medium();
    try {
      await api.patch(`/reservations/${id}/accept`);
      fetchReservations();
    } catch (error) { console.error(error); }
  };

  const handleCancel = async (id: string) => {
    haptic.impact();
    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (error) { console.error(error); }
  };

  const openViewer = (order: Order, mode: 'contract' | 'receipt') => {
    haptic.light();
    setViewerMode(mode);
    setSelectedContract(order);
  };

  const filteredOrders = reservations.filter(o =>
    activeTab === 'active'
      ? !['TERMINE', 'ANNULE'].includes(o.status)
      : ['TERMINE', 'ANNULE'].includes(o.status)
  );

  return (
    <div className="bg-[#000000] min-h-screen pb-32 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase mb-2">Suivi <span className="text-orange-600">Premium</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] italic">L'excellence au service de vos besoins</p>
           </div>
           
           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-3xl">
              <button 
                onClick={() => setActiveTab('active')}
                className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-gray-500 hover:text-white'}`}
              >
                En Cours
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-gray-500 hover:text-white'}`}
              >
                Historique
              </button>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <div key={order.id} className="bg-white/5 backdrop-blur-3xl rounded-[45px] p-8 border border-white/10 hover:border-orange-600/20 transition-all group relative overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                   {/* Product Image */}
                   <div className="w-full lg:w-48 h-48 rounded-[35px] overflow-hidden border border-white/10 relative">
                     <img src={order.image_url || '/images/default_service.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={order.listing_title} />
                     <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                        order.status === 'PROPOSITION' ? 'bg-orange-600 text-white border-white/20 animate-pulse' :
                        order.status === 'PAYE' ? 'bg-green-600 text-white border-white/20' :
                        'bg-black/80 text-white border-white/10'
                     }`}>
                        {order.status}
                     </div>
                   </div>

                   {/* Info */}
                   <div className="flex-1 space-y-4 w-full">
                      <div className="flex justify-between items-start">
                         <div>
                            <h3 className="text-2xl font-black italic tracking-tighter group-hover:text-orange-600 transition-colors uppercase">{order.listing_title}</h3>
                            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                               <ShieldCheck size={14} className="text-orange-600" /> Prestataire: {order.provider_name || 'Particulier'}
                            </p>
                         </div>
                         <div className="text-right">
                            <p className="text-3xl font-black italic tracking-tighter text-white">
                               {formatFCFA(order.negotiated_price || order.base_price)}
                            </p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Séquestre Sécurisé</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-y border-white/5">
                         <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Zone</p>
                            <p className="text-sm font-bold">{order.zone}</p>
                         </div>
                         <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Date</p>
                            <p className="text-sm font-bold">{new Date(order.check_in).toLocaleDateString()}</p>
                         </div>
                         <div className="lg:col-span-2">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Référence</p>
                            <p className="text-sm font-mono text-orange-600 font-black">#{order.id.slice(-8).toUpperCase()}</p>
                         </div>
                      </div>

                      {/* Actions Logic */}
                      <div className="flex flex-wrap gap-4 pt-4">
                         {order.status === 'PROPOSITION' && (
                           <div className="w-full bg-orange-600/10 border border-orange-600/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in zoom-in-95">
                              <div>
                                 <p className="text-orange-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-1"><Zap size={14}/> Contre-Proposition !</p>
                                 <p className="text-sm text-gray-300 italic">Le prestataire propose un ajustement.</p>
                              </div>
                              <div className="flex gap-3">
                                 <button onClick={() => handleCancel(order.id)} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 hover:text-red-500 transition-all">Refuser</button>
                                 <button onClick={() => handleAcceptProposition(order.id)} className="px-8 py-4 rounded-2xl bg-orange-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-600/30 hover:scale-105 active:scale-95 transition-all">Accepter & Payer</button>
                              </div>
                           </div>
                         )}

                         {order.status === 'PAYE' && (
                            <div className="w-full bg-green-600/10 border border-green-600/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                               <div>
                                  <p className="text-green-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-1"><ShieldCheck size={14}/> Paiement Sécurisé</p>
                                  <p className="text-[10px] text-gray-400 font-medium italic">L'argent est sous séquestre. OTP requis à la fin.</p>
                               </div>
                               <div className="bg-black/50 px-6 py-4 rounded-2xl border border-green-500/30 text-center">
                                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Votre OTP</p>
                                  <p className="text-3xl font-black text-green-500 tracking-[0.3em] font-mono leading-none">{order.otp_code || '8492'}</p>
                               </div>
                            </div>
                         )}

                         <div className="flex gap-4 ml-auto">
                            <button 
                               onClick={() => openViewer(order, 'contract')}
                               className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-orange-600 hover:text-white transition-all"
                            >
                               Contrat
                            </button>
                            {(order.status === 'PAYE' || order.status === 'TERMINE') && (
                               <button 
                                  onClick={() => openViewer(order, 'receipt')}
                                  className="px-6 py-4 rounded-2xl bg-orange-600/10 border border-orange-600/30 text-orange-600 text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl"
                               >
                                  Reçu Élite
                               </button>
                            )}
                            <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400 hover:text-white">
                               <MessageCircle size={20} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )) : (
              <div className="bg-white/5 rounded-[60px] p-24 text-center border border-dashed border-white/10 overflow-hidden relative">
                <div className="absolute inset-0 bg-orange-600/5 blur-[80px] rounded-full -z-10 animate-pulse"></div>
                <Package size={64} className="mx-auto mb-6 text-gray-700 opacity-20" />
                <p className="text-2xl font-black italic text-gray-500">Aucune commande active.</p>
                <p className="text-[10px] uppercase tracking-widest font-black text-orange-600 mt-4 italic">Vivez l'excellence avec LocaConnecté</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedContract && (
        <ContractViewer 
          order={selectedContract} 
          mode={viewerMode}
          onClose={() => setSelectedContract(null)} 
        />
      )}

      <Footer />
    </div>
  );
}