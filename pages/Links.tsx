
import React, { useState, useEffect } from 'react';
import PhonePreview from '../components/PhonePreview';
import { useNavigate } from 'react-router-dom';
import client from '../src/api/client';
import { UserProfile, Link } from '../types';
import { Plus, Trash2, X, Wand2, QrCode, Download, Share2, Eye, Link as LinkIcon, Check, ShieldAlert, Zap, Star, Lock } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../src/context/ToastContext';
import { getSocialIcon } from '../src/utils/socialIcons';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableLink from '../components/SortableLink';
import PageManager from '../components/PageManager';
import { usePageSelector } from '../src/hooks/usePageSelector';

interface LinksPageProps {
    onLogout: () => void;
}

const LinksPage: React.FC<LinksPageProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { selectedPageId, setSelectedPageId } = usePageSelector();

    const [showAddForm, setShowAddForm] = useState(false);
    const [showSocialForm, setShowSocialForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newScheduledStart, setNewScheduledStart] = useState('');
    const [newScheduledEnd, setNewScheduledEnd] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newSocialUrl, setNewSocialUrl] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    // Derived active page
    const activePage = profile?.pages.find(p => p.id === selectedPageId) || profile?.pages[0] || null;

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('/auth/me.php');
                if (res.data.user) {
                    setProfile(res.data.user);
                    if (!selectedPageId && res.data.user.pages.length > 0) {
                        setSelectedPageId(res.data.user.pages[0].id);
                    }
                } else {
                    navigate('/login');
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate, selectedPageId, setSelectedPageId]);

    if (loading || !profile || !activePage) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div></div>;
    }

    const isFreePlan = profile.plan === 'free';
    const linkLimit = isFreePlan ? 3 : Infinity;
    const hasReachedLimit = (activePage.links?.length || 0) >= linkLimit;

    const publicUrl = `${window.location.origin}/${activePage.slug}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(publicUrl)}&bgcolor=ffffff&color=0f172a&margin=2`;

    const handleDownloadQR = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `s2t-qr-${activePage.slug}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            showToast('QR Code downloaded!', 'success');
        } catch (err) {
            console.error("Failed to download QR", err);
            showToast("Failed to download QR code.", "error");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        showToast('Link copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddLink = async (e: React.FormEvent, type: 'social' | 'social_icon' = 'social') => {
        e.preventDefault();
        const url = type === 'social_icon' ? newSocialUrl : newUrl;
        const title = type === 'social_icon' ? 'Social Icon' : newTitle;

        if (!url || (type === 'social' && !title)) return;
        if (type === 'social' && hasReachedLimit) {
            showToast("You've reached your free link limit!", "warning");
            return;
        }

        try {
            const payload: any = { title, url, type, pageId: activePage.id };
            if (type === 'social') {
                payload.scheduledStart = newScheduledStart || null;
                payload.scheduledEnd = newScheduledEnd || null;
                payload.password = newPassword || null;
            }

            const res = await client.post('/links/create.php', payload);

            setProfile(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    pages: prev.pages.map(p => p.id === activePage.id ? {
                        ...p,
                        links: [...p.links, res.data.link]
                    } : p)
                };
            });

            if (type === 'social_icon') {
                setNewSocialUrl('');
                setShowSocialForm(false);
            } else {
                setNewTitle('');
                setNewUrl('');
                setNewScheduledStart('');
                setNewScheduledEnd('');
                setNewPassword('');
                setShowAddForm(false);
            }
            showToast('Link added successfully!', 'success');
        } catch (err) {
            console.error("Failed to add link", err);
            showToast("Failed to create link", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this link?")) return;
        try {
            await client.post('/links/delete.php', { id });
            setProfile(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    pages: prev.pages.map(p => p.id === activePage.id ? {
                        ...p,
                        links: p.links.filter(l => l.id !== id)
                    } : p)
                };
            });
            showToast('Link deleted', 'info');
        } catch (err) {
            console.error("Failed to delete link", err);
            showToast('Failed to delete link', 'error');
        }
    };

    const handleToggleActive = async (id: string, active: boolean) => {
        setProfile(prev => {
            if (!prev) return null;
            return {
                ...prev,
                pages: prev.pages.map(p => p.id === activePage.id ? {
                    ...p,
                    links: p.links.map(l => l.id === id ? { ...l, active } : l)
                } : p)
            };
        });

        try {
            await client.post('/links/update.php', { id, is_active: active ? 1 : 0 });
            showToast(active ? 'Link activated' : 'Link deactivated', 'success');
        } catch (err) {
            console.error("Failed to update link", err);
            showToast('Failed to update status', 'error');
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = activePage.links.findIndex(l => l.id === active.id);
            const newIndex = activePage.links.findIndex(l => l.id === over.id);

            const newLinks = arrayMove(activePage.links, oldIndex, newIndex);

            setProfile(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    pages: prev.pages.map(p => p.id === activePage.id ? { ...p, links: newLinks } : p)
                };
            });

            try {
                await client.post('/links/reorder.php', {
                    ids: newLinks.map(l => l.id)
                });
                showToast('Order updated', 'success');
            } catch (err) {
                console.error("Failed to reorder links", err);
                showToast('Failed to save link order', 'error');
                // Rollback
                setProfile(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        pages: prev.pages.map(p => p.id === activePage.id ? { ...p, links: activePage.links } : p)
                    };
                });
            }
        }
    };

    const onPageCreated = (page: any) => {
        setProfile(prev => prev ? {
            ...prev,
            pages: [...prev.pages, page]
        } : null);
    };

    const mainLinks = activePage.links.filter(l => l.type !== 'social_icon');
    const socialIcons = activePage.links.filter(l => l.type === 'social_icon');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-32 lg:pb-8">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-slate-900">Manage Links</h1>
                <p className="text-slate-500 font-medium">Add, edit and organize your custom links</p>
            </header>

            <div className="grid lg:grid-cols-[1fr,320px] gap-8 items-start">

                <div className="space-y-6">
                    <PageManager
                        pages={profile.pages}
                        onPageCreated={onPageCreated}
                    />

                    {/* Plan Info Bar */}
                    <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${isFreePlan ? 'bg-amber-50 border-amber-200' : 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-100'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isFreePlan ? 'bg-amber-200 text-amber-800' : 'bg-white/20 text-white'}`}>
                                {isFreePlan ? <Zap size={20} /> : <Star size={20} />}
                            </div>
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-widest ${isFreePlan ? 'text-amber-700' : 'text-indigo-100'}`}>Current Plan</p>
                                <h3 className="text-lg font-black capitalize">{profile.plan}</h3>
                            </div>
                        </div>
                        {isFreePlan && (
                            <button
                                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl font-black text-sm transition-all shadow-md active:scale-95"
                                onClick={() => navigate('/dashboard')}
                            >
                                Upgrade to PRO
                            </button>
                        )}
                    </div>

                    {/* Links Section */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <LinkIcon size={20} className="text-indigo-600" /> My Links
                                </h2>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${hasReachedLimit ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {mainLinks.length} / {isFreePlan ? '3' : '∞'}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowAddForm(true)}
                                disabled={hasReachedLimit}
                                className={`px-4 sm:px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 text-sm ${hasReachedLimit ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                            >
                                <Plus size={18} /> <span className="hidden xs:inline">Add New Link</span>
                            </button>
                        </div>

                        {hasReachedLimit && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700">
                                <ShieldAlert size={18} />
                                <p className="text-sm font-medium">Link limit reached. Upgrade to add more.</p>
                            </div>
                        )}

                        {showAddForm && (
                            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold">New Link</h3>
                                    <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                                </div>
                                <form onSubmit={handleAddLink} className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <input
                                            placeholder="Title (e.g. My Website)"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            autoFocus
                                        />
                                        <input
                                            placeholder="URL (e.g. https://...)"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                                            value={newUrl}
                                            onChange={(e) => setNewUrl(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Start Date (Optional)</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                                value={newScheduledStart}
                                                onChange={(e) => setNewScheduledStart(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">End Date (Optional)</label>
                                            <input
                                                type="datetime-local"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                                value={newScheduledEnd}
                                                onChange={(e) => setNewScheduledEnd(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Password Protection (Optional)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Set a password to lock this link"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="px-4 py-2 rounded-lg text-slate-500 font-semibold hover:bg-slate-100 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md"
                                        >
                                            Add Link
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="space-y-4">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={mainLinks.map(l => l.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {mainLinks.length === 0 ? (
                                        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                                                <Plus size={32} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">No links yet</h3>
                                                <p className="text-slate-500 text-sm">Add your first custom link to get started!</p>
                                            </div>
                                            <button
                                                onClick={() => setShowAddForm(true)}
                                                className="text-indigo-600 font-bold hover:underline"
                                            >
                                                Create your first link
                                            </button>
                                        </div>
                                    ) : (
                                        mainLinks.map((link) => (
                                            <SortableLink
                                                key={link.id}
                                                link={link}
                                                getSocialIcon={getSocialIcon}
                                                handleToggleActive={handleToggleActive}
                                                handleDelete={handleDelete}
                                            />
                                        ))
                                    )}
                                </SortableContext>
                            </DndContext>
                        </div>
                    </section>

                    {/* Social Icons Section */}
                    <section className="space-y-4 pt-10">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Share2 size={20} className="text-indigo-600" /> Social Icons
                                </h2>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                    {socialIcons.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowSocialForm(true)}
                                className="px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-sm bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 text-sm"
                            >
                                <Plus size={18} /> Add Social
                            </button>
                        </div>

                        {showSocialForm && (
                            <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold">New Social Icon</h3>
                                    <button onClick={() => setShowSocialForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                                </div>
                                <form onSubmit={(e) => handleAddLink(e, 'social_icon')} className="space-y-4">
                                    <div>
                                        <input
                                            placeholder="Social Profile URL (e.g. https://instagram.com/...)"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                                            value={newSocialUrl}
                                            onChange={(e) => setNewSocialUrl(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowSocialForm(false)}
                                            className="px-4 py-2 rounded-lg text-slate-500 font-semibold hover:bg-slate-100 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md"
                                        >
                                            Add Icon
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {socialIcons.map((link) => (
                                <div key={link.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-slate-50 rounded-lg">
                                            {getSocialIcon(link.url)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-mono text-slate-500 truncate">{link.url}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="relative inline-flex items-center cursor-pointer scale-75">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={link.active}
                                                onChange={(e) => handleToggleActive(link.id, e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                        <button onClick={() => handleDelete(link.id)} className="text-slate-300 hover:text-red-500 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="hidden lg:block sticky top-24">
                    <PhonePreview page={activePage} />
                </div>
            </div>
        </div>
    );
};

export default LinksPage;
