import React from 'react';
import { Product } from '../types';
import { Edit, Trash2, Plus, Box, Layers, Search } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
}

const ProductManager: React.FC<ProductManagerProps> = ({ products }) => {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Manajemen Produk</h2>
            <p className="text-gray-500 text-xs md:text-sm">Kelola daftar menu, harga, dan varian secara efisien.</p>
        </div>
        <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-100 transition-all">
          <Plus size={18} /> Tambah Menu Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Cari nama menu..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-[0.1em] border-b border-gray-100">
                <th className="p-5 font-bold">Produk</th>
                <th className="p-5 font-bold">Kategori</th>
                <th className="p-5 font-bold">Varian Tersedia</th>
                <th className="p-5 font-bold">Harga Pokok</th>
                <th className="p-5 font-bold text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate">{product.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">#{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-5">
                    {product.variants && product.variants.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.variants.map((v, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200">
                            {v.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs italic">Standar</span>
                    )}
                  </td>
                  <td className="p-5 font-black text-gray-800">
                    Rp{product.price.toLocaleString('id-ID')}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 rounded-xl text-gray-400 hover:text-red-500 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;