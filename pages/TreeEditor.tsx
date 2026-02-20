
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout,
    Palette,
    Share2,
    Zap,
    ArrowLeft,
    ExternalLink,
    Eye,
    Settings,
    ChevronRight,
    QrCode,
    Sparkles,
    MousePointer2,
    X
} from 'lucide-react';
import client from '../src/api/client';
import { UserProfile } from '../types';
import { useToast } from '../src/context/ToastContext';
import { useAuth } from '../src/context/AuthContext';
import PhonePreview from '../components/PhonePreview';

import TreeLinks from '../components/tree-editor/TreeLinks';
import TreeSocial from '../components/tree-editor/TreeSocial';
import TreeThemes from '../components/tree-editor/TreeThemes';
import TreeSharing from '../components/tree-editor/TreeSharing';

const TreeEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user: profile, updateUser } = useAuth();

    const [activeTab, setActiveTab] = useState<'links' | 'social' | 'themes' | 'share'>('links');
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    // No fetchProfile useEffect needed

    const activePage = profile?.pages?.find(p => p.id === id) || null;

    if (!profile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!activePage) {
        return (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 m-8">
                <h2 className="text-xl font-black text-slate-900">Tree Not Found</h2>
                <button onClick={() => navigate('/dashboard/trees')} className="mt-4 text-indigo-600 font-bold">Back to My Trees</button>
            </div>
        );
    }

    const tabs = [
        { id: 'links', label: 'Links', icon: <MousePointer2 size={18} /> },
        { id: 'social', label: 'Social Icons', icon: <Share2 size={18} /> },
        { id: 'themes', label: 'Appearance', icon: <Palette size={18} /> },
        { id: 'share', label: 'Sharing', icon: <QrCode size={18} /> },
    ];

    const handleProfileUpdate = (updatedPage: any) => {
        if (!profile) return;
        const newPages = profile.pages.map(p => p.id === id ? { ...p, ...updatedPage } : p);
        updateUser({ pages: newPages });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full pb-32 lg:pb-12">
            {/* Upper Navigation / Breadcrumbs - Glassmorphism */}
            <div className="relative sticky top-0 z-30 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 bg-white/60 backdrop-blur-xl border-b border-white/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/trees')}
                            className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all hover:shadow-md active:scale-95"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                                <span>My Trees</span>
                                <ChevronRight size={10} className="text-slate-300" />
                                <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Editor</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                {activePage.displayName}
                                <span className="text-slate-300 font-mono text-sm font-medium">/{activePage.slug}</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={`${window.location.origin}/${activePage.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 hover:shadow-sm"
                        >
                            <ExternalLink size={18} /> <span className="hidden sm:inline">Preview Live</span>
                        </a>
                        <button
                            onClick={() => setActiveTab('share')}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95"
                        >
                            <Share2 size={18} /> <span className="hidden sm:inline">Share Tree</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr,360px] gap-10 items-start">
                {/* Main Content Area */}
                <div className="space-y-8">
                    {/* Tab Navigation - Premium Pill Style */}
                    <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60 flex gap-1 overflow-x-auto no-scrollbar backdrop-blur-sm">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm whitespace-nowrap transition-all relative group ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                <span className={`${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'} transition-colors`}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Panels */}
                    <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                            />
                        )}
                    </div>
                </div>

                {/* Live Preview Sidebar - iPhone Style Enhancement */}
                <div className="hidden lg:block sticky top-32">
                    <div className="bg-slate-950 p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden ring-8 ring-slate-900 border-4 border-slate-800">
                        {/* iPhone Top Notch/Speaker */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>

                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-10"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-80">Live Preview</h3>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                            </div>
                        </div>

                        <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 min-h-[550px] border border-white/5">
                            <PhonePreview page={activePage} />
                        </div>

                        <div className="mt-8 text-center bg-slate-900/50 py-3 rounded-2xl border border-white/5">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                <Sparkles size={12} className="text-amber-500" />
                                Auto-saving changes
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Preview Toggle */}
            <button
                onClick={() => setShowMobilePreview(true)}
                className="lg:hidden fixed bottom-6 right-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl z-40 active:scale-95 transition-all outline-none border-4 border-white"
            >
                <Eye size={24} />
            </button>

            {/* Mobile Preview Modal */}
            {showMobilePreview && (
                <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6 lg:hidden animate-in fade-in duration-200">
                    <div className="relative w-full max-w-[340px] h-[700px] max-h-[85vh]">
                        <button
                            onClick={() => setShowMobilePreview(false)}
                            className="absolute -top-12 right-0 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="w-full h-full bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-slate-800 relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-10"></div>
                            <div className="h-full overflow-y-auto no-scrollbar pb-8">
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
