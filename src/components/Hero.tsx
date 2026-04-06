// Hero.tsx
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Tag, Zap } from 'lucide-react';
import { theme } from '../theme';

const slides = [
  {
    id: 1,
    type: 'promo',
    badge: 'OFFRE SPÉCIALE',
    badgeIcon: Tag,
    title: '-30% sur toutes les résidences',
    subtitle: 'Ce week-end seulement — Abidjan & environs',
    cta: "Profiter de l'offre",
    bg: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 60%, #C44A22 100%)`,
    accentColor: '#fff',
    badgeBg: 'rgba(255,255,255,0.18)',
    badgeBorder: 'rgba(255,255,255,0.35)',
  },
  {
    id: 2,
    type: 'video',
    badge: 'NOUVEAUTÉ',
    badgeIcon: Play,
    title: 'ConnectPro passe en vidéo',
    subtitle: 'Visitez les prestataires en live avant de réserver',
    cta: 'Voir les previews',
    bg: `linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.gray[800]} 60%, ${theme.colors.gray[700]} 100%)`,
    accentColor: theme.colors.primary,
    badgeBg: `${theme.colors.primary}28`,
    badgeBorder: `${theme.colors.primary}55`,
  },
  {
    id: 3,
    type: 'flash',
    badge: 'FLASH DEAL',
    badgeIcon: Zap,
    title: 'Voitures dès 15 000 FCFA/jour',
    subtitle: 'Les meilleures offres à Cocody & Plateau',
    cta: 'Voir les voitures',
    bg: `linear-gradient(135deg, #0D3B2E 0%, #1B5E45 60%, #256B4F 100%)`,
    accentColor: '#5ECFA1',
    badgeBg: 'rgba(94,207,161,0.18)',
    badgeBorder: 'rgba(94,207,161,0.4)',
  },
];

function Deco({ color }: { color: string }) {
  return (
    <svg
      className="absolute right-0 top-0 bottom-0 h-full opacity-10 pointer-events-none"
      viewBox="0 0 300 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMaxYMid slice"
    >
      <circle cx="260" cy="50" r="140" fill={color} />
      <circle cx="200" cy="220" r="90" fill={color} />
      <rect x="100" y="10" width="80" height="80" rx="20" fill={color} transform="rotate(25 140 50)" />
    </svg>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = () => setCurrent(c => (c + 1) % slides.length);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!paused) {
      timerRef.current = setInterval(next, 5000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, current]);

  const slide = slides[current];
  const BadgeIcon = slide.badgeIcon;

  return (
    <div className="px-4 pt-4 bg-white font-['DM_Sans']">
      <div
        className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden h-[220px] sm:h-[280px] flex items-end transition-all duration-700 ease-in-out shadow-lg"
        style={{ background: slide.bg }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Deco color="#fff" />

        {/* Contenu principal */}
        <div className="relative z-10 p-6 sm:p-10 w-full max-w-2xl animate-in fade-in slide-in-from-left-4 duration-500">
          
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-3"
            style={{
              background: slide.badgeBg,
              border: `1px solid ${slide.badgeBorder}`,
              color: slide.accentColor,
            }}
          >
            <BadgeIcon size={10} strokeWidth={3} />
            {slide.badge}
          </div>

          {/* Texte - Correction de la taille et de l'étirement */}
          <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight mb-2 tracking-tight">
            {slide.title}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mb-5 font-medium max-w-[80%]">
            {slide.subtitle}
          </p>

          {/* Bouton CTA */}
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white rounded-full text-xs sm:text-sm font-bold text-slate-900 shadow-xl shadow-black/10 active:scale-95 transition-transform">
            {slide.type === 'video' && (
              <Play size={12} className="fill-slate-900" />
            )}
            {slide.cta}
          </button>
        </div>

        {/* Navigation - Flèches (cachées sur mobile, visibles au hover/desktop) */}
        <div className="hidden sm:block">
            <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors"
                onClick={prev}
            >
                <ChevronLeft size={20} />
            </button>
            <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors"
                onClick={next}
            >
                <ChevronRight size={20} />
            </button>
        </div>

        {/* Indicateurs (Dots) */}
        <div className="absolute bottom-6 right-6 flex gap-1.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        {/* Barre de progression style Story */}
        {!paused && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10 z-30 overflow-hidden">
            <div 
              key={current}
              className="h-full bg-white/40 animate-[hero-progress_5s_linear_forwards]"
            />
          </div>
        )}
      </div>

      {/* Tailwind Animation Keyframe (à ajouter dans tailwind.config.js ou via <style>) */}
      <style>{`
        @keyframes hero-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}