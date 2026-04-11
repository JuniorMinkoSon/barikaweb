import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Clock, ChefHat } from 'lucide-react';
import Footer from '../../components/Footer';

const mockRestaurants = [
  {
    id: 1,
    name: 'Le Nid d\'Abidjan',
    category: 'Local',
    rating: 4.8,
    reviews: 124,
    deliveryTime: '30-45 min',
    deliveryFee: 1000,
    minOrder: 5000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    tags: ['Garba', 'Alloco', 'Poulet Braisé']
  },
  {
    id: 2,
    name: 'Burger Imperial',
    category: 'Fast Food',
    rating: 4.5,
    reviews: 89,
    deliveryTime: '20-30 min',
    deliveryFee: 500,
    minOrder: 2000,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
    tags: ['Burgers', 'Frites', 'Sodas']
  },
  {
    id: 3,
    name: 'Kyoto Sushi Bar',
    category: 'Asiatique',
    rating: 4.9,
    reviews: 210,
    deliveryTime: '40-55 min',
    deliveryFee: 1500,
    minOrder: 10000,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
    tags: ['Sushi', 'Maki', 'Japonais']
  }
];

const categories = ['Tous', 'Local', 'Fast Food', 'Asiatique', 'Healthy'];

export default function RestaurantList() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filtered = activeCategory === 'Tous' 
    ? mockRestaurants 
    : mockRestaurants.filter(r => r.category === activeCategory);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurants</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Plat, restaurant, cuisine..." 
            className="w-full bg-gray-100 pl-10 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
          />
        </div>

        {/* Categories (Horizontal Scroll) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
                activeCategory === cat 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant List */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(restaurant => (
          <div 
            key={restaurant.id} 
            onClick={() => navigate(`/restaurants/${restaurant.id}`)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
          >
            {/* Image */}
            <div className="h-40 w-full relative">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star size={12} className="text-orange-500 fill-orange-500" />
                <span className="text-xs font-bold text-gray-900">{restaurant.rating}</span>
                <span className="text-xs text-gray-500">({restaurant.reviews})</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-lg font-bold text-gray-900">{restaurant.name}</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">{restaurant.tags.join(' • ')}</p>
              
              <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-blue-900" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat size={14} className="text-blue-900" />
                  <span>Livraison {restaurant.deliveryFee}F</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
