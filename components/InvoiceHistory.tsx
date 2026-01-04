import React from 'react';
import { Transaction } from '../types';
import { FileText, Download, Eye, Calendar, User, Search, Filter } from 'lucide-react';

interface InvoiceHistoryProps {
  transactions: Transaction[];
}

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ transactions }) => {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Riwayat Transaksi</h2>
            <p className="text-gray-500 text-xs md:text-sm">Pantau semua aktivitas penjualan yang telah tercatat.</p>
        </div>
        <button className="w-full sm:w-auto text-sm bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-gray-700 font-bold hover:bg-gray-50 shadow-sm transition-all flex items-center justify-center gap-2">
            <Download size={16} /> Export Data (.xlsx)
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Cari No. Invoice..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            <Filter size={16} /> Filter Periode
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-white text-gray-500 text-[11px] uppercase tracking-[0.1em] border-b border-gray-100">
                <th className="p-5 font-bold">No. Invoice</th>
                <th className="p-5 font-bold">Waktu Transaksi</th>
                <th className="p-5 font-bold">Pelanggan</th>
                <th className="p-5 font-bold">Rincian</th>
                <th className="p-5 font-bold text-right">Nominal</th>
                <th className="p-5 font-bold text-center">Status</th>
                <th className="p-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5 font-black text-indigo-600">#{t.id}</td>
                  <td className="p-5 text-gray-600">
                      <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400"/>
                          {new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                  </td>
                  <td className="p-5 text-gray-800">
                      <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase">
                            {(t.customerName || "U").charAt(0)}
                          </div>
                          <span className="font-medium">{t.customerName || "Umum"}</span>
                      </div>
                  </td>
                  <td className="p-5 text-gray-500 text-xs">
                    {t.items.length} Menu dipesan
                  </td>
                  <td className="p-5 text-right font-black text-gray-900">
                    Rp{t.total.toLocaleString('id-ID')}
                  </td>
                  <td className="p-5 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Berhasil</span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all" title="Lihat Detail">
                          <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm rounded-xl transition-all" title="Cetak Ulang">
                          <FileText size={18} />
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

export default InvoiceHistory;