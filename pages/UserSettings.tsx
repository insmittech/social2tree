
import React, { useState, useEffect, useMemo } from 'react';
import {
    Clock,
    Globe,
    Zap,
    Save,
    Search,
    Locate,
    Check,
    LayoutGrid,
    Type,
    AlertCircle
} from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';
import { useAuth } from '../src/context/AuthContext';
import { getCurrentTime } from '../src/utils/dateUtils';

const UserSettings: React.FC = () => {
    const { showToast } = useToast();
    const { user: profile, updateUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form states
    const [settings, setSettings] = useState({
        timezone: 'UTC',
        timeFormat: '12h' as '12h' | '24h'
    });

    // Populate initial state from profile
    useEffect(() => {
        if (profile) {
            setSettings({
                timezone: profile.timezone || 'UTC',
                timeFormat: (profile.timeFormat as '12h' | '24h') || '12h'
            });
        }
    }, [profile]);

    // Get all timezones
    const timezones = useMemo(() => {
        try {
            // @ts-ignore - Intl.supportedValuesOf is relatively new
            return Intl.supportedValuesOf('timeZone');
        } catch (e) {
            // Fallback for older browsers
            return ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata'];
        }
    }, []);

    const filteredTimezones = useMemo(() => {
        return timezones.filter((tz: string) =>
            tz.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 50); // Limit results for performance
    }, [timezones, searchQuery]);

    const handleAutoDetect = () => {
        const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setSettings(prev => ({ ...prev, timezone: detectedTz }));
        showToast(`Detected timezone: ${detectedTz}`, "success");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await client.post('/auth/update_profile.php', settings);
            showToast("Settings updated successfully!", "success");
            updateUser(settings);
        } catch (err: any) {
            console.error("Failed to update settings", err);
            showToast(err.response?.data?.message || "Failed to update settings", "error");
        } finally {
            setSaving(false);
        }
    };

    const currentTime = useMemo(() => {
        return getCurrentTime(settings.timezone, settings.timeFormat);
    }, [settings.timezone, settings.timeFormat]);

    if (!profile) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-700/50 m-8">
                <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Profile Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Please try logging in again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 pb-32 sm:pb-10">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Preferences</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-[11px] sm:text-sm uppercase tracking-wider mt-1">Configure your workspace experience</p>
                </div>
                <div className="bg-indigo-50 dark:bg-teal-500/10 border border-indigo-100 dark:border-teal-500/20 px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Zap size={16} className="text-indigo-600 dark:text-teal-400" />
                    <span className="text-xs font-black text-indigo-700 dark:text-teal-400 uppercase tracking-widest">{profile.plan} Member</span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Timezone & Clock Card */}
                <div className="bg-white dark:bg-[#0b121e] rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-800/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />

                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-teal-400 rounded-xl flex items-center justify-center">
                                    <Globe size={22} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Regional Settings</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Set your local timezone and clock preference</p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                {/* Timezone Selection */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block">System Timezone</label>
                                        <button
                                            type="button"
                                            onClick={handleAutoDetect}
                                            className="text-[10px] font-black uppercase text-indigo-600 dark:text-teal-400 tracking-widest flex items-center gap-1.5 hover:opacity-80 transition-all"
                                        >
                                            <Locate size={12} /> Auto-Detect
                                        </button>
                                    </div>

                                    <div className="relative group/search">
                                        <Search className="absolute left-4 top-4 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search timezone (e.g. Kolkata, London, New York)..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-100 dark:border-slate-800/50 rounded-2xl pl-11 pr-5 py-4 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                                        />
                                    </div>

                                    <div className="max-h-48 overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-2 p-1">
                                        {filteredTimezones.map(tz => (
                                            <button
                                                key={tz}
                                                type="button"
                                                onClick={() => setSettings(prev => ({ ...prev, timezone: tz }))}
                                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${settings.timezone === tz
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <span className="truncate">{tz.replace(/_/g, ' ')}</span>
                                                {settings.timezone === tz && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Format */}
                                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                    <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block">Clock Format</label>
                                    <div className="flex gap-4">
                                        {[
                                            { id: '12h', label: '12-Hour (AM/PM)' },
                                            { id: '24h', label: '24-Hour (Military)' }
                                        ].map(format => (
                                            <button
                                                key={format.id}
                                                type="button"
                                                onClick={() => setSettings(prev => ({ ...prev, timeFormat: format.id as '12h' | '24h' }))}
                                                className={`flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${settings.timeFormat === format.id
                                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/5 dark:border-teal-500'
                                                    : 'border-slate-100 dark:border-slate-800 bg-transparent hover:border-slate-200'
                                                    }`}
                                            >
                                                <Type size={20} className={settings.timeFormat === format.id ? 'text-indigo-600 dark:text-teal-400' : 'text-slate-400'} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${settings.timeFormat === format.id ? 'text-indigo-600 dark:text-teal-400' : 'text-slate-500'}`}>
                                                    {format.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 dark:hover:bg-teal-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 dark:shadow-none active:scale-95 disabled:opacity-50"
                                >
                                    <Save size={18} /> {saving ? 'Applying Preferences...' : 'Save Settings'}
                                </button>
                            </form>
                        </div>

                        {/* Preview Widget */}
                        <div className="lg:w-80">
                            <div className="bg-slate-900 dark:bg-[#05080f] rounded-[2rem] p-8 text-center space-y-6 border border-white/5 relative overflow-hidden h-full flex flex-col justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                                <div className="relative">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white/40">
                                        <Clock size={32} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-2">Live Preview</p>
                                    <h4 className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none">
                                        {currentTime}
                                    </h4>
                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                        <Globe size={10} className="text-white/40" />
                                        <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">{settings.timezone}</span>
                                    </div>
                                </div>
                                <div className="pt-8 space-y-4">
                                    <div className="h-px bg-white/5" />
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] leading-relaxed">
                                        This is how timestamps and schedules will be processed across your dashboard and analytics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Preferences (Placeholders) */}
                <div className="grid sm:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-[#0b121e] p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm opacity-60">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                <LayoutGrid size={16} className="text-slate-400" />
                            </div>
                            <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">Dashboard Layout</h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Customize your management interface. Feature coming soon.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#0b121e] p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm opacity-60">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                <Zap size={16} className="text-slate-400" />
                            </div>
                            <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">System Theme</h4>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Sync dashboard theme with your OS. Feature coming soon.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
