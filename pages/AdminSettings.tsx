
import React, { useState, useEffect } from 'react';
import { Settings, Save, Globe, Zap, Shield, Palette, Layout, Server, AlertCircle } from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

interface AdminSettingsProps {
  onLogout: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onLogout }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'Social2Tree',
    maintenance_mode: 'false',
    free_link_limit: '3',
    pro_link_limit: '100',
    pro_price: '15.00',
    enable_custom_domains: 'true',
    available_themes: '["default", "dark", "glass", "minimal"]',
    navbar_links: '[]',
    footer_explore_links: '[]',
    footer_legal_links: '[]'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await client.get('/admin/settings/get.php');
        if (res.data.settings) {
          setSettings(prev => ({ ...prev, ...res.data.settings }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

  const handleUpdateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await client.post('/admin/settings/update.php', settings);
      showToast('Settings saved successfully', 'success');
    } catch (err) {
      console.error('Failed to save settings:', err);
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const themes = JSON.parse(settings.available_themes || '[]');

  return (
    <div className="p-4 sm:p-8 lg:px-12 py-8 overflow-hidden pb-32 lg:pb-12">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">System Settings</h1>
          <p className="text-slate-500 font-medium">Platform-wide configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 sm:px-8 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
        >
          {isSaving ? 'Updating...' : <><Save size={18} /> Save Changes</>}
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
                value={settings.site_name}
                onChange={(e) => handleUpdateSetting('site_name', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="max-w-[70%]">
                <p className="text-sm font-black text-slate-900">Maintenance Mode</p>
                <p className="text-[10px] text-slate-500 font-medium">Redirect all non-admin traffic</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.maintenance_mode === 'true'}
                  onChange={(e) => handleUpdateSetting('maintenance_mode', e.target.checked ? 'true' : 'false')}
                />
                <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Plans & Limits */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
            <Zap className="text-amber-500" size={22} /> Plans & Limits
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Free Links Limit</label>
              <input
                type="number"
                value={settings.free_link_limit}
                onChange={(e) => handleUpdateSetting('free_link_limit', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-amber-100 outline-none transition-all font-bold text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Pro Links Limit</label>
              <input
                type="number"
                value={settings.pro_link_limit}
                onChange={(e) => handleUpdateSetting('pro_link_limit', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Pro Price ($)</label>
              <input
                type="text"
                value={settings.pro_price}
                onChange={(e) => handleUpdateSetting('pro_price', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>
        </section>

        {/* Domain Features */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
            <Server className="text-emerald-500" size={22} /> Custom Domains
          </h2>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="max-w-[70%]">
              <p className="text-sm font-black text-slate-900">Custom Domain Mapping</p>
              <p className="text-[10px] text-slate-500 font-medium">Allow users to use their own domains</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.enable_custom_domains === 'true'}
                onChange={(e) => handleUpdateSetting('enable_custom_domains', e.target.checked ? 'true' : 'false')}
              />
              <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </section>

        {/* Theme Management */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
            <Palette className="text-pink-500" size={22} /> Design Themes
          </h2>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Available Themes (JSON)</p>
            <textarea
              value={settings.available_themes}
              onChange={(e) => handleUpdateSetting('available_themes', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-mono text-sm h-32"
            />
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {themes.map((t: string) => (
                <span key={t} className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full border border-pink-100 capitalize">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
        {/* Navigation Menu Management */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
            <Layout className="text-indigo-600" size={22} /> Navigation Menu Management
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Navbar Links (JSON)</label>
              <textarea
                value={settings.navbar_links || '[]'}
                onChange={(e) => handleUpdateSetting('navbar_links', e.target.value)}
                placeholder='[{"label": "Home", "to": "/"}]'
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-mono text-sm h-48"
              />
              <p className="text-[10px] text-slate-400 px-2 italic font-medium">Format: Array of {"{label: string, to: string}"}</p>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Footer Explore Links (JSON)</label>
              <textarea
                value={settings.footer_explore_links || '[]'}
                onChange={(e) => handleUpdateSetting('footer_explore_links', e.target.value)}
                placeholder='[{"label": "Pricing", "to": "/pricing"}]'
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-mono text-sm h-48"
              />
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Footer Legal Links (JSON)</label>
              <textarea
                value={settings.footer_legal_links || '[]'}
                onChange={(e) => handleUpdateSetting('footer_legal_links', e.target.value)}
                placeholder='[{"label": "Privacy", "to": "/privacy"}]'
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-mono text-sm h-48"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;
