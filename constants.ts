import { Product, Transaction, ProductCategory, Customer, Supplier, User } from './types';

// Categories with Hierarchy
export const MOCK_CATEGORIES: ProductCategory[] = [
  { id: 'cat-1', name: 'Makanan', parentId: null },
  { id: 'cat-2', name: 'Minuman', parentId: null },
  { id: 'cat-3', name: 'Makanan Berat', parentId: 'cat-1' },
  { id: 'cat-4', name: 'Cemilan', parentId: 'cat-1' },
  { id: 'cat-5', name: 'Kopi', parentId: 'cat-2' },
  { id: 'cat-6', name: 'Non-Kopi', parentId: 'cat-2' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    price: 25000,
    category: 'Makanan Berat',
    image: 'https://picsum.photos/id/225/300/300',
    date: '2024-01-15T08:00:00Z',
    variants: [
        { name: 'Pedas', price: 25000, stock: 10 },
        { name: 'Tidak Pedas', price: 25000, stock: 15 }
    ]
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    price: 20000,
    category: 'Makanan Berat',
    image: 'https://picsum.photos/id/292/300/300',
    date: '2024-01-16T09:30:00Z'
  },
  {
    id: '3',
    name: 'Es Kopi Susu Gula Aren',
    price: 18000,
    category: 'Kopi',
    image: 'https://picsum.photos/id/425/300/300',
    date: '2024-02-01T10:00:00Z',
    variants: [
        { name: 'Regular', price: 18000, stock: 50 },
        { name: 'Large', price: 22000, stock: 30 }
    ]
  },
  {
    id: '4',
    name: 'Teh Manis Dingin',
    price: 8000,
    category: 'Non-Kopi',
    image: 'https://picsum.photos/id/439/300/300',
    date: '2024-02-02T11:15:00Z'
  },
  {
    id: '5',
    name: 'Pisang Bakar Keju',
    price: 15000,
    category: 'Cemilan',
    image: 'https://picsum.photos/id/102/300/300',
    date: '2024-02-10T14:00:00Z'
  },
  {
    id: '6',
    name: 'Kentang Goreng',
    price: 12000,
    category: 'Cemilan',
    image: 'https://picsum.photos/id/486/300/300',
    date: '2024-02-12T15:30:00Z'
  },
  {
    id: '7',
    name: 'Sate Ayam Madura',
    price: 30000,
    category: 'Makanan Berat',
    image: 'https://picsum.photos/id/493/300/300',
    date: '2024-03-01T17:00:00Z'
  },
  {
    id: '8',
    name: 'Jus Alpukat',
    price: 15000,
    category: 'Non-Kopi',
    image: 'https://picsum.photos/id/1080/300/300',
    date: '2024-03-05T12:00:00Z'
  },
  {
    id: '9',
    name: 'Brownies Coklat',
    price: 10000,
    category: 'Cemilan',
    image: 'https://picsum.photos/id/299/300/300',
    date: '2024-03-10T13:45:00Z'
  }
];

// Generate some fake history for the dashboard
export const INITIAL_TRANSACTIONS: Transaction[] = Array.from({ length: 20 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (i % 7)); // Spread over last 7 days
  
  return {
    id: `INV-${1000 + i}`,
    date: date.toISOString(),
    items: [],
    total: 50000 + Math.floor(Math.random() * 100000),
    aiNote: "Transaksi berhasil.",
    customerName: i % 3 === 0 ? "Budi Santoso" : "Umum"
  };
}).reverse();

export const MOCK_CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'Budi Santoso', phone: '08123456789', points: 150, email: 'budi@example.com' },
    { id: 'c2', name: 'Siti Aminah', phone: '08987654321', points: 50, email: 'siti@example.com' },
    { id: 'c3', name: 'Joko Widodo', phone: '08567891234', points: 320 },
];

export const MOCK_SUPPLIERS: Supplier[] = [
    { id: 's1', name: 'PT. Pangan Sejahtera', contactPerson: 'Pak Harto', phone: '021-555666', address: 'Jl. Raya Bogor No. 1' },
    { id: 's2', name: 'CV. Sayur Segar', contactPerson: 'Bu Sri', phone: '0811223344', address: 'Pasar Induk Kramat Jati' },
];

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Admin Utama', role: 'Admin', email: 'admin@warung.com' },
    { id: 'u2', name: 'Kasir Pagi', role: 'Cashier', email: 'kasir1@warung.com' },
    { id: 'u3', name: 'Manajer Operasional', role: 'Manager', email: 'manager@warung.com' },
];