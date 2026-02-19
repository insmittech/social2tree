
import React, { useState, useEffect } from 'react';
import { Globe, Plus, Search, Filter, ExternalLink, Settings, MoreVertical, LayoutGrid, List, BarChart3, Star, Zap } from 'lucide-react';
import client from '../src/api/client';
import { UserProfile } from '../types';
import { useToast } from '../src/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { usePageSelector } from '../src/hooks/usePageSelector';

const BioTrees: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { setSelectedPageId } = usePageSelector();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('/auth/me.php');
                if (res.data.user) {
                    setProfile(res.data.user);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                showToast("Failed to load your trees", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEditTree = (pageId: string) => {
        setSelectedPageId(pageId);
        navigate(`/dashboard/trees/${pageId}`);
    };

    if (loading) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-32 lg:pb-12">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Bio Trees</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and grow your digital presence across multiple profiles</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')} // For now, Dashboard handles creation via PageManager
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-95"
                >
                    <Plus size={20} /> Create New Tree
                </button>
            </header>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search your trees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-grow md:flex-grow-0 p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                        <Filter size={18} />
                    </button>
                    <div className="h-10 w-px bg-slate-100 mx-2 hidden md:block"></div>
                    <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                        <LayoutGrid size={18} />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-slate-600 rounded-xl">
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Tree Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPages.map(page => (
                    <div
                        key={page.id}
                        className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="relative">
                                <img
                                    src={page.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.displayName || page.slug)}&background=6366f1&color=fff`}
                                    className="w-20 h-20 rounded-3xl border-4 border-slate-50 shadow-inner object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt={page.displayName}
                                />
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white">
                                    <Globe size={12} />
                                </div>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                {page.displayName}
                            </h3>
                            <p className="text-slate-400 font-mono text-sm">s2t.me/{page.slug}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Links</p>
                                <p className="text-slate-900 font-black flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" /> {page.links?.length || 0}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Performance</p>
                                <p className="text-indigo-600 font-black flex items-center gap-2">
                                    <BarChart3 size={14} /> 2.4k
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleEditTree(page.id)}
                                className="flex-grow bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                            >
                                Edit Tree
                            </button>
                            <a
                                href={`${window.location.origin}/${page.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                            >
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                ))}

                {/* Create Card */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="group border-4 border-dashed border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-500"
                >
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-500 shadow-inner">
                        <Plus size={32} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 text-lg">New Bio Tree</h4>
                        <p className="text-slate-400 text-sm font-medium">Create another profile</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default BioTrees;
