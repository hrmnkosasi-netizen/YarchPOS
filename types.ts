export const POS_MODULE_INIT = true;

export interface ProductVariant {
  name: string;
  price: number;
  stock: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  parentId?: string | null;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  date: string;
  variants?: ProductVariant[];
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  aiNote?: string;
  customerName?: string;
  outletId?: string;
  paymentMethod?: string;
  taxAmount?: number;
  serviceAmount?: number;
}

// Settings Interfaces
export interface Outlet {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'Cash' | 'E-Wallet' | 'Transfer' | 'Card';
  isActive: boolean;
}

export interface TaxServiceConfig {
  taxPercentage: number;
  servicePercentage: number;
  isTaxEnabled: boolean;
  isServiceEnabled: boolean;
}

export interface ReceiptConfig {
  storeName: string;
  headerText: string;
  footerText: string;
  qrCodeText: string;
  address: string;
  instagram: string;
  website: string;
  showLogo: boolean;
  showSocialMedia: boolean;
  showQRCode: boolean;
  logoUrl?: string;
}

// Interfaces for People/Entities
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  points: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Cashier' | 'Manager';
  email: string;
}