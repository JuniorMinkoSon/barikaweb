import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { formatFCFA } from '../../utils/formatters';
import { MapPin, User, Fuel, Star, Zap } from 'lucide-react';

const mockCars = [
  {
    id: 'c1',
    name: 'Range Rover Evoque',
    type: 'SUV LUXE',
    price: 80000,
    driver: 'Ahmed',
    rating: 4.9,
    thumb: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80'
  },
  {
    id: 'c2',
    name: 'Toyota Yaris 2022',
    type: 'STANDARD',
    price: 25000,
    driver: 'Koffi',
    rating: 4.7,
    thumb: 'https://images.unsplash.com/photo-1554580218-c290a071c3e3?w=400&q=80'
  }
];

export default function CarList() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <Navbar />
      
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">Véhicules & Chauffeurs</h1>
        <p className="text-sm text-gray-500 mb-6">Suivi GPS et paiement protégé.</p>
        
        {/* Filtres Rapides */}
        <div className="flex gap-2 overflow-x-auto pb-4 snap-x hide-scrollbar">
          <button className="bg-stone-800 text-white px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap snap-start">Tous</button>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap snap-start">Standard</button>
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap snap-start">VIP / Luxe</button>
        </div>

        {/* Grille responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockCars.map(car => (
            <Link key={car.id} to={`/cars/${car.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="relative">
                <img src={car.thumb} alt={car.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute top-3 left-3 bg-stone-800 px-2 py-1 rounded-md text-[10px] font-bold text-white tracking-widest uppercase">
                  {car.type}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-gray-800 shadow-sm">
                  <Star size={12} className="text-orange-500 fill-orange-500" /> {car.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-lg text-gray-900 line-clamp-1">{car.name}</h2>
                  <p className="font-extrabold text-orange-500 text-sm whitespace-nowrap ml-2">{formatFCFA(car.price)}<span className="text-xs text-gray-400 font-normal">/jour</span></p>
                </div>
                {/* Chauffeur pricing badge */}
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="bg-blue-50 text-blue-900 text-[10px] font-bold px-2 py-1 rounded-full">+10 000F Chauffeur (Abidjan)</span>
                  <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full">+13 000F Hors Abidjan</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><User size={14} /> Chauffeur {car.driver}</span>
                  <span className="flex items-center gap-1"><Fuel size={14} /> Hybride</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
