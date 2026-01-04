import React, { useState } from 'react';
import { Product, CartItem, Category } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { Plus, Minus, Trash2, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import { generateReceiptMessage } from '../services/geminiService';

interface POSProps {
  onCheckoutComplete: (items: CartItem[], total: number, aiNote: string) => void;
}

const POS: React.FC<POSProps> = ({ onCheckoutComplete }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
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

    // Call Gemini for a fun receipt message
    const aiMessage = await generateReceiptMessage(cart, cartTotal);
    
    // Simulate delay for effect
    setTimeout(() => {
      onCheckoutComplete(cart, cartTotal, aiMessage);
      setCart([]);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Product Grid Area */}
      <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
        {/* Filters */}
        <div className="p-4 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Daftar Menu</h2>
            <input 
              type="text" 
              placeholder="Cari menu..." 
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button 
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Semua
            </button>
            {Object.values(Category).map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
              >
                <div className="h-32 bg-gray-200 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700">
                    {product.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">{product.name}</h3>
                  <p className="text-indigo-600 font-bold mt-1">Rp{product.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col h-[40vh] lg:h-full z-20">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={20} />
            Keranjang
          </h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{cart.length} Item</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100">
                <img src={item.image} alt="" className="w-12 h-12 rounded-md object-cover bg-gray-100" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-gray-500">Rp{item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200 space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Subtotal</span>
            <span>Rp{cartTotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-gray-900">
            <span>Total</span>
            <span>Rp{cartTotal.toLocaleString('id-ID')}</span>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              cart.length === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Memproses...
              </>
            ) : (
              <>
                Bayar Sekarang
              </>
            )}
          </button>
          
          <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <Sparkles size={12} className="text-indigo-400" />
            Didukung oleh Gemini AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;