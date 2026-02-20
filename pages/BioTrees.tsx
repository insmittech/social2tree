import React, { useState } from 'react';
import { Globe, Plus, Search, Filter, ExternalLink, MoreVertical, LayoutGrid, List, BarChart3, Zap } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePageSelector } from '../src/hooks/usePageSelector';

const BioTrees: React.FC = () => {
    const navigate = useNavigate();
    const { user: profile } = useAuth();
    const { setSelectedPageId } = usePageSelector();
    const [searchQuery, setSearchQuery] = useState('');

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pb-32 lg:pb-12">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-4">
                        My Trees
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Eco-system Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and scale your digital identities.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                    <Plus size={18} /> Create New Tree
                </button>
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

                        <div className="grid grid-cols-2 gap-3 mb-8">
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

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleEditTree(page.id)}
                                className="flex-grow bg-slate-900 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-600 transition-all"
                            >
                                Manage Tree
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
                    onClick={() => navigate('/dashboard')}
                    className="group border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all"
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
    );
};

export default BioTrees;
