import { useState } from 'react';
import { Trash2, MapPin, Edit3, Car, Home, ArrowRight, X } from 'lucide-react';
import { theme } from '../theme';
import Suggest from '../components/suggest';
import Checkout from '../components/checkout';

const initialCart = [
  {
    id: 1,
    name: 'Toyota Corolla 2022',
    category: 'Voiture',
    price: 35000,
    details: 'Location du 12 au 14 Avril (2 jours)',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Cocody, Abidjan',
    description: 'Berline confortable, climatisée, idéale pour vos déplacements en ville.',
    dateDebut: '2024-04-12',
    dateFin: '2024-04-14',
    options: { gps: true, chauffeur: false, siegeBebe: false },
    notes: '',
  },
  {
    id: 2,
    name: 'Villa avec piscine',
    category: 'Résidence',
    price: 120000,
    details: 'Séjour du 15 au 18 Avril (3 nuits)',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Bingerville',
    description: 'Villa luxueuse avec piscine privée, jardin et vue panoramique.',
    dateDebut: '2024-04-15',
    dateFin: '2024-04-18',
    personnes: 2,
    options: { petitDejeuner: false, menage: true, piscine: true },
    notes: '',
  },
  {
    id: 3,
    name: 'Mercedes Classe S',
    category: 'Voiture',
    price: 75000,
    details: 'Forfait VIP (24h)',
    image: 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Plateau',
    description: 'Berline de prestige avec intérieur cuir, parfaite pour vos événements VIP.',
    dateDebut: '2024-04-20',
    dateFin: '2024-04-21',
    options: { gps: true, chauffeur: true, siegeBebe: false },
    notes: 'Besoin du chauffeur en tenue formelle.',
  },
];

function diffDays(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

// Bottom nav height + safe area
const BOTTOM_NAV_HEIGHT = 90;

function EditModal({ item, onClose, onSave }: { item: any; onClose: () => void; onSave: (updated: any) => void }) {
  const [form, setForm] = useState({ ...item });
  const days = diffDays(form.dateDebut, form.dateFin);

  const toggleOpt = (key: string) =>
    setForm((f: any) => ({ ...f, options: { ...f.options, [key]: !f.options[key] } }));

  const voitureOptions = [
    { key: 'gps', label: 'GPS intégré' },
    { key: 'chauffeur', label: 'Avec chauffeur' },
    { key: 'siegeBebe', label: 'Siège bébé' },
  ];

  const residenceOptions = [
    { key: 'petitDejeuner', label: 'Petit-déjeuner inclus' },
    { key: 'menage', label: 'Service de ménage' },
    { key: 'piscine', label: 'Accès piscine' },
  ];

  const options = item.category === 'Voiture' ? voitureOptions : residenceOptions;
  const accentColor = item.category === 'Voiture' ? theme.colors.primary : '#10b981';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
    >
      {/* Le popup s'arrête au-dessus du bottom nav */}
      <div
        className="w-full max-w-lg bg-white rounded-t-[40px] overflow-hidden shadow-2xl flex flex-col"
        style={{
          maxHeight: `calc(100vh - ${BOTTOM_NAV_HEIGHT}px - 16px)`,
          marginBottom: `${BOTTOM_NAV_HEIGHT}px`,
        }}
      >
        {/* Image header — taille réduite pour laisser de la place au contenu */}
        <div className="relative h-40 flex-shrink-0">
          <img src={form.image} className="w-full h-full object-cover" alt={form.name} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/30"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-5">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg text-white"
              style={{ backgroundColor: accentColor }}
            >
              {item.category}
            </span>
            <h2 className="text-white font-bold text-lg mt-1">{form.name}</h2>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 pt-5 pb-8 space-y-6 flex-1">

          {/* Description */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{form.description}</p>
          </div>

          {/* Dates */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              {item.category === 'Voiture' ? 'Période de location' : 'Séjour'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 font-semibold mb-1 block">
                  {item.category === 'Voiture' ? 'Début' : 'Check-in'}
                </label>
                <input
                  type="date"
                  value={form.dateDebut}
                  onChange={e => setForm((f: any) => ({ ...f, dateDebut: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-400 outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-semibold mb-1 block">
                  {item.category === 'Voiture' ? 'Fin' : 'Check-out'}
                </label>
                <input
                  type="date"
                  value={form.dateFin}
                  onChange={e => setForm((f: any) => ({ ...f, dateFin: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-400 outline-none text-sm font-semibold"
                />
              </div>
            </div>
            <div className="mt-2 px-4 py-3 rounded-2xl flex items-center justify-between" style={{ backgroundColor: `${accentColor}15` }}>
              <span className="text-xs font-semibold text-gray-500">
                {item.category === 'Voiture' ? 'Nombre de jours' : 'Nombre de nuits'}
              </span>
              <span className="font-black text-lg" style={{ color: accentColor }}>{days}</span>
            </div>
          </div>

          {/* Personnes — Résidence uniquement */}
          {item.category === 'Résidence' && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Nombre de personnes</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setForm((f: any) => ({ ...f, personnes: Math.max(1, f.personnes - 1) }))}
                  className="w-10 h-10 rounded-2xl bg-gray-100 font-bold text-xl flex items-center justify-center"
                >−</button>
                <span className="text-2xl font-black" style={{ color: theme.colors.secondary }}>{form.personnes}</span>
                <button
                  onClick={() => setForm((f: any) => ({ ...f, personnes: f.personnes + 1 }))}
                  className="w-10 h-10 rounded-2xl font-bold text-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >+</button>
              </div>
            </div>
          )}

          {/* Options */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Options</p>
            <div className="space-y-2">
              {options.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => toggleOpt(opt.key)}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: form.options[opt.key] ? accentColor : '#f3f4f6',
                    backgroundColor: form.options[opt.key] ? `${accentColor}10` : '#f9fafb',
                  }}
                >
                  <span className="text-sm font-semibold text-gray-700">{opt.label}</span>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: form.options[opt.key] ? accentColor : '#d1d5db' }}
                  >
                    {form.options[opt.key] && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Notes / Demandes spéciales</p>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))}
              placeholder="Ex : arrivée tardive, allergie, préférences..."
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-400 outline-none text-sm font-medium resize-none"
            />
          </div>

          {/* Save */}
          <button
            onClick={() => {
              const updatedDetails = item.category === 'Voiture'
                ? `Location du ${form.dateDebut} au ${form.dateFin} (${days} jours)`
                : `Séjour du ${form.dateDebut} au ${form.dateFin} (${days} nuits)`;
              onSave({ ...form, details: updatedDetails });
            }}
            className="w-full py-5 rounded-2xl font-black text-base text-white transition-all active:scale-95"
            style={{ backgroundColor: theme.colors.primary, boxShadow: `0 8px 20px ${theme.colors.primary}40` }}
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const [view, setView] = useState<'cart' | 'checkout'>('cart');
  const [items, setItems] = useState(initialCart);
  const [editItem, setEditItem] = useState<any | null>(null);

  const total = items.reduce((acc, item) => acc + item.price, 0);
  const serviceFee = 2500;

  if (view === 'checkout') {
    return <Checkout total={total} serviceFee={serviceFee} onBack={() => setView('cart')} />;  }

  return (
    <div className="min-h-screen bg-gray-50">

      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={(updated) => {
            setItems(items.map(i => i.id === updated.id ? updated : i));
            setEditItem(null);
          }}
        />
      )}

      {/* Header */}
      <div className="relative pt-14 pb-10 px-6 overflow-hidden" style={{ backgroundColor: theme.colors.white }}>
        <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full opacity-10 blur-[80px]" style={{ backgroundColor: theme.colors.primary }} />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: theme.colors.secondary }}>
            Mon Panier
          </h1>
        </div>
      </div>

      {/* Items */}
      <div className="px-6 space-y-4">
        {items.length > 0 ? items.map((item) => (
          <div key={item.id} className="p-4 rounded-3xl border bg-white shadow-sm" style={{ borderColor: theme.colors.gray[100] }}>
            <div className="flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <img src={item.image} className="w-full h-full rounded-2xl object-cover" alt={item.name} />
                <div className="absolute -top-1.5 -left-1.5 text-white p-1.5 rounded-xl" style={{ backgroundColor: theme.colors.secondary }}>
                  {item.category === 'Voiture' ? <Car size={12} /> : <Home size={12} />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm" style={{ color: theme.colors.secondary, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {item.name}
                  </h3>
                  <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-1 text-gray-400 my-1.5">
                  <MapPin size={12} />
                  <span className="text-xs">{item.location}</span>
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded-lg">
                  <p className="text-[10px] text-gray-500 font-medium m-0">{item.details}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <p className="font-bold text-lg m-0" style={{ color: theme.colors.primary }}>
                {item.price.toLocaleString()} <span className="text-[10px]">FCFA</span>
              </p>
              <button
                onClick={() => setEditItem(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[11px] font-bold"
                style={{ color: theme.colors.secondary }}
              >
                <Edit3 size={12} /> Modifier
              </button>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center text-gray-400 font-medium">Votre panier est vide</div>
        )}
      </div>

      <div className="pb-[300px]">
        <Suggest />
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-[90px] left-4 right-4 p-5 bg-white/95 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-50 z-40">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 font-medium">Sous-total</span>
              <span className="font-bold" style={{ color: theme.colors.secondary }}>{total.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 font-medium">Frais</span>
              <span className="font-bold" style={{ color: theme.colors.secondary }}>{serviceFee.toLocaleString()} FCFA</span>
            </div>
            <div className="h-px bg-gray-100 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold" style={{ color: theme.colors.secondary }}>Total à payer</span>
              <span className="text-xl font-extrabold" style={{ color: theme.colors.primary }}>
                {(total + serviceFee).toLocaleString()} <small className="text-[10px]">FCFA</small>
              </span>
            </div>
          </div>
          <button
            onClick={() => setView('checkout')}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-95"
            style={{ backgroundColor: theme.colors.primary, color: 'white', boxShadow: `0 8px 20px ${theme.colors.primary}40` }}
          >
            Confirmer <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}