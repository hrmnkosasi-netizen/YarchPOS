import React, { useState } from 'react';
import POS from './components/POS.tsx';
import Dashboard from './components/Dashboard.tsx';
import ProductManager from './components/ProductManager.tsx';
import CategoryManager from './components/CategoryManager.tsx';
import InvoiceHistory from './components/InvoiceHistory.tsx';
import PeopleManager from './components/PeopleManager.tsx';
import SettingsManager from './components/SettingsManager.tsx';
import { Transaction, CartItem, ReceiptConfig, TaxServiceConfig, Product, Customer, Supplier, User } from './types.ts';
import { MOCK_PRODUCTS, INITIAL_TRANSACTIONS, MOCK_CUSTOMERS, MOCK_SUPPLIERS, MOCK_USERS } from './constants.ts';
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
    footerText: 'Silahkan datang kembali. Simpan struk ini sebagai bukti pembayaran sah.',
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

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleAddPerson = (type: string, person: any) => {
    if (type === 'customer') setCustomers(prev => [person, ...prev]);
    if (type === 'supplier') setSuppliers(prev => [person, ...prev]);
    if (type === 'user') setUsers(prev => [person, ...prev]);
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
      case 'pos': return <POS products={products} onCheckoutComplete={handleCheckoutComplete} taxConfig={taxConfig} />;
      case 'dashboard': return <Dashboard transactions={transactions} />;
      case 'products': return <ProductManager products={products} onAdd={handleAddProduct} onDelete={handleDeleteProduct} />;
      case 'categories': return <CategoryManager />;
      case 'invoices': return <InvoiceHistory transactions={transactions} />;
      case 'customers': return <PeopleManager type="customer" data={customers} onAdd={(p) => handleAddPerson('customer', p)} />;
      case 'suppliers': return <PeopleManager type="supplier" data={suppliers} onAdd={(p) => handleAddPerson('supplier', p)} />;
      case 'users': return <PeopleManager type="user" data={users} onAdd={(p) => handleAddPerson('user', p)} />;
      case 'settings': return <SettingsManager receiptConfig={receiptConfig} setReceiptConfig={setReceiptConfig} taxConfig={taxConfig} setTaxConfig={setTaxConfig} />;
      default: return <POS products={products} onCheckoutComplete={handleCheckoutComplete} taxConfig={taxConfig} />;
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[70] lg:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[80] w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex lg:shrink-0
      `}>
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
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 lg:hidden hover:bg-gray-50 rounded-xl transition-all"><X size={20} /></button>
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

        <div className="p-6 border-t border-gray-50">
          <div className="bg-gray-50 p-4 rounded-3xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 font-black">AI</div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest leading-none">Gemini 2.0</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-white lg:bg-gray-50/20">
        <header className="h-20 lg:h-24 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 shrink-0 z-40">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-3 text-gray-900 bg-gray-50 rounded-2xl lg:hidden hover:bg-gray-100 transition-all">
                <MenuIcon size={20} />
              </button>
              <div>
                <h1 className="text-base lg:text-lg font-black text-gray-900 uppercase tracking-tighter italic">
                    {currentView.replace('-', ' ')}
                </h1>
                <p className="text-[8px] lg:text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">Management Console</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Admin Utama</span>
                      <span className="text-[8px] text-gray-400 font-bold uppercase">Super User</span>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 overflow-hidden border-2 border-white shadow-xl shadow-indigo-100 ring-1 ring-gray-100 transition-transform group-hover:scale-105">
                        <img src="https://picsum.photos/id/64/100/100" alt="User" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-auto relative no-scrollbar">
           {renderContent()}
        </div>
      </main>

      {/* Modern Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in duration-500 border border-white/20">
            <div className="bg-indigo-600 p-12 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="relative z-10">
                    <div className="w-20 h-20 bg-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">{receiptConfig.storeName}</h3>
                    <p className="text-indigo-200 text-[9px] mt-2 font-black uppercase tracking-[0.3em]">{receiptConfig.address}</p>
                </div>
            </div>
            
            <div className="p-10 font-mono text-[11px] text-gray-700">
                <div className="text-center border-b-2 border-dashed border-gray-100 pb-6 mb-6">
                    <p className="font-black text-gray-900">REF: {lastTransaction.id}</p>
                    <p className="text-gray-400 mt-1 uppercase text-[9px]">{new Date(lastTransaction.date).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="space-y-3 mb-8">
                    {lastTransaction.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="font-black text-gray-900 uppercase text-[10px]">{item.name}</span>
                                <span className="text-[9px] text-gray-400 font-bold">{item.quantity} x Rp{item.price.toLocaleString('id-ID')}</span>
                            </div>
                            <span className="font-black text-gray-900">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                    ))}
                    
                    <div className="border-t-2 border-dashed border-gray-100 pt-6 mt-6 space-y-2">
                      <div className="flex justify-between font-black text-lg pt-2 text-indigo-600 uppercase italic tracking-tighter">
                          <span>Total</span>
                          <span>Rp{lastTransaction.total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                </div>

                {lastTransaction.aiNote && (
                    <div className="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100 mb-8 text-center italic text-[10px] text-indigo-700 font-bold leading-relaxed relative">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 border border-indigo-100 rounded-full text-[8px] font-black uppercase tracking-widest text-indigo-400">Analisis AI</span>
                        "{lastTransaction.aiNote}"
                    </div>
                )}

                <button 
                    onClick={() => setShowReceipt(false)}
                    className="w-full bg-gray-900 text-white py-5 rounded-[1.75rem] font-black hover:bg-black transition-all uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95"
                >
                    Tutup
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
