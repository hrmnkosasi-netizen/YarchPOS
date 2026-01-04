import React, { useState } from 'react';
import { Product, ProductCategory, ProductVariant } from '../types';
import { Edit, Trash2, Plus, X, ListPlus, Tag, Package, Box, Image as ImageIcon } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  categories: ProductCategory[];
  onAdd: (p: Product) => void;
  onDelete: (id: string) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, categories, onAdd, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&h=300&auto=format&fit=crop',
    stock: '0'
  });
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const addVariantField = () => {
    setVariants([...variants, { name: '', price: formData.price ? Number(formData.price) : 0, stock: 0 }]);
  };

  const updateVariant = (idx: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[idx] = { ...newVariants[idx], [field]: value };
    setVariants(newVariants);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Product = {
      id: `RET-${Date.now().toString().slice(-6)}`,
      name: formData.name,
      price: Number(formData.price),
      category: formData.category || (categories[0]?.name || 'Umum'),
      image: formData.image,
      date: new Date().toISOString(),
      stock: Number(formData.stock),
      variants: variants.length > 0 ? variants : undefined
    };
    onAdd(newP);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: '', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&h=300&auto=format&fit=crop', stock: '0' });
    setVariants([]);
  };

  return (
    <div className="p-6 md:p-10 space-y-10 animate-fade-in max-w-7xl mx-auto pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-3">
              <Box className="text-indigo-600" size={32} />
              Katalog<span className="text-indigo-600">Produk</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Kelola Inventori Retail & Varian Barang</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black shadow-2xl transition-all active:scale-95 text-[10px] tracking-widest uppercase">
          <Plus size={18} /> Tambah Produk Baru
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.3em] border-b border-gray-100">
                <th className="px-10 py-6 font-black">Informasi Produk</th>
                <th className="px-8 py-6 font-black">Kategori</th>
                <th className="px-8 py-6 font-black">Harga Jual</th>
                <th className="px-8 py-6 font-black">Stok / Varian</th>
                <th className="px-10 py-6 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-gray-100 overflow-hidden border border-gray-100 shadow-sm relative group-hover:scale-105 transition-transform">
                        <img src={product.image} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://placehold.co/100x100?text=No+Img' }} />
                      </div>
                      <div>
                        <div className="font-black text-gray-900 text-sm uppercase italic tracking-tighter">{product.name}</div>
                        <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5 flex items-center gap-2">
                           <Tag size={10} className="text-indigo-400" /> ID: {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-sm italic tracking-tight text-gray-900">
                    Rp {product.price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-8 py-6">
                    {product.variants ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.variants.map((v, i) => (
                          <div key={i} className="flex items-center gap-1 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg border border-gray-200 text-[8px] font-black uppercase">
                             {v.name} <span className="text-indigo-500">({v.stock})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                         <Package size={14} className="text-gray-300" />
                         <span className="text-xs font-black">{product.stock || 0} Unit</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-3 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-xl rounded-2xl transition-all"><Edit size={16} /></button>
                      <button onClick={() => onDelete(product.id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-xl rounded-2xl transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl my-8 overflow-hidden animate-in zoom-in duration-300 shadow-2xl">
             <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="font-black text-xl uppercase italic tracking-tighter">Registrasi Produk Retail</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Masukkan detail produk dan variasi stok</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-3 text-gray-400 hover:text-gray-900 transition-colors"><X size={24}/></button>
             </div>
             <form onSubmit={handleAddSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Barang / Produk</label>
                       <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100 uppercase italic" placeholder="Contoh: Celana Dalam Anak Pack isi 3" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Harga Jual Dasar (Rp)</label>
                       <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stok Awal (Jika tanpa varian)</label>
                       <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100" placeholder="0" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pilih Kategori</label>
                       <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100 cursor-pointer">
                          <option value="">Pilih Kategori...</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Visual Produk (URL Image)</label>
                       <div className="flex gap-2">
                          <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-[10px] outline-none" placeholder="https://..." />
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center shrink-0">
                             <ImageIcon size={20} className="text-gray-300" />
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Variasi Produk (Ukuran/Warna)</label>
                      <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">Tambahkan jika barang memiliki pilihan harga/stok berbeda</p>
                    </div>
                    <button type="button" onClick={addVariantField} className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] bg-indigo-50 px-5 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                      <ListPlus size={14} /> Tambah Varian
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                    {variants.map((v, i) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-3 bg-gray-50/50 p-5 rounded-[1.75rem] border border-gray-100 animate-in slide-in-from-left-4 duration-300">
                        <div className="flex-1">
                           <input placeholder="Contoh: Ukuran XL / Warna Merah" className="w-full p-3 bg-white rounded-xl text-[11px] font-black outline-none border border-gray-100 uppercase" value={v.name} onChange={e => updateVariant(i, 'name', e.target.value)} />
                        </div>
                        <div className="flex gap-2">
                           <input type="number" placeholder="Harga" className="w-24 p-3 bg-white rounded-xl text-[11px] font-black outline-none border border-gray-200" value={v.price} onChange={e => updateVariant(i, 'price', Number(e.target.value))} />
                           <input type="number" placeholder="Stok" className="w-20 p-3 bg-white rounded-xl text-[11px] font-black outline-none border border-gray-200" value={v.stock} onChange={e => updateVariant(i, 'stock', Number(e.target.value))} />
                           <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                    {variants.length === 0 && (
                      <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-[2rem]">
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Klik "Tambah Varian" untuk opsi ukuran/warna</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 rounded-[1.75rem] font-black uppercase text-[11px] tracking-widest border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">Batal</button>
                   <button type="submit" className="flex-[2] bg-indigo-600 text-white py-5 rounded-[1.75rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-indigo-700 transition-all active:scale-[0.98]">Simpan ke Katalog</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;