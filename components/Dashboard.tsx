import React, { useEffect, useState, useMemo } from 'react';
import { Transaction } from '../types.ts';
import { generateBusinessInsight } from '../services/geminiService.ts';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Sparkles, TrendingUp, DollarSign, Activity, XCircle, ArrowUpRight, ArrowDownRight, Clock, Zap } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = t.date.split('T')[0];
      const isAfterStart = startDate ? tDate >= startDate : true;
      const isBeforeEnd = endDate ? tDate <= endDate : true;
      return isAfterStart && isBeforeEnd;
    });
  }, [transactions, startDate, endDate]);

  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    const sorted = [...filteredTransactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sorted.forEach(t => {
      const date = t.date.split('T')[0];
      grouped[date] = (grouped[date] || 0) + t.total;
    });

    return Object.keys(grouped).map(date => ({
      date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      total: grouped[date]
    })).slice(-7);
  }, [filteredTransactions]);

  const totalRevenue = useMemo(() => filteredTransactions.reduce((sum, t) => sum + t.total, 0), [filteredTransactions]);
  const avgTransaction = useMemo(() => filteredTransactions.length > 0 ? totalRevenue / filteredTransactions.length : 0, [totalRevenue, filteredTransactions.length]);

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    const result = await generateBusinessInsight(filteredTransactions);
    setInsight(result);
    setLoadingInsight(false);
  };

  useEffect(() => {
    if (transactions.length > 0 && !insight) {
      handleGenerateInsight();
    }
  }, []);

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-fade-in max-w-[1600px] mx-auto pb-24 lg:pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Analytics<span className="text-indigo-600">Report</span></h2>
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mt-1">Real-time store performance monitor</p>
        </div>
        
        <div className="bg-white p-3 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 flex items-center gap-3 self-start md:self-auto ring-4 ring-gray-50/30">
          <div className="flex flex-col px-3 border-r border-gray-100">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Mulai</span>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-none bg-transparent p-0 text-[11px] font-black uppercase outline-none focus:text-indigo-600"
              />
          </div>
          <div className="flex flex-col px-3">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Akhir</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-none bg-transparent p-0 text-[11px] font-black uppercase outline-none focus:text-indigo-600"
              />
          </div>
          {(startDate || endDate) && (
            <button onClick={() => {setStartDate(''); setEndDate('');}} className="p-2 text-red-400 hover:bg-red-50 rounded-2xl transition-colors">
              <XCircle size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: DollarSign, label: 'Pendapatan Kotor', value: `Rp${totalRevenue.toLocaleString('id-ID')}`, color: 'indigo', trend: '+12.5%' },
          { icon: TrendingUp, label: 'Total Transaksi', value: filteredTransactions.length, color: 'emerald', trend: '+5.2%' },
          { icon: Activity, label: 'Rata-rata Keranjang', value: `Rp${Math.round(avgTransaction).toLocaleString('id-ID')}`, color: 'amber', trend: '-1.4%' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 group cursor-default shadow-sm">
            <div className={`w-16 h-16 bg-${card.color}-50 rounded-3xl flex items-center justify-center text-${card.color}-600 shadow-sm transition-transform group-hover:scale-110 duration-500 ring-4 ring-${card.color}-50/50`}>
              <card.icon size={32} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{card.label}</p>
              <div className="flex items-center gap-3">
                  <p className="text-2xl font-black text-gray-900 tracking-tight">{card.value}</p>
                  <span className={`text-[10px] font-black ${card.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-xl flex items-center`}>
                      {card.trend}
                  </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
                <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg italic">Tren Penjualan</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Daily revenue distribution</p>
            </div>
            <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 tracking-widest uppercase italic shadow-sm">Live Feed</div>
          </div>
          
          <div className="w-full relative z-10" style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartData.length > 0 ? (
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1', textAnchor: 'middle'}} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={15}
                  />
                  <YAxis 
                    tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(v) => `${v/1000}k`}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px', backgroundColor: '#0f172a', color: '#fff'}}
                    itemStyle={{fontSize: '12px', fontWeight: 900, color: '#818cf8'}}
                  />
                  <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={24}>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#e2e8f0'} className="hover:fill-indigo-400 transition-colors duration-300" />
                      ))}
                  </Bar>
                </BarChart>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                    <Zap size={40} className="opacity-20" />
                    <span className="font-black uppercase tracking-[0.3em] text-[10px]">No transaction data available</span>
                </div>
              )}
            </ResponsiveContainer>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>

        <div className="bg-[#0c0f17] p-10 rounded-[3rem] text-white relative overflow-hidden flex flex-col shadow-2xl shadow-indigo-950/40 border border-white/5">
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <Sparkles className="text-indigo-400 animate-pulse" size={24} />
                </div>
                <div>
                    <h3 className="font-black uppercase tracking-tighter italic text-xl">Gemini Pro <span className="text-indigo-400">AI</span></h3>
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.3em]">Business Strategy Engine</p>
                </div>
              </div>
              <button 
                onClick={handleGenerateInsight}
                disabled={loadingInsight}
                className="text-[10px] font-black bg-white/5 hover:bg-indigo-600 px-5 py-2.5 rounded-2xl transition-all disabled:opacity-50 backdrop-blur-md border border-white/10 uppercase tracking-widest shadow-lg"
              >
                {loadingInsight ? 'Analysing...' : 'Refresh AI'}
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex-1 min-h-[260px] max-h-[260px] overflow-y-auto no-scrollbar backdrop-blur-xl relative">
              {loadingInsight ? (
                <div className="h-full flex flex-col items-center justify-center gap-6">
                   <div className="relative">
                       <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                       <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                   </div>
                   <span className="text-[10px] font-black tracking-[0.4em] text-indigo-300 animate-pulse uppercase">Thinking...</span>
                </div>
              ) : (
                <div className="text-[13px] leading-relaxed font-medium text-gray-300 whitespace-pre-line space-y-4">
                  {insight || "Gunakan AI untuk menganalisis pola penjualan dan mendapatkan saran strategis untuk bisnis Anda."}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">System Online</span>
            </div>
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Model: G-AI-2.0-FLASH</span>
          </div>

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm shadow-gray-100/50">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between">
           <div>
               <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg italic">Log Transaksi Terakhir</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Last 5 completed transactions</p>
           </div>
           <button className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-5 py-2.5 rounded-2xl transition-all uppercase tracking-widest">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                        <th className="px-10 py-5">No. Invoice</th>
                        <th className="px-10 py-5">Waktu</th>
                        <th className="px-10 py-5">Pelanggan</th>
                        <th className="px-10 py-5">Nominal</th>
                        <th className="px-10 py-5 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredTransactions.slice(0, 5).map(t => (
                        <tr key={t.id} className="hover:bg-gray-50/80 transition-all duration-300 group cursor-default">
                            <td className="px-10 py-5 font-black text-[11px] text-indigo-600 group-hover:translate-x-1 transition-transform tracking-wider uppercase italic"># {t.id}</td>
                            <td className="px-10 py-5 text-[11px] font-bold text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock size={12} className="text-gray-300" />
                                    {new Date(t.date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </td>
                            <td className="px-10 py-5 text-[11px] font-black text-gray-800 uppercase tracking-tighter">{t.customerName || 'Umum'}</td>
                            <td className="px-10 py-5 text-sm font-black text-gray-900 tracking-tight">Rp {t.total.toLocaleString('id-ID')}</td>
                            <td className="px-10 py-5">
                                <div className="flex items-center justify-center">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">Settled</span>
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

export default Dashboard;