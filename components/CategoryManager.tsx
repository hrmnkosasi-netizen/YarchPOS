import React, { useState } from 'react';
import { ProductCategory } from '../types.ts';
import { FolderTree, Trash2, Plus, X, Layers } from 'lucide-react';

interface CategoryManagerProps {
  categories: ProductCategory[];
  onAdd: (c: ProductCategory) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAdd }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const newCat: ProductCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      parentId: null
    };
    onAdd(newCat);
    setNewCatName('');
    setShowAddModal(false);
  };

  return (
    <div className="p-6 md:p-10 space-y-10 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl shadow-indigo-100">
             <Layers size={28} />
          </div>
          <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Master<span className="text-indigo-600">Kategori</span></h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Klasifikasi Menu Penjualan</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black shadow-2xl text-[10px] tracking-widest uppercase">
          <Plus size={18} /> Kategori Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(node => (
          <div key={node.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-2xl transition-all duration-500">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600`}>
                <FolderTree size={24} />
            </div>
            <div className="flex-1">
                <h4 className="font-black text-gray-800 text-sm uppercase italic tracking-tighter">{node.name}</h4>
                <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">ID: {node.id.slice(-4)}</span>
            </div>
            <button className="text-gray-200 group-hover:text-red-500 transition-colors">
                <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden animate-in zoom-in duration-300 shadow-2xl">
             <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-black text-xl uppercase italic tracking-tighter">Kategori Baru</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-900"><X size={24}/></button>
             </div>
             <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Kategori</label>
                   <input required autoFocus value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100 uppercase italic" placeholder="Misal: Paket Hemat" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.75rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-indigo-700 transition-all">Daftarkan Kategori</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;