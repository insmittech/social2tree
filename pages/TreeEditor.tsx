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
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 m-8">
                <h2 className="text-xl font-bold text-slate-900">Tree Not Found</h2>
                <button onClick={() => navigate('/dashboard/trees')} className="mt-4 text-indigo-600 font-bold">Back to My Trees</button>
            </div>
        );
    }

    const tabs = [
        { id: 'links', label: 'Links', icon: <MousePointer2 size={16} /> },
        { id: 'social', label: 'Socials', icon: <Share2 size={16} /> },
        { id: 'themes', label: 'Appearance', icon: <Palette size={16} /> },
        { id: 'share', label: 'Sharing', icon: <QrCode size={16} /> },
    ];

    const handleProfileUpdate = (updatedPage: any) => {
        if (!profile || !profile.pages) return;
        const newPages = profile.pages.map(p => p.id === id ? { ...p, ...updatedPage } : p);
        updateUser({ pages: newPages });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full pb-32 lg:pb-12">
            {/* Upper Navigation */}
            <div className="bg-white border-b border-slate-100 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/trees')}
                            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Editor</p>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                {activePage.displayName}
                                <span className="text-slate-300 font-mono text-xs font-medium">/{activePage.slug}</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={`${window.location.origin}/${activePage.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 px-4 py-2 rounded-lg font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <ExternalLink size={16} /> <span className="hidden sm:inline">Preview</span>
                        </a>
                        <button
                            onClick={() => navigate(`/dashboard/builder/${id}`)}
                            className="bg-white text-indigo-600 border border-indigo-100 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <PanelsTopLeft size={16} /> <span className="hidden sm:inline">Customize Layout</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('share')}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr,340px] gap-10 items-start">
                {/* Main Content Area */}
                <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="bg-slate-50 p-1 rounded-xl border border-slate-200 flex overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex-1 ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Panels */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 min-h-[500px]">
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

                {/* Live Preview Sidebar */}
                <div className="hidden lg:block sticky top-32">
                    <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-slate-800">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Preview</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>

                        <div className="relative rounded-[1.8rem] overflow-hidden bg-white min-h-[500px] border-4 border-slate-800">
                            <PhonePreview page={activePage} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Preview Toggle */}
            <button
                onClick={() => setShowMobilePreview(true)}
                className="lg:hidden fixed bottom-24 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg z-40 active:scale-95"
            >
                <Eye size={24} />
            </button>

            {/* Mobile Preview Modal */}
            {showMobilePreview && (
                <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden">
                    <div className="relative w-full max-w-[320px]">
                        <button
                            onClick={() => setShowMobilePreview(false)}
                            className="absolute -top-10 right-0 text-white"
                        >
                            <X size={24} />
                        </button>
                        <div className="bg-slate-900 p-4 rounded-[2rem] border-4 border-slate-800">
                            <div className="bg-white rounded-[1.2rem] overflow-hidden min-h-[450px]">
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
