import React from 'react';
import { Transaction } from '../types.ts';
import { FileText, Download, Eye, Calendar, Filter, Search, ChevronRight } from 'lucide-react';

interface InvoiceHistoryProps {
  transactions: Transaction[];
}

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ transactions }) => {
  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-10 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Sales<span className="text-indigo-600">History</span></h2>
            <p className="text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mt-1">Comprehensive Transaction Ledger</p>
        </div>
        <button className="w-full sm:w-auto text-[10px] bg-white border border-gray-200 px-8 py-4 rounded-[1.5rem] text-gray-900 font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm transition-all flex items-center justify-center gap-3">
            <Download size={18} /> Export Ledger (.xlsx)
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/20 flex flex-col xl:flex-row gap-6 items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="Filter by Invoice ID..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-wider outline-none focus:ring-4 focus:ring-indigo-50 transition-all" 
            />
          </div>
          <button className="flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-all">
            <Filter size={18} /> Date Range Selection
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-gray-400 text-[10px] uppercase tracking-[0.3em] border-b border-gray-100">
                <th className="px-10 py-6 font-black">Reference</th>
                <th className="px-8 py-6 font-black">Settlement Date</th>
                <th className="px-8 py-6 font-black">Customer Profile</th>
                <th className="px-8 py-6 font-black">Items</th>
                <th className="px-8 py-6 font-black text-right">Net Total</th>
                <th className="px-8 py-6 font-black text-center">Status</th>
                <th className="px-10 py-6 font-black text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                  <td className="px-10 py-6 font-black text-indigo-600 tracking-wider text-xs italic"># {t.id}</td>
                  <td className="px-8 py-6 text-gray-500 font-bold text-[11px]">
                      <div className="flex items-center gap-2 uppercase tracking-tight">
                          <Calendar size={14} className="text-indigo-300"/>
                          {new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                  </td>
                  <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[11px] text-indigo-600 font-black uppercase shadow-sm border border-indigo-100">
                            {(t.customerName || "U").charAt(0)}
                          </div>
                          <span className="font-black text-gray-900 text-xs uppercase tracking-tighter italic">{t.customerName || "General Customer"}</span>
                      </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.items.length} units listed</span>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-gray-900 text-sm tracking-tighter italic">
                    Rp {t.total.toLocaleString('id-ID')}
                  </td>
                  <td className="px-8 py-6 text-center">
                      <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">Settled</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-xl rounded-2xl border border-transparent hover:border-gray-100 transition-all" title="View Details">
                          <Eye size={18} />
                      </button>
                      <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-xl rounded-2xl border border-transparent hover:border-gray-100 transition-all" title="Reprint">
                          <FileText size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden p-4 space-y-4">
          {transactions.map((t) => (
             <div key={t.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all active:scale-[0.98] group">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[9px] font-black text-indigo-600 italic tracking-widest uppercase"># {t.id}</p>
                      <div className="flex items-center gap-1.5 text-gray-300 mt-1">
                         <Calendar size={12} />
                         <span className="text-[9px] font-bold uppercase">{new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                   </div>
                   <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest">Settled</span>
                </div>

                <div className="flex items-center gap-3 py-3 border-y border-gray-50">
                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xs uppercase shadow-inner">{ (t.customerName || "U").charAt(0) }</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</p>
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-tighter italic truncate">{t.customerName || "General Customer"}</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                        <p className="text-sm font-black text-gray-900 italic tracking-tighter">Rp {t.total.toLocaleString('id-ID')}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                   <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{t.items.length} items purchased</p>
                   <button className="flex items-center gap-1 text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl">Details <ChevronRight size={12} /></button>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHistory;