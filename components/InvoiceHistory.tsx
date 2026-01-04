import React from 'react';
import { Transaction } from '../types';
import { FileText, Download, Eye, Calendar, User } from 'lucide-react';

interface InvoiceHistoryProps {
  transactions: Transaction[];
}

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ transactions }) => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Invoice</h2>
        <div className="flex gap-2">
            <button className="text-sm bg-white border border-gray-300 px-3 py-2 rounded-lg text-gray-600 font-medium">
                Export Excel
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4">No. Invoice</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Items</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-indigo-600">#{t.id}</td>
                <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400"/>
                        {new Date(t.date).toLocaleDateString('id-ID')}
                    </div>
                </td>
                <td className="p-4 text-gray-800">
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400"/>
                        {t.customerName || "Umum"}
                    </div>
                </td>
                <td className="p-4 text-gray-600">
                    {t.items.length} item(s)
                </td>
                <td className="p-4 text-right font-bold text-gray-800">
                  Rp{t.total.toLocaleString('id-ID')}
                </td>
                <td className="p-4 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Lunas</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md" title="Lihat Detail">
                        <Eye size={16} />
                    </button>
                    <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md" title="Download PDF">
                        <Download size={16} />
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

export default InvoiceHistory;