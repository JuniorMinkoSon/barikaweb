import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, MapPin, Star, Heart, ChevronLeft, ChevronRight, Shield, Truck, X, MessageCircle, ExternalLink, Package, ThumbsUp, Clock, BadgeCheck } from 'lucide-react';
import { theme } from '../theme';
import type { Product } from '../productTypes';
import type { Seller } from './Sellerprofilepage';

const PRIMARY = theme.colors.primary;
const PRIMARY_HOVER = theme.colors.primaryHover;
const PRIMARY_LIGHT = '#FFF5F2';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#888', margin: '0 0 10px' }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#f0f0f0' }} />;
}

function OptionButton({ label, selected, disabled = false, onClick }: { label: string; selected: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{ padding: '8px 18px', borderRadius: 9, border: `1.5px solid ${selected ? PRIMARY : disabled ? '#e0e0e0' : '#d0d0d0'}`, background: selected ? PRIMARY_LIGHT : disabled ? '#f5f5f5' : '#fff', color: selected ? PRIMARY : disabled ? '#bbb' : '#444', fontSize: 14, fontWeight: selected ? 700 : 400, cursor: disabled ? 'not-allowed' : 'pointer', textDecoration: disabled ? 'line-through' : 'none', opacity: disabled ? 0.6 : 1, transition: 'all 0.15s', fontFamily: 'inherit' }}>
      {label}
    </button>
  );
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const goTo = useCallback((idx: number) => { setFading(true); setTimeout(() => { setActiveIdx(idx); setFading(false); }, 160); }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#f0ede8', aspectRatio: '4/3' }}>
        <img src={images[activeIdx]} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: fading ? 0 : 1, transition: 'opacity 0.16s' }} />
        {images.length > 1 && (
          <>
            <button onClick={() => goTo((activeIdx - 1 + images.length) % images.length)} style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}><ChevronLeft size={18} /></button>
            <button onClick={() => goTo((activeIdx + 1) % images.length)} style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}><ChevronRight size={18} /></button>
            <span style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>{activeIdx + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 10 }}>
          {images.map((src, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ flex: 1, aspectRatio: '1', borderRadius: 12, overflow: 'hidden', border: `2.5px solid ${i === activeIdx ? PRIMARY : 'transparent'}`, padding: 0, cursor: 'pointer', background: 'none', transition: 'border-color 0.15s' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VetementOptions({ product }: { product: Extract<Product, { category: 'Vêtements' }> }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].hex);
  const [selectedSize, setSelectedSize] = useState('M');
  return (
    <>
      <div>
        <SectionLabel>Couleur — {product.colors.find(c => c.hex === selectedColor)?.label}</SectionLabel>
        <div style={{ display: 'flex', gap: 10 }}>
          {product.colors.map(c => <button key={c.hex} onClick={() => setSelectedColor(c.hex)} title={c.label} style={{ width: 28, height: 28, borderRadius: '50%', background: c.hex, border: 'none', cursor: 'pointer', outline: selectedColor === c.hex ? `3px solid ${PRIMARY}` : '2px solid transparent', outlineOffset: 2, transition: 'outline 0.15s' }} />)}
        </div>
      </div>
      <div>
        <SectionLabel>Taille</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {product.sizes.map(s => <OptionButton key={s} label={s} selected={selectedSize === s} disabled={product.unavailableSizes?.includes(s)} onClick={() => setSelectedSize(s)} />)}
        </div>
        {(product.unavailableSizes?.length ?? 0) > 0 && <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>{product.unavailableSizes?.join(', ')} épuisé(s) · <span style={{ color: PRIMARY, cursor: 'pointer', textDecoration: 'underline' }}>Guide des tailles</span></p>}
      </div>
    </>
  );
}

function ChaussureOptions({ product }: { product: Extract<Product, { category: 'Chaussures' }> }) {
  const [selectedPointure, setSelectedPointure] = useState(38);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].hex);
  return (
    <>
      <div>
        <SectionLabel>Pointure (EU)</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {product.pointures.map(p => <OptionButton key={p} label={String(p)} selected={selectedPointure === p} disabled={product.unavailablePointures?.includes(p)} onClick={() => setSelectedPointure(p)} />)}
        </div>
      </div>
      <div>
        <SectionLabel>Couleur — {product.colors.find(c => c.hex === selectedColor)?.label}</SectionLabel>
        <div style={{ display: 'flex', gap: 10 }}>
          {product.colors.map(c => <button key={c.hex} onClick={() => setSelectedColor(c.hex)} title={c.label} style={{ width: 28, height: 28, borderRadius: '50%', background: c.hex, border: 'none', cursor: 'pointer', outline: selectedColor === c.hex ? `3px solid ${PRIMARY}` : '2px solid transparent', outlineOffset: 2, transition: 'outline 0.15s' }} />)}
        </div>
      </div>
    </>
  );
}

function VoitureOptions({ product }: { product: Extract<Product, { category: 'Voiture' }> }) {
  const [selectedDuree, setSelectedDuree] = useState(product.durees[0]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const toggle = (opt: string) => setSelectedOptions(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  return (
    <>
      <div><SectionLabel>Durée de location</SectionLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{product.durees.map(d => <OptionButton key={d} label={d} selected={selectedDuree === d} onClick={() => setSelectedDuree(d)} />)}</div></div>
      <div><SectionLabel>Options supplémentaires</SectionLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{product.options.map(opt => <OptionButton key={opt} label={opt} selected={selectedOptions.includes(opt)} onClick={() => toggle(opt)} />)}</div></div>
    </>
  );
}

function ResidenceOptions({ product }: { product: Extract<Product, { category: 'Résidence' }> }) {
  const [selectedSejour, setSelectedSejour] = useState(product.sejours[1] ?? product.sejours[0]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const toggle = (s: string) => setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  return (
    <>
      <div><SectionLabel>Durée du séjour</SectionLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{product.sejours.map(s => <OptionButton key={s} label={s} selected={selectedSejour === s} onClick={() => setSelectedSejour(s)} />)}</div></div>
      <div><SectionLabel>Services à la carte</SectionLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{product.services.map(s => <OptionButton key={s} label={s} selected={selectedServices.includes(s)} onClick={() => toggle(s)} />)}</div></div>
    </>
  );
}

function CoachingOptions({ product }: { product: Extract<Product, { category: 'Coaching' }> }) {
  const [selectedFormat, setSelectedFormat] = useState(product.formats[0]);
  const [selectedSession, setSelectedSession] = useState(0);
  return (
    <>
      <div><SectionLabel>Format</SectionLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{product.formats.map(f => <OptionButton key={f} label={f} selected={selectedFormat === f} onClick={() => setSelectedFormat(f)} />)}</div></div>
      <div>
        <SectionLabel>Prochaines disponibilités</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {product.sessions.map((session, idx) => (
            <button key={idx} onClick={() => setSelectedSession(idx)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${selectedSession === idx ? PRIMARY : '#e0e0e0'}`, background: selectedSession === idx ? PRIMARY_LIGHT : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>{session.date} · {session.time}</p>
                <p style={{ fontSize: 12, color: '#888', margin: '3px 0 0' }}>{session.mode} · {session.duration}</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: session.spotsLeft ? '#c0392b' : '#2E7D52', flexShrink: 0, marginLeft: 12 }}>{session.spotsLeft ? `${session.spotsLeft} place restante` : 'Disponible'}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function MaterielOptions({ product }: { product: Extract<Product, { category: 'Matériel' }> }) {
  const [selectedDuree, setSelectedDuree] = useState(product.durees[0]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const toggle = (opt: string) => setSelectedOptions(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  return (
    <>
      <div><SectionLabel>Durée de location</SectionLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{product.durees.map(d => <OptionButton key={d} label={d} selected={selectedDuree === d} onClick={() => setSelectedDuree(d)} />)}</div></div>
      {product.options.length > 0 && <div><SectionLabel>Options</SectionLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{product.options.map(opt => <OptionButton key={opt} label={opt} selected={selectedOptions.includes(opt)} onClick={() => toggle(opt)} />)}</div></div>}
    </>
  );
}

function ExperienceOptions({ product }: { product: Extract<Product, { category: 'Expérience' }> }) {
  const [selectedDuree, setSelectedDuree] = useState(product.durees[0]);
  return (
    <>
      <div><SectionLabel>Durée</SectionLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{product.durees.map(d => <OptionButton key={d} label={d} selected={selectedDuree === d} onClick={() => setSelectedDuree(d)} />)}</div></div>
      <div>
        <SectionLabel>Inclus dans l'expérience</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {product.inclus.map(item => <span key={item} style={{ padding: '7px 14px', borderRadius: 9, background: '#f0faf5', color: '#2E7D52', border: '1.5px solid #c3e8d5', fontSize: 13, fontWeight: 600 }}>✓ {item}</span>)}
        </div>
      </div>
    </>
  );
}

function ProductOptions({ product }: { product: Product }) {
  switch (product.category) {
    case 'Vêtements':  return <VetementOptions product={product} />;
    case 'Chaussures': return <ChaussureOptions product={product} />;
    case 'Voiture':    return <VoitureOptions product={product} />;
    case 'Résidence':  return <ResidenceOptions product={product} />;
    case 'Coaching':   return <CoachingOptions product={product} />;
    case 'Matériel':   return <MaterielOptions product={product} />;
    case 'Expérience': return <ExperienceOptions product={product} />;
    default:           return null;
  }
}

// ─── SELLER CARD (compact, in product page) ──────────────────────────────────

function SellerCard({ seller, onOpen }: { seller: Seller; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 18px', borderRadius: 16,
        border: `1.5px solid ${hovered ? PRIMARY : '#f0ede8'}`,
        background: hovered ? PRIMARY_LIGHT : '#fdfcfb',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 4px 20px rgba(232,113,74,0.10)' : 'none',
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={seller.avatar} alt={seller.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', display: 'block', border: '2px solid #f0ede8' }} />
        {seller.verified && (
          <div style={{ position: 'absolute', bottom: 1, right: 1, background: PRIMARY, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>{seller.name}</span>
          {seller.verified && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', background: PRIMARY_LIGHT, color: PRIMARY, borderRadius: 20, letterSpacing: '0.04em' }}>VÉRIFIÉ</span>}
        </div>
        <p style={{ margin: '0 0 6px', fontSize: 12, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{seller.tagline}</p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>{seller.rating} <span style={{ color: '#bbb', fontWeight: 400 }}>({seller.reviews})</span></span>
          <span style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>{seller.totalSales.toLocaleString('fr-FR')} ventes</span>
          <span style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>Rép. {seller.responseTime}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: hovered ? PRIMARY : '#aaa', fontWeight: 600, transition: 'color 0.15s' }}>Voir profil</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={hovered ? PRIMARY : '#ccc'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.15s' }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

// ─── SELLER PROFILE PANEL (slide-in drawer) ───────────────────────────────────

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} style={{ color: i < Math.floor(rating) ? PRIMARY : '#e0e0e0', fill: i < Math.floor(rating) ? PRIMARY : '#e0e0e0' }} />
      ))}
    </div>
  );
}

function StatPill({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div style={{ flex: 1, minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 10px', borderRadius: 14, background: '#fdfcfb', border: '1.5px solid #f0ede8' }}>
      <div style={{ color: PRIMARY }}>{icon}</div>
      <span style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, color: '#999', textAlign: 'center', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

interface SellerProfilePanelProps {
  seller: Seller;
  open: boolean;
  onClose: () => void;
  onFullProfile: () => void;
}

function SellerProfilePanel({ seller, open, onClose, onFullProfile }: SellerProfilePanelProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Mock recent reviews for the panel
  const mockReviews = [
    { author: 'Koffi A.', rating: 5, text: 'Excellent service, très professionnel et réactif. Je recommande vivement !', date: 'Il y a 3 jours' },
    { author: 'Marie T.', rating: 5, text: 'Livraison rapide, produit conforme à la description. Parfait !', date: 'Il y a 1 semaine' },
    { author: 'Ibrahim S.', rating: 4, text: 'Bonne qualité, communication agréable. Reviendrai avec plaisir.', date: 'Il y a 2 semaines' },
  ];

  // Mock recent listings
  const mockListings = [
    { name: 'Service Premium', price: '45 000 FCFA', badge: 'Populaire' },
    { name: 'Formule Essentielle', price: '22 000 FCFA', badge: null },
    { name: 'Pack Découverte', price: '12 500 FCFA', badge: 'Nouveau' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(3px)',
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(480px, 100vw)',
        background: '#fff',
        zIndex: 201,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 48px rgba(0,0,0,0.12)',
        overflowY: 'auto',
      }}>

        {/* ── HEADER ── */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Profil du vendeur</span>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── IDENTITY ── */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={seller.avatar} alt={seller.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${PRIMARY_LIGHT}`, display: 'block' }} />
              {seller.verified && (
                <div style={{ position: 'absolute', bottom: 2, right: 2, background: PRIMARY, borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #fff' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', margin: 0 }}>{seller.name}</h2>
                {seller.verified && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, padding: '3px 10px', background: PRIMARY_LIGHT, color: PRIMARY, borderRadius: 20, letterSpacing: '0.04em' }}>
                    <BadgeCheck size={11} /> VÉRIFIÉ
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#888', margin: '0 0 8px', lineHeight: 1.5 }}>{seller.tagline}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <StarRating rating={seller.rating} size={13} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{seller.rating}</span>
                <span style={{ fontSize: 12, color: '#aaa' }}>({seller.reviews} avis)</span>
              </div>
            </div>
          </div>

          {/* ── STATS ── */}
          <div style={{ display: 'flex', gap: 10 }}>
            <StatPill icon={<Package size={18} />} value={seller.totalSales.toLocaleString('fr-FR')} label="Ventes" />
            <StatPill icon={<ThumbsUp size={18} />} value={`${seller.rating * 20}%`} label="Satisfaction" />
            <StatPill icon={<Clock size={18} />} value={seller.responseTime} label="Réponse" />
          </div>

          {/* ── BIO / DESCRIPTION ── */}
          {seller.bio && (
            <div style={{ padding: '16px 18px', borderRadius: 14, background: '#fafaf8', border: '1px solid #f0ede8' }}>
              <SectionLabel>À propos</SectionLabel>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75, margin: 0 }}>{seller.bio}</p>
            </div>
          )}

          {/* ── BADGES ── */}
          {seller.badges && seller.badges.length > 0 && (
            <div>
              <SectionLabel>Distinctions</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {seller.badges.map((badge: string) => (
                  <span key={badge} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, padding: '6px 13px', borderRadius: 20, background: '#fff8f0', color: '#c0700a', border: '1.5px solid #fde8c8' }}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── RECENT LISTINGS ── */}
          <div>
            <SectionLabel>Autres annonces du vendeur</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockListings.map(listing => (
                <div key={listing.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #f0ede8', background: '#fdfcfb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIMARY, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{listing.name}</span>
                    {listing.badge && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: PRIMARY_LIGHT, color: PRIMARY }}>{listing.badge}</span>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: PRIMARY, flexShrink: 0 }}>{listing.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RECENT REVIEWS ── */}
          <div>
            <SectionLabel>Avis récents</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockReviews.map((review, idx) => (
                <div key={idx} style={{ padding: '14px 16px', borderRadius: 14, background: '#fafaf8', border: '1px solid #f0ede8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${idx * 60 + 20}, 60%, 88%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: `hsl(${idx * 60 + 20}, 50%, 35%)` }}>
                        {review.author[0]}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{review.author}</span>
                    </div>
                    <StarRating rating={review.rating} size={11} />
                  </div>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: '0 0 6px' }}>{review.text}</p>
                  <span style={{ fontSize: 11, color: '#bbb' }}>{review.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
            <button
              onClick={onFullProfile}
              style={{ width: '100%', padding: '14px', borderRadius: 13, border: 'none', background: PRIMARY, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = PRIMARY_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.background = PRIMARY)}
            >
              <ExternalLink size={16} /> Voir le profil complet
            </button>
            <button
              style={{ width: '100%', padding: '14px', borderRadius: 13, border: `1.5px solid ${PRIMARY}`, background: PRIMARY_LIGHT, color: PRIMARY, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}
            >
              <MessageCircle size={16} /> Contacter le vendeur
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: `translateX(-50%) translateY(${visible ? 0 : 100}px)`, background: '#1a1a1a', color: '#fff', padding: '14px 28px', borderRadius: 14, fontSize: 14, fontWeight: 600, transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)', zIndex: 9999, whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
      ✓ {message}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

interface ProductDetailPageProps {
  product: Product;
  seller: Seller | null;
  onBack: () => void;
  onSellerClick: () => void;
}

export default function ProductDetailPage({ product, seller, onBack, onSellerClick }: ProductDetailPageProps) {
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [toast, setToast] = useState(false);
  const [sellerPanelOpen, setSellerPanelOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSellerPanelOpen(false);
      if (e.key === 'Backspace' && (e.altKey || e.metaKey)) onBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBack]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const handleOrder = () => { setToast(true); setTimeout(() => setToast(false), 3200); };

  const starsEl = Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={15} style={{ color: i < Math.floor(product.rating) ? PRIMARY : '#e0e0e0', fill: i < Math.floor(product.rating) ? PRIMARY : '#e0e0e0' }} />
  ));

  return (
    <>
      <style>{`
        .detail-root { display: flex; flex-direction: column; min-height: 100vh; background: ${theme.colors.gray[50]}; }
        .detail-topbar { background: #fff; border-bottom: 1px solid ${theme.colors.gray[100]}; padding: 0 40px; display: flex; align-items: center; height: 60px; position: sticky; top: 0; z-index: 100; }
        .detail-body { flex: 1; display: grid; grid-template-columns: 1fr 1fr; width: 100%; }
        .detail-col-left { padding: 40px 48px 80px; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; background: #f7f5f2; border-right: 1px solid ${theme.colors.gray[100]}; }
        .detail-col-right { padding: 40px 56px 120px; overflow-y: auto; background: #fff; display: flex; flex-direction: column; gap: 24px; }
        @media (max-width: 900px) {
          .detail-body { grid-template-columns: 1fr; }
          .detail-col-left { position: static; height: auto; padding: 28px 20px 0; border-right: none; border-bottom: 1px solid ${theme.colors.gray[100]}; }
          .detail-col-right { padding: 28px 20px 100px; }
          .detail-topbar { padding: 0 20px; }
        }
      `}</style>

      <div className="detail-root">

        <div className="detail-topbar">
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.secondary, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', padding: '6px 0' }}
            onMouseEnter={e => (e.currentTarget.style.color = PRIMARY)}
            onMouseLeave={e => (e.currentTarget.style.color = theme.colors.secondary)}
          >
            <ArrowLeft size={18} />Retour aux produits
          </button>
          <div style={{ marginLeft: 24, display: 'flex', alignItems: 'center', gap: 8, color: theme.colors.gray[400], fontSize: 13 }}>
            <span style={{ color: theme.colors.gray[300] }}>·</span>
            <span>{product.category}</span>
            <span style={{ color: theme.colors.gray[300] }}>·</span>
            <span style={{ color: theme.colors.secondary, fontWeight: 600, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
          </div>
        </div>

        <div className="detail-body">

          <div className="detail-col-left">
            <Gallery images={product.images} name={product.name} />
          </div>

          <div className="detail-col-right">

            <div>
              <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, background: PRIMARY_LIGHT, color: PRIMARY, marginBottom: 12 }}>{product.category}</span>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: theme.colors.secondary, lineHeight: 1.3, margin: 0 }}>{product.name}</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 2 }}>{starsEl}</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{product.rating}</span>
                <span style={{ fontSize: 13, color: '#888' }}>({product.reviews} avis)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={14} color="#888" />
                <span style={{ fontSize: 13, color: '#888' }}>{product.location}</span>
              </div>
            </div>

            <div style={{ padding: '18px 24px', borderRadius: 14, background: PRIMARY_LIGHT, border: `1px solid ${PRIMARY}20`, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: PRIMARY, letterSpacing: '-1px' }}>{product.price.toLocaleString('fr-FR')}</span>
              <span style={{ fontSize: 16, color: PRIMARY, fontWeight: 600 }}>FCFA</span>
              <span style={{ fontSize: 14, color: '#c0836a' }}>{product.unit}</span>
            </div>

            {product.description && <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, margin: 0 }}>{product.description}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {product.tags.map(tag => <span key={tag} style={{ fontSize: 12, padding: '4px 11px', borderRadius: 20, background: '#f5f5f0', color: '#666', border: '1px solid #e8e8e8' }}>{tag}</span>)}
            </div>

            <Divider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <ProductOptions product={product} />
            </div>

            <Divider />

            {/* ── PRESTATAIRE ── */}
            {seller && (
              <div>
                <SectionLabel>Prestataire</SectionLabel>
                {/* Compact card — opens panel on click */}
                <SellerCard seller={seller} onOpen={() => setSellerPanelOpen(true)} />
              </div>
            )}

            <Divider />

            <div>
              <SectionLabel>Quantité</SectionLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={qtyBtn}>−</button>
                <span style={{ fontSize: 17, fontWeight: 800, minWidth: 32, textAlign: 'center', color: '#1a1a1a' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={qtyBtn}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleOrder} onMouseEnter={e => (e.currentTarget.style.background = PRIMARY_HOVER)} onMouseLeave={e => (e.currentTarget.style.background = PRIMARY)} style={{ flex: 1, padding: '16px', borderRadius: 13, border: 'none', background: PRIMARY, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.02em', transition: 'background 0.15s', fontFamily: 'inherit' }}>
                Commander
              </button>
              <button onClick={() => setLiked(l => !l)} style={{ padding: '16px 20px', borderRadius: 13, border: `1.5px solid ${liked ? PRIMARY : '#e0e0e0'}`, background: liked ? PRIMARY_LIGHT : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                <Heart size={20} style={{ color: liked ? PRIMARY : '#aaa', fill: liked ? PRIMARY : 'none', transition: 'all 0.15s' }} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
              {[{ icon: <Shield size={14} />, label: 'Paiement sécurisé' }, { icon: <Truck size={14} />, label: 'Livraison disponible' }].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#999', fontSize: 12 }}>{icon}<span>{label}</span></div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── SELLER PROFILE DRAWER ── */}
      {seller && (
        <SellerProfilePanel
          seller={seller}
          open={sellerPanelOpen}
          onClose={() => setSellerPanelOpen(false)}
          onFullProfile={() => { setSellerPanelOpen(false); onSellerClick(); }}
        />
      )}

      <Toast message="Commande confirmée ! Vous serez contacté." visible={toast} />
    </>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 38, height: 38, borderRadius: 9, border: '1.5px solid #d0d0d0', background: '#fff',
  cursor: 'pointer', fontSize: 20, fontWeight: 500, display: 'flex', alignItems: 'center',
  justifyContent: 'center', color: '#1a1a1a', fontFamily: 'inherit', transition: 'border-color 0.15s',
};