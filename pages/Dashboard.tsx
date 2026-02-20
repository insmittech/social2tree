import React, { useState, useEffect } from 'react';
import PhonePreview from '../components/PhonePreview';
import { useNavigate } from 'react-router-dom';
import client from '../src/api/client';
import { Plus, Trash2, Check, Share2, QrCode, Eye, ArrowRight, ShieldAlert, X, ShieldCheck, Lock } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../src/context/ToastContext';
import { useAuth } from '../src/context/AuthContext';
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
import { THEMES } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user: profile, updateUser } = useAuth();
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

  const activePage = profile?.pages?.find(p => p.id === selectedPageId) || profile?.pages?.[0] || null;

  useEffect(() => {
    if (profile && !selectedPageId && profile.pages?.length > 0) {
      setSelectedPageId(profile.pages[0].id);
    }
  }, [profile, selectedPageId, setSelectedPageId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div></div>;
  }

  if (!activePage) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-xl shadow-slate-100/50 max-w-2xl mx-auto">
          <div className="bg-indigo-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
            <Plus className="text-indigo-600 w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase italic">Create Your First Bio-Tree</h2>
          <p className="text-slate-500 font-medium text-lg mb-10">You don't have any pages yet. Create one to start sharing your social identity.</p>
          <button
            onClick={() => navigate('/dashboard/trees')}
            className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 mx-auto"
          >
            Get Started <Plus size={24} />
          </button>
        </div>
      </div>
    );
  }

  const isFreePlan = profile.plan === 'free';
  const linkLimit = isFreePlan ? 3 : Infinity;
  const hasReachedLimit = (activePage.links?.length || 0) >= linkLimit;

  const publicUrl = `${window.location.origin}/${activePage.slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(publicUrl)}&bgcolor=ffffff&color=0f172a&margin=2`;

  const totalClicks = activePage?.links?.reduce((acc, link) => acc + (link.clicks || 0), 0) || 0;
  const ctr = profile.views > 0 ? ((totalClicks / profile.views) * 100).toFixed(1) : '0';

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

      if (profile) {
        const newPages = profile.pages.map(p => p.id === activePage.id ? {
          ...p,
          links: [...p.links, res.data.link]
        } : p);
        updateUser({ pages: newPages });
      }

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
      if (profile) {
        const newPages = profile.pages.map(p => p.id === activePage.id ? {
          ...p,
          links: p.links.filter(l => l.id !== id)
        } : p);
        updateUser({ pages: newPages });
      }
      showToast('Link deleted', 'info');
    } catch (err) {
      console.error("Failed to delete link", err);
      showToast('Failed to delete link', 'error');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    if (profile) {
      const newPages = profile.pages.map(p => p.id === activePage.id ? { ...p, links: p.links.map(l => l.id === id ? { ...l, active } : l) } : p);
      updateUser({ pages: newPages });
    }

    try {
      await client.post('/links/update.php', { id, is_active: active ? 1 : 0 });
      showToast(active ? 'Link activated' : 'Link deactivated', 'success');
    } catch (err) {
      console.error("Failed to update link", err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleProfileUpdate = async (updates: any) => {
    if (profile) {
      const newPages = profile.pages.map(p => p.id === activePage.id ? { ...p, ...updates } : p);
      updateUser({ pages: newPages });
    }

    try {
      await client.post('/pages/update.php', { id: activePage.id, ...updates });
    } catch (err) {
      console.error("Failed to update page", err);
      showToast('Failed to update page', 'error');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activePage.links.findIndex(l => l.id === active.id);
      const newIndex = activePage.links.findIndex(l => l.id === over.id);

      const newLinks = arrayMove(activePage.links, oldIndex, newIndex);

      if (profile) {
        const newPages = profile.pages.map(p => p.id === activePage.id ? { ...p, links: newLinks } : p);
        updateUser({ pages: newPages });
      }

      try {
        await client.post('/links/reorder.php', {
          ids: newLinks.map(l => l.id)
        });
        showToast('Order updated', 'success');
      } catch (err) {
        console.error("Failed to reorder links", err);
        showToast('Failed to save link order', 'error');
        if (profile) {
          const originalPages = profile.pages.map(p => p.id === activePage.id ? { ...p, links: activePage.links } : p);
          updateUser({ pages: originalPages });
        }
      }
    }
  };

  const generateAIBio = async () => {
    setIsGeneratingBio(true);
    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' } as any);
      const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Write a professional one-sentence bio for ${activePage.displayName}. Max 80 characters.`);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-24">
      <div className="grid lg:grid-cols-[1fr,320px] gap-10 items-start">
        <div className="space-y-8">

          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overview</p>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Welcome back, {profile.displayName.split(' ')[0]}
                {profile.isVerified && <ShieldCheck className="text-blue-500 fill-blue-500/10" size={24} />}
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Your profile: <span className="text-indigo-600 font-bold">s2t.me/{activePage.slug}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                title="Copy Link"
              >
                {copied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
              </button>
              <button
                onClick={handleDownloadQR}
                className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                title="Download QR"
              >
                {isDownloading ? <div className="animate-spin h-4.5 w-4.5 border-2 border-indigo-600 border-t-transparent rounded-full" /> : <QrCode size={18} />}
              </button>
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Views", value: profile.views.toLocaleString() },
              { label: "Clicks", value: totalClicks.toLocaleString() },
              { label: "CTR", value: `${ctr}%` },
              { label: "Plan", value: profile.plan.toUpperCase() }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-lg border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Verification Status */}
          {!profile.isVerified && (
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 relative">
                  <ShieldCheck className="text-slate-300 w-8 h-8" />
                  <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-full border-2 border-white">
                    <Lock size={10} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Get Verified</h3>
                  <p className="text-slate-500 text-xs font-medium">Verify your identity to get the official blue checkmark.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => navigate('/dashboard/verification')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all whitespace-nowrap"
                >
                  Apply for Verification
                </button>
                {isFreePlan && (
                  <button
                    onClick={() => navigate('/dashboard/plan')}
                    className="px-6 py-3 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 hover:bg-amber-100 transition-all whitespace-nowrap"
                  >
                    Upgrade to Pro (Instant)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Profile Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    value={activePage.displayName}
                    onChange={(e) => handleProfileUpdate({ displayName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                    <button onClick={generateAIBio} disabled={isGeneratingBio} className="text-[10px] font-bold text-indigo-600 hover:underline">
                      {isGeneratingBio ? '...' : 'AI Bio'}
                    </button>
                  </div>
                  <textarea
                    value={activePage.bio}
                    onChange={(e) => handleProfileUpdate({ bio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none h-24 resize-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base Color</label>
                <div className="flex items-center gap-3">
                  {(() => {
                    const currentTheme = THEMES[activePage.theme] || THEMES.default;
                    return (
                      <>
                        <div className={`w-10 h-10 rounded-lg border border-slate-200 ${currentTheme.background}`} />
                        <p className="text-xs font-mono text-slate-500">{currentTheme.name}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Active Links</h2>
              <button
                onClick={() => setShowAddForm(true)}
                disabled={hasReachedLimit}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                Add Link
              </button>
            </div>

            {showAddForm && (
              <div className="bg-white p-6 rounded-lg border border-indigo-100 shadow-sm space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-bold text-sm">New Link</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400"><X size={16} /></button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    placeholder="Title"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <input
                    placeholder="URL"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-mono"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddLink}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm"
                >
                  Create Link
                </button>
              </div>
            )}

            <div className="space-y-3">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={mainLinks.map(l => l.id)} strategy={verticalListSortingStrategy}>
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
          </div>
        </div>

        {/* Sidebar Preview */}
        <div className="hidden lg:block sticky top-24">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="bg-white rounded-lg overflow-hidden min-h-[480px]">
              <PhonePreview page={activePage} />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
