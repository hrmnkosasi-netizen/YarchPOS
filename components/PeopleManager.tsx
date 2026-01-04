import React, { useState } from 'react';
import { Customer, Supplier, User as UserType } from '../types.ts';
import { Users, Truck, ShieldCheck, Mail, Phone, MapPin, MoreHorizontal, User, Search, Plus, Trash2, X } from 'lucide-react';

type PeopleType = 'customer' | 'supplier' | 'user';

interface PeopleManagerProps {
  type: PeopleType;
  data: (Customer | Supplier | UserType)[];
  onAdd: (p: any) => void;
}

const PeopleManager: React.FC<PeopleManagerProps> = ({ type, data, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', detail: '' });

  const getHeader = () => {
    switch (type) {
      case 'customer': return { title: 'Daftar Pelanggan', subtitle: 'Kelola database pelanggan & loyalitas.', icon: Users, color: 'indigo' };
      case 'supplier': return { title: 'Daftar Pemasok', subtitle: 'Manajemen distributor bahan baku.', icon: Truck, color: 'amber' };
      case 'user': return { title: 'Daftar Pengguna', subtitle: 'Kontrol hak akses & akun staf.', icon: ShieldCheck, color: 'blue' };
    }
  };

  const header = getHeader();
  const Icon = header.icon;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    const newPerson = {
        id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        points: 0,
        role: type === 'user' ? 'Cashier' : undefined,
        address: type === 'supplier' ? formData.detail : undefined
    };
    onAdd(newPerson);
    setShowModal(false);
    setFormData({ name: '', phone: '', email: '', detail: '' });
  };

  const renderCardContent = (item: any) => {
    if (type === 'customer') {
        const c = item as Customer;
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                    <Phone size={14} className="text-indigo-400" /> {c.phone}
                </div>
                {c.email && <div className="flex items-center gap-3 text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                    <Mail size={14} className="text-indigo-400" /> {c.email}
                </div>}
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Loyalty Points</span>
                    <span className="text-indigo-600 font-black bg-indigo-50 px-3 py-1.5 rounded-xl text-[10px] border border-indigo-100 italic">{c.points} PTS</span>
                </div>
            </div>
        );
    }
    if (type === 'supplier') {
        const s = item as Supplier;
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                    <User size={14} className="text-amber-400" /> CP: {s.contactPerson || 'N/A'}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                    <Phone size={14} className="text-amber-400" /> {s.phone}
                </div>
                <div className="flex items-start gap-3 text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                    <MapPin size={14} className="text-amber-400 shrink-0" /> <span className="line-clamp-2">{s.address}</span>
                </div>
            </div>
        );
    }
    if (type === 'user') {
        const u = item as UserType;
        return (
            <div className="space-y-3">
                <div className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 italic">
                  {u.role}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500 font-bold uppercase tracking-tight pt-2">
                    <Mail size={14} className="text-blue-400" /> {u.email}
                </div>
            </div>
        );
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-10 animate-fade-in max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div className="flex items-center gap-4">
            <div className={`p-4 bg-${header.color}-600 text-white rounded-[1.5rem] shadow-xl shadow-${header.color}-200`}>
                <Icon size={28} />
            </div>
            <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase">{header.title}</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">{header.subtitle}</p>
            </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95"
        >
          <Plus size={18} /> Daftarkan Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data.map((item: any) => (
            <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative group cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black italic border border-gray-50 shadow-inner ${
                            type === 'user' ? 'bg-blue-50 text-blue-600' :
                            type === 'supplier' ? 'bg-amber-50 text-amber-600' :
                            'bg-indigo-50 text-indigo-600'
                        }`}>
                            {item.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter italic leading-tight">{item.name}</h3>
                            <span className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em] mt-1 block">ID: {item.id.slice(-6)}</span>
                        </div>
                    </div>
                </div>
                
                <div className="pt-6 border-t border-gray-50 border-dashed relative">
                    {renderCardContent(item)}
                    <div className="absolute top-6 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors"><MoreHorizontal size={16} /></button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-black text-xl uppercase italic tracking-tighter">Tambah Data {type}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-all"><X size={24}/></button>
             </div>
             <form onSubmit={handleAddSubmit} className="p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                   <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100 uppercase italic tracking-tight" placeholder="Masukan Nama..." />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nomor Telepon</label>
                   <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100" placeholder="08..." />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email (Opsional)</label>
                   <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-100" placeholder="user@mail.com" />
                </div>
                {type === 'supplier' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alamat Gudang</label>
                    <textarea value={formData.detail} onChange={e => setFormData({...formData, detail: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-100" rows={2} placeholder="Alamat lengkap supplier..." />
                  </div>
                )}
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.75rem] font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all">Daftarkan Sekarang</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleManager;