import { Category, Product, Transaction } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    price: 25000,
    category: Category.FOOD,
    image: 'https://picsum.photos/id/225/300/300',
    date: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    price: 20000,
    category: Category.FOOD,
    image: 'https://picsum.photos/id/292/300/300',
    date: '2024-01-16T09:30:00Z'
  },
  {
    id: '3',
    name: 'Es Kopi Susu Gula Aren',
    price: 18000,
    category: Category.DRINK,
    image: 'https://picsum.photos/id/425/300/300',
    date: '2024-02-01T10:00:00Z'
  },
  {
    id: '4',
    name: 'Teh Manis Dingin',
    price: 8000,
    category: Category.DRINK,
    image: 'https://picsum.photos/id/439/300/300',
    date: '2024-02-02T11:15:00Z'
  },
  {
    id: '5',
    name: 'Pisang Bakar Keju',
    price: 15000,
    category: Category.SNACK,
    image: 'https://picsum.photos/id/102/300/300',
    date: '2024-02-10T14:00:00Z'
  },
  {
    id: '6',
    name: 'Kentang Goreng',
    price: 12000,
    category: Category.SNACK,
    image: 'https://picsum.photos/id/486/300/300',
    date: '2024-02-12T15:30:00Z'
  },
  {
    id: '7',
    name: 'Sate Ayam Madura',
    price: 30000,
    category: Category.FOOD,
    image: 'https://picsum.photos/id/493/300/300',
    date: '2024-03-01T17:00:00Z'
  },
  {
    id: '8',
    name: 'Jus Alpukat',
    price: 15000,
    category: Category.DRINK,
    image: 'https://picsum.photos/id/1080/300/300',
    date: '2024-03-05T12:00:00Z'
  },
  {
    id: '9',
    name: 'Brownies Coklat',
    price: 10000,
    category: Category.DESSERT,
    image: 'https://picsum.photos/id/299/300/300',
    date: '2024-03-10T13:45:00Z'
  }
];

// Generate some fake history for the dashboard
export const INITIAL_TRANSACTIONS: Transaction[] = Array.from({ length: 20 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (i % 7)); // Spread over last 7 days
  
  return {
    id: `tr-${1000 + i}`,
    date: date.toISOString(),
    items: [],
    total: 50000 + Math.floor(Math.random() * 100000),
    aiNote: "Transaksi berhasil."
  };
}).reverse();