import React, { useState, useEffect } from 'react';
import { Search, Globe, Image as ImageIcon, ToggleLeft, ToggleRight, Save, X, Eye, Monitor, Smartphone, MessageSquare, Zap } from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

interface SeoMetadata {
    title_tag: string;
    meta_description: string;
    meta_keywords: string;
    og_image: string;
    is_indexed: boolean;
    include_in_sitemap: boolean;
    canonical_url: string;
    structured_data: any;
}

interface SeoManagerProps {
    pageId: string;
    slug: string;
    displayName: string;
    onClose: () => void;
}

const SeoManager: React.FC<SeoManagerProps> = ({ pageId, slug, displayName, onClose }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<'google' | 'social'>('google');
    const [seo, setSeo] = useState<SeoMetadata>({
        title_tag: '',
        meta_description: '',
        meta_keywords: '',
        og_image: '',
        is_indexed: true,
        include_in_sitemap: true,
        canonical_url: '',
        structured_data: null
    });

    useEffect(() => {
        const fetchSeo = async () => {
            try {
                const res = await client.get(`/admin/seo/get.php?page_id=${pageId}`);
                setSeo(res.data);
            } catch (err) {
                console.error("Failed to fetch SEO metadata", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSeo();
    }, [pageId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await client.post('/admin/seo/save.php', { ...seo, page_id: pageId });
            showToast('SEO settings saved successfully.', 'success');
            onClose();
        } catch (err) {
            showToast('Failed to save SEO settings.', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Configuration Column */}
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                            <Monitor size={14} /> Meta Title Tag
                        </label>
                        <input
                            type="text"
                            value={seo.title_tag}
                            onChange={(e) => setSeo({ ...seo, title_tag: e.target.value })}
                            placeholder={`${displayName} | Social2Tree`}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                            <MessageSquare size={14} /> Meta Description
                        </label>
                        <textarea
                            rows={3}
                            value={seo.meta_description}
                            onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })}
                            placeholder="A brief summary of your bio tree for search engines..."
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                                <Globe size={14} /> Indexing
                            </label>
                            <button
                                type="button"
                                onClick={() => setSeo({ ...seo, is_indexed: !seo.is_indexed })}
                                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${seo.is_indexed
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                                    : 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20'
                                    }`}
                            >
                                {seo.is_indexed ? <ToggleRight /> : <ToggleLeft />}
                                <span className="text-[10px] font-black uppercase tracking-widest">{seo.is_indexed ? 'Index' : 'Noindex'}</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                                <Search size={14} /> Sitemap
                            </label>
                            <button
                                type="button"
                                onClick={() => setSeo({ ...seo, include_in_sitemap: !seo.include_in_sitemap })}
                                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${seo.include_in_sitemap
                                    ? 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20'
                                    : 'bg-slate-50 border-slate-100 text-slate-400 dark:bg-slate-800/50'
                                    }`}
                            >
                                {seo.include_in_sitemap ? <ToggleRight /> : <ToggleLeft />}
                                <span className="text-[10px] font-black uppercase tracking-widest">{seo.include_in_sitemap ? 'Shown' : 'Hidden'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                            <ImageIcon size={14} /> OG Image URL
                        </label>
                        <input
                            type="text"
                            value={seo.og_image}
                            onChange={(e) => setSeo({ ...seo, og_image: e.target.value })}
                            placeholder="https://example.com/social-preview.jpg"
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-white text-xs"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2"
                        >
                            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save SEO Metadata'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all font-bold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Preview Column */}
                <div className="space-y-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] flex items-center gap-2">
                            <Eye size={14} /> SEO Previewer
                        </h4>
                        <div className="flex bg-white dark:bg-slate-800 border dark:border-slate-700 p-1 rounded-xl">
                            <button
                                onClick={() => setPreviewMode('google')}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${previewMode === 'google' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                            >
                                Google
                            </button>
                            <button
                                onClick={() => setPreviewMode('social')}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${previewMode === 'social' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                            >
                                Social
                            </button>
                        </div>
                    </div>

                    {previewMode === 'google' ? (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm space-y-2 border border-slate-100 dark:border-slate-800 max-w-md mx-auto">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800" />
                                <span className="text-[10px] text-slate-400 font-medium">https://social2tree.com › {slug}</span>
                            </div>
                            <h3 className="text-[#1a0dab] dark:text-[#8ab4f8] text-xl font-medium hover:underline cursor-pointer">
                                {seo.title_tag || `${displayName} | Social2Tree`}
                            </h3>
                            <p className="text-[#4d5156] dark:text-[#bdc1c6] text-sm leading-relaxed line-clamp-2">
                                {seo.meta_description || "Check out my BioTree for all my latest links, social profiles, and exclusive content. One link for everything."}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 max-w-sm mx-auto">
                            <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                {seo.og_image ? (
                                    <img src={seo.og_image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={48} className="text-slate-200 dark:text-slate-700" />
                                )}
                            </div>
                            <div className="p-6 bg-[#f0f2f5] dark:bg-[#1c1e21] border-t border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">social2tree.com</span>
                                <h3 className="text-slate-900 dark:text-white font-bold text-base mt-0.5 line-clamp-1">
                                    {seo.title_tag || `${displayName} - Social2Tree`}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-1">
                                    {seo.meta_description || "Check out my BioTree for all my latest links..."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-indigo-50/50 dark:bg-indigo-500/5 p-6 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mt-0.5"><Zap size={16} /></div>
                            <div>
                                <h5 className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">SEO Health Check</h5>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-bold leading-relaxed">
                                    {seo.title_tag.length > 60 ? "⚠️ Title tag is a bit long. Keep it under 60 chars." : seo.title_tag.length < 10 ? "ℹ️ Add a title tag for better ranking." : "✅ Title tag length is looking good!"}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-bold leading-relaxed">
                                    {!seo.is_indexed && "🚫 Note: Indexing is disabled. This page won't show on Google."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeoManager;
