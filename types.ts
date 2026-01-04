export enum Category {
  FOOD = 'Makanan',
  DRINK = 'Minuman',
  SNACK = 'Cemilan',
  DESSERT = 'Penutup'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO String
  items: CartItem[];
  total: number;
  aiNote?: string;
}

export interface SalesMetric {
  date: string;
  amount: number;
}

export interface CategoryMetric {
  name: string;
  value: number;
}