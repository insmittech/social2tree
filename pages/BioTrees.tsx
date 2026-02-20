
import React, { useState, useEffect } from 'react';
import { Globe, Plus, Search, Filter, ExternalLink, Settings, MoreVertical, LayoutGrid, List, BarChart3, Star, Zap } from 'lucide-react';
import client from '../src/api/client';
import { UserProfile } from '../types';
import { useToast } from '../src/context/ToastContext';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePageSelector } from '../src/hooks/usePageSelector';

const BioTrees: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
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
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent shadow-2xl"></div>
            </div>
        );
    }

    const pages = profile?.pages || [];
    const filteredPages = pages.filter(p =>
        p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pb-32 lg:pb-12 bg-slate-50/30">
            <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        My Ecosystem
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">My Bio Trees</h1>
                    <p className="text-slate-500 font-bold mt-2">Scale your digital presence across multiple high-end profiles.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100/20 active:scale-95 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Create New Tree
                </button>
            </header>

            {/* Toolbar */}
            <div className="bg-white/60 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-sm border border-white/40 mb-12 flex flex-col md:flex-row gap-5 items-center">
                <div className="relative flex-grow w-full group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search your projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-100/50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-slate-700 placeholder:text-slate-300"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-grow md:flex-grow-0 p-4 bg-white text-slate-400 rounded-2xl hover:text-indigo-600 transition-all border-2 border-slate-100 shadow-sm">
                        <Filter size={20} />
                    </button>
                    <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
                    <button className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                        <LayoutGrid size={20} />
                    </button>
                    <button className="p-4 bg-white text-slate-300 rounded-2xl border-2 border-slate-100 opacity-50">
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Tree Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredPages.map(page => (
                    <div
                        key={page.id}
                        className="group bg-white rounded-[3rem] p-1 shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.1)] transition-all duration-500 relative overflow-hidden"
                    >
                        {/* Interactive Sparkline Mockup */}
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                            <svg width="100" height="40" className="text-indigo-600" viewBox="0 0 100 40" fill="none">
                                <path d="M0 35 Q 20 5 40 30 T 80 15 T 100 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-8">
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2rem] opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500"></div>
                                    <img
                                        src={page.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.displayName || page.slug)}&background=1e293b&color=fff`}
                                        className="relative w-24 h-24 rounded-[1.8rem] border-4 border-slate-50 shadow-xl object-cover group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700"
                                        alt={page.displayName}
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl border-4 border-white shadow-lg animate-bounce duration-[3000ms]">
                                        <Globe size={14} />
                                    </div>
                                </div>
                                <button className="p-3 text-slate-200 hover:text-slate-900 transition-all bg-slate-50 rounded-xl hover:bg-indigo-50 border border-slate-100">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-3xl font-black text-slate-900 leading-none mb-2 group-hover:text-indigo-600 transition-colors tracking-tighter">
                                    {page.displayName}
                                </h3>
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] opacity-60">s2t.me/{page.slug}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-slate-50/80 p-5 rounded-[2rem] group-hover:bg-indigo-50/50 transition-colors border border-slate-100/50">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Links</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Zap size={14} className="text-amber-500" fill="currentColor" /></div>
                                        <p className="text-slate-900 font-black text-xl">{page.links?.length || 0}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50/80 p-5 rounded-[2rem] group-hover:bg-indigo-50/50 transition-colors border border-slate-100/50">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Clicks</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><BarChart3 size={14} className="text-indigo-600" /></div>
                                        <p className="text-indigo-600 font-black text-xl">2.4k</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleEditTree(page.id)}
                                    className="flex-grow bg-slate-950 text-white py-5 rounded-[1.8rem] font-black text-sm hover:bg-indigo-600 hover:-translate-y-1 transition-all shadow-xl active:scale-95"
                                >
                                    Manage Tree
                                </button>
                                <a
                                    href={`${window.location.origin}/${page.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-5 bg-white text-slate-400 rounded-[1.8rem] hover:bg-indigo-50 hover:text-indigo-600 transition-all border-2 border-slate-100 group-hover:border-indigo-100"
                                >
                                    <ExternalLink size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create Card */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="group border-4 border-dashed border-slate-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-6 hover:border-indigo-300 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-700"
                >
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 shadow-inner group-hover:shadow-indigo-200/50">
                        <Plus size={44} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 text-2xl tracking-tight mb-2">New Bio Tree</h4>
                        <p className="text-slate-400 text-sm font-bold max-w-[180px] leading-relaxed">Expand your empire with a fresh digital profile.</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default BioTrees;
