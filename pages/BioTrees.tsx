import React, { useState } from 'react';
import {
    Plus, Search, Filter, ExternalLink, MoreVertical,
    LayoutGrid, List, BarChart3, Zap, X, Loader2, PanelsTopLeft
} from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePageSelector } from '../src/hooks/usePageSelector';
import client from '../src/api/client';

const BioTrees: React.FC = () => {
    const navigate = useNavigate();
    const { user: profile, refreshProfile } = useAuth();
    const { setSelectedPageId } = usePageSelector();
    const [searchQuery, setSearchQuery] = useState('');

    // ── Create Modal state ──────────────────────────────────────────────────
    const [showCreate, setShowCreate] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createSlug, setCreateSlug] = useState('');
    const [createError, setCreateError] = useState('');
    const [creating, setCreating] = useState(false);

    const slugify = (s: string) =>
        s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const handleNameChange = (v: string) => {
        setCreateName(v);
        setCreateSlug(slugify(v));
    };

    const closeModal = () => {
        setShowCreate(false);
        setCreateError('');
        setCreateName('');
        setCreateSlug('');
    };

    const handleCreate = async () => {
        setCreateError('');
        if (!createName.trim() || !createSlug.trim()) {
            setCreateError('Display name and slug are required.');
            return;
        }
        if (!/^[a-z0-9-]+$/.test(createSlug)) {
            setCreateError('Slug can only contain lowercase letters, numbers, and hyphens.');
            return;
        }
        try {
            setCreating(true);
            const res = await client.post('/pages/create.php', {
                displayName: createName.trim(),
                slug: createSlug.trim(),
            });
            await refreshProfile();
            closeModal();
            const newPage = res?.data?.page;
            if (newPage?.id) {
                setSelectedPageId(newPage.id);
                navigate(`/dashboard/trees/${newPage.id}`);
            }
        } catch (err: any) {
            setCreateError(err?.message || 'Failed to create tree. The slug may already be taken.');
        } finally {
            setCreating(false);
        }
    };

    const handleEditTree = (pageId: string) => {
        setSelectedPageId(pageId);
        navigate(`/dashboard/trees/${pageId}`);
    };

    if (!profile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    const pages = profile?.pages || [];
    const filteredPages = pages.filter(p =>
        p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full pb-32 sm:pb-12">
                <header className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            My Trees
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">Eco-system Overview</h1>
                        <p className="text-slate-500 text-[11px] sm:text-sm font-bold uppercase tracking-wider mt-1">Manage and scale your digital identities.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowCreate(true)}
                            className="bg-indigo-600 text-white px-6 py-3.5 sm:py-3 rounded-[1.25rem] sm:rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                        >
                            <Plus size={18} /> New Tree
                        </button>
                    </div>
                </header>

                <div className="bg-white p-4 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-10">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or slug..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-400 focus:bg-white transition-all outline-none font-bold text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex bg-slate-100 p-1 rounded-[1.25rem]">
                                <button className="p-2.5 rounded-xl bg-white shadow-sm text-indigo-600"><LayoutGrid size={18} /></button>
                                <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"><List size={18} /></button>
                            </div>
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 rounded-[1.25rem] text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                                <Filter size={18} /> Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                    {filteredPages.map(page => (
                        <div
                            key={page.id}
                            onClick={() => handleEditTree(page.id)}
                            className="group bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.75rem] bg-slate-50 p-1 border-4 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={page.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.displayName || page.slug)}&background=1e293b&color=fff`}
                                        className="w-full h-full rounded-[1.5rem] object-cover"
                                        alt={page.displayName}
                                    />
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                    <ExternalLink size={20} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-900 leading-tight">{page.displayName}</h3>
                                <p className="text-slate-400 font-bold text-sm">s2t.me/{page.slug}</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</span>
                                        <span className="text-sm font-black text-slate-900">{profile.views?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="w-px h-6 bg-slate-100" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Links</span>
                                        <span className="text-sm font-black text-slate-900">{page.links?.length || 0}</span>
                                    </div>
                                </div>
                                <button className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1">
                                    Edit <Zap size={12} fill="currentColor" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowCreate(true)}
                        className="group border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[280px]"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-md transition-all">
                            <Plus size={32} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 text-lg">New Bio Tree</h4>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Create a fresh profile</p>
                        </div>
                    </button>
                </div>
            </div>

            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300">
                        <button onClick={closeModal}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 leading-tight">Create New Tree</h2>
                                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Start your digital identity</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="block">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Display Name</span>
                                <input
                                    value={createName}
                                    onChange={e => handleNameChange(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                                    placeholder="e.g. My Portfolio"
                                    autoFocus
                                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 bg-slate-50 text-slate-900 font-bold text-sm focus:border-indigo-400 focus:bg-white outline-none transition-all"
                                />
                            </label>

                            <label className="block">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Custom Link</span>
                                <div className="flex items-center border-2 border-slate-50 bg-slate-50 rounded-2xl overflow-hidden focus-within:border-indigo-400 focus-within:bg-white transition-all">
                                    <span className="px-4 py-3.5 text-xs font-black text-slate-400 bg-slate-100/50 select-none border-r border-slate-100 whitespace-nowrap">s2t.me/</span>
                                    <input
                                        value={createSlug}
                                        onChange={e => setCreateSlug(slugify(e.target.value))}
                                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                                        placeholder="username"
                                        className="flex-1 px-4 py-3.5 bg-transparent text-slate-900 font-bold text-sm outline-none"
                                    />
                                </div>
                            </label>

                            {createError && (
                                <div className="bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4 text-xs font-bold text-rose-600 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                    {createError}
                                </div>
                            )}

                            <button
                                onClick={handleCreate}
                                disabled={creating || !createName.trim() || !createSlug.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 mt-4 active:scale-[0.98]"
                            >
                                {creating
                                    ? <><Loader2 size={18} className="animate-spin" /> Creating Your Tree…</>
                                    : <><Plus size={18} /> Create Final Tree</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BioTrees;
