import React from 'react';
import { ProductCategory } from '../types.ts';
import { MOCK_CATEGORIES } from '../constants.ts';
import { FolderTree, Edit2, PlusCircle } from 'lucide-react';

const CategoryManager: React.FC = () => {
  // Simple recursive renderer for tree structure
  const renderCategoryTree = (categories: ProductCategory[], parentId: string | null = null, level: number = 0) => {
    const nodes = categories.filter(c => c.parentId === parentId);
    
    if (nodes.length === 0) return null;

    return (
      <div className={`space-y-2 ${level > 0 ? 'ml-6 pl-4 border-l border-gray-200' : ''}`}>
        {nodes.map(node => (
          <div key={node.id}>
            <div className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-100 shadow-sm transition-all group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${level === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                    <FolderTree size={16} />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{node.name}</h4>
                    <span className="text-xs text-gray-400">ID: {node.id}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                    <button className="text-gray-400 hover:text-indigo-600"><Edit2 size={14} /></button>
                    <button className="text-gray-400 hover:text-green-600"><PlusCircle size={14} /></button>
                </div>
            </div>
            {renderCategoryTree(categories, node.id, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Kategori Menu</h2>
            <p className="text-gray-500 text-sm">Struktur kategori bertingkat (Nested Categories).</p>
        </div>
        <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm">
          + Root Kategori
        </button>
      </div>

      <div className="max-w-3xl">
        {renderCategoryTree(MOCK_CATEGORIES)}
      </div>
    </div>
  );
};

export default CategoryManager;