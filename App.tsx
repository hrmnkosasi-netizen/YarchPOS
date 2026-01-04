import React, { useState } from 'react';
import POS from './components/POS.tsx';
import Dashboard from './components/Dashboard.tsx';
import ProductManager from './components/ProductManager.tsx';
import CategoryManager from './components/CategoryManager.tsx';
import InvoiceHistory from './components/InvoiceHistory.tsx';
import PeopleManager from './components/PeopleManager.tsx';
import SettingsManager from './components/SettingsManager.tsx';
import { Transaction, CartItem } from './types.ts';
import { MOCK_PRODUCTS, INITIAL_TRANSACTIONS, MOCK_CUSTOMERS, MOCK_SUPPLIERS, MOCK_USERS } from './constants.ts';
import { 
  LayoutDashboard, 
  Store, 
  X, 
  CheckCircle, 
  Receipt, 
  Box, 
  Layers, 
  FileText, 
  Users, 
  Truck, 
  ShieldCheck,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';

type ViewType = 'pos' | 'dashboard' | 'products' | 'categories' | 'invoices' | 'customers' | 'suppliers' | 'users' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('pos');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const handleCheckoutComplete = (items: CartItem[], total: number, aiNote: string) => {
    const newTransaction: Transaction = {
      id: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total,
      aiNote,
      customerName: "Umum"
    };

    setTransactions(prev => [...prev, newTransaction]);
    setLastTransaction(newTransaction);
    setShowReceipt(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'pos':
        return <POS onCheckoutComplete={handleCheckoutComplete} />;
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'products':
        return <ProductManager products={MOCK_PRODUCTS} />;
      case 'categories':
        return <CategoryManager />;
      case 'invoices':
        return <InvoiceHistory transactions={transactions} />;
      case 'customers':
        return <PeopleManager type="customer" data={MOCK_CUSTOMERS} />;
      case 'suppliers':
        return <PeopleManager type="supplier" data={MOCK_SUPPLIERS} />;
      case 'users':
        return <PeopleManager type="user" data={MOCK_USERS} />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <POS onCheckoutComplete={handleCheckoutComplete} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewType; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-2xl transition-all ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
      }`}
      title={label}
    >
      <Icon size={20} className="shrink-0" />
      <span className="hidden lg:block font-bold text-sm truncate">{label}</span>
      {currentView === view && <ChevronRight size={14} className="ml-auto hidden lg:block opacity-50" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-16 lg:w-72 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-40">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-8 w-full shrink-0">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Store className="text-white" size={20} />
          </div>
          <span className="hidden lg:block ml-4 font-black text-gray-900 text-xl tracking-tight uppercase">Warung<span className="text-indigo-600">AI</span></span>
        </div>

        <nav className="flex-1 w-full p-2 lg:p-6 space-y-1.5 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-black text-gray-300 px-3 mb-4 hidden lg:block uppercase tracking-[0.2em]">Navigasi</div>
          <NavItem view="pos" icon={Store} label="Kasir (POS)" />
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="invoices" icon={FileText} label="Invoice Riwayat" />
          
          <div className="mt-8 mb-4 text-[10px] font-black text-gray-300 px-3 hidden lg:block uppercase tracking-[0.2em]">Katalog</div>
          <NavItem view="products" icon={Box} label="Menu & Varian" />
          <NavItem view="categories" icon={Layers} label="Kategori Menu" />

          <div className="mt-8 mb-4 text-[10px] font-black text-gray-300 px-3 hidden lg:block uppercase tracking-[0.2em]">Master</div>
          <NavItem view="customers" icon={Users} label="Pelanggan" />
          <NavItem view="suppliers" icon={Truck} label="Pemasok" />
          <NavItem view="users" icon={ShieldCheck} label="Pengguna" />

          <div className="mt-8 mb-4 text-[10px] font-black text-gray-300 px-3 hidden lg:block uppercase tracking-[0.2em]">Preferensi</div>
          <NavItem view="settings" icon={Settings} label="Pengaturan" />
        </nav>

        <div className="p-4 w-full shrink-0 border-t border-gray-50">
            <div className="hidden lg:flex p-4 bg-gray-50 rounded-2xl flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sistem V1.2</span>
                <span className="font-bold flex items-center gap-2 mt-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> 
                  Server Online
                </span>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-10 shrink-0">
            <h1 className="text-lg md:text-xl font-black text-gray-900 capitalize tracking-tight">
                {currentView.replace('-', ' ')}
            </h1>
            <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-400 hidden xl:block uppercase tracking-widest">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <div className="w-10 h-10 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100 group cursor-pointer hover:ring-indigo-200 transition-all">
                    <img src="https://picsum.photos/id/64/100/100" alt="User" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-auto relative">
           {renderContent()}
        </div>
      </main>

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-indigo-600 p-8 text-white text-center relative">
                <div className="absolute top-4 right-4 text-white/20">
                  <Receipt size={64} />
                </div>
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-6 scale-110">
                    <CheckCircle size={40} className="text-indigo-600" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Berhasil!</h3>
                <p className="text-indigo-100 text-xs font-bold mt-2 uppercase tracking-[0.2em]">{lastTransaction.id}</p>
            </div>
            
            <div className="p-8">
                <div className="space-y-3 mb-8">
                    {lastTransaction.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs md:text-sm">
                            <span className="text-gray-500 font-medium">{item.quantity}x {item.name}</span>
                            <span className="font-black text-gray-800">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                    ))}
                    <div className="border-t-2 border-gray-900 my-4 pt-4 flex justify-between font-black text-xl">
                        <span>TOTAL</span>
                        <span className="text-indigo-600">Rp{lastTransaction.total.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {lastTransaction.aiNote && (
                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 mb-8 relative">
                        <div className="flex items-center gap-2 mb-3 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                            <Sparkles size={14} />
                            Pesan Gemini AI
                        </div>
                        <p className="text-xs text-gray-600 italic leading-relaxed font-medium">"{lastTransaction.aiNote}"</p>
                    </div>
                )}

                <button 
                    onClick={() => setShowReceipt(false)}
                    className="w-full bg-gray-900 text-white py-4 rounded-[1.5rem] font-black hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-gray-200 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
                >
                    <X size={16} />
                    Tutup Nota
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;