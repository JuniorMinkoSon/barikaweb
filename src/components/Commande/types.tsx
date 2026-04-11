export type OrderStatus = 
  | 'EN_COURS'     // Client request
  | 'PROPOSITION'  // Provider counter-offer
  | 'ACCEPTE'      // Client accepted, waiting payment
  | 'PAYE'         // Money in escrow
  | 'DEMARRE'      // Service in progress
  | 'TERMINE'      // Finished
  | 'ANNULE'       // Cancelled
  | 'LITIGE';      // Ongoing dispute

export interface Order {
  id: string;
  listingId: string;
  listing_title: string;
  image_url: string;
  status: OrderStatus;
  base_price: number;
  negotiated_price?: number;
  check_in: string;
  check_out: string;
  zone: string;
  otp_code: string;
  provider_name?: string;
  provider_phone?: string;
  created_at: string;
}

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  icon: JSX.Element;
}