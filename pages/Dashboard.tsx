
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import PhonePreview from '../components/PhonePreview';
import { useNavigate } from 'react-router-dom';
import client from '../src/api/client';
import { UserProfile } from '../types';
import { Plus, Trash2, ExternalLink, Edit2, X, Wand2, QrCode, Download, Share2, Globe, Star, Zap, ShieldAlert, Check, Eye, Settings } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../src/context/ToastContext';
import { getSocialIcon } from '../src/utils/socialIcons';
import { usePageSelector } from '../src/hooks/usePageSelector';
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

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
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
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Derived active page
  const activePage = profile?.pages.find(p => p.id === selectedPageId) || profile?.pages[0] || null;

  useEffect(() => {
    if (profile && !selectedPageId && profile.pages.length > 0) {
      setSelectedPageId(profile.pages[0].id);
    }
  }, [profile, selectedPageId, setSelectedPageId]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get('/auth/me.php');
        if (res.data.user) {
          setProfile(res.data.user);
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
  }, [navigate]);

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
        pages: prev.pages.map(p => p.id === activePage.id ? { ...p, links: p.links.map(l => l.id === id ? { ...l, active } : l) } : p)
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

  const handleProfileUpdate = async (updates: any) => {
    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        pages: prev.pages.map(p => p.id === activePage.id ? { ...p, ...updates } : p)
      };
    });

    try {
      await client.post('/pages/update.php', { id: activePage.id, ...updates });
    } catch (err) {
      console.error("Failed to update page", err);
      showToast('Failed to update page', 'error');
    }
  };

  const onPageCreated = (page: any) => {
    setProfile(prev => prev ? {
      ...prev,
      pages: [...prev.pages, page]
    } : null);
  };

  const handleUpgrade = () => {
    showToast("Payment gateway integration pending.", "info");
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
        // Rollback on error
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

  const generateAIBio = async () => {
    setIsGeneratingBio(true);
    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' } as any);
      const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Write a compelling, professional one-sentence social media bio for ${activePage.displayName} who is ${activePage.bio || 'a digital creator'}. Focus on authority and personality. Max 80 characters.`);
      const response = await result.response;
      const text = response.text();

      if (text) {
        handleProfileUpdate({ bio: text.trim().replace(/"/g, '') });
        showToast('AI Bio generated!', 'success');
      }
    } catch (err) {
      console.error("Failed to generate bio", err);
      showToast('AI Bio generation failed', 'error');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const mainLinks = activePage.links.filter(l => l.type !== 'social_icon');
  const socialIcons = activePage.links.filter(l => l.type === 'social_icon');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar isDashboard onLogout={onLogout} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-32 lg:pb-8">
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
                  onClick={handleUpgrade}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl font-black text-sm transition-all shadow-md active:scale-95"
                >
                  Upgrade to PRO
                </button>
              )}
            </div>

            {/* QR Code Quick Access */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={handleDownloadQR}
                className="p-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 transition-colors group relative"
                title="Click to download QR Code"
              >
                <img
                  src={qrUrl}
                  alt="Your QR Code"
                  className={`w-24 h-24 group-hover:opacity-90 transition-opacity ${isDownloading ? 'opacity-30' : 'opacity-100'}`}
                />
                {isDownloading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent"></div>
                  </div>
                )}
              </button>
              <div className="text-center sm:text-left flex-grow">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
                  <QrCode size={20} className="text-indigo-600" /> Your QR Code
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">One code. Complete digital identity.</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    onClick={handleDownloadQR}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] sm:text-xs font-bold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    <Download size={14} /> {isDownloading ? '...' : 'Download'}
                  </button>
                  <button
                    onClick={handleShare}
                    className={`flex items-center gap-2 px-4 py-2 border text-[10px] sm:text-xs font-bold rounded-lg transition-all ${copied
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {copied ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Copy Link</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Edit2 size={18} className="text-indigo-600" /> Page Editor
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative group self-center sm:self-start">
                  <img src={activePage.avatarUrl} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-inner" />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Edit2 size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex-grow w-full space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Display Name</label>
                      <input
                        type="text"
                        value={activePage.displayName}
                        onChange={(e) => handleProfileUpdate({ displayName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Custom Domain (Optional)</label>
                      <input
                        type="text"
                        value={activePage.customDomain || ''}
                        placeholder="links.brand.com"
                        onChange={(e) => handleProfileUpdate({ customDomain: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block flex justify-between items-center">
                      Bio
                      <button
                        onClick={generateAIBio}
                        disabled={isGeneratingBio}
                        className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] flex items-center gap-1 normal-case font-bold hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                      >
                        <Wand2 size={10} /> {isGeneratingBio ? 'Thinking...' : 'AI Enhance'}
                      </button>
                    </label>
                    <textarea
                      value={activePage.bio}
                      onChange={(e) => handleProfileUpdate({ bio: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm h-20 resize-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Links Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">Links</h2>
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
                  <Plus size={18} /> <span className="hidden xs:inline">Add Link</span>
                </button>
              </div>

              {hasReachedLimit && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700">
                  <ShieldAlert size={18} />
                  <p className="text-sm font-medium">Link limit reached. <button onClick={handleUpgrade} className="font-bold underline">Upgrade to PRO</button></p>
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
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 rounded-lg text-slate-500 font-semibold hover:bg-slate-100 transition-all font-mono"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-10 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md font-mono"
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
                    {mainLinks.map((link) => (
                      <SortableLink
                        key={link.id}
                        link={link}
                        getSocialIcon={getSocialIcon}
                        handleToggleActive={handleToggleActive}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </section>

            {/* Social Icons Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">Social Icons</h2>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {socialIcons.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowSocialForm(true)}
                  className="px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-sm bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 text-sm"
                >
                  <Plus size={18} /> Add Icon
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
                        className="px-4 py-2 rounded-lg text-slate-500 font-semibold hover:bg-slate-100 transition-all font-mono"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-10 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md font-mono"
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
      </main>

      <div className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full px-4 flex gap-2">
        <button
          className="flex-grow bg-slate-900 text-white px-4 py-3 rounded-xl font-bold shadow-2xl flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all text-xs font-mono"
          onClick={handleShare}
        >
          <Share2 size={16} /> {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <button
          className="bg-white text-indigo-600 px-4 py-3 rounded-xl font-bold shadow-2xl flex items-center justify-center gap-2 border border-slate-200 active:scale-95 transition-all text-xs font-mono"
          onClick={() => setShowMobilePreview(true)}
        >
          <Eye size={16} /> Preview
        </button>
      </div>

      {showMobilePreview && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden animate-in fade-in duration-300">
          <div className="relative animate-in slide-in-from-bottom-10 duration-500">
            <button
              onClick={() => setShowMobilePreview(false)}
              className="absolute -top-4 -right-4 bg-white text-slate-900 p-2 rounded-full shadow-xl border border-slate-100 z-[70] hover:scale-110 active:scale-95 transition-all"
            >
              <X size={24} />
            </button>
            <div className="max-h-[90vh] overflow-y-auto no-scrollbar bg-white rounded-[3rem] p-2 shadow-2xl">
              <PhonePreview page={activePage} />
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
};

export default Dashboard;
