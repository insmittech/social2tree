import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Share2,
    Palette,
    ArrowLeft,
    ExternalLink,
    Eye,
    QrCode,
    MousePointer2,
    X,
    PanelsTopLeft
} from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import PhonePreview from '../components/PhonePreview';

import TreeLinks from '../components/tree-editor/TreeLinks';
import TreeSocial from '../components/tree-editor/TreeSocial';
import TreeThemes from '../components/tree-editor/TreeThemes';
import TreeSharing from '../components/tree-editor/TreeSharing';

const TreeEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: profile, updateUser } = useAuth();

    const [activeTab, setActiveTab] = useState<'links' | 'social' | 'themes' | 'share'>('links');
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    const activePage = profile?.pages?.find(p => p.id === id) ?? null;

    if (!profile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!activePage) {
        return (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 m-8 shadow-sm">
                <h2 className="text-xl font-black text-slate-900">Tree Not Found</h2>
                <button onClick={() => navigate('/dashboard/trees')} className="mt-4 text-indigo-600 font-black uppercase text-xs tracking-widest">Back to My Trees</button>
            </div>
        );
    }

    const tabs = [
        { id: 'links', label: 'Links', icon: <MousePointer2 size={16} /> },
        { id: 'social', label: 'Socials', icon: <Share2 size={16} /> },
        { id: 'themes', label: 'Style', icon: <Palette size={16} /> },
        { id: 'share', label: 'Share', icon: <QrCode size={16} /> },
    ];

    const handleProfileUpdate = (updatedPage: any) => {
        if (!profile || !profile.pages) return;
        const newPages = profile.pages.map(p => p.id === id ? { ...p, ...updatedPage } : p);
        updateUser({ pages: newPages });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full pb-32 lg:pb-12">
            {/* Upper Navigation */}
            <div className="bg-white border-b border-slate-100 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate('/dashboard/trees')}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm active:scale-95"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Profile Setting</p>
                            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 leading-none">
                                {activePage.displayName}
                                <span className="text-indigo-600/30 text-xs font-black uppercase tracking-widest hidden sm:inline">/{activePage.slug}</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={`${window.location.origin}/${activePage.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-slate-600 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <ExternalLink size={14} /> <span>Live</span>
                        </a>
                        <button
                            onClick={() => navigate(`/dashboard/builder/${id}`)}
                            className="bg-white text-indigo-600 border border-indigo-100 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <PanelsTopLeft size={14} /> <span>Layout</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('share')}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                        >
                            <Share2 size={14} /> <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr,340px] gap-12 items-start">
                <div className="space-y-8">
                    {/* Tabs Navigation */}
                    <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100 overflow-x-auto no-scrollbar whitespace-nowrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3.5 px-4 rounded-[1.25rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-900 hover:bg-white'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Panels */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-10 min-h-[500px] shadow-sm">
                        {activeTab === 'links' && (
                            <TreeLinks
                                page={activePage}
                                onUpdate={handleProfileUpdate}
                                plan={profile.plan}
                            />
                        )}
                        {activeTab === 'social' && (
                            <TreeSocial
                                page={activePage}
                                onUpdate={handleProfileUpdate}
                            />
                        )}
                        {activeTab === 'themes' && (
                            <TreeThemes
                                page={activePage}
                                onUpdate={handleProfileUpdate}
                            />
                        )}
                        {activeTab === 'share' && (
                            <TreeSharing
                                page={activePage}
                                onUpdate={handleProfileUpdate}
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar Preview */}
                <div className="hidden lg:block sticky top-32">
                    <div className="bg-slate-950 p-7 rounded-[3rem] shadow-2xl border border-slate-900">
                        <div className="flex items-center justify-between mb-5 px-3">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live System</span>
                            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-full">
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="relative rounded-[2.2rem] overflow-hidden bg-white min-h-[520px] border-8 border-slate-900 shadow-inner">
                            <PhonePreview page={activePage} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Actions */}
            <button
                onClick={() => setShowMobilePreview(true)}
                className="lg:hidden fixed bottom-24 right-6 bg-slate-900 text-white p-5 rounded-[1.75rem] shadow-2xl z-40 active:scale-90 transition-transform flex items-center gap-2 border border-slate-800"
            >
                <Eye size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest px-1">Preview</span>
            </button>

            {showMobilePreview && (
                <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 lg:hidden animate-in fade-in duration-300">
                    <div className="relative w-full max-w-[320px]">
                        <button
                            onClick={() => setShowMobilePreview(false)}
                            className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <X size={28} />
                        </button>
                        <div className="bg-slate-950 p-5 rounded-[3rem] border-4 border-slate-900 shadow-2xl">
                            <div className="bg-white rounded-[2rem] overflow-hidden min-h-[480px]">
                                <PhonePreview page={activePage} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreeEditor;
