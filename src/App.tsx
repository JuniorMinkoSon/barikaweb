import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, ShoppingBag, MapPin, Car } from 'lucide-react';

// Lazy loading all routes to ensure sub-2s load time on 3G (UX Rule #1)
const Home = lazy(() => import('./pages/Home'));
const ShopList = lazy(() => import('./pages/dropshipping/ShopList'));
const ReservationFlow = lazy(() => import('./pages/ReservationFlow'));
const CheckoutFlow = lazy(() => import('./pages/checkout/CheckoutFlow'));
const OrderTracking = lazy(() => import('./pages/tracking/OrderTracking'));
const ResidenceList = lazy(() => import('./pages/residences/ResidenceList'));
const ResidenceDetails = lazy(() => import('./pages/residences/ResidenceDetails'));
const CarList = lazy(() => import('./pages/transport/CarList'));
const CarDetails = lazy(() => import('./pages/transport/CarDetails'));
const RestaurantList = lazy(() => import('./pages/restaurants/RestaurantList'));
const MenuDetails = lazy(() => import('./pages/restaurants/MenuDetails'));
const Login = lazy(() => import('./pages/auth/Login'));
const OTPVerify = lazy(() => import('./pages/auth/OTPVerify'));
const ProviderRegister = lazy(() => import('./pages/provider/ProviderRegister'));
const ProviderDashboard = lazy(() => import('./pages/provider/ProviderDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UniversalList = lazy(() => import('./pages/UniversalList'));

// Simple loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="w-10 h-10 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin"></div>
  </div>
);

// Fixed Bottom Navigation
const BottomNav = () => {
  const location = useLocation();
  // Cart count logic should be dynamic, hardcoded to 1 to show the indicator for MVP.
  const cartItemCount = 1;

  const tabs = [
    { name: 'Accueil', path: '/', icon: HomeIcon },
    { name: 'Boutique', path: '/shop', icon: ShoppingBag },
    { name: 'Transport', path: '/cars', icon: Car },
    { name: 'Suivi', path: '/tracking', icon: MapPin },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe z-50 md:hidden">
      <div className="flex justify-around items-center h-16 max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link key={tab.path} to={tab.path} className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-900 relative">
              <Icon size={24} className={isActive ? 'text-blue-900' : ''} />
              
              {/* Persistent Cart Count indicator requested by UX rules */}
              {tab.name === 'Boutique' && cartItemCount > 0 && (
                <span className="absolute top-1 right-3 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
              
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-blue-900 font-bold' : ''}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};


import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      {/* Responsive container: full width on mobile, centered max-width on desktop */}
      <div className="bg-gray-50 min-h-screen relative font-sans shadow-sm w-full mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <div className="max-w-7xl mx-auto">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopList />} />
            <Route path="/reservation" element={<ReservationFlow />} />
            <Route path="/checkout" element={<CheckoutFlow />} />
            <Route path="/tracking" element={<OrderTracking />} />
            <Route path="/residences" element={<ResidenceList />} />
            <Route path="/residences/:id" element={<ResidenceDetails />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/:id" element={<MenuDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<OTPVerify />} />
            <Route path="/provider/register" element={<ProviderRegister />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/lingerie" element={<UniversalList />} />
            <Route path="/repairs" element={<UniversalList />} />
            <Route path="/energy" element={<UniversalList />} />
            <Route path="/chauffeurs" element={<UniversalList />} />
            <Route path="/delivery" element={<UniversalList />} />
            </Routes>
          </div>
        </Suspense>
        
        {/* Navigation is rendered globally. Fixed for mobile, hides on large screens where sidebar will live. */}
        <BottomNav />
      </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;