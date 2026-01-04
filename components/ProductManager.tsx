import React, { useState } from 'react';
import { Product } from '../types.ts';
import { Edit, Trash2, Plus, Search, MoreVertical, X } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  onAdd: (p: Product) => void;
  onDelete: (id: string) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, onAdd, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Makanan Berat',
    image: 'https://picsum.photos/300/300',
    stock: '50'
  });

  const getStockStatus = (stock: number = 20) => {
    if (stock === 0) return { label: 'Habis', color: 'bg-red-100 text-red-600', dot: 'bg-red-500' };
    if (stock < 10) return { label: 'Menipis', color: 'bg-amber-100 text-amber-600', dot: 'bg-amber-500' };
    return { label: 'Tersedia', color: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500' };
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Product = {
      id: Date.now().toString(),
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      image: formData.image + '?sig=' + Date.now(),
      date: new Date().toISOString(),
      stock: Number(formData.stock)
    };
    onAdd(newP);
    setShowAddModal(false);
    setFormData({ name: '', price: '', category: 'Makanan Berat', image: 'https://picsum.photos/300/300', stock: '50' });
  };

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-10 animate-fade-in max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Master<span className="text-indigo-600">Produk</span></h2>
            <p className="text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mt-1">Kontrol Persediaan & Penyesuaian Harga</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black shadow-2xl transition-all active:scale-95 text-[10px] tracking-widest uppercase"
        >
          <Plus size={18} /> Tambah Menu Baru
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-[10px] uppercase tracking-[0.3em] border-b border-gray-100">
                <th className="px-10 py-6 font-black">Informasi Item</th>
                <th className="px-8 py-6 font-black">Kategori</th>
                <th className="px-8 py-6 font-black">Harga</th>
                <th className="px-8 py-6 font-black">Stok Saat Ini</th>
                <th className="px-10 py-6 font-black text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => {
                 const mockStock = product.stock || 25;
                 const status = getStockStatus(mockStock);

                 return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                      <td className="px-10 py-6">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden shadow-sm shrink-0 border border-gray-100 relative transition-transform duration-500">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-black text-gray-900 text-sm truncate uppercase tracking-tighter italic mb-1">{product.name}</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-gray-300 font-black bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 uppercase tracking-widest">SKU-{product.id.slice(-5)}</span>
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
                            <button onClick={() => onDelete(product.id)} className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"><Trash2 size={18} /></button>
                          </div>
                      </td>
                    </tr>
                 );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View with Full Color Images */}
        <div className="lg:hidden divide-y divide-gray-50 p-4 space-y-4">
          {products.map((product) => {
            const mockStock = product.stock || 25;
            const status = getStockStatus(mockStock);
            return (
              <div key={product.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 space-y-4 shadow-sm relative overflow-hidden group">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-[1.75rem] overflow-hidden shrink-0 border border-gray-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
                   <button onClick={() => onDelete(product.id)} className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-widest"><Trash2 size={14} /> Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-black text-xl uppercase italic tracking-tighter">Tambah Menu Baru</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-all"><X size={24}/></button>
             </div>
             <form onSubmit={handleAddSubmit} className="p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Menu</label>
                   <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100 uppercase italic tracking-tight" placeholder="Contoh: Es Teh Manis" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Harga (Rp)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stok Awal</label>
                    <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100" placeholder="50" />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategori</label>
                   <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100">
                      <option>Makanan Berat</option>
                      <option>Minuman</option>
                      <option>Kopi</option>
                      <option>Cemilan</option>
                   </select>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.75rem] font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all">Simpan Menu Baru</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;