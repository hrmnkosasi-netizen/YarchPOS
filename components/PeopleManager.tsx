import React from 'react';
import { Customer, Supplier, User as UserType } from '../types.ts';
import { Users, Truck, ShieldCheck, Mail, Phone, MapPin, MoreHorizontal, User, Search, Plus } from 'lucide-react';

type PeopleType = 'customer' | 'supplier' | 'user';

interface PeopleManagerProps {
  type: PeopleType;
  data: (Customer | Supplier | UserType)[];
}

const PeopleManager: React.FC<PeopleManagerProps> = ({ type, data }) => {
  const getHeader = () => {
    switch (type) {
      case 'customer': return { title: 'Daftar Pelanggan', subtitle: 'Kelola data pelanggan dan poin loyalitas.', icon: Users };
      case 'supplier': return { title: 'Daftar Supplier', subtitle: 'Kelola data pemasok bahan baku.', icon: Truck };
      case 'user': return { title: 'Manajemen Pengguna', subtitle: 'Atur akses staf kasir dan manajer.', icon: ShieldCheck };
    }
  };

  const header = getHeader();
  const Icon = header.icon;

  const renderCardContent = (item: any) => {
    if (type === 'customer') {
        const c = item as Customer;
        return (
            <>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Phone size={14} /> {c.phone}
                </div>
                {c.email && <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Mail size={14} /> {c.email}
                </div>}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Loyalty Points</span>
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md text-xs">{c.points} pts</span>
                </div>
            </>
        );
    }
    if (type === 'supplier') {
        const s = item as Supplier;
        return (
            <>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <User size={14} /> CP: {s.contactPerson}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Phone size={14} /> {s.phone}
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600 mt-1">
                    <MapPin size={14} className="mt-0.5 min-w-[14px]" /> <span className="line-clamp-2">{s.address}</span>
                </div>
            </>
        );
    }
    if (type === 'user') {
        const u = item as UserType;
        return (
            <>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {u.role}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                    <Mail size={14} /> {u.email}
                </div>
            </>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{header.title}</h2>
                <p className="text-gray-500 text-xs font-medium">{header.subtitle}</p>
            </div>
        </div>
        
        <button className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
          <Plus size={16} /> Tambah Data
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder={`Cari nama ${type === 'user' ? 'pengguna' : type === 'supplier' ? 'supplier' : 'pelanggan'}...`} 
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
            />
        </div>
        <div className="w-full md:w-auto flex gap-2">
            <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50">Filter</button>
            <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50">Export</button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item: any) => (
            <div key={item.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner ${
                            type === 'user' ? 'bg-blue-50 text-blue-600' :
                            type === 'supplier' ? 'bg-orange-50 text-orange-600' :
                            'bg-indigo-50 text-indigo-600'
                        }`}>
                            {item.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-black text-gray-800 text-sm">{item.name}</h3>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID: {item.id}</span>
                        </div>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 border-dashed">
                    {renderCardContent(item)}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleManager;