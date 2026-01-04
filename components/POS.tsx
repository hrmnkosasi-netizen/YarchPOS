import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../constants';
import { Plus, Minus, Trash2, ShoppingBag, Loader2, Sparkles, ChevronDown, Search } from 'lucide-react';
import { generateReceiptMessage } from '../services/geminiService';

interface POSProps {
  onCheckoutComplete: (items: CartItem[], total: number, aiNote: string) => void;
}

const POS: React.FC<POSProps> = ({ onCheckoutComplete }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const parentCategories = MOCK_CATEGORIES.filter(c => !c.parentId);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategoryName === 'All' || product.category === selectedCategoryName || 
                            MOCK_CATEGORIES.find(c => c.name === product.category)?.parentId === MOCK_CATEGORIES.find(c => c.name === selectedCategoryName)?.id;
    
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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const aiMessage = await generateReceiptMessage(cart, cartTotal);
    
    setTimeout(() => {
      onCheckoutComplete(cart, cartTotal, aiMessage);
      setCart([]);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
      {/* Product Grid Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search & Categories Bar */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-3 md:p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 hidden sm:block">Daftar Menu</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari menu..." 
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button 
              onClick={() => setSelectedCategoryName('All')}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${selectedCategoryName === 'All' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Semua
            </button>
            {parentCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategoryName(cat.name)}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${selectedCategoryName === cat.name ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-95 group relative flex flex-col"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-gray-700">
                    {product.category}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-semibold text-gray-800 text-xs md:text-sm line-clamp-2 leading-tight">{product.name}</h3>
                  <p className="text-indigo-600 font-bold mt-1 text-sm md:text-base">Rp{product.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar - Bottom Sheet on Mobile, Right Sidebar on Desktop */}
      <div className="w-full lg:w-[400px] bg-white lg:border-l border-gray-200 flex flex-col h-[350px] lg:h-full z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] lg:shadow-none">
        <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={18} className="text-indigo-600" />
            Keranjang Belanja
          </h2>
          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{cart.length} Item</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-50">
              <ShoppingBag size={48} />
              <p className="text-sm">Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-50 shadow-sm">
                <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs md:text-sm font-medium text-gray-800 truncate">{item.name}</h4>
                  <p className="text-[10px] md:text-xs text-indigo-600 font-bold">Rp{item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}
                    className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}
                    className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200 space-y-3 shrink-0">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Subtotal</span>
              <span>Rp{cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-black text-gray-900">
              <span>Total Akhir</span>
              <span className="text-indigo-600">Rp{cartTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              cart.length === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Memproses...
              </>
            ) : (
              <>
                Bayar Sekarang
              </>
            )}
          </button>
          
          <div className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
            <Sparkles size={10} className="text-indigo-400" />
            Didukung Kecerdasan Gemini AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;