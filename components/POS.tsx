import React, { useState } from 'react';
import { Product, CartItem, TaxServiceConfig } from '../types.ts';
import { MOCK_CATEGORIES } from '../constants.ts';
import { Plus, Minus, ShoppingBag, Loader2, Search, X, ChevronRight, Zap, CreditCard, Banknote, QrCode } from 'lucide-react';
import { generateReceiptMessage } from '../services/geminiService.ts';

interface POSProps {
  products: Product[];
  onCheckoutComplete: (items: CartItem[], subtotal: number, aiNote: string) => void;
  taxConfig: TaxServiceConfig;
}

const POS: React.FC<POSProps> = ({ products, onCheckoutComplete, taxConfig }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCartOpenMobile, setIsCartOpenMobile] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'QRIS' | 'Card'>('Cash');

  const parentCategories = MOCK_CATEGORIES.filter(c => !c.parentId);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategoryName === 'All' || product.category === selectedCategoryName;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = taxConfig.isTaxEnabled ? (subtotal * taxConfig.taxPercentage / 100) : 0;
  const service = taxConfig.isServiceEnabled ? (subtotal * taxConfig.servicePercentage / 100) : 0;
  const total = subtotal + tax + service;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const aiMessage = await generateReceiptMessage(cart, total);
    
    setTimeout(() => {
      onCheckoutComplete(cart, subtotal, aiMessage);
      setCart([]);
      setIsProcessing(false);
      setIsCartOpenMobile(false);
    }, 1200);
  };

  const CartContent = () => (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-2">
              <ShoppingBag size={20} className="text-indigo-600" />
              Keranjang
            </h2>
            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-0.5">Order Review</p>
        </div>
        <button onClick={() => setIsCartOpenMobile(false)} className="lg:hidden p-3 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-2xl transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-6 opacity-20 py-20">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center border-4 border-dashed border-gray-200">
              <ShoppingBag size={48} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Empty Basket</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-[1.75rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                    <img src={item.image} alt="" className="w-full h-full object-cover transition-all" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black text-gray-900 truncate uppercase tracking-tight italic">{item.name}</h4>
                  <p className="text-[10px] text-indigo-600 font-black mt-0.5 tracking-tighter">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1.5 shrink-0">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all hover:shadow-sm">
                    <Minus size={14} />
                  </button>
                  <span className="text-[11px] font-black w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Metode Pembayaran</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Cash', icon: Banknote, label: 'Tunai' },
                  { id: 'QRIS', icon: QrCode, label: 'QRIS' },
                  { id: 'Card', icon: CreditCard, label: 'Debit/Kredit' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${paymentMethod === method.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                  >
                    <method.icon size={18} className="mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-gray-100 space-y-6 sticky bottom-0">
        <div className="space-y-2 border-b border-gray-50 pb-6">
          <div className="flex justify-between items-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
            <span>Subtotal</span>
            <span className="text-gray-900 font-black">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          {taxConfig.isTaxEnabled && (
            <div className="flex justify-between items-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
              <span>Pajak ({taxConfig.taxPercentage}%)</span>
              <span className="font-bold">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
          )}
          {taxConfig.isServiceEnabled && (
            <div className="flex justify-between items-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
              <span>Biaya Layanan</span>
              <span className="font-bold">Rp {service.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-2xl font-black text-gray-900 pt-4 italic tracking-tighter">
            <span>TOTAL</span>
            <span className="text-indigo-600">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
        
        <button
          onClick={handleCheckout}
          disabled={cart.length === 0 || isProcessing}
          className={`w-full py-5 rounded-[1.75rem] font-black flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-2xl relative overflow-hidden group uppercase text-[11px] tracking-widest ${
            cart.length === 0 
            ? 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100' 
            : 'bg-indigo-600 hover:bg-black text-white shadow-indigo-200'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={18} />
                <span>Processing...</span>
            </div>
          ) : (
            <>
                <Zap size={18} className="text-indigo-300" />
                <span>Bayar Sekarang</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-white lg:bg-gray-50/10 relative">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">Pilih<span className="text-indigo-600">Menu</span></h2>
                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em] mt-1.5">Fresh inventory items</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input 
                      type="text" 
                      placeholder="Cari makanan..." 
                      className="pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-50 shadow-inner outline-none w-full text-xs font-black uppercase tracking-wider transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-2 px-2 pb-1">
              <button 
                onClick={() => setSelectedCategoryName('All')}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${selectedCategoryName === 'All' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 italic scale-105' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}
              >
                Semua Menu
              </button>
              {parentCategories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategoryName(cat.name)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${selectedCategoryName === cat.name ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 italic scale-105' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar pb-32 lg:pb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 active:scale-95 group flex flex-col relative"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-md w-10 h-10 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <Plus size={20} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1.5">{product.category}</p>
                  <h3 className="font-black text-gray-900 text-xs md:text-sm line-clamp-2 min-h-[2.5rem] leading-tight uppercase tracking-tighter italic">{product.name}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-indigo-600 font-black text-base tracking-tighter">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-6 py-40">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border-4 border-dashed border-gray-100">
                    <Zap size={32} className="opacity-10" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Tidak ada menu ditemukan</p>
             </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-[420px] border-l border-gray-100 shrink-0 bg-white">
        <CartContent />
      </div>

      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[40] animate-in slide-in-from-bottom-10 duration-500">
          <button 
            onClick={() => setIsCartOpenMobile(true)}
            className="w-full bg-gray-900 text-white rounded-[2.5rem] p-5 shadow-2xl flex items-center justify-between group active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center relative shadow-lg shadow-indigo-600/20">
                <ShoppingBag size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-900">
                  {cart.length}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total</p>
                <p className="text-xl font-black tracking-tighter italic">Rp {total.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pr-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black uppercase tracking-widest">Detail</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </div>
      )}

      {isCartOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-x-0 bottom-0 h-[90vh] bg-white rounded-t-[4rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-600 flex flex-col">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full mx-auto my-4 shrink-0"></div>
            <div className="flex-1 overflow-hidden">
              <CartContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
