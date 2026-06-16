export type OrderStatus = 'en_attente' | 'approuve' | 'livre' | 'annule';

export interface OrderDetails {
  startDate: string;
  endDate: string;
  duration: string;
  pricePerDay?: number;
  price?: number;
  description: string;
  location: string;
  seller: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  productName: string;
  image: string;
  location: string;
  details: OrderDetails;
  validationCode?: string;
  rating: number | null;
  comment: string | null;
}

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  icon: JSX.Element | null;
}