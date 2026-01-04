import React, { useState, useRef } from 'react';
import { Outlet, PaymentMethod, TaxServiceConfig, ReceiptConfig } from '../types.ts';
import { MOCK_OUTLETS, MOCK_PAYMENTS } from '../constants.ts';
import { Store, Save, CheckCircle2, Receipt, Percent, CreditCard, Type, QrCode, Upload, Trash2, Plus, Edit2, MapPin, Phone, Mail, Globe, Instagram, Settings2, Zap } from 'lucide-react';

type TabType = 'outlets' | 'payments' | 'tax' | 'receipt';

interface SettingsManagerProps {
  receiptConfig: ReceiptConfig;
  setReceiptConfig: React.Dispatch<React.SetStateAction<ReceiptConfig>>;
  taxConfig: TaxServiceConfig;
  setTaxConfig: React.Dispatch<React.SetStateAction<TaxServiceConfig>>;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ 
  receiptConfig, setReceiptConfig, 
  taxConfig, setTaxConfig 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('receipt');
  const [outlets, setOutlets] = useState<Outlet[]>(MOCK_OUTLETS);
  const [payments, setPayments] = useState<PaymentMethod[]>(MOCK_PAYMENTS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptConfig(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePayment = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 lg:px-8 py-5 border-b-4 transition-all font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] whitespace-nowrap ${
        activeTab === id 
          ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20' 
          : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="p-4 md:p-12 space-y-10 animate-fade-in max-w-7xl mx-auto pb-20 md:pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase">System<span className="text-indigo-600">Configurations</span></h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mt-1">Manage global preferences & operational rules</p>
        </div>
        <button 
          onClick={handleSave}
          className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black transition-all shadow-2xl active:scale-95 uppercase text-xs tracking-widest"
        >
          {saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saveSuccess ? 'Changes Saved' : 'Commit Changes'}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[700px]">
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100 bg-gray-50/10 px-4">
          <TabButton id="receipt" label="Receipt" icon={Receipt} />
          <TabButton id="outlets" label="Branches" icon={Store} />
          <TabButton id="payments" label="Payments" icon={CreditCard} />
          <TabButton id="tax" label="Tax & Fee" icon={Percent} />
        </div>

        <div className="p-6 md:p-14 flex-1 bg-white">
          
          {/* --- TAB: TAX & SERVICE --- */}
          {activeTab === 'tax' && (
            <div className="max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-8">
                  <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-100 rounded-[1.25rem] flex items-center justify-center text-indigo-600 shadow-sm shadow-indigo-100">
                                <Percent size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 uppercase tracking-tighter text-lg italic leading-none">VAT Tax</h4>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Government taxation</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={taxConfig.isTaxEnabled} onChange={e => setTaxConfig(p => ({...p, isTaxEnabled: e.target.checked}))} className="sr-only peer" />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    {taxConfig.isTaxEnabled && (
                        <div className="animate-in slide-in-from-top-4 duration-500 pt-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Rate (%)</label>
                            <div className="relative group">
                                <input type="number" value={taxConfig.taxPercentage} onChange={e => setTaxConfig(p => ({...p, taxPercentage: Number(e.target.value)}))} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-black text-lg pl-6 transition-all" />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-400 opacity-50">%</span>
                            </div>
                        </div>
                    )}
                  </div>

                  <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-amber-100 rounded-[1.25rem] flex items-center justify-center text-amber-600 shadow-sm shadow-amber-100">
                                <Store size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 uppercase tracking-tighter text-lg italic leading-none">Service</h4>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hospitality fee</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={taxConfig.isServiceEnabled} onChange={e => setTaxConfig(p => ({...p, isServiceEnabled: e.target.checked}))} className="sr-only peer" />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                    </div>
                    {taxConfig.isServiceEnabled && (
                        <div className="animate-in slide-in-from-top-4 duration-500 pt-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Rate (%)</label>
                            <div className="relative group">
                                <input type="number" value={taxConfig.servicePercentage} onChange={e => setTaxConfig(p => ({...p, servicePercentage: Number(e.target.value)}))} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-50 font-black text-lg pl-6 transition-all" />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-400 opacity-50">%</span>
                            </div>
                        </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          {/* --- TAB: PAYMENTS --- */}
          {activeTab === 'payments' && (
             <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Payments</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Accepted transaction channels</p>
                    </div>
                    <button className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95">
                        <Plus size={16} /> New Method
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {payments.map(payment => (
                        <div key={payment.id} className={`p-6 rounded-[2rem] border transition-all duration-300 ${payment.isActive ? 'bg-white border-gray-200 shadow-xl shadow-gray-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center ${payment.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200 text-gray-400'} shadow-sm`}>
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-tighter">{payment.name}</h4>
                                        <span className="text-[9px] bg-gray-100 px-2.5 py-1 rounded-lg text-gray-500 font-black uppercase tracking-widest mt-1 inline-block">{payment.type}</span>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={payment.isActive} onChange={() => togglePayment(payment.id)} className="sr-only peer" />
                                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          )}

          {/* --- TAB: OUTLETS --- */}
          {activeTab === 'outlets' && (
              <div className="space-y-8 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Locations</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Branch distribution centers</p>
                    </div>
                    <button className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95">
                        <Plus size={16} /> Register Branch
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-6">
                    {outlets.map(outlet => (
                        <div key={outlet.id} className="p-6 md:p-8 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group">
                             <div className="flex items-start gap-4 md:gap-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-100">
                                    <Store size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 text-base md:text-lg uppercase tracking-tighter italic leading-none">{outlet.name}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase mt-1">
                                        <MapPin size={12} className="text-indigo-600" /> {outlet.address}
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <span className="flex items-center gap-2 text-[9px] text-gray-500 font-black uppercase tracking-wider">
                                            <Phone size={12} className="text-indigo-400" /> {outlet.phone}
                                        </span>
                                    </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0">
                                 <button className="flex-1 md:flex-none px-6 py-3 rounded-2xl border border-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                    <Edit2 size={14} /> Profile
                                 </button>
                                 <button className="p-3 rounded-2xl border border-transparent text-gray-300 hover:text-red-500 transition-all">
                                    <Trash2 size={20} />
                                 </button>
                             </div>
                        </div>
                    ))}
                </div>
              </div>
          )}

          {/* --- TAB: RECEIPT --- */}
          {activeTab === 'receipt' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-10">
                <div className="p-8 md:p-10 bg-gray-50 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 space-y-8">
                    <div className="flex items-center justify-between">
                         <h3 className="font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter italic text-lg">
                            <Upload size={24} className="text-indigo-600" />
                            Visual ID
                        </h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={receiptConfig.showLogo} onChange={e => setReceiptConfig(p => ({...p, showLogo: e.target.checked}))} className="sr-only peer" />
                            <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                    
                    {receiptConfig.showLogo && (
                         <div className="flex items-center gap-6 animate-in slide-in-from-top-4 duration-500">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[1.5rem] md:rounded-[1.75rem] border-4 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group cursor-pointer shadow-sm hover:border-indigo-400 transition-all" onClick={() => fileInputRef.current?.click()}>
                                {receiptConfig.logoUrl ? (
                                    <img src={receiptConfig.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <Upload size={32} className="text-gray-200" />
                                )}
                                <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Update</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                                <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">Upload Logo</button>
                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-none">Max 2MB. PNG/JPG</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Store Name</label>
                            <input value={receiptConfig.storeName} onChange={e => setReceiptConfig(p => ({...p, storeName: e.target.value}))} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none font-black text-indigo-600 uppercase italic tracking-tighter" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Address</label>
                            <textarea value={receiptConfig.address} onChange={e => setReceiptConfig(p => ({...p, address: e.target.value}))} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none text-[11px] font-bold shadow-sm" rows={2} />
                        </div>
                    </div>
                </div>

                 <div className="p-8 md:p-10 bg-gray-50 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                         <div className="flex items-center gap-3">
                             <QrCode size={20} className="text-gray-400" />
                             <h4 className="font-black text-gray-700 text-[10px] uppercase tracking-widest">Dynamic QR</h4>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={receiptConfig.showQRCode} onChange={e => setReceiptConfig(p => ({...p, showQRCode: e.target.checked}))} className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                         <div className="flex items-center gap-3">
                             <Instagram size={20} className="text-gray-400" />
                             <h4 className="font-black text-gray-700 text-[10px] uppercase tracking-widest">Social Media</h4>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={receiptConfig.showSocialMedia} onChange={e => setReceiptConfig(p => ({...p, showSocialMedia: e.target.checked}))} className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                    </div>
                    
                    {receiptConfig.showSocialMedia && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-500">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Instagram</label>
                                <input value={receiptConfig.instagram} onChange={e => setReceiptConfig(p => ({...p, instagram: e.target.value}))} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-[10px] font-black" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Website</label>
                                <input value={receiptConfig.website} onChange={e => setReceiptConfig(p => ({...p, website: e.target.value}))} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-[10px] font-black" />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Footer Message</label>
                        <textarea value={receiptConfig.footerText} onChange={e => setReceiptConfig(p => ({...p, footerText: e.target.value}))} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none text-[11px] font-bold italic shadow-sm" rows={2} />
                    </div>
                 </div>
              </div>

              {/* Thermal Print Preview (Stacked on mobile) */}
              <div className="relative pt-6 lg:pt-0">
                <div className="bg-gray-100 p-8 md:p-16 rounded-[3.5rem] md:rounded-[4.5rem] flex flex-col items-center justify-center border border-gray-200 shadow-inner">
                   <div className="bg-white w-full max-w-[320px] p-6 md:p-8 shadow-2xl font-mono text-[10px] md:text-[11px] text-gray-900 space-y-6 border-t-[10px] border-indigo-600 relative overflow-hidden">
                      <div className="absolute -bottom-2 left-0 w-full h-5 bg-white" style={{clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'}}></div>

                      <div className="text-center space-y-3">
                        {receiptConfig.showLogo && (
                            <div className="w-16 h-16 mx-auto mb-4 overflow-hidden rounded-[1.25rem] bg-gray-50 p-2 flex items-center justify-center border border-gray-100">
                                {receiptConfig.logoUrl ? (
                                    <img src={receiptConfig.logoUrl} className="w-full h-full object-contain filter grayscale" />
                                ) : (
                                    <Store size={28} className="text-gray-200"/>
                                )}
                            </div>
                        )}
                        <div className="font-black text-base uppercase tracking-tight italic leading-none">{receiptConfig.storeName}</div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{receiptConfig.address}</div>
                        {receiptConfig.showSocialMedia && (
                             <div className="text-[8px] text-indigo-400 mt-2 flex justify-center gap-2 font-black uppercase tracking-widest">
                                 <span>{receiptConfig.instagram}</span> • <span>{receiptConfig.website}</span>
                             </div>
                        )}
                      </div>
                      
                      <div className="border-t-2 border-dashed border-gray-200 pt-6 space-y-2">
                         <div className="flex justify-between font-bold"><span>AMERICANO COFFEE</span><span>18.000</span></div>
                         <div className="flex justify-between font-bold"><span>FRIED RICE</span><span>25.000</span></div>
                         <div className="flex justify-between text-gray-400 font-medium"><span>TAX ({taxConfig.taxPercentage}%)</span><span>4.730</span></div>
                         <div className="flex justify-between font-black mt-4 pt-4 border-t-2 border-dashed border-gray-100 text-sm italic tracking-tighter"><span>TOTAL NET</span><span>47.730</span></div>
                      </div>
                      
                      <div className="text-center text-[9px] italic text-gray-400 mt-6 font-bold">
                        "{receiptConfig.footerText}"
                      </div>
                      
                      {receiptConfig.showQRCode && (
                          <div className="flex flex-col items-center pt-6 opacity-90 border-t border-gray-50 border-dashed">
                              <QrCode size={48} className="text-gray-900" />
                              <span className="text-[8px] mt-2 text-gray-400 font-black uppercase tracking-widest">{receiptConfig.qrCodeText}</span>
                          </div>
                      )}
                      <div className="text-center text-[7px] text-gray-200 uppercase tracking-widest mt-6">POWERED BY WARUNG AI</div>
                   </div>
                   <div className="absolute top-6 right-6 lg:top-10 lg:right-10">
                       <div className="bg-indigo-600 text-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
                           <Zap size={14} className="md:size-[16px]" />
                           <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Live View</span>
                       </div>
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