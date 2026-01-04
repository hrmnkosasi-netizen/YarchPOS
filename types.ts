export enum Category {
  FOOD = 'Makanan',
  DRINK = 'Minuman',
  SNACK = 'Cemilan',
  DESSERT = 'Penutup'
}

export interface ProductVariant {
  name: string;
  price: number;
  stock: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  parentId?: string | null; // Untuk kategori bertingkat
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // Changed from enum to string to support dynamic categories
  image: string;
  date: string;
  variants?: ProductVariant[]; // Varian produk
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Transaction {
  id: string;
  date: string; // ISO String
  items: CartItem[];
  total: number;
  aiNote?: string;
  customerName?: string;
}

export interface SalesMetric {
  date: string;
  amount: number;
}

export interface CategoryMetric {
  name: string;
  value: number;
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