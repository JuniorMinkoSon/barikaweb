import { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, MapPin, Package, TrendingUp,
  Shield, MessageCircle, Heart, Award, Clock,
  CheckCircle,
} from 'lucide-react';
import { theme } from '../theme';
import type { Product } from '../productTypes';

// ─── THEME ────────────────────────────────────────────────────────────────────

const PRIMARY = theme.colors.primary;
const PRIMARY_HOVER = theme.colors.primaryHover;
const PRIMARY_LIGHT = '#FFF5F2';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
  location: string;
  memberSince: string;
  verified: boolean;
  rating: number;
  reviews: number;
  totalSales: number;
  responseTime: string;
  responseRate: number;
  badges: string[];
  bio: string;
  categories: string[];
}

interface SellerProfilePageProps {
  seller: Seller;
  products: Product[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ value, label, icon }: { value: string | number; label: string; icon: React.ReactNode }) {
  return (
    <div style={{
      flex: 1, minWidth: 110,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '20px 12px', borderRadius: 16,
      background: '#fff', border: '1px solid #f0ede8',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      <div style={{ color: PRIMARY }}>{icon}</div>
      <span style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.5px' }}>{value}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18, overflow: 'hidden',
        background: '#fff', border: '1px solid #f0ede8',
        cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 12px 36px rgba(0,0,0,0.10)' : '0 2px 10px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '4/3', background: '#f0ede8', overflow: 'hidden' }}>
        <img
          src={product.images[0]}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transition: 'transform 0.3s', transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(255,255,255,0.92)', border: 'none',
            borderRadius: '50%', width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={15} style={{ color: liked ? PRIMARY : '#aaa', fill: liked ? PRIMARY : 'none', transition: 'all 0.15s' }} />
        </button>
        <span style={{
          position: 'absolute', bottom: 10, left: 10,
          background: 'rgba(0,0,0,0.55)', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '3px 9px',
          borderRadius: 20, backdropFilter: 'blur(4px)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {product.category}
        </span>
        {product.images.length > 1 && (
          <span style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.45)', color: '#fff',
            fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
          }}>
            +{product.images.length - 1}
          </span>
        )}
      </div>

      <div style={{ padding: '14px 16px 18px' }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 6 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={11} style={{ color: i < Math.floor(product.rating) ? PRIMARY : '#e0e0e0', fill: i < Math.floor(product.rating) ? PRIMARY : '#e0e0e0' }} />
          ))}
          <span style={{ fontSize: 12, color: '#bbb', marginLeft: 3 }}>({product.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
          <MapPin size={11} color="#ccc" />
          <span style={{ fontSize: 12, color: '#bbb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: PRIMARY, letterSpacing: '-0.5px' }}>{product.price.toLocaleString('fr-FR')}</span>
          <span style={{ fontSize: 12, color: PRIMARY, fontWeight: 600 }}>FCFA</span>
          <span style={{ fontSize: 11, color: '#ccc', marginLeft: 2 }}>{product.unit}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function SellerProfilePage({ seller, products, onBack, onProductClick }: SellerProfilePageProps) {
  const [activeFilter, setActiveFilter] = useState<string>('Tous');
  const [followed, setFollowed] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  const allCategories = ['Tous', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = activeFilter === 'Tous' ? products : products.filter(p => p.category === activeFilter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');

        .sp-root { min-height: 100vh; background: #f7f5f2; font-family: 'DM Sans', sans-serif; }

        .sp-topbar {
          background: #fff; border-bottom: 1px solid #f0ede8;
          padding: 0 40px; display: flex; align-items: center;
          height: 60px; position: sticky; top: 0; z-index: 100;
        }

        .sp-hero {
          background: linear-gradient(135deg, #111111 0%, #262626 100%);
          padding: 56px 60px 60px; position: relative; overflow: hidden;
        }
        .sp-hero::before {
          content: ''; position: absolute; top: -100px; right: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: ${PRIMARY}; opacity: 0.07; pointer-events: none;
        }
        .sp-hero::after {
          content: ''; position: absolute; bottom: -80px; left: 38%;
          width: 260px; height: 260px; border-radius: 50%;
          background: ${PRIMARY}; opacity: 0.04; pointer-events: none;
        }

        .sp-stats { display: flex; gap: 14px; flex-wrap: wrap; padding: 28px 60px 0; }

        .sp-body { max-width: 1280px; margin: 0 auto; padding: 40px 60px 100px; }

        .sp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 20px; margin-top: 24px;
        }

        .sp-filter {
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: 13px; padding: 8px 18px; border-radius: 30px; transition: all 0.15s;
        }
        .sp-filter.active { background: ${PRIMARY}; color: #fff; box-shadow: 0 4px 14px ${PRIMARY}40; }
        .sp-filter:not(.active) { background: #fff; color: #666; border: 1.5px solid #e0e0e0; }
        .sp-filter:not(.active):hover { border-color: ${PRIMARY}; color: ${PRIMARY}; }

        .sp-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-weight: 700;
          font-size: 14px; cursor: pointer; border: none; transition: all 0.15s;
        }

        @media (max-width: 900px) {
          .sp-topbar { padding: 0 20px; }
          .sp-hero { padding: 36px 20px 40px; }
          .sp-stats { padding: 20px 20px 0; }
          .sp-body { padding: 28px 20px 80px; }
          .sp-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
        }
        @media (max-width: 480px) { .sp-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="sp-root">

        {/* ── TOPBAR ── */}
        <div className="sp-topbar">
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.secondary, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', padding: '6px 0' }}
            onMouseEnter={e => (e.currentTarget.style.color = PRIMARY)}
            onMouseLeave={e => (e.currentTarget.style.color = theme.colors.secondary)}
          >
            <ArrowLeft size={18} />
            Retour
          </button>
        </div>

        {/* ── HERO ── */}
        <div className="sp-hero">
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={seller.avatar} alt={seller.name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', display: 'block', border: '3px solid rgba(255,255,255,0.15)' }} />
              {seller.verified && (
                <div style={{ position: 'absolute', bottom: 3, right: 3, background: PRIMARY, borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid #111' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <h1 style={{ margin: 0, color: '#fff', fontSize: 30, fontWeight: 900, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.5px' }}>{seller.name}</h1>
                {seller.verified && (
                  <span style={{ background: `${PRIMARY}25`, color: PRIMARY, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.06em' }}>✓ VÉRIFIÉ</span>
                )}
              </div>
              <p style={{ margin: '0 0 14px', color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>{seller.tagline}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  <MapPin size={13} /><span>{seller.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  <Clock size={13} /><span>Membre depuis {seller.memberSince}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {seller.badges.map(badge => (
                  <span key={badge} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>
                    <Award size={10} />{badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, alignSelf: 'flex-start', flexWrap: 'wrap' }}>
              <button className="sp-btn" style={{ background: PRIMARY, color: '#fff' }}
                onMouseEnter={e => (e.currentTarget.style.background = PRIMARY_HOVER)}
                onMouseLeave={e => (e.currentTarget.style.background = PRIMARY)}
              >
                <MessageCircle size={16} />Contacter
              </button>
              <button className="sp-btn" onClick={() => setFollowed(f => !f)} style={{ background: followed ? `${PRIMARY}18` : 'rgba(255,255,255,0.08)', color: followed ? PRIMARY : '#fff', border: `1.5px solid ${followed ? PRIMARY : 'rgba(255,255,255,0.15)'}` }}>
                <Heart size={16} style={{ fill: followed ? PRIMARY : 'none' }} />
                {followed ? 'Suivi' : 'Suivre'}
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="sp-stats">
          <StatCard value={seller.totalSales.toLocaleString('fr-FR')} label="Ventes totales" icon={<TrendingUp size={20} />} />
          <StatCard value={`${seller.rating}/5`} label="Note moyenne" icon={<Star size={20} style={{ fill: PRIMARY, color: PRIMARY }} />} />
          <StatCard value={seller.reviews} label="Avis clients" icon={<MessageCircle size={20} />} />
          <StatCard value={`${seller.responseRate}%`} label="Taux de réponse" icon={<CheckCircle size={20} />} />
          <StatCard value={seller.responseTime} label="Temps de réponse" icon={<Clock size={20} />} />
          <StatCard value={products.length} label="Produits actifs" icon={<Package size={20} />} />
        </div>

        {/* ── BODY ── */}
        <div className="sp-body">

          {/* Bio */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', border: '1px solid #f0ede8', marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
            <div>
              <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#bbb', letterSpacing: '0.08em', textTransform: 'uppercase' }}>À propos</p>
              <p style={{ margin: 0, fontSize: 14, color: '#555', lineHeight: 1.85 }}>{seller.bio}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
              {seller.categories.map(cat => (
                <span key={cat} style={{ padding: '5px 14px', borderRadius: 20, background: PRIMARY_LIGHT, color: PRIMARY, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{cat}</span>
              ))}
            </div>
          </div>

          {/* Trust signals */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}>
            {[
              { icon: <Shield size={14} />, label: 'Paiements sécurisés' },
              { icon: <CheckCircle size={14} />, label: 'Produits vérifiés' },
              { icon: <Award size={14} />, label: 'Vendeur certifié' },
              { icon: <TrendingUp size={14} />, label: `${seller.responseRate}% de satisfaction` },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 30, background: '#fff', border: '1px solid #f0ede8', color: '#555', fontSize: 12, fontWeight: 600 }}>
                <span style={{ color: PRIMARY }}>{icon}</span>{label}
              </div>
            ))}
          </div>

          {/* Products header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#1a1a1a', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.3px' }}>Ses produits</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#999' }}>{filtered.length} produit{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {allCategories.map(cat => (
                <button key={cat} className={`sp-filter ${activeFilter === cat ? 'active' : ''}`} onClick={() => setActiveFilter(cat)}>{cat}</button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="sp-grid">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Package size={44} style={{ opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Aucun produit dans cette catégorie</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}