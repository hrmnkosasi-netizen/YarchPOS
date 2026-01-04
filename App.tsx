import React, { useState } from 'react';
import POS from './components/POS';
import Dashboard from './components/Dashboard';
import ProductManager from './components/ProductManager';
import CategoryManager from './components/CategoryManager';
import InvoiceHistory from './components/InvoiceHistory';
import PeopleManager from './components/PeopleManager';
import SettingsManager from './components/SettingsManager';
import { Transaction, CartItem, ReceiptConfig, TaxServiceConfig, Product, ProductCategory, Customer, Supplier, User } from './types';
import { MOCK_PRODUCTS, INITIAL_TRANSACTIONS, MOCK_CUSTOMERS, MOCK_SUPPLIERS, MOCK_USERS, MOCK_CATEGORIES } from './constants';
import { 
  LayoutDashboard, 
  Store, 
  X, 
  CheckCircle, 
  Menu as MenuIcon,
  Box, 
  Layers, 
  FileText, 
  Users, 
  Settings,
  ChevronRight
} from 'lucide-react';

type ViewType = 'pos' | 'dashboard' | 'products' | 'categories' | 'invoices' | 'customers' | 'suppliers' | 'users' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('pos');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<ProductCategory[]>(MOCK_CATEGORIES);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [taxConfig, setTaxConfig] = useState<TaxServiceConfig>({
    taxPercentage: 11,
    servicePercentage: 5,
    isTaxEnabled: true,
    isServiceEnabled: false
  });
  
  const [receiptConfig, setReceiptConfig] = useState<ReceiptConfig>({
    storeName: 'WARUNG PINTAR AI',
    headerText: 'Terima Kasih Telah Berkunjung!',
    footerText: 'Silahkan datang kembali.',
    qrCodeText: 'Scan untuk feedback',
    address: 'Jl. Jend. Sudirman No. 45, Jakarta Pusat',
    instagram: '@warungpintar.ai',
    website: 'warung.ai',
    showLogo: true,
    showSocialMedia: true,
    showQRCode: true,
    logoUrl: undefined
  });

  const handleCheckoutComplete = (items: CartItem[], total: number, aiNote: string) => {
    const taxAmount = taxConfig.isTaxEnabled ? (total * taxConfig.taxPercentage / 100) : 0;
    const serviceAmount = taxConfig.isServiceEnabled ? (total * taxConfig.servicePercentage / 100) : 0;
    const grandTotal = total + taxAmount + serviceAmount;

    const newTransaction: Transaction = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items,
      total: grandTotal,
      taxAmount,
      serviceAmount,
      aiNote,
      customerName: "Umum",
      paymentMethod: "Cash"
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setLastTransaction(newTransaction);
    setShowReceipt(true);
  };

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewType; icon: any; label: string }) => (
    <button
      onClick={() => navigateTo(view)}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50/50' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={18} className="shrink-0" />
      <span className="font-black text-[10px] uppercase tracking-[0.2em] truncate">{label}</span>
      {currentView === view && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'pos': return <POS products={products} categories={categories} onCheckoutComplete={handleCheckoutComplete} taxConfig={taxConfig} />;
      case 'dashboard': return <Dashboard transactions={transactions} />;
      case 'products': return <ProductManager products={products} categories={categories} onAdd={(p) => setProducts([p, ...products])} onDelete={(id) => setProducts(products.filter(p => p.id !== id))} />;
      case 'categories': return <CategoryManager categories={categories} onAdd={(c) => setCategories([...categories, c])} />;
      case 'invoices': return <InvoiceHistory transactions={transactions} />;
      case 'customers': return <PeopleManager type="customer" data={customers} onAdd={(p) => setCustomers([p, ...customers])} />;
      case 'suppliers': return <PeopleManager type="supplier" data={suppliers} onAdd={(p) => setSuppliers([p, ...suppliers])} />;
      case 'users': return <PeopleManager type="user" data={users} onAdd={(p) => setUsers([p, ...users])} />;
      case 'settings': return <SettingsManager receiptConfig={receiptConfig} setReceiptConfig={setReceiptConfig} taxConfig={taxConfig} setTaxConfig={setTaxConfig} />;
      default: return <POS products={products} categories={categories} onCheckoutComplete={handleCheckoutComplete} taxConfig={taxConfig} />;
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[70] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-[80] w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-500 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-24 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-indigo-200">
              <Store className="text-white" size={24} />
            </div>
            <div className="ml-3 flex flex-col">
              <span className="font-black text-gray-900 text-xl tracking-tighter leading-none italic uppercase">Warung<span className="text-indigo-600">AI</span></span>
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">Professional POS</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 w-full p-6 space-y-2 overflow-y-auto no-scrollbar">
          <NavItem view="pos" icon={Store} label="Kasir (POS)" />
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="invoices" icon={FileText} label="Transaksi" />
          <div className="pt-8 pb-3 text-[8px] font-black text-gray-300 px-4 uppercase tracking-[0.4em]">Master Data</div>
          <NavItem view="products" icon={Box} label="Menu" />
          <NavItem view="categories" icon={Layers} label="Kategori" />
          <NavItem view="customers" icon={Users} label="Pelanggan" />
          <NavItem view="suppliers" icon={Store} label="Pemasok" />
          <NavItem view="users" icon={Users} label="Staf" />
          <div className="pt-8 pb-3 text-[8px] font-black text-gray-300 px-4 uppercase tracking-[0.4em]">Sistem</div>
          <NavItem view="settings" icon={Settings} label="Pengaturan" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white lg:bg-gray-50/20">
        <header className="h-20 lg:h-24 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 shrink-0 z-40">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-3 text-gray-900 bg-gray-50 rounded-2xl lg:hidden">
                <MenuIcon size={20} />
              </button>
              <div>
                <h1 className="text-base lg:text-lg font-black text-gray-900 uppercase tracking-tighter italic">{currentView.replace('-', ' ')}</h1>
                <p className="text-[8px] lg:text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">Management Console</p>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 overflow-hidden border-2 border-white shadow-xl shadow-indigo-100 ring-1 ring-gray-100">
                <img src="https://picsum.photos/id/64/100/100" alt="User" className="w-full h-full object-cover" />
            </div>
        </header>
        <div className="flex-1 overflow-auto no-scrollbar">{renderContent()}</div>
      </main>

      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] shadow-2xl max-w-sm w-full overflow-hidden p-10 font-mono text-[11px]">
            <div className="text-center border-b-2 border-dashed border-gray-100 pb-6 mb-6">
                <h3 className="text-2xl font-black italic uppercase text-indigo-600">{receiptConfig.storeName}</h3>
                <p className="text-gray-400 mt-1 uppercase text-[9px]">{lastTransaction.id}</p>
            </div>
            <div className="space-y-3 mb-8">
                {lastTransaction.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="font-black text-gray-900 uppercase">{item.name} {item.selectedVariant ? `(${item.selectedVariant.name})` : ''}</span>
                            <span className="text-[9px] text-gray-400 font-bold">{item.quantity} x Rp{item.price.toLocaleString('id-ID')}</span>
                        </div>
                        <span className="font-black text-gray-900">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                ))}
                <div className="border-t-2 border-dashed border-gray-100 pt-6 mt-6 flex justify-between font-black text-lg text-indigo-600 uppercase italic">
                    <span>Total</span>
                    <span>Rp{lastTransaction.total.toLocaleString('id-ID')}</span>
                </div>
            </div>
            <button onClick={() => setShowReceipt(false)} className="w-full bg-gray-900 text-white py-5 rounded-[1.75rem] font-black uppercase text-[10px] tracking-widest">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;