import Navbar from '../components/Navbar';
import StoriesRow from '../components/StoriesRow';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { 
  Home as IconHome, Car, Utensils,
  UserRound, Zap, Truck, Shirt, ShieldCheck, MapPin, Clock, Lock, ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import PromoCarousel from '../components/PromoCarousel';

export default function Home() {
  const { t } = useTranslation();

  const univers = [
    { id: 'residences', title: 'Résidences de Cocon', icon: IconHome, path: '/residences', img: '/images/affiches_residences.jpg', color: 'bg-orange-600', desc: 'Séjours de luxe & Cocons premium' },
    { id: 'chauffeurs', title: 'Chauffeurs Privés', icon: UserRound, path: '/chauffeurs', img: '/images/affiche_chauffeur_journee.jpg', color: 'bg-white/10', desc: 'Elite VTC & Chauffeurs de jour' },
    { id: 'cars', title: 'Location Prestige', icon: Car, path: '/cars', img: '/images/affiche_plusieurs_voitures.jpg', color: 'bg-orange-600', desc: 'Flotte flexible haut de gamme' },
    { id: 'energy', title: 'LocaEnergy 🔥', icon: Zap, path: '/energy', img: '/images/energy_delivery.png', color: 'bg-white/10', desc: 'Gaz, Carburant & Énergie 24/7' },
    { id: 'restaurants', title: 'Cuisine & Gastronomie', icon: Utensils, path: '/restaurants', img: '/images/plat_ivoirien.png', color: 'bg-white/10', desc: 'Cuisine locale & pro' },
    { id: 'blanchisserie', title: 'Blanchisserie Pro', icon: Shirt, path: '/lingerie', img: '/images/affiche_services.jpg', color: 'bg-orange-600', desc: 'Pressing & Entretien linge' },
    { id: 'depannage', title: 'Dépannage & Répa', icon: ShieldCheck, path: '/repairs', img: '/images/repairs_hero.png', color: 'bg-orange-600', desc: 'Diagnostics & Réparations pro' },
    { id: 'delivery', title: 'Coursiers Express', icon: Truck, path: '/delivery', img: '/images/livraison_express.png', color: 'bg-white/10', desc: 'Livraison urbaine garantie' },
  ];

  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    700: 2,
    500: 2
  };

  return (
    <div className="bg-[#000000] min-h-screen pb-32 text-white">
      <Navbar />
      
      <div className="max-w-[1920px] mx-auto overflow-hidden">
        <StoriesRow />

        {/* Hero Video Banner Pro - Full Screen Experience */}
        <div className="relative w-full h-[70vh] lg:h-[85vh] overflow-hidden bg-black group rounded-b-[60px] lg:rounded-b-[100px] border-b border-white/5 shadow-2xl">
          <video 
            autoPlay loop muted playsInline 
            className="absolute top-0 left-0 w-full h-full object-cover opacity-70 scale-105 group-hover:scale-100 transition-transform duration-[10s]"
          >
            <source src="/images/VIDEO_PRESENT.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-20 gap-6">
            <div className="bg-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full w-fit tracking-[0.2em] uppercase mb-2 orange-glow">
              L'Elite de la Côte d'Ivoire
            </div>
            <h1 className="text-6xl lg:text-[140px] font-black text-white leading-[0.9] italic tracking-tighter drop-shadow-2xl">
              VIVEZ LE <br/><span className="text-orange-600">COCON.</span>
            </h1>
            <p className="text-xl lg:text-3xl text-white/70 max-w-2xl font-medium leading-tight italic">
              Découvrez la Super-App qui redéfinit le service premium à Abidjan. <br className="hidden lg:block"/>
              Fluidité, Sécurité, Excellence.
            </p>
            <div className="flex flex-wrap items-center gap-5 mt-6">
              <Link to="/shop" className="bg-orange-600 text-white font-black py-5 px-14 rounded-full shadow-[0_0_40px_rgba(234,88,12,0.4)] transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 text-xl uppercase tracking-tighter flex items-center gap-2">
                Commencer <ArrowRight size={24} />
              </Link>
              <Link to="/shop" className="bg-white/5 hover:bg-white/10 backdrop-blur-3xl text-white font-bold py-5 px-10 rounded-full border border-white/10 transition-all text-lg uppercase italic tracking-tighter">
                Explorer les services
              </Link>
            </div>
          </div>
        </div>

        {/* Masonry Discovery Grid */}
        <div className="px-4 lg:px-20 -mt-20 relative z-20">
          
          <PromoCarousel />

          <div className="mb-14 flex items-end justify-between px-2">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none">DÉCOUVRIR</h2>
              <p className="text-orange-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">Sélection Privilege & Services Elite</p>
            </div>
          </div>

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {univers.map((uni) => {
              const Icon = uni.icon;
              return (
                <Link 
                   key={uni.id} 
                   to={uni.path} 
                   className="group block relative rounded-[40px] overflow-hidden bg-white/5 border border-white/10 hover:border-orange-600/50 hover:shadow-[0_0_50px_rgba(234,88,12,0.1)] transition-all duration-500"
                >
                   <div className="p-10 flex flex-col items-center text-center gap-8">
                      <div className={`w-20 h-20 ${uni.color} text-white rounded-[25px] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
                         <Icon size={40} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-white group-hover:text-orange-600 transition-colors italic tracking-tighter uppercase leading-none mb-3">{uni.title}</h3>
                         <p className="text-[10px] text-white/50 leading-relaxed uppercase font-bold tracking-widest">{uni.desc}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 text-orange-600">
                         <ArrowRight size={20} />
                      </div>
                   </div>
                </Link>
              );
            })}
          </Masonry>
        </div>

        {/* Section Livraison Express V2 - Purged of Image */}
        <div className="px-4 lg:px-20 py-24">
          <div className="bg-white/5 rounded-[60px] p-10 lg:p-24 border border-white/10 flex flex-col items-center text-center orange-glow">
            <div className="max-w-3xl">
              <div className="bg-orange-600/20 inline-flex items-center gap-2 px-4 py-2 rounded-full text-orange-600 font-black mb-8 uppercase text-[10px] tracking-widest border border-orange-600/20">
                <Truck size={14} /> ⚡ {t('common.express_delivery')}
              </div>
              <h2 className="text-6xl lg:text-[100px] font-black text-white italic mb-8 leading-none tracking-tighter">
                LE TEMPS <br/><span className="text-orange-600">S'ARRÊTE.</span>
              </h2>
              <p className="text-gray-400 text-xl lg:text-2xl mb-12 italic font-medium">Optimisez votre vie. On s'occupe du reste. Turbo ou Express, la promesse LocaConnecté.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div className="bg-white/5 p-10 rounded-[45px] border border-white/10 hover:border-orange-600/30 transition-all group">
                  <p className="text-4xl font-black text-orange-600 group-hover:scale-110 transition-transform italic">1500 F</p>
                  <p className="font-bold text-white mt-2 uppercase text-xs tracking-[0.2em]">Turbo 20 min</p>
                  <p className="text-[10px] text-gray-500 mt-2">Gaz, Food & LocaEnergy</p>
                </div>
                <div className="bg-white/5 p-10 rounded-[45px] border border-white/10 hover:border-white/20 transition-all">
                  <p className="text-4xl font-black text-white italic">600 F</p>
                  <p className="font-bold text-white/70 mt-2 uppercase text-xs tracking-[0.2em]">Express 2H</p>
                  <p className="text-[10px] text-gray-500 mt-2">Colis & Coursiers privés</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pourquoi LocaConnecté ? Section Educative Noir/Orange */}
        <div className="bg-white/5 border-y border-white/10 py-32 overflow-hidden relative">
          <div className="lg:px-20 px-6 relative z-10">
            <div className="max-w-3xl mb-24">
              <h2 className="text-5xl lg:text-8xl font-black italic mb-4 leading-none tracking-tighter">{t('common.why_locaconnecte')}</h2>
              <p className="text-orange-600 font-bold uppercase tracking-[0.4em] text-xs">Excellence & Sécurité</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Lock, color: 'text-orange-600', title: 'Escrow Séquestre', desc: 'Paiement bloqué jusqu\'à validation. Sécurité totale.' },
                { icon: MapPin, color: 'text-white', title: 'GPS Temps Réel', desc: 'Suivi millimétré de vos prestataires et livreurs.' },
                { icon: ShieldCheck, color: 'text-orange-600', title: 'Elite Vérifiée', desc: 'Contrôle physique rigoureux de chaque fournisseur.' },
                { icon: Clock, color: 'text-white', title: 'Garantie Chrono', desc: 'La ponctualité n\'est plus une option, c\'est un standard.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-white/5 backdrop-blur-3xl p-10 rounded-[45px] border border-white/10 hover:-translate-y-2 transition-all group">
                    <div className={`w-16 h-16 bg-[#000000] rounded-2xl flex items-center justify-center mb-8 border border-white/10 ${item.color} group-hover:bg-orange-600 group-hover:text-white transition-all`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="font-black text-2xl mb-4 italic uppercase tracking-tighter">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Section Cocon Premium - Purged of Image */}
        <div className="px-4 lg:px-20 py-32 text-center">
          <div className="bg-orange-600 rounded-[80px] p-20 lg:p-40 flex flex-col items-center shadow-[0_0_100px_rgba(234,88,12,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-black/5 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-4xl">
              <h2 className="text-6xl lg:text-[140px] font-black text-white italic mb-14 leading-[0.8] tracking-[-0.05em]">L'EXPÉRIENCE <br/>DU COCON.</h2>
              <p className="text-white/90 text-2xl lg:text-3xl leading-relaxed mb-16 italic font-medium">
                "Nous ne livrons pas seulement des services, nous créons du temps. <br className="hidden lg:block"/>
                La Super-App pensée pour l'élite ivoirienne."
              </p>
              <div className="flex justify-center gap-20">
                <div className="flex flex-col">
                  <span className="text-6xl lg:text-8xl font-black text-white">100%</span>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-2">Audit interne Pro</span>
                </div>
                <div className="w-px h-24 bg-white/20"></div>
                <div className="flex flex-col">
                  <span className="text-6xl lg:text-8xl font-black text-white">24/7</span>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-2">Ligne Prestige</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
