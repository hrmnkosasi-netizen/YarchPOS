import React, { useEffect, useState, useMemo } from 'react';
import { Transaction } from '../types';
import { generateBusinessInsight } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Sparkles, TrendingUp, DollarSign, Activity, Calendar, Filter, XCircle } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = t.date.split('T')[0];
      const isAfterStart = startDate ? tDate >= startDate : true;
      const isBeforeEnd = endDate ? tDate <= endDate : true;
      return isAfterStart && isBeforeEnd;
    });
  }, [transactions, startDate, endDate]);

  // Aggregating data for charts based on filtered transactions
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    
    // Sort transactions by date first to ensure chart order
    const sorted = [...filteredTransactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sorted.forEach(t => {
      const date = t.date.split('T')[0]; // YYYY-MM-DD
      grouped[date] = (grouped[date] || 0) + t.total;
    });

    const data = Object.keys(grouped).map(date => ({
      date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      originalDate: date,
      total: grouped[date]
    }));

    // If no filter is active, default to last 7 items for better initial view
    if (!startDate && !endDate) {
      return data.slice(-7);
    }

    return data;
  }, [filteredTransactions, startDate, endDate]);

  const totalRevenue = useMemo(() => filteredTransactions.reduce((sum, t) => sum + t.total, 0), [filteredTransactions]);
  const avgTransaction = useMemo(() => filteredTransactions.length > 0 ? totalRevenue / filteredTransactions.length : 0, [totalRevenue, filteredTransactions.length]);

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    // Use filtered transactions for insight
    const result = await generateBusinessInsight(filteredTransactions);
    setInsight(result);
    setLoadingInsight(false);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  useEffect(() => {
    // Auto-generate insight on mount if data exists
    if (transactions.length > 0 && !insight) {
      handleGenerateInsight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-generate insight when filter changes substantially (optional, but good for UX)
  useEffect(() => {
    if (startDate || endDate) {
       // Reset insight when filter changes to encourage refreshing analysis for new context
       // or we could auto-fetch. Let's keep existing insight but allow refresh.
    }
  }, [startDate, endDate]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard & Analisis</h2>
        
        {/* Date Filter Controls */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-2">
          <div className="flex items-center gap-2 px-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Filter:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-gray-400 text-xs">s/d</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {(startDate || endDate) && (
            <button 
              onClick={clearFilter}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1"
              title="Hapus Filter"
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pendapatan</p>
            <p className="text-xl font-bold text-gray-800">Rp{totalRevenue.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Transaksi</p>
            <p className="text-xl font-bold text-gray-800">{filteredTransactions.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rata-rata Keranjang</p>
            <p className="text-xl font-bold text-gray-800">Rp{Math.round(avgTransaction).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-between">
            <span>Tren Penjualan</span>
            <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {startDate || endDate ? 'Filtered' : '7 Hari Terakhir'}
            </span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartData.length > 0 ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`Rp${value.toLocaleString()}`, 'Total']}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="total" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Tidak ada data pada periode ini
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Sparkles className="mr-2" size={20} />
                Saran Cerdas Gemini
              </h3>
              <button 
                onClick={handleGenerateInsight} 
                disabled={loadingInsight}
                className="text-xs bg-white/20 hover:bg-white/30 transition px-3 py-1 rounded-full backdrop-blur-sm"
              >
                {loadingInsight ? 'Menganalisis...' : 'Refresh Analisis'}
              </button>
            </div>
            
            <div className="flex-1 bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/10 overflow-y-auto custom-scrollbar">
              {loadingInsight ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="space-y-2 text-sm leading-relaxed whitespace-pre-line">
                  {insight || "Data penjualan belum cukup untuk analisis."}
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;