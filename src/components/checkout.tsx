import { useState } from 'react';
import { theme } from '../theme';

interface CheckoutProps {
  total: number;
  serviceFee: number;
  onBack?: () => void;
}

export default function Checkout({ total, serviceFee, onBack }: CheckoutProps) {
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [payOption, setPayOption] = useState<'wave' | 'orange'>('wave');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header style HeroSection */}
      <div className="relative pt-14 pb-32 px-6 overflow-hidden" style={{backgroundColor: theme.colors.gray[900]}}>
        <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full opacity-20 blur-[80px]" style={{ backgroundColor: theme.colors.primary }} />
        <div className="max-w-5xl mx-auto relative z-10 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all active:scale-90 shrink-0"
            aria-label="Retour"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Paiement
          </h1>
        </div>
      </div>

      <main className="max-w-5xl mx-auto -mt-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">

        <div className="lg:col-span-7 space-y-6">
          {/* Livraison / Retrait */}
          <div className="bg-white p-2 rounded-[32px] flex gap-2 shadow-xl border border-gray-100">
            <button
              onClick={() => setMethod('delivery')}
              className={`flex-1 py-5 rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2 ${method === 'delivery' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400'}`}
            >
              Livraison
            </button>
            <button
              onClick={() => setMethod('pickup')}
              className={`flex-1 py-5 rounded-[24px] font-bold text-sm transition-all flex items-center justify-center gap-2 ${method === 'pickup' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400'}`}
            >
              Retrait
            </button>
          </div>

          {/* Adresse */}
          <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-50 space-y-8">
            <h3 className="font-bold text-xl text-gray-900">
              {method === 'delivery' ? 'Où vous livrer ?' : 'Lieu de récupération'}
            </h3>
            <div className="space-y-4">
              <input
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 outline-none border-2 border-transparent focus:border-orange-500 font-semibold"
                placeholder="Ville et Commune"
              />
              <textarea
                rows={3}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 outline-none border-2 border-transparent focus:border-orange-500 font-semibold resize-none"
                placeholder="Précisions d'adresse..."
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100">
            <h3 className="font-bold text-xl mb-6">Mode de paiement</h3>

            <div className="space-y-4 mb-8">
              {/* Wave */}
              <button
                onClick={() => setPayOption('wave')}
                className={`w-full py-5 px-6 rounded-[26px] border-2 transition-all flex items-center gap-4 ${payOption === 'wave' ? 'border-[#1da1f2] bg-[#1da1f2]/5' : 'border-gray-100 hover:bg-gray-50'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#1da1f2] flex items-center justify-center overflow-hidden shrink-0 shadow-sm" />
                <div className="text-left flex-1">
                  <p className="font-bold text-sm text-gray-900">Wave</p>
                  <p className="text-[10px] text-gray-400 font-medium">Paiement sans frais</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${payOption === 'wave' ? 'border-[#1da1f2]' : 'border-gray-200'}`}>
                  {payOption === 'wave' && <div className="w-3 h-3 rounded-full bg-[#1da1f2]" />}
                </div>
              </button>

              {/* Orange Money */}
              <button
                onClick={() => setPayOption('orange')}
                className={`w-full py-5 px-6 rounded-[26px] border-2 transition-all flex items-center gap-4 ${payOption === 'orange' ? 'border-[#ff7900] bg-[#ff7900]/5' : 'border-gray-100 hover:bg-gray-50'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#ff7900] flex items-center justify-center shrink-0 shadow-sm" />
                <div className="text-left flex-1">
                  <p className="font-bold text-sm text-gray-900">Orange Money</p>
                  <p className="text-[10px] text-gray-400 font-medium">Rapide et sécurisé</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${payOption === 'orange' ? 'border-[#ff7900]' : 'border-gray-200'}`}>
                  {payOption === 'orange' && <div className="w-3 h-3 rounded-full bg-[#ff7900]" />}
                </div>
              </button>
            </div>

            <div className="flex justify-between items-center mb-6 pt-6 border-t border-gray-50">
              <span className="font-bold text-gray-400">Total à régler</span>
              <span className="text-2xl font-black text-orange-600">{(total + serviceFee).toLocaleString()} FCFA</span>
            </div>

            <button className="w-full py-6 rounded-[28px] bg-slate-900 text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all">
              Payer avec {payOption === 'wave' ? 'Wave' : 'Orange'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}