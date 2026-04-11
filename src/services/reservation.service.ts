import api from "./api";

export interface DiscoverPricingPayload {
  zone: string;
  basePrice: number;
}

export interface CreateReservationPayload {
  serviceId: string;
  clientId: string;
  zone: string;
  expectedPrice: number;
}

export const discoverPrice = async (params: DiscoverPricingPayload) => {
  const response = await api.get('/discovery/price', { params });
  return response.data;
};

export const createReservationRequest = async (payload: CreateReservationPayload) => {
  const response = await api.post('/reservations', payload);
  return response.data;
};

export const submitNegotiation = async (reservationId: string, negotiatedPrice: number) => {
  const response = await api.patch(`/reservations/${reservationId}/negotiate`, { negotiatedPrice });
  return response.data;
};

export const validateHandshakeOtp = async (reservationId: string, otpCode: string) => {
  const response = await api.post(`/reservations/${reservationId}/handshake`, { otpCode });
  return response.data;
};
