import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Car, Utensils, Shirt, Sparkles, Waves, Zap, Truck, ShieldCheck, 
  UserRound, Instagram, Facebook, Twitter, Phone, Mail, MapPin, Shield, Lock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UNIVERS = [
  { label: 'Résidences', path: '/residences', icon: Home },
  { label: 'Chauffeurs', path: '/chauffeurs', icon: UserRound },
  { label: 'Voitures', path: '/cars', icon: Car },
  { label: 'Restaurants', path: '/restaurants', icon: Utensils },
  { label: 'Vêtements', path: '/clothes', icon: Shirt },
  { label: 'Lingerie', path: '/lingerie', icon: Sparkles },
  { label: 'Ménagères', path: '/cleaners', icon: Waves },
  { label: 'LocaEnergy', path: '/energy', icon: Zap },
  { label: 'Pressing', path: '/repairs', icon: ShieldCheck },
  { label: 'Livraison', path: '/delivery', icon: Truck },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-black mb-1">Devenez Prestataire</h2>
            <p className="text-blue-200 text-sm">Inscription gratuite · Paiement garanti Escrow · 0 frais sans vente</p>
          </div>
          <Link 
            to="/provider/register"
            className="bg-orange-500 hover:bg-orange-600 text-white font-black py-3 px-8 rounded-full text-sm transition-all hover:scale-105 shadow-lg shadow-orange-500/30 whitespace-nowrap flex-shrink-0"
          >
            Rejoindre LocaConnecté →
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-black text-lg shadow-lg">
                L
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Loca<span className="text-orange-500">Connecté</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              La Super-App ivoirienne pour tous vos besoins. Résidences, transport, énergie, restauration — tout en un seul endroit.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a 
                  key={label} href={href}
                  className="w-9 h-9 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nos Univers */}
          <div>
            <h3 className="font-black uppercase tracking-widest text-xs text-gray-500 mb-5">Nos Univers</h3>
            <ul className="space-y-2.5">
              {UNIVERS.slice(0, 5).map(({ label, path, icon: Icon }) => (
                <li key={path}>
                  <Link to={path} className="flex items-center gap-2 text-gray-400 hover:text-orange-400 text-sm font-medium transition-colors group">
                    <Icon size={13} className="flex-shrink-0 group-hover:text-orange-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-black uppercase tracking-widest text-xs text-gray-500 mb-5">Plus de Services</h3>
            <ul className="space-y-2.5">
              {UNIVERS.slice(5).map(({ label, path, icon: Icon }) => (
                <li key={path}>
                  <Link to={path} className="flex items-center gap-2 text-gray-400 hover:text-orange-400 text-sm font-medium transition-colors group">
                    <Icon size={13} className="flex-shrink-0 group-hover:text-orange-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Sécurité */}
          <div>
            <h3 className="font-black uppercase tracking-widest text-xs text-gray-500 mb-5">Contact</h3>
            <ul className="space-y-3 mb-7">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={14} className="flex-shrink-0 text-orange-400" />
                <span>+225 07 00 00 00 00</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={14} className="flex-shrink-0 text-orange-400" />
                <span>support@locaconnecte.ci</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={14} className="flex-shrink-0 text-orange-400 mt-0.5" />
                <span>Plateau, Abidjan<br/>Côte d'Ivoire 🇨🇮</span>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <Lock size={14} className="text-green-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 font-medium">Paiement Escrow Sécurisé</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <Shield size={14} className="text-blue-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 font-medium">Fournisseurs Vérifiés</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © {year} <strong className="text-gray-400">CEI LocaConnecté</strong> · Tous droits réservés · Abidjan, Côte d'Ivoire
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Confidentialité</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">CGU</Link>
            <span>·</span>
            <Link to="/provider/register" className="hover:text-orange-400 font-bold text-orange-500 transition-colors">Devenir Prestataire</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
