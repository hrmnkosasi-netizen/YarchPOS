import React, { useState } from 'react';
import POS from './components/POS';
import Dashboard from './components/Dashboard';
import ProductManager from './components/ProductManager';
import CategoryManager from './components/CategoryManager';
import InvoiceHistory from './components/InvoiceHistory';
import PeopleManager from './components/PeopleManager';
import { Transaction, CartItem } from './types';
import { MOCK_PRODUCTS, INITIAL_TRANSACTIONS, MOCK_CUSTOMERS, MOCK_SUPPLIERS, MOCK_USERS } from './constants';
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
  ShieldCheck 
} from 'lucide-react';

type ViewType = 'pos' | 'dashboard' | 'products' | 'categories' | 'invoices' | 'customers' | 'suppliers' | 'users';

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
      default:
        return <POS onCheckoutComplete={handleCheckoutComplete} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewType; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all text-sm font-medium ${
        currentView === view 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={20} />
      <span className="hidden lg:block">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col items-center lg:items-start transition-all duration-300 z-30">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 w-full border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Store className="text-white" size={18} />
          </div>
          <span className="hidden lg:block ml-3 font-bold text-gray-800 text-lg">Warung<span className="text-indigo-600">AI</span></span>
        </div>

        <nav className="flex-1 w-full p-4 space-y-1 overflow-y-auto no-scrollbar">
          <div className="text-xs font-bold text-gray-400 px-3 mb-2 hidden lg:block uppercase tracking-wider">Utama</div>
          <NavItem view="pos" icon={Store} label="Kasir (POS)" />
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="invoices" icon={FileText} label="Invoice" />
          
          <div className="mt-6 mb-2 text-xs font-bold text-gray-400 px-3 hidden lg:block uppercase tracking-wider">Produk</div>
          <NavItem view="products" icon={Box} label="Produk & Varian" />
          <NavItem view="categories" icon={Layers} label="Kategori Menu" />

          <div className="mt-6 mb-2 text-xs font-bold text-gray-400 px-3 hidden lg:block uppercase tracking-wider">Data Master</div>
          <NavItem view="customers" icon={Users} label="Pelanggan" />
          <NavItem view="suppliers" icon={Truck} label="Supplier" />
          <NavItem view="users" icon={ShieldCheck} label="Pengguna" />
        </nav>

        <div className="p-4 w-full shrink-0">
            <div className="hidden lg:flex p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white text-xs flex-col shadow-lg">
                <span className="font-bold opacity-90">Status Sistem</span>
                <span className="font-semibold flex items-center gap-1 mt-1"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> Online v1.2</span>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
            <h1 className="text-xl font-bold text-gray-800 capitalize">
                {currentView.replace('-', ' ')}
            </h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden md:block">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                    <img src="https://picsum.photos/id/64/100/100" alt="User" />
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-auto bg-gray-50 relative">
           {renderContent()}
        </div>
      </main>

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-green-500 p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold">Pembayaran Berhasil!</h3>
                <p className="text-white/80 text-sm mt-1">ID: {lastTransaction.id}</p>
            </div>
            
            <div className="p-6">
                <div className="space-y-3 mb-6">
                    {lastTransaction.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.quantity}x {item.name}</span>
                            <span className="font-medium text-gray-800">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                    ))}
                    <div className="border-t border-dashed border-gray-300 my-2 pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>Rp{lastTransaction.total.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {lastTransaction.aiNote && (
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                        <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
                            <Receipt size={14} />
                            Catatan Struk (Gemini AI)
                        </div>
                        <p className="text-sm text-gray-700 italic">"{lastTransaction.aiNote}"</p>
                    </div>
                )}

                <button 
                    onClick={() => setShowReceipt(false)}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                    <X size={18} />
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