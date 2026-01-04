
import React from 'react';
import { Customer, Supplier, User as UserType } from '../types';
import { Users, Truck, ShieldCheck, Mail, Phone, MapPin, MoreHorizontal, User } from 'lucide-react';

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
                    {/* Fixed: User is now correctly imported as a component from lucide-react */}
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
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{header.title}</h2>
                <p className="text-gray-500 text-sm">{header.subtitle}</p>
            </div>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium">
          + Tambah Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item: any) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative group">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            {item.name.charAt(0)}
                        </div>
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                    </div>
                    <button className="text-gray-300 hover:text-gray-600">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                
                <div className="mt-2">
                    {renderCardContent(item)}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleManager;
