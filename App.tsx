
import React, { useState } from 'react';
import POS from './components/POS.tsx';
import Dashboard from './components/Dashboard.tsx';
import ProductManager from './components/ProductManager.tsx';
import CategoryManager from './components/CategoryManager.tsx';
import InvoiceHistory from './components/InvoiceHistory.tsx';
import PeopleManager from './components/PeopleManager.tsx';
import SettingsManager from './components/SettingsManager.tsx';
import { Transaction, CartItem, ReceiptConfig, TaxServiceConfig, Product, ProductCategory, Customer, Supplier, User } from './types.ts';
import { MOCK_PRODUCTS, INITIAL_TRANSACTIONS, MOCK_CUSTOMERS, MOCK_SUPPLIERS, MOCK_USERS, MOCK_CATEGORIES } from './constants.ts';
import { 
  LayoutDashboard, 
  Store, 
  X, 
  Menu as MenuIcon,
  Box, 
  Layers, 
  FileText, 
  Users, 
  Settings,
  ChevronRight,
  Sparkles
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
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all duration-500 group ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 translate-x-1' 
          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={20} className={`${currentView === view ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
      <span className="font-bold text-xs uppercase tracking-[0.15em]">{label}</span>
      {currentView === view && <Sparkles size={12} className="ml-auto animate-pulse" />}
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
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[80] w-72 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 lg:translate-x-0 lg:static premium-shadow ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-28 flex items-center px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3">
              <Store className="text-white" size={22} />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-xl tracking-tighter leading-none italic block uppercase">WARUNG<span className="text-indigo-600">AI</span></span>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mt-1.5 block">PREMIUM RETAIL</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 w-full px-4 space-y-1.5 overflow-y-auto no-scrollbar pt-4">
          <NavItem view="pos" icon={Store} label="POS System" />
          <NavItem view="dashboard" icon={LayoutDashboard} label="Insight AI" />
          <NavItem view="invoices" icon={FileText} label="Riwayat" />
          
          <div className="pt-10 pb-4 text-[9px] font-black text-slate-300 px-6 uppercase tracking-[0.5em]">Inventory</div>
          <NavItem view="products" icon={Box} label="Katalog" />
          <NavItem view="categories" icon={Layers} label="Kategori" />
          
          <div className="pt-10 pb-4 text-[9px] font-black text-slate-300 px-6 uppercase tracking-[0.5em]">Network</div>
          <NavItem view="customers" icon={Users} label="Pelanggan" />
          <NavItem view="suppliers" icon={Store} label="Supplier" />
          
          <div className="pt-10 pb-4 text-[9px] font-black text-slate-300 px-6 uppercase tracking-[0.5em]">Control</div>
          <NavItem view="settings" icon={Settings} label="System" />
        </nav>

        <div className="p-6">
          <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden border-2 border-indigo-100">
               <img src="https://picsum.photos/id/64/100/100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-extrabold text-slate-900 truncate">ADMIN UTAMA</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-24 bg-white/50 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 shrink-0 z-40">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(true)} className="p-3 text-slate-500 hover:text-indigo-600 bg-slate-50 rounded-2xl lg:hidden transition-all">
                <MenuIcon size={22} />
              </button>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 uppercase tracking-tighter italic">{currentView.replace('-', ' ')}</h1>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">Live Console Cloud Sync</p>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-900 uppercase italic">Outlet Sudirman</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Session: 08:45 AM</p>
               </div>
               <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>
               <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:shadow-lg transition-all">
                  <Sparkles size={18} />
               </button>
            </div>
        </header>

        <div className="flex-1 overflow-auto no-scrollbar">
          {renderContent()}
        </div>
      </main>

      {/* Modal Kwitansi */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-sm w-full overflow-hidden p-10 font-mono text-[11px] animate-in zoom-in duration-500">
            <div className="text-center border-b-2 border-dashed border-slate-100 pb-8 mb-8">
                <div className="w-16 h-16 bg-indigo-50 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                   <Sparkles className="text-indigo-600" size={32} />
                </div>
                <h3 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">{receiptConfig.storeName}</h3>
                <p className="text-slate-400 mt-2 uppercase text-[9px] tracking-widest font-bold">INV #{lastTransaction.id}</p>
            </div>
            
            <div className="space-y-4 mb-10">
                {lastTransaction.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4">
                        <div className="flex flex-col flex-1">
                            <span className="font-bold text-slate-900 uppercase text-[10px]">{item.name} {item.selectedVariant ? `(${item.selectedVariant.name})` : ''}</span>
                            <span className="text-[9px] text-slate-400 font-bold mt-1">{item.quantity} UNIT x Rp {item.price.toLocaleString('id-ID')}</span>
                        </div>
                        <span className="font-black text-slate-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                ))}
                
                <div className="border-t-2 border-dashed border-slate-100 pt-6 mt-6 space-y-2">
                    <div className="flex justify-between text-slate-400 font-bold">
                        <span>SUBTOTAL</span>
                        <span>Rp {(lastTransaction.total - (lastTransaction.taxAmount || 0)).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-bold">
                        <span>PAJAK (11%)</span>
                        <span>Rp {(lastTransaction.taxAmount || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-black text-xl text-indigo-600 uppercase italic pt-4">
                        <span>GRAND TOTAL</span>
                        <span>Rp {lastTransaction.total.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl mb-8">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Sparkles size={10} className="text-indigo-500" /> AI Greeting
               </p>
               <p className="text-slate-700 italic leading-relaxed text-[10px] font-medium">{lastTransaction.aiNote}</p>
            </div>

            <button onClick={() => setShowReceipt(false)} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200 active:scale-[0.98] transition-all">CETAK & TUTUP</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
