
import React, { useState } from 'react';
import { Product, CartItem, TaxServiceConfig, ProductCategory, ProductVariant } from '../types.ts';
import { Plus, Minus, ShoppingBag, Loader2, Search, X, ChevronRight, Zap, Banknote, QrCode, CreditCard, Star, Package, Tag } from 'lucide-react';
import { generateReceiptMessage } from '../services/geminiService.ts';

interface POSProps {
  products: Product[];
  categories: ProductCategory[];
  onCheckoutComplete: (items: CartItem[], subtotal: number, aiNote: string) => void;
  taxConfig: TaxServiceConfig;
}

// Moved CartItemRow outside POS component to fix key prop issues and improve performance
const CartItemRow = ({ item, updateQuantity }: { item: CartItem; updateQuantity: (id: string, variantName: string | undefined, delta: number) => void }) => (
  <div className="flex items-center gap-5 bg-white p-5 rounded-[2rem] border border-slate-100 premium-shadow group animate-in slide-in-from-right-4 duration-300">
     <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-50 relative">
       <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
     </div>
     <div className="flex-1 min-w-0">
       <h4 className="text-[11px] font-black text-slate-900 uppercase italic truncate leading-none mb-1">{item.name}</h4>
       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.selectedVariant ? item.selectedVariant.name : 'Standard'}</p>
       <p className="text-[10px] text-indigo-600 font-black mt-2">Rp {item.price.toLocaleString('id-ID')}</p>
     </div>
     <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
       <button onClick={() => updateQuantity(item.id, item.selectedVariant?.name, -1)} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-red-500 hover:shadow-sm transition-all"><Minus size={12}/></button>
       <span className="text-xs font-black px-1 text-slate-900">{item.quantity}</span>
       <button onClick={() => updateQuantity(item.id, item.selectedVariant?.name, 1)} className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 hover:shadow-lg transition-all"><Plus size={12}/></button>
     </div>
  </div>
);

const POS: React.FC<POSProps> = ({ products, categories, onCheckoutComplete, taxConfig }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCartOpenMobile, setIsCartOpenMobile] = useState(false);
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

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Product Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
        <div className="p-8 lg:p-12 bg-white/50 border-b border-slate-100">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Premium<span className="text-indigo-600">Collection</span></h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Browse elite inventory items</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search retail items..." className="w-full pl-14 pr-6 py-4 bg-white rounded-[1.5rem] border border-slate-100 outline-none font-bold text-xs uppercase tracking-wider shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all" />
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar mt-10">
            <button onClick={() => setSelectedCategoryName('All')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategoryName === 'All' ? 'bg-indigo-600 text-white italic shadow-lg shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-400 hover:border-indigo-100'}`}>SEMUA</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategoryName(cat.name)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategoryName === cat.name ? 'bg-indigo-600 text-white italic shadow-lg shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-400 hover:border-indigo-100'}`}>{cat.name}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 no-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => handleProductClick(product)} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group active:scale-95 premium-shadow">
                <div className="aspect-[4/5] bg-slate-50 overflow-hidden relative">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                     <span className="text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Plus size={14} /> Tambahkan ke Bill
                     </span>
                  </div>
                  {product.variants && product.variants.length > 0 && (
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                       <Tag size={10} /> MULTI-VARIAN
                    </div>
                  )}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600">
                     <Star size={14} />
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">{product.category}</p>
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase italic line-clamp-2 min-h-[2.5rem] leading-snug">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                     <p className="text-indigo-600 font-black text-sm tracking-tight">Rp {product.price.toLocaleString('id-ID')}</p>
                     <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-300">
                        <Package size={10} /> {product.stock || 0}
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="hidden lg:flex w-[460px] border-l border-slate-100 flex-col bg-white premium-shadow">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                 <ShoppingBag size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tighter italic uppercase">Customer Bill</h2>
           </div>
           <span className="text-[9px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-xl uppercase tracking-widest">{cart.length} ITEMS</span>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-5 no-scrollbar bg-slate-50/20">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-40 py-20 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                 <ShoppingBag size={48} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">No items in cart</p>
              <p className="text-[8px] font-bold uppercase tracking-widest mt-2">Start adding retail collection</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <CartItemRow key={`${item.id}-${item.selectedVariant?.name || 'base'}`} item={item} updateQuantity={updateQuantity} />
            ))
          )}
        </div>

        <div className="p-10 bg-white border-t border-slate-100 space-y-8">
           <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span>Subtotal</span>
                 <span className="text-slate-900 font-extrabold">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span>Tax (11%)</span>
                 <span className="text-slate-900 font-extrabold">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="h-[1px] bg-slate-100 my-4"></div>
              <div className="flex justify-between text-2xl font-black text-slate-900 italic tracking-tighter">
                 <span>GRAND TOTAL</span>
                 <span className="text-indigo-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>
           </div>
           
           <button
             onClick={handleCheckout}
             disabled={cart.length === 0 || isProcessing}
             className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 disabled:bg-slate-100 disabled:text-slate-300 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all flex items-center justify-center gap-4 text-xs group"
           >
             {isProcessing ? <Loader2 className="animate-spin" /> : (
                <>
                  <Zap size={18} className="group-hover:animate-pulse" />
                  PROSES PEMBAYARAN
                </>
             )}
           </button>
        </div>
      </div>

      {/* Variant Modal */}
      {variantModalProduct && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-lg overflow-hidden animate-in zoom-in duration-500 shadow-2xl">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="font-extrabold text-2xl uppercase italic tracking-tighter text-slate-900 leading-none">{variantModalProduct.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Select available retail variant</p>
              </div>
              <button onClick={() => setVariantModalProduct(null)} className="p-4 text-slate-300 hover:text-slate-900 hover:bg-white rounded-3xl transition-all shadow-sm border border-transparent hover:border-slate-100"><X size={28}/></button>
            </div>
            <div className="p-10 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
              {variantModalProduct.variants?.map((v, idx) => (
                <button 
                  key={idx}
                  onClick={() => addToCart(variantModalProduct, v)}
                  className="w-full p-6 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-[2rem] flex justify-between items-center transition-all group border border-slate-100 hover:border-indigo-400"
                >
                  <div className="text-left">
                     <span className="font-black uppercase tracking-widest text-xs group-hover:italic transition-all">{v.name}</span>
                     <p className="text-[9px] font-bold text-slate-400 group-hover:text-indigo-200 uppercase mt-1">Stok Tersedia: {v.stock}</p>
                  </div>
                  <span className="font-black text-indigo-600 group-hover:text-white text-base">Rp {v.price.toLocaleString('id-ID')}</span>
                </button>
              ))}
            </div>
            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
               <Zap className="text-indigo-600" size={16} />
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inventory is automatically synced across all cloud nodes.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
