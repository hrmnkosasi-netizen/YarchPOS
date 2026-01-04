import React from 'react';
import { Product } from '../types';
import { Edit, Trash2, Plus, Box, Layers } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
}

const ProductManager: React.FC<ProductManagerProps> = ({ products }) => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Produk</h2>
            <p className="text-gray-500 text-sm">Kelola daftar menu, harga, dan varian.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-semibold">Info Produk</th>
              <th className="p-4 font-semibold">Kategori</th>
              <th className="p-4 font-semibold">Varian</th>
              <th className="p-4 font-semibold">Harga Dasar</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-400">ID: {product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold">
                    {product.category}
                  </span>
                </td>
                <td className="p-4">
                  {product.variants && product.variants.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {product.variants.map((v, idx) => (
                        <div key={idx} className="text-xs flex items-center gap-1 text-gray-600">
                          <Layers size={12} className="text-indigo-400"/>
                          <span>{v.name} (Rp{v.price.toLocaleString()})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm italic">- Tanpa Varian -</span>
                  )}
                </td>
                <td className="p-4 font-medium text-gray-800">
                  Rp{product.price.toLocaleString('id-ID')}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-red-600">
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
  );
};

export default ProductManager;