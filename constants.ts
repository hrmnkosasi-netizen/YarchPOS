import { Product, Transaction, ProductCategory, Customer, Supplier, User, Outlet, PaymentMethod } from './types';

export const MOCK_OUTLETS: Outlet[] = [
  { id: 'ot-1', name: 'Toko Retail Sudirman', address: 'Jl. Jend. Sudirman No. 45, Jakarta Pusat', phone: '021-123456', email: 'sudirman@tokoretai.com' },
  { id: 'ot-2', name: 'Toko Retail Kemang', address: 'Jl. Kemang Raya No. 12, Jakarta Selatan', phone: '021-654321', email: 'kemang@tokoretail.com' }
];

export const MOCK_PAYMENTS: PaymentMethod[] = [
  { id: 'p1', name: 'Tunai (Cash)', type: 'Cash', isActive: true },
  { id: 'p2', name: 'QRIS (Gopay/OVO)', type: 'E-Wallet', isActive: true },
  { id: 'p3', name: 'Transfer Bank BCA', type: 'Transfer', isActive: true },
  { id: 'p4', name: 'Kartu Kredit/Debit', type: 'Card', isActive: false },
];

export const MOCK_CATEGORIES: ProductCategory[] = [
  { id: 'cat-retail-1', name: 'Pakaian Anak', parentId: null },
  { id: 'cat-retail-2', name: 'Pakaian Dewasa', parentId: null },
  { id: 'cat-retail-3', name: 'Kebutuhan Pokok', parentId: null },
  { id: 'cat-retail-4', name: 'Elektronik', parentId: null },
  { id: 'cat-1', name: 'Makanan & Minuman', parentId: null },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'retail-1',
    name: 'Celana Dalam Anak-anak (Pack isi 3)',
    price: 45000,
    category: 'Pakaian Anak',
    image: 'https://images.unsplash.com/photo-1519270841-4704336049a4?q=80&w=300&h=300&auto=format&fit=crop',
    date: '2024-03-20T08:00:00Z',
    variants: [
        { name: 'Size S (Kuning/Biru)', price: 45000, stock: 20 },
        { name: 'Size M (Motif Hewan)', price: 47500, stock: 15 },
        { name: 'Size L (Polos Mix)', price: 50000, stock: 10 }
    ],
    stock: 45
  },
  {
    id: 'retail-2',
    name: 'Kaos Kaki Karakter Anak',
    price: 12500,
    category: 'Pakaian Anak',
    image: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?q=80&w=300&h=300&auto=format&fit=crop',
    date: '2024-03-21T09:00:00Z',
    stock: 100
  },
  {
    id: 'food-1',
    name: 'Nasi Goreng Spesial',
    price: 25000,
    category: 'Makanan & Minuman',
    image: 'https://picsum.photos/id/225/300/300',
    date: '2024-01-15T08:00:00Z',
    variants: [
        { name: 'Pedas', price: 25000, stock: 10 },
        { name: 'Tidak Pedas', price: 25000, stock: 15 }
    ]
  },
  {
    id: 'drink-1',
    name: 'Es Kopi Susu Aren',
    price: 18000,
    category: 'Makanan & Minuman',
    image: 'https://picsum.photos/id/425/300/300',
    date: '2024-02-01T10:00:00Z',
    variants: [
        { name: 'Regular', price: 18000, stock: 50 },
        { name: 'Large', price: 22000, stock: 30 }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = Array.from({ length: 20 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (i % 7));
  
  return {
    id: `INV-${1000 + i}`,
    date: date.toISOString(),
    items: [],
    total: 50000 + Math.floor(Math.random() * 100000),
    aiNote: "Transaksi retail berhasil.",
    customerName: i % 3 === 0 ? "Budi Santoso" : "Umum"
  };
}).reverse();

export const MOCK_CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'Budi Santoso', phone: '08123456789', points: 150, email: 'budi@example.com' },
    { id: 'c2', name: 'Siti Aminah', phone: '08987654321', points: 50, email: 'siti@example.com' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
    { id: 's1', name: 'Grosir Pakaian Jaya', contactPerson: 'Pak Harto', phone: '021-555666', address: 'Blok A Tanah Abang, Jakarta' },
];

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Owner Toko', role: 'Admin', email: 'owner@tokoretail.com' },
];