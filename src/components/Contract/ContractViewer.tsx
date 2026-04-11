import React from 'react';
import html2pdf from 'html2pdf.js';
import { FileText, Download, ShieldCheck, Printer, CheckCircle } from 'lucide-center';
import { formatFCFA } from '../../utils/formatters';

interface ContractViewerProps {
  order: any;
  onClose: () => void;
  mode?: 'contract' | 'receipt';
}

export default function ContractViewer({ order, onClose, mode = 'contract' }: ContractViewerProps) {
  const downloadPDF = () => {
    const element = document.getElementById('document-content');
    const opt = {
      margin: 10,
      filename: `LocaConnecte_${mode === 'contract' ? 'Contrat' : 'Recu'}_${order.id.slice(-6)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-10 overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-4xl w-full bg-[#f8f9fa] text-black rounded-[50px] overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.1)] border border-white/10 animate-in zoom-in-95 duration-500">
        
        {/* Actions Header */}
        <div className="bg-black p-8 flex items-center justify-between text-white border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
                {mode === 'contract' ? <FileText size={24} /> : <Printer size={24} />}
             </div>
             <div>
                <h2 className="font-black italic uppercase tracking-tighter text-2xl">{mode === 'contract' ? 'CONTRAT ÉLITE' : 'REÇU ÉLITE'}</h2>
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest italic leading-none">Certification LocaConnecté Premium</p>
             </div>
          </div>
          <div className="flex gap-4">
             <button onClick={downloadPDF} className="bg-white text-black hover:bg-orange-600 hover:text-white px-8 py-3 rounded-2xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl">
                <Download size={16} /> Télécharger PDF
             </button>
             <button onClick={onClose} className="w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl flex items-center justify-center transition-all">
                <X size={24} />
             </button>
          </div>
        </div>

        {/* Document Content (Styled for PDF) */}
        <div id="document-content" className="p-12 lg:p-24 bg-white relative overflow-hidden">
           {/* Watermark */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 opacity-[0.03] select-none pointer-events-none">
              <h1 className="text-[200px] font-black italic tracking-tighter leading-none">LOCACONNECTÉ</h1>
           </div>

           <div className="flex justify-between items-start mb-24 relative z-10">
              <div>
                 <h1 className="text-5xl font-black italic tracking-tighter text-black mb-2 uppercase">Loca<span className="text-orange-600">Connecté</span></h1>
                 <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-8">L'Excellence au service de la Confiance</p>
                 
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 shadow-sm">
                       <CheckCircle size={14} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Document Certifié</span>
                    </div>
                    {mode === 'receipt' && (
                       <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full border border-orange-100 shadow-sm">
                          <ShieldCheck size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Paiement Sécurisé</span>
                       </div>
                    )}
                 </div>
              </div>
              <div className="text-right">
                 <p className="font-black text-lg uppercase text-gray-900 tracking-tighter italic">{mode === 'contract' ? 'CONTRAT' : 'FACTURE'} N°LC-{order.id.slice(-8).toUpperCase()}</p>
                 <p className="text-[11px] font-bold text-gray-400 mt-2 uppercase tracking-widest italic">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
           </div>

           <div className="space-y-12 text-sm relative z-10">
              {/* Context */}
              <div className="grid grid-cols-2 gap-12 bg-gray-50/50 p-10 rounded-[40px] border border-gray-100">
                 <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">Client Elite</p>
                    <p className="font-black text-black text-lg mb-1">{order.client_phone || 'Utilisateur Premium'}</p>
                    <p className="text-xs text-gray-500 italic">Identité vérifiée par 2FA</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">Prestataire Certifié</p>
                    <p className="font-black text-black text-lg mb-1">{order.provider_name || 'Partenaire LocaConnecté'}</p>
                    <p className="text-xs text-orange-600 font-black uppercase tracking-tighter">Membre Elite Choice</p>
                 </div>
              </div>

              {/* Body */}
              <section>
                 <h3 className="font-black text-black uppercase tracking-[0.3em] text-[10px] mb-6 border-l-4 border-orange-600 pl-4 py-1 italic">Détails de la Prestation</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b-2 border-black/5">
                             <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Désignation</th>
                             <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Montant</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-black/5">
                          <tr>
                             <td className="py-8">
                                <p className="font-black text-lg tracking-tighter uppercase italic">{order.listing_title}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Lieu : {order.zone} • Date : {new Date(order.check_in).toLocaleDateString()}</p>
                             </td>
                             <td className="py-8 text-right font-black text-xl italic">{formatFCFA(order.negotiated_price || order.base_price)}</td>
                          </tr>
                          {mode === 'receipt' && (
                             <tr>
                                <td className="py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic italic">Frais de médiation LocaConnecté</td>
                                <td className="py-6 text-right font-bold text-gray-600 italic">OFFERT</td>
                             </tr>
                          )}
                       </tbody>
                       <tfoot>
                          <tr>
                             <td className="py-10 text-2xl font-black italic tracking-tighter uppercase">Total {mode === 'contract' ? 'Engagé' : 'Payé'}</td>
                             <td className="py-10 text-right text-4xl font-black italic text-orange-600">{formatFCFA(order.negotiated_price || order.base_price)}</td>
                          </tr>
                       </tfoot>
                    </table>
                 </div>
              </section>

              {/* Legal / Note */}
              <section>
                 <h3 className="font-black text-black uppercase tracking-[0.3em] text-[10px] mb-4 italic">Note Importante</h3>
                 <p className="text-xs text-gray-500 leading-relaxed italic">
                    {mode === 'contract' 
                      ? "Ce document fait office de contrat de médiation. Les fonds sont sécurisés sous séquestre jusqu'à la libération par OTP." 
                      : "Ce reçu atteste de la bonne exécution du paiement sous séquestre. La prestation est garantie par LocaConnecté."}
                 </p>
              </section>

              {/* Signatures / Sceau */}
              <div className="pt-16 flex justify-between gap-10">
                 <div className="flex-1 text-center">
                    <div className="h-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mb-4 flex items-center justify-center italic text-gray-300 relative overflow-hidden">
                       <span className="relative z-10 font-bold uppercase tracking-widest text-[9px]">Sceau Client</span>
                    </div>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Signature Numérique</p>
                 </div>
                 <div className="flex-1 text-center">
                    <div className="h-32 bg-gray-900 rounded-3xl shadow-xl mb-4 flex items-center justify-center flex-col gap-3 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-orange-600/10 animate-pulse" />
                       <ShieldCheck className="text-orange-600 relative z-10" size={32} />
                       <span className="text-[10px] font-black uppercase text-orange-600 relative z-10 tracking-widest">CERTIFIÉ ÉLITE</span>
                    </div>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest italic">Authentifié par LOCACONNECTÉ CI</p>
                 </div>
              </div>
           </div>
           
           <div className="mt-24 pt-10 border-t border-black/5 text-center">
              <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.5em] italic">L'Expérience Elite • Depuis Abidjan • Propulsé par GC-V2 Technology</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function X({ size }: { size: number }) {
   return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
}
