import React, { useState } from 'react';
import {
    Plus, Search, Filter, ExternalLink, MoreVertical,
    LayoutGrid, List, BarChart3, Zap, X, Loader2, PanelsTopLeft, Globe
} from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePageSelector } from '../src/hooks/usePageSelector';
import client from '../src/api/client';
import Pagination from '../components/Pagination';
import SeoManager from '../components/SeoManager';

const BioTrees: React.FC = () => {
    const navigate = useNavigate();
    const { user: profile, refreshProfile } = useAuth();
    const { setSelectedPageId } = usePageSelector();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ── Create Modal state ──────────────────────────────────────────────────
    const [showCreate, setShowCreate] = useState(false);
    const [showSeo, setShowSeo] = useState(false);
    const [selectedPageForSeo, setSelectedPageForSeo] = useState<any>(null);
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

    const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
    const paginatedPages = filteredPages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full pb-32 sm:pb-12">
                <header className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center px-3 py-1 bg-indigo-50 dark:bg-teal-500/10 text-indigo-600 dark:text-teal-400 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-indigo-100 dark:border-teal-500/20">
                            My Trees
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">Eco-system Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-sm font-bold uppercase tracking-wider mt-1 transition-colors">Manage and scale your digital identities.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowCreate(true)}
                            className="bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 px-6 py-3.5 sm:py-3 rounded-[1.25rem] sm:rounded-2xl font-black text-sm hover:bg-indigo-700 dark:hover:bg-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg dark:shadow-teal-500/20 shadow-indigo-100"
                        >
                            <Plus size={18} /> New Tree
                        </button>
                    </div>
                </header>

                <div className="bg-white dark:bg-[#0b121e] rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm dark:shadow-none overflow-hidden transition-colors">
                    {/* Search & Filters */}
                    <div className="p-4 sm:p-6 border-b border-slate-50 dark:border-slate-800/30">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or slug..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#0b0f19] border border-slate-100 dark:border-slate-800/50 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-400 focus:bg-white transition-all outline-none font-bold text-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-[1.25rem] transition-colors">
                                    <button className="p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"><LayoutGrid size={18} /></button>
                                    <button className="p-2.5 rounded-xl bg-white dark:bg-slate-900/40 shadow-sm dark:shadow-none text-indigo-600 dark:text-teal-400 transition-colors"><List size={18} /></button>
                                </div>
                                <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-800/50 rounded-[1.25rem] text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                    <Filter size={18} /> Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800/50 uppercase">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest">
                                        <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                                            Bio Tree <MoreVertical size={12} className="opacity-40" />
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest hidden md:table-cell">
                                        <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                                            Slug <MoreVertical size={12} className="opacity-40" />
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest text-center hidden md:table-cell">
                                        <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                                            Views <MoreVertical size={12} className="opacity-40" />
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest text-center hidden md:table-cell">
                                        <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                                            Links <MoreVertical size={12} className="opacity-40" />
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPages.map(page => (
                                    <tr key={page.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border-b border-slate-50 dark:border-slate-800/50">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm uppercase shadow-lg">
                                                    {page.displayName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">{page.displayName}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold md:hidden">s2t.me/{page.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 hidden md:table-cell">
                                            <span className="text-sm font-bold text-slate-400">s2t.me/{page.slug}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center hidden md:table-cell">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{page.views?.toLocaleString() ?? 0}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center hidden md:table-cell">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{page.links?.length ?? 0}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3 sm:gap-4">
                                                <button
                                                    onClick={() => window.open(`http://s2t.me/${page.slug}`, '_blank')}
                                                    className="text-slate-400 hover:text-indigo-600 transition-all p-2 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl"
                                                    title="View Public Page"
                                                >
                                                    <ExternalLink size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedPageForSeo(page);
                                                        setShowSeo(true);
                                                    }}
                                                    className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-teal-400 dark:hover:bg-teal-500/10 transition-all active:scale-95 group/btn"
                                                    title="SEO Settings"
                                                >
                                                    <Globe size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditTree(page.id)}
                                                    className="bg-indigo-50 dark:bg-teal-500/10 text-indigo-600 dark:text-teal-400 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 dark:hover:bg-teal-500 hover:text-white dark:hover:text-slate-950 transition-all border border-indigo-100/50 dark:border-teal-500/20"
                                                >
                                                    Edit <Zap size={14} fill="currentColor" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {/* Footer Add Row */}
                                <tr onClick={() => setShowCreate(true)} className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                    <td colSpan={5} className="px-8 py-8 text-center border-t border-slate-50 dark:border-slate-800/50">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 dark:bg-teal-500/10 text-indigo-600 dark:text-teal-400 rounded-full flex items-center justify-center group-hover:bg-indigo-600 dark:group-hover:bg-teal-500 group-hover:text-white dark:group-hover:text-slate-950 transition-all shadow-sm">
                                                <Plus size={18} />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-black text-slate-900 dark:text-white text-sm leading-tight">Add New Bio Tree</h4>
                                                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Create a fresh profile</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-[#05080f]/80 backdrop-blur-sm transition-colors">
                    <div className="bg-white dark:bg-[#0b121e] rounded-[2.5rem] shadow-2xl dark:shadow-none w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-300 border dark:border-slate-800">
                        <button onClick={closeModal}
                            className="absolute top-6 right-6 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-600 dark:bg-teal-500 rounded-2xl flex items-center justify-center text-white dark:text-slate-950 shadow-lg dark:shadow-teal-500/20 shadow-indigo-200">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight transition-colors">Create New Tree</h2>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-0.5 transition-colors">Start your digital identity</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="block">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 px-1">Display Name</span>
                                <input
                                    value={createName}
                                    onChange={e => handleNameChange(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                                    placeholder="e.g. My Portfolio"
                                    autoFocus
                                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white font-bold text-sm focus:border-indigo-400 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900/50 outline-none transition-all"
                                />
                            </label>

                            <label className="block">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2 px-1">Custom Link</span>
                                <div className="flex items-center border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] rounded-2xl overflow-hidden focus-within:border-indigo-400 dark:focus-within:border-teal-500 focus-within:bg-white dark:focus-within:bg-slate-900/50 transition-all">
                                    <span className="px-4 py-3.5 text-xs font-black text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-800/50 select-none border-r border-slate-100 dark:border-slate-800 whitespace-nowrap">s2t.me/</span>
                                    <input
                                        value={createSlug}
                                        onChange={e => setCreateSlug(slugify(e.target.value))}
                                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                                        placeholder="username"
                                        className="flex-1 px-4 py-3.5 bg-transparent text-slate-900 dark:text-white font-bold text-sm outline-none"
                                    />
                                </div>
                            </label>

                            {createError && (
                                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl px-5 py-4 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                    {createError}
                                </div>
                            )}

                            <button
                                onClick={handleCreate}
                                disabled={creating || !createName.trim() || !createSlug.trim()}
                                className="w-full bg-indigo-600 dark:bg-teal-500 hover:bg-indigo-700 dark:hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-slate-950 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl dark:shadow-teal-500/20 shadow-indigo-100 mt-4 active:scale-[0.98]"
                            >
                                {creating
                                    ? <><Loader2 size={18} className="animate-spin" /> Creating Your Tree…</>
                                    : <><Plus size={18} /> Create Final Tree</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showSeo && selectedPageForSeo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0b121e] w-full max-w-5xl rounded-[3rem] p-8 sm:p-12 shadow-2xl dark:shadow-none relative overflow-hidden border dark:border-slate-800">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        <button
                            onClick={() => setShowSeo(false)}
                            className="absolute top-8 right-10 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <Search size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter transition-colors">SEO & Indexing Control</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest text-[10px] mt-1 transition-colors">Managing metadata for <span className="text-indigo-600">@{selectedPageForSeo.slug}</span></p>
                            </div>
                        </div>

                        <SeoManager
                            pageId={selectedPageForSeo.id}
                            slug={selectedPageForSeo.slug}
                            displayName={selectedPageForSeo.displayName}
                            onClose={() => setShowSeo(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default BioTrees;
