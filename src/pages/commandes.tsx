import { useState } from 'react';
import {
  Clock, CheckCircle2, XCircle, Package, RefreshCcw,
} from 'lucide-react';
import { OrderCard } from '../components/Commande/OrderCard';
import { OrderDetailsPopup } from '../components/Commande/OrderDetailsPopup';
import { Order, OrderStatus } from '../components/Commande/types';
import { theme } from '../theme';
import Suggest from '../components/suggest';

const initialOrders: Order[] = [
  {
    id: '#ORD-9921',
    date: 'Aujourd\'hui, 14:20',
    status: 'en_attente',
    total: 35000,
    productName: 'Toyota Corolla 2022',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
    location: 'Cocody, Abidjan',
    details: {
      startDate: '12 Avril 2026, 14:00',
      endDate: '14 Avril 2026, 12:00',
      duration: '2 jours',
      pricePerDay: 17500,
      description: 'Toyota Corolla 2022, automatique, climatisation, GPS intégré.',
      location: 'Cocody, Abidjan',
      seller: 'AutoPlus Location',
    },
    validationCode: '515993',
    rating: null,
    comment: null
  },
  {
    id: '#ORD-9915',
    date: 'Hier, 09:45',
    status: 'livre',
    total: 120000,
    productName: 'Villa avec piscine',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    location: 'Bingerville',
    details: {
      startDate: '15 Avril 2026, 15:00',
      endDate: '18 Avril 2026, 11:00',
      duration: '3 nuits',
      pricePerNight: 40000,
      description: 'Villa moderne avec piscine privée, 3 chambres avec salle de bain attitrée.',
      location: 'Bingerville, Abidjan',
      seller: 'ImmoLuxe',
    },
    rating: null,
    comment: null
  }
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'history'>('active');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const filteredOrders = orders.filter(o =>
    activeTab === 'active'
      ? (o.status === 'en_attente' || o.status === 'approuve')
      : (o.status === 'livre' || o.status === 'annule')
  );

  const getStatusConfig = (status: OrderStatus) => {
    switch(status) {
      case 'en_attente':
        return { label: 'Attente', color: theme.colors.primary, bg: theme.colors.primaryLight, icon: <Clock size={16} /> };
      case 'approuve':
        return { label: 'Approuvé', color: theme.colors.success, bg: theme.colors.successLight, icon: <CheckCircle2 size={16} /> };
      case 'livre':
        return { label: 'Livré', color: theme.colors.info, bg: theme.colors.infoLight, icon: <Package size={16} /> };
      case 'annule':
        return { label: 'Annulé', color: theme.colors.gray[500], bg: theme.colors.gray[100], icon: <XCircle size={16} /> };
      default:
        return { label: status, color: theme.colors.gray[500], bg: theme.colors.gray[100], icon: null };
    }
  };

  const handleCancel = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'annule' } : o));
  };

  const handleSubmitReview = () => {
    if (!selectedOrder) return;
    setOrders(prev => prev.map(o =>
      o.id === selectedOrder.id ? { ...o, rating, comment } : o
    ));
    setIsPopupOpen(false);
  };

  const openDetailsPopup = (order: Order) => {
    setSelectedOrder(order);
    setRating(order.rating || 0);
    setComment(order.comment || '');
    setIsPopupOpen(true);
  };

  return (
    <div className="min-h-screen pb-24" style={{
      backgroundColor: theme.colors.gray[50],
      fontFamily: theme.fonts.primary
    }}>
      {/* En-tête */}
      <div className="px-6" style={{ paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.sm }}>
        <h1 style={{
          fontSize: theme.fontSize['2xl'],
          fontWeight: 700,
          color: theme.colors.secondary,
          fontFamily: theme.fonts.heading
        }}>
          Mes Commandes
        </h1>
      </div>

      {/* Onglets */}
      <div className="px-6 mb-6 flex gap-2">
        {[
          { id: 'active', label: 'En cours', count: orders.filter(o => o.status === 'en_attente' || o.status === 'approuve').length },
          { id: 'history', label: 'Historique', count: orders.filter(o => o.status === 'livre' || o.status === 'annule').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? theme.colors.secondary : theme.colors.gray[100],
              color: activeTab === tab.id ? theme.colors.white : theme.colors.gray[600],
              fontWeight: 600,
              fontSize: theme.fontSize.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing.xs
            }}
          >
            {tab.label}
            <span style={{
              fontSize: theme.fontSize.xs,
              padding: `2px ${theme.spacing.xs}`,
              borderRadius: 8,
              backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : theme.colors.gray[200]
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Liste des commandes */}
      <div className="px-6 space-y-4">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            statusConfig={getStatusConfig(order.status)}
            onCancel={handleCancel}
            onDetails={openDetailsPopup}
            theme={theme}
          />
        )) : (
          <div style={{ padding: `${theme.spacing['2xl']} 0`, textAlign: 'center', color: theme.colors.gray[400] }}>
            <RefreshCcw size={40} style={{ display: 'block', margin: '0 auto 16px', color: theme.colors.gray[300] }} />
            <p>Aucune commande dans cette section</p>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <Suggest />

      {/* Popup de détails */}
      {isPopupOpen && selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          rating={rating}
          comment={comment}
          onClose={() => setIsPopupOpen(false)}
          onSubmitReview={handleSubmitReview}
          onRatingChange={setRating}
          onCommentChange={setComment}
          theme={theme}
        />
      )}
    </div>
  );
}