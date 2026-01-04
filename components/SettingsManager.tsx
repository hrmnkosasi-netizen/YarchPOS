import React, { useState } from 'react';
import { Outlet, PaymentMethod, TaxServiceConfig, ReceiptConfig } from '../types';
import { MOCK_OUTLETS, MOCK_PAYMENTS } from '../constants';
import { MapPin, Phone, Mail, Plus, Trash2, CreditCard, Percent, Receipt, Store, Save, CheckCircle2 } from 'lucide-react';

type TabType = 'outlets' | 'payments' | 'tax' | 'receipt';

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('outlets');
  const [outlets, setOutlets] = useState<Outlet[]>(MOCK_OUTLETS);
  const [payments, setPayments] = useState<PaymentMethod[]>(MOCK_PAYMENTS);
  const [taxConfig, setTaxConfig] = useState<TaxServiceConfig>({
    taxPercentage: 11,
    servicePercentage: 5,
    isTaxEnabled: true,
    isServiceEnabled: false
  });
  const [receiptConfig, setReceiptConfig] = useState<ReceiptConfig>({
    headerText: 'Terima Kasih Telah Berkunjung!',
    footerText: 'Silahkan datang kembali. Simpan struk ini sebagai bukti pembayaran sah.',
    showLogo: true,
    showSocialMedia: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all font-medium text-sm ${
        activeTab === id 
          ? 'border-indigo-600 text-indigo-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h2>
          <p className="text-gray-500 text-sm">Konfigurasi outlet, biaya tambahan, dan template struk.</p>
        </div>
        {saveSuccess ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200 animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">Perubahan Disimpan</span>
          </div>
        ) : (
          <button 
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-indigo-200 transition-all"
          >
            <Save size={18} /> Simpan Semua
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 px-4">
          <TabButton id="outlets" label="Outlet" icon={Store} />
          <TabButton id="payments" label="Pembayaran" icon={CreditCard} />
          <TabButton id="tax" label="Pajak & Service" icon={Percent} />
          <TabButton id="receipt" label="Template Struk" icon={Receipt} />
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'outlets' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Daftar Outlet / Cabang</h3>
                <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
                  <Plus size={16} /> Tambah Outlet
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outlets.map(outlet => (
                  <div key={outlet.id} className="p-5 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors bg-gray-50/30 group">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{outlet.name}</h4>
                      <button className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-1 shrink-0 text-gray-400" />
                        <span>{outlet.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="shrink-0 text-gray-400" />
                        <span>{outlet.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="shrink-0 text-gray-400" />
                        <span>{outlet.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="font-bold text-gray-800">Metode Pembayaran Aktif</h3>
              <div className="space-y-3">
                {payments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{payment.name}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest">{payment.type}</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={payment.isActive} 
                        onChange={() => {}}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="max-w-xl space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div>
                    <h4 className="font-bold text-indigo-900">Pajak Pertambahan Nilai (PPN)</h4>
                    <p className="text-xs text-indigo-700">Aktifkan untuk menambahkan pajak otomatis di setiap transaksi.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={taxConfig.isTaxEnabled} onChange={() => setTaxConfig(p => ({...p, isTaxEnabled: !p.isTaxEnabled}))}/>
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center gap-4 px-4">
                  <span className="text-sm font-medium text-gray-600 w-32">Persentase Pajak</span>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={taxConfig.taxPercentage} 
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right pr-8"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400">%</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div>
                    <h4 className="font-bold text-purple-900">Biaya Layanan (Service Charge)</h4>
                    <p className="text-xs text-purple-700">Tambahkan biaya operasional restoran di struk.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={taxConfig.isServiceEnabled} onChange={() => setTaxConfig(p => ({...p, isServiceEnabled: !p.isServiceEnabled}))}/>
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center gap-4 px-4">
                  <span className="text-sm font-medium text-gray-600 w-32">Persentase Service</span>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={taxConfig.servicePercentage} 
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right pr-8"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'receipt' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="font-bold text-gray-800">Kustomisasi Teks Struk</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Header Struk (Atas)</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      rows={2}
                      value={receiptConfig.headerText}
                      onChange={(e) => setReceiptConfig(p => ({...p, headerText: e.target.value}))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Footer Struk (Bawah)</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      rows={3}
                      value={receiptConfig.footerText}
                      onChange={(e) => setReceiptConfig(p => ({...p, footerText: e.target.value}))}
                    />
                  </div>
                </div>
              </div>

              {/* Struk Preview */}
              <div className="bg-gray-100 p-6 rounded-2xl flex justify-center">
                <div className="bg-white w-64 shadow-xl p-4 font-mono text-[10px] text-gray-800 flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-800 rounded-full mb-2"></div>
                  <div className="font-bold text-center mb-1">WARUNG PINTAR AI</div>
                  <div className="text-center text-[8px] mb-4">Sudirman, Jakarta Pusat</div>
                  
                  <div className="w-full border-t border-dashed border-gray-300 my-2"></div>
                  <div className="text-center italic mb-4">"{receiptConfig.headerText}"</div>
                  
                  <div className="w-full space-y-1">
                    <div className="flex justify-between"><span>2x Nasi Goreng</span><span>50.000</span></div>
                    <div className="flex justify-between"><span>1x Es Teh</span><span>5.000</span></div>
                  </div>
                  
                  <div className="w-full border-t border-dashed border-gray-300 my-2"></div>
                  <div className="w-full space-y-1 font-bold">
                    <div className="flex justify-between"><span>Subtotal</span><span>55.000</span></div>
                    <div className="flex justify-between"><span>Pajak (11%)</span><span>6.050</span></div>
                    <div className="flex justify-between text-xs"><span>TOTAL</span><span>61.050</span></div>
                  </div>
                  
                  <div className="w-full border-t border-dashed border-gray-300 my-4"></div>
                  <div className="text-center leading-tight opacity-70">
                    {receiptConfig.footerText}
                  </div>
                  <div className="mt-4 text-[8px] opacity-40">24/05/2024 14:30 | INV-1029</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;