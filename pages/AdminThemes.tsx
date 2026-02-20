
import React, { useState, useEffect } from 'react';
import {
    Palette,
    Plus,
    Save,
    Trash2,
    ChevronRight,
    Search,
    Type,
    Square,
    CheckCircle2,
    Layout
} from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';
import { UserTheme } from '../types';

const AdminThemes: React.FC = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [themes, setThemes] = useState<UserTheme[]>([]);
    const [activeThemeNames, setActiveThemeNames] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await client.get('/admin/settings/get.php');
                const s = res.data.settings || {};

                // In a real app, we might fetch themes from a themes table
                // For now, we'll manage the 'available_themes' list which controls selection
                const available = JSON.parse(s.available_themes || '["default", "dark", "purple", "sunset", "brutalist", "nature"]');
                setActiveThemeNames(available);

                // Mocking the full theme list from types.ts for management
                // In production, this should ideally come from the database
                const platformThemes: UserTheme[] = [
                    { id: 'default', name: 'Snowy White', background: 'bg-white', buttonClass: 'bg-slate-900 text-white', textClass: 'text-slate-900', cardClass: 'bg-slate-50' },
                    { id: 'dark', name: 'Midnight', background: 'bg-slate-950', buttonClass: 'bg-white text-slate-950', textClass: 'text-white', cardClass: 'bg-slate-900' },
                    { id: 'purple', name: 'Grape Juice', background: 'bg-gradient-to-br from-purple-600 to-indigo-900', buttonClass: 'bg-white/10 text-white', textClass: 'text-white' },
                    { id: 'sunset', name: 'Sunset Glow', background: 'bg-gradient-to-tr from-orange-400 to-rose-500', buttonClass: 'bg-white text-rose-600', textClass: 'text-white' },
                    { id: 'brutalist', name: 'Neo-Brutalism', background: 'bg-yellow-400', buttonClass: 'bg-white text-black border-4 border-black', textClass: 'text-black font-black' },
                    { id: 'nature', name: 'Emerald Garden', background: 'bg-emerald-900', buttonClass: 'bg-emerald-400 text-emerald-950', textClass: 'text-emerald-50' }
                ];
                setThemes(platformThemes);
            } catch (err) {
                showToast('Failed to load theme settings', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showToast]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await client.post('/admin/settings/update.php', {
                available_themes: JSON.stringify(activeThemeNames)
            });
            showToast('Available themes updated', 'success');
        } catch (err) {
            showToast('Failed to save themes', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTheme = (id: string) => {
        setActiveThemeNames(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    const filteredThemes = themes.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-8 lg:px-12 py-8 overflow-hidden pb-32 lg:pb-12">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Design Themes</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Platform Appearance & User Selections</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search themes..."
                            className="w-full sm:w-64 pl-12 pr-6 py-3 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
                    </button>
                </div>
            </header>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredThemes.map(theme => {
                    const isActive = activeThemeNames.includes(theme.id);
                    return (
                        <div
                            key={theme.id}
                            onClick={() => toggleTheme(theme.id)}
                            className={`group cursor-pointer relative overflow-hidden rounded-[2.5rem] border-4 transition-all duration-300 ${isActive
                                    ? 'border-indigo-600 bg-white ring-8 ring-indigo-50 shadow-2xl scale-[1.02]'
                                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                                }`}
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{theme.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {theme.id}</p>
                                    </div>
                                    <div className={`p-2 rounded-xl border-2 transition-all ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-200'}`}>
                                        <CheckCircle2 size={20} />
                                    </div>
                                </div>

                                {/* Preview Card */}
                                <div className={`h-40 rounded-3xl p-6 ${theme.background} border-2 border-slate-100 shadow-inner flex flex-col justify-center gap-3`}>
                                    <div className={`h-10 w-full rounded-xl ${theme.buttonClass} flex items-center justify-center text-[10px] font-black uppercase tracking-widest px-4 truncate`}>
                                        Preview Button
                                    </div>
                                    <div className="flex gap-2">
                                        <div className={`h-8 flex-1 rounded-xl ${theme.buttonClass} opacity-50`} />
                                        <div className={`h-8 flex-1 rounded-xl ${theme.buttonClass} opacity-50`} />
                                    </div>
                                </div>
                            </div>

                            {/* Overlay Info */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="bg-slate-900 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">Enable Theme</p>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add Custom Theme Placeholder */}
                <div className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center group hover:bg-slate-50 transition-all cursor-not-allowed">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 transition-transform">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-slate-400 font-black uppercase tracking-widest text-xs">New Custom Theme</h3>
                    <p className="text-[10px] text-slate-300 font-bold mt-2 italic px-8">Custom css themes development coming soon</p>
                </div>
            </div>
        </div>
    );
};

export default AdminThemes;
