
import React, { useState } from 'react';
import { Globe, Plus, X, Check, Settings, ExternalLink } from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';
import { usePageSelector } from '../src/hooks/usePageSelector';

interface PageManagerProps {
    pages: any[];
    onPageCreated: (page: any) => void;
    compact?: boolean;
    className?: string;
}

const PageManager: React.FC<PageManagerProps> = ({ pages, onPageCreated, compact = false, className = '' }) => {
    const { showToast } = useToast();
    const { selectedPageId, setSelectedPageId } = usePageSelector();
    const [showCreatePage, setShowCreatePage] = useState(false);
    const [newPageSlug, setNewPageSlug] = useState('');
    const [newPageName, setNewPageName] = useState('');
    const [newPageCustomDomain, setNewPageCustomDomain] = useState('');

    const handleCreatePage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPageSlug || !newPageName) return;

        try {
            const res = await client.post('/pages/create.php', {
                slug: newPageSlug,
                displayName: newPageName,
                customDomain: newPageCustomDomain || null
            });

            onPageCreated(res.data.page);
            setSelectedPageId(res.data.page.id);

            setNewPageSlug('');
            setNewPageName('');
            setNewPageCustomDomain('');
            setShowCreatePage(false);
            showToast('Page created!', 'success');
        } catch (err: any) {
            console.error("Failed to create page", err);
            showToast(err.response?.data?.message || "Failed to create page", "error");
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Globe size={20} />
                    </div>
                    <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-slate-900`}>Your Pages</h2>
                </div>
                <button
                    onClick={() => setShowCreatePage(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
                >
                    <Plus size={18} /> New Page
                </button>
            </div>

            <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'}`}>
                {pages.map(page => {
                    const isSelected = page.id === selectedPageId;
                    const pagePublicUrl = `${window.location.origin}/${page.slug}`;
                    return (
                        <div
                            key={page.id}
                            className={`bg-white p-4 rounded-2xl shadow-sm border transition-all duration-300 ${isSelected
                                ? 'border-indigo-500 ring-2 ring-indigo-500/10'
                                : 'border-slate-200 hover:border-indigo-200 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                    <img
                                        src={page.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.displayName || page.slug)}&background=6366f1&color=fff`}
                                        className="w-12 h-12 rounded-full border border-slate-100 shadow-sm object-cover"
                                        alt={page.displayName}
                                    />
                                    {isSelected && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
                                            <Check className="text-white w-2.5 h-2.5" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-bold text-slate-900 truncate" title={page.displayName}>
                                        {page.displayName}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-mono truncate">@{page.slug}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedPageId(page.id)}
                                    className={`flex-grow flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all ${isSelected
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                                        }`}
                                >
                                    <Settings size={14} /> {isSelected ? 'Managing' : 'Settings'}
                                </button>
                                <a
                                    href={pagePublicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-slate-50 transition-all font-mono"
                                >
                                    <ExternalLink size={14} /> Profile
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showCreatePage && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-bold">Create New Page</h3>
                        <button onClick={() => setShowCreatePage(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                    </div>
                    <form onSubmit={handleCreatePage} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Page Name</label>
                                <input
                                    placeholder="e.g. My Portfolio"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={newPageName}
                                    onChange={(e) => setNewPageName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Slug (URL)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">/</span>
                                    <input
                                        placeholder="username"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                                        value={newPageSlug}
                                        onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Custom Domain (Optional)</label>
                                <input
                                    placeholder="e.g. links.mybrand.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                                    value={newPageCustomDomain}
                                    onChange={(e) => setNewPageCustomDomain(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowCreatePage(false)}
                                className="px-6 py-2 rounded-lg text-slate-500 font-semibold hover:bg-slate-100 transition-all font-mono"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-10 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md font-mono"
                            >
                                Create Page
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PageManager;
