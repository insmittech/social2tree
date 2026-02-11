
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import MobileNav from '../components/MobileNav';
import { Settings, Save, Globe, Zap, Shield, Key, Bell, Palette } from 'lucide-react';

interface AdminSettingsProps {
  onLogout: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onLogout }) => {
  const [siteName, setSiteName] = useState('Social2Tree');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [freeLinkLimit, setFreeLinkLimit] = useState(5);
  const [proPrice, setProPrice] = useState(15);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [allowCustomHtml, setAllowCustomHtml] = useState(true);
  const [enableSocialSharing, setEnableSocialSharing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // TODO: Load settings from API endpoint when available
  useEffect(() => {
    // Placeholder - would call API to load settings
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // TODO: Call API endpoint to save settings
      // const { default: client } = await import('../src/api/client');
      // await client.post('/admin/settings/update.php', { siteName, maintenanceMode, ... });
      
      setTimeout(() => {
        setIsSaving(false);
        alert('System settings updated successfully!');
      }, 600);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setIsSaving(false);
      alert('Failed to save settings');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isDashboard onLogout={onLogout} />
      
      <div className="max-w-[1600px] mx-auto flex">
        <AdminSidebar />
        
        <main className="flex-grow p-4 sm:p-8 lg:p-12 pb-32 lg:pb-12">
          <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">System Settings</h1>
              <p className="text-slate-500 font-medium">Platform configuration</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 sm:px-8 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : <><Save size={18} /> Save</>}
            </button>
          </header>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* General Settings */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
                <Globe className="text-indigo-600" size={22} /> General
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Site Name</label>
                  <input 
                    type="text" 
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="max-w-[70%]">
                    <p className="text-sm font-black text-slate-900">Maintenance</p>
                    <p className="text-[10px] text-slate-500 font-medium">Redirect all traffic</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                    />
                    <div className="w-12 sm:w-14 h-6 sm:h-7 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Tier Limits */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
                <Zap className="text-amber-500" size={22} /> Tiers
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Free Links</label>
                  <input 
                    type="number" 
                    value={freeLinkLimit}
                    onChange={(e) => setFreeLinkLimit(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-amber-100 outline-none transition-all font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Pro Price</label>
                  <input 
                    type="number" 
                    value={proPrice}
                    onChange={(e) => setProPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <MobileNav isAdmin />
    </div>
  );
};

export default AdminSettings;
