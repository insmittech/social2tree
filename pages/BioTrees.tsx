import React, { useState } from 'react';
import {
    Globe, Plus, Search, Filter, ExternalLink, MoreVertical,
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pb-32 lg:pb-12">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-4">
                            My Trees
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Eco-system Overview</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage and scale your digital identities.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/dashboard/builder')}
                            className="border border-indigo-200 bg-indigo-50 text-indigo-700 px-5 py-3 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-all flex items-center gap-2"
                        >
                            <PanelsTopLeft size={16} /> Page Builder
                        </button>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Plus size={18} /> Create New Tree
                        </button>
                    </div>
                </header>

                {/* Toolbar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search trees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                            <Filter size={18} />
                        </button>
                        <div className="w-px h-8 bg-slate-100 mx-2 hidden md:block"></div>
                        <button className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                            <LayoutGrid size={18} />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-slate-600">
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Tree Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPages.map(page => (
                        <div
                            key={page.id}
                            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="relative">
                                    <img
                                        src={page.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.displayName || page.slug)}&background=1e293b&color=fff`}
                                        className="w-16 h-16 rounded-xl border-2 border-slate-50 shadow-sm object-cover"
                                        alt={page.displayName}
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-md border-2 border-white shadow-sm">
                                        <Globe size={10} />
                                    </div>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                    {page.displayName}
                                </h3>
                                <p className="text-slate-400 text-xs font-medium">s2t.me/{page.slug}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Links</p>
                                    <div className="flex items-center gap-2">
                                        <Zap size={14} className="text-amber-500" />
                                        <p className="text-slate-900 font-bold text-lg">{page.links?.length || 0}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Performance</p>
                                    <div className="flex items-center gap-2">
                                        <BarChart3 size={14} className="text-indigo-600" />
                                        <p className="text-indigo-600 font-bold text-lg">Good</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEditTree(page.id)}
                                    className="flex-grow bg-slate-900 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-600 transition-all"
                                >
                                    Manage Tree
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard/builder')}
                                    title="Open Page Builder"
                                    className="p-2.5 text-indigo-600 border border-indigo-100 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <PanelsTopLeft size={16} />
                                </button>
                                <a
                                    href={`${window.location.origin}/${page.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 text-slate-400 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>
                    ))}

                    {/* Create Card */}
                    <button
                        onClick={() => setShowCreate(true)}
                        className="group border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all min-h-[280px]"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                            <Plus size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-lg">New Bio Tree</h4>
                            <p className="text-slate-400 text-xs font-medium">Create a fresh digital profile.</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* ── Create Tree Modal ─────────────────────────────────────── */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in">
                        <button onClick={closeModal}
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                            <X size={18} />
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Plus size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Create New Tree</h2>
                                <p className="text-xs text-slate-400 font-medium">Set up your new digital profile</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <label className="block">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1.5">Display Name</span>
                                <input
                                    value={createName}
                                    onChange={e => handleNameChange(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                                    placeholder="My Awesome Tree"
                                    autoFocus
                                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 font-semibold text-sm focus:border-indigo-400 focus:bg-white outline-none transition-all"
                                />
                            </label>

                            <label className="block">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1.5">Page URL</span>
                                <div className="flex items-center border-2 border-slate-100 bg-slate-50 rounded-2xl overflow-hidden focus-within:border-indigo-400 focus-within:bg-white transition-all">
                                    <span className="px-3 py-3 text-xs font-bold text-slate-400 bg-slate-100 select-none border-r border-slate-200 whitespace-nowrap">s2t.me/</span>
                                    <input
                                        value={createSlug}
                                        onChange={e => setCreateSlug(slugify(e.target.value))}
                                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                                        placeholder="my-awesome-tree"
                                        className="flex-1 px-3 py-3 bg-transparent text-slate-900 font-semibold text-sm outline-none"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1 font-medium">Lowercase letters, numbers, and hyphens only</p>
                            </label>

                            {createError && (
                                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs font-bold text-rose-600">
                                    {createError}
                                </div>
                            )}

                            <button
                                onClick={handleCreate}
                                disabled={creating || !createName.trim() || !createSlug.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-200 mt-2"
                            >
                                {creating
                                    ? <><Loader2 size={16} className="animate-spin" /> Creating…</>
                                    : <><Plus size={16} /> Create Tree</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BioTrees;
