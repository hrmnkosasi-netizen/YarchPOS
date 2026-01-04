import React, { useState } from 'react';
import { Product, CartItem, TaxServiceConfig, ProductCategory, ProductVariant } from '../types';
import { Plus, Minus, ShoppingBag, Loader2, Search, X, ChevronRight, Zap, Banknote, QrCode, CreditCard } from 'lucide-react';
import { generateReceiptMessage } from '../services/geminiService';

interface POSProps {
  products: Product[];
  categories: ProductCategory[];
  onCheckoutComplete: (items: CartItem[], subtotal: number, aiNote: string) => void;
  taxConfig: TaxServiceConfig;
}

const POS: React.FC<POSProps> = ({ products, categories, onCheckoutComplete, taxConfig }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCartOpenMobile, setIsCartOpenMobile] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'QRIS' | 'Card'>('Cash');
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategoryName === 'All' || product.category === selectedCategoryName;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      setVariantModalProduct(product);
    } else {
      addToCart(product);
    }
  };

  const addToCart = (product: Product, variant?: ProductVariant) => {
    setCart(prev => {
      const existing = prev.find(item => 
        variant 
          ? (item.id === product.id && item.selectedVariant?.name === variant.name) 
          : (item.id === product.id && !item.selectedVariant)
      );
      
      if (existing) {
        return prev.map(item => 
          (variant 
            ? (item.id === product.id && item.selectedVariant?.name === variant.name) 
            : (item.id === product.id && !item.selectedVariant)) 
            ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      return [...prev, { 
        ...product, 
        quantity: 1, 
        selectedVariant: variant,
        price: variant ? variant.price : product.price 
      }];
    });
    setVariantModalProduct(null);
  };

  const updateQuantity = (id: string, variantName: string | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedVariant?.name === variantName) {
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
        <h2 className="text-xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-2">
          <ShoppingBag size={20} className="text-indigo-600" />
          Keranjang
        </h2>
        <button onClick={() => setIsCartOpenMobile(false)} className="lg:hidden p-2 text-gray-400">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-20 py-20">
            <ShoppingBag size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest mt-4">Keranjang Kosong</p>
          </div>
        ) : (
          cart.map((item, idx) => (
            <div key={`${item.id}-${item.selectedVariant?.name || 'base'}`} className="flex items-center gap-4 bg-white p-4 rounded-[1.75rem] border border-gray-100 shadow-sm">
               <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-50">
                 <img src={item.image} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 min-w-0">
                 <h4 className="text-[11px] font-black uppercase italic truncate">{item.name} {item.selectedVariant ? `(${item.selectedVariant.name})` : ''}</h4>
                 <p className="text-[10px] text-indigo-600 font-black">Rp {item.price.toLocaleString('id-ID')}</p>
               </div>
               <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1">
                 <button onClick={() => updateQuantity(item.id, item.selectedVariant?.name, -1)} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-gray-100"><Minus size={12}/></button>
                 <span className="text-xs font-black px-1">{item.quantity}</span>
                 <button onClick={() => updateQuantity(item.id, item.selectedVariant?.name, 1)} className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center"><Plus size={12}/></button>
               </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 border-t border-gray-100 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
            <span>Subtotal</span>
            <span className="text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-2xl font-black text-gray-900 italic tracking-tighter">
            <span>TOTAL</span>
            <span className="text-indigo-600">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
        
        <button
          onClick={handleCheckout}
          disabled={cart.length === 0 || isProcessing}
          className="w-full py-5 bg-indigo-600 text-white rounded-[1.75rem] font-black uppercase tracking-widest shadow-2xl disabled:bg-gray-100 disabled:text-gray-300"
        >
          {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : 'BAYAR SEKARANG'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-50/10">
        <div className="p-6 md:p-8 bg-white border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Menu<span className="text-indigo-600">Terfavorit</span></h2>
              <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em] mt-1">Stok Real-time</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Cari menu..." className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border-none outline-none font-black text-xs uppercase" />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pt-6">
            <button onClick={() => setSelectedCategoryName('All')} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategoryName === 'All' ? 'bg-indigo-600 text-white italic scale-105' : 'bg-white border border-gray-100 text-gray-400'}`}>Semua</button>
            {categories.filter(c => !c.parentId).map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategoryName(cat.name)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategoryName === cat.name ? 'bg-indigo-600 text-white italic scale-105' : 'bg-white border border-gray-100 text-gray-400'}`}>{cat.name}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => handleProductClick(product)} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl transition-all group active:scale-95">
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  {product.variants && product.variants.length > 0 && (
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">Varian</div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[8px] font-black text-indigo-400 uppercase mb-1.5">{product.category}</p>
                  <h3 className="font-black text-gray-900 text-xs uppercase italic line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                  <p className="text-indigo-600 font-black text-base mt-2">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-[420px] border-l border-gray-100 flex-col bg-white">
        <CartContent />
      </div>

      {variantModalProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-black text-xl uppercase italic tracking-tighter">{variantModalProduct.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Pilih Varian Menu</p>
              </div>
              <button onClick={() => setVariantModalProduct(null)} className="p-3 text-gray-400 hover:bg-gray-100 rounded-2xl transition-colors"><X size={24}/></button>
            </div>
            <div className="p-8 space-y-3">
              {variantModalProduct.variants?.map((v, idx) => (
                <button 
                  key={idx}
                  onClick={() => addToCart(variantModalProduct, v)}
                  className="w-full p-6 bg-gray-50 hover:bg-indigo-600 hover:text-white rounded-[2rem] flex justify-between items-center transition-all group"
                >
                  <span className="font-black uppercase tracking-widest text-[11px]">{v.name}</span>
                  <span className="font-black text-indigo-600 group-hover:text-white">Rp {v.price.toLocaleString('id-ID')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;