export type UserRole = 'customer' | 'seller';

export type ModalType =
  | 'none'
  | 'authBeforeEdit'
  | 'editInfo'
  | 'logout'
  | 'askChangePass'
  | 'inputTempPass'
  | 'inputNewPass'
  | 'successPass'
  | 'becomeSellerInfo'
  | 'becomeSellerPending';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  id: string;
}

export interface FAQItem {
  q: string;
  a: string;
}