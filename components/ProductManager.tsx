import React from 'react';
import { Product } from '../types.ts';
import { Edit, Trash2, Plus, Search, MoreVertical } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
}

const ProductManager: React.FC<ProductManagerProps> = ({ products }) => {
  const getStockStatus = (stock: number = 20) => {
    if (stock === 0) return { label: 'Habis', color: 'bg-red-100 text-red-600', dot: 'bg-red-500' };
    if (stock < 10) return { label: 'Menipis', color: 'bg-amber-100 text-amber-600', dot: 'bg-amber-500' };
    return { label: 'Tersedia', color: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500' };
  };

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-10 animate-fade-in max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Master<span className="text-indigo-600">Inventory</span></h2>
            <p className="text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mt-1">Stock, Pricing & Variant Control</p>
        </div>
        <button className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black shadow-2xl transition-all active:scale-95 text-[10px] tracking-widest uppercase">
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col xl:flex-row gap-6 items-center justify-between bg-gray-50/20">
          <div className="relative w-full xl:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="Search SKU or Name..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-wider outline-none focus:ring-4 focus:ring-indigo-50 transition-all" 
            />
          </div>
          <div className="flex gap-2 w-full xl:w-auto overflow-x-auto no-scrollbar pb-1">
             <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl shadow-gray-200">All Items</button>
             <button className="px-6 py-3 bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 rounded-2xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all">Food</button>
             <button className="px-6 py-3 bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 rounded-2xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all">Beverage</button>
             <button className="px-6 py-3 bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 rounded-2xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all">Low Stock</button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-[10px] uppercase tracking-[0.3em] border-b border-gray-50">
                <th className="px-10 py-6 font-black">Item Details</th>
                <th className="px-8 py-6 font-black">Category</th>
                <th className="px-8 py-6 font-black">Unit Price</th>
                <th className="px-8 py-6 font-black">Stock Ledger</th>
                <th className="px-10 py-6 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => {
                 const mockStock = product.variants ? product.variants.reduce((a, b) => a + b.stock, 0) : (product.stock || 25);
                 const status = getStockStatus(mockStock);

                 return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                      <td className="px-10 py-6">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden shadow-sm shrink-0 border border-gray-100 relative group-hover:scale-105 transition-transform duration-500">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-black text-gray-900 text-sm truncate uppercase tracking-tighter italic mb-1">{product.name}</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-gray-300 font-black bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 uppercase tracking-widest">REF-{product.id}</span>
                                    {product.variants && <span className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">{product.variants.length} Variants</span>}
                                </div>
                            </div>
                          </div>
                      </td>
                      <td className="px-8 py-6">
                          <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-200/50">
                            {product.category}
                          </span>
                      </td>
                      <td className="px-8 py-6 font-black text-gray-900 text-sm tracking-tight italic">
                           Rp {product.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-8 py-6 min-w-[200px]">
                          <div className="flex items-center justify-between mb-2">
                              <span className={`text-[9px] font-black uppercase tracking-widest ${status.color.split(' ')[1]}`}>{status.label}</span>
                              <span className="text-[10px] text-gray-900 font-black">{mockStock} Units</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-1000 ${status.dot}`} style={{ width: `${Math.min(100, (mockStock/50)*100)}%` }}></div>
                          </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"><Edit size={18} /></button>
                            <button className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"><Trash2 size={18} /></button>
                          </div>
                      </td>
                    </tr>
                 );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-50 p-4 space-y-4">
          {products.map((product) => {
            const mockStock = product.variants ? product.variants.reduce((a, b) => a + b.stock, 0) : (product.stock || 25);
            const status = getStockStatus(mockStock);
            return (
              <div key={product.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 space-y-4 shadow-sm relative overflow-hidden group">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden shrink-0 border border-gray-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{product.category}</p>
                      <button className="text-gray-300"><MoreVertical size={16} /></button>
                    </div>
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter italic mt-1 line-clamp-1">{product.name}</h3>
                    <p className="font-black text-indigo-600 text-base tracking-tighter mt-1">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-50 space-y-2">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                      <span className={status.color.split(' ')[1]}>{status.label}</span>
                      <span className="text-gray-400">{mockStock} Units</span>
                   </div>
                   <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${status.dot}`} style={{ width: `${Math.min(100, (mockStock/50)*100)}%` }}></div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                   <button className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[9px] font-black uppercase tracking-widest"><Edit size={14} /> Edit</button>
                   <button className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-widest"><Trash2 size={14} /> Remove</button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-8 md:p-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/10">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Showing {products.length} Items Ledger</span>
            <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl border border-gray-200 bg-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30 transition-all">Prev</button>
                <button className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-gray-200 transition-all">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;