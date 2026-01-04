import React, { useState, useRef } from 'react';
import { Outlet, PaymentMethod, TaxServiceConfig, ReceiptConfig } from '../types';
import { MOCK_OUTLETS, MOCK_PAYMENTS } from '../constants';
import { MapPin, Phone, Mail, Plus, Trash2, CreditCard, Percent, Receipt, Store, Save, CheckCircle2, Instagram, Globe, Layout, Upload, X, Image as ImageIcon, QrCode, Type } from 'lucide-react';

type TabType = 'outlets' | 'payments' | 'tax' | 'receipt';

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('receipt');
  const [outlets, setOutlets] = useState<Outlet[]>(MOCK_OUTLETS);
  const [payments, setPayments] = useState<PaymentMethod[]>(MOCK_PAYMENTS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [taxConfig, setTaxConfig] = useState<TaxServiceConfig>({
    taxPercentage: 11,
    servicePercentage: 5,
    isTaxEnabled: true,
    isServiceEnabled: false
  });
  
  const [receiptConfig, setReceiptConfig] = useState<ReceiptConfig>({
    storeName: 'WARUNG PINTAR AI',
    headerText: 'Terima Kasih Telah Berkunjung!',
    footerText: 'Silahkan datang kembali. Simpan struk ini sebagai bukti pembayaran sah.',
    qrCodeText: 'Scan untuk feedback',
    address: 'Jl. Jend. Sudirman No. 45, Jakarta Pusat',
    instagram: '@warungpintar.ai',
    website: 'warung.ai',
    showLogo: true,
    showSocialMedia: true,
    showQRCode: true,
    logoUrl: undefined
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptConfig(prev => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setReceiptConfig(prev => ({
      ...prev,
      logoUrl: undefined
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all font-medium text-xs md:text-sm whitespace-nowrap ${
        activeTab === id 
          ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in max-w-6xl mx-auto pb-20 lg:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Pengaturan Sistem</h2>
          <p className="text-gray-500 text-xs md:text-sm">Konfigurasi outlet, biaya tambahan, dan template struk.</p>
        </div>
        {saveSuccess ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-200 w-full sm:w-auto justify-center">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">Disimpan</span>
          </div>
        ) : (
          <button 
            onClick={handleSave}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-100 transition-all"
          >
            <Save size={18} /> Simpan Semua
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 bg-gray-50/50 px-2">
          <TabButton id="outlets" label="Outlet" icon={Store} />
          <TabButton id="payments" label="Pembayaran" icon={CreditCard} />
          <TabButton id="tax" label="Pajak & Service" icon={Percent} />
          <TabButton id="receipt" label="Template Struk" icon={Receipt} />
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-8">
          {activeTab === 'outlets' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Daftar Outlet</h3>
                <button className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
                  <Plus size={14} /> Tambah
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outlets.map(outlet => (
                  <div key={outlet.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 group">
                    <div className="flex justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{outlet.name}</h4>
                      <button className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-2 text-xs md:text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                        <span>{outlet.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="shrink-0 text-gray-400" />
                        <span>{outlet.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'receipt' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
              <div className="lg:col-span-7 space-y-8">
                {/* Store Header Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <Type size={18} className="text-indigo-600" />
                    Header Struk Utama
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nama Toko / Judul Struk</label>
                    <input 
                      type="text"
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all uppercase bg-gray-50/50"
                      placeholder="Contoh: WARUNG PINTAR AI"
                      value={receiptConfig.storeName}
                      onChange={(e) => setReceiptConfig(p => ({...p, storeName: e.target.value}))}
                    />
                  </div>
                </div>

                {/* Logo & Address */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <ImageIcon size={18} className="text-indigo-600" />
                    Logo & Alamat
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all">
                        {receiptConfig.logoUrl ? (
                          <img src={receiptConfig.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon size={32} className="text-gray-300" />
                        )}
                      </div>
                      {receiptConfig.logoUrl && (
                        <button 
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <div className="flex-1">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Upload size={16} /> Ganti Logo
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      <p className="text-[10px] text-gray-400 mt-2">Format PNG/JPG (Maks 2MB).</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">Alamat Outlet</label>
                    <textarea 
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
                      rows={2}
                      placeholder="Masukkan alamat lengkap..."
                      value={receiptConfig.address}
                      onChange={(e) => setReceiptConfig(p => ({...p, address: e.target.value}))}
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <Instagram size={18} className="text-indigo-600" />
                    Media Sosial
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Instagram</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
                        placeholder="@username"
                        value={receiptConfig.instagram}
                        onChange={(e) => setReceiptConfig(p => ({...p, instagram: e.target.value}))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Website</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
                        placeholder="www.domain.com"
                        value={receiptConfig.website}
                        onChange={(e) => setReceiptConfig(p => ({...p, website: e.target.value}))}
                      />
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <Receipt size={18} className="text-indigo-600" />
                    Pesan Struk
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pesan Salam (Atas)</label>
                      <textarea 
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
                        rows={2}
                        value={receiptConfig.headerText}
                        onChange={(e) => setReceiptConfig(p => ({...p, headerText: e.target.value}))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pesan Penutup (Bawah)</label>
                      <textarea 
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
                        rows={2}
                        value={receiptConfig.footerText}
                        onChange={(e) => setReceiptConfig(p => ({...p, footerText: e.target.value}))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Preview */}
              <div className="lg:col-span-5 bg-gray-50 rounded-3xl p-4 md:p-8 flex flex-col items-center sticky top-6 self-start">
                <span className="text-[10px] font-black text-gray-300 mb-6 uppercase tracking-[0.2em]">Pratinjau Nota</span>
                <div className="bg-white w-full max-w-[300px] shadow-2xl p-6 font-mono text-[11px] text-gray-800 flex flex-col items-center relative border border-gray-100 min-h-[550px]">
                  
                  {receiptConfig.showLogo && (
                    <div className="mb-4">
                      {receiptConfig.logoUrl ? (
                        <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                          <img src={receiptConfig.logoUrl} alt="Logo" className="w-full h-full object-contain filter grayscale" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                          <Store size={24} />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="font-bold text-center text-[13px] mb-1 uppercase tracking-tight">
                    {receiptConfig.storeName || 'WARUNG PINTAR AI'}
                  </div>
                  <div className="text-center text-[9px] text-gray-400 mb-4 leading-tight px-4">
                    {receiptConfig.address}
                  </div>
                  
                  <div className="w-full border-t border-dashed border-gray-200 my-2"></div>
                  
                  <div className="w-full space-y-2 mb-4">
                    <div className="flex justify-between"><span>2x Nasi Goreng Spesial</span><span>50.000</span></div>
                    <div className="flex justify-between"><span>1x Es Kopi Susu Aren</span><span>18.000</span></div>
                  </div>
                  
                  <div className="w-full border-t border-dashed border-gray-200 my-2"></div>
                  
                  <div className="w-full space-y-1.5 font-bold">
                    <div className="flex justify-between"><span>Subtotal</span><span>68.000</span></div>
                    <div className="flex justify-between text-[14px] mt-2 border-t-2 border-gray-800 pt-2">
                      <span>TOTAL</span>
                      <span>75.480</span>
                    </div>
                  </div>
                  
                  <div className="w-full border-t border-dashed border-gray-200 my-6"></div>
                  
                  <div className="text-center italic text-gray-500 mb-4 leading-tight">
                    {receiptConfig.footerText}
                  </div>

                  {receiptConfig.showQRCode && (
                    <div className="mb-6 flex flex-col items-center gap-2">
                      <div className="w-20 h-20 border border-gray-200 p-2 flex items-center justify-center bg-gray-50">
                        <QrCode size={64} className="text-gray-800" />
                      </div>
                      <span className="text-[8px] text-gray-400 uppercase tracking-widest">{receiptConfig.qrCodeText}</span>
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-1 opacity-50 text-[8px] pt-2 border-t border-gray-50 w-full mt-auto">
                    <div className="flex gap-4">
                      <span>IG: {receiptConfig.instagram}</span>
                      <span>WEB: {receiptConfig.website}</span>
                    </div>
                  </div>

                  <div className="absolute -bottom-2 left-0 right-0 h-3 flex overflow-hidden">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="min-w-[20px] h-6 bg-white rotate-45 -mt-3 border-r border-b border-gray-200 shadow-sm"></div>
                    ))}
                  </div>
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