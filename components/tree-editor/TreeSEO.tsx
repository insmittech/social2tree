import React, { useState, useEffect } from 'react';
import { Search, Globe, Eye, EyeOff, Save, ShieldCheck } from 'lucide-react';
import client from '../../src/api/client';
import { useToast } from '../../src/context/ToastContext';

interface TreeSEOProps {
    page: any;
    onUpdate: (page: any) => void;
}

const TreeSEO: React.FC<TreeSEOProps> = ({ page, onUpdate }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [seo, setSeo] = useState<any>({
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
        const fetchSEO = async () => {
            try {
                const res = await client.get(`/admin/seo/get.php?page_id=${page.id}`);
                if (res.data) {
                    setSeo(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch SEO metadata:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSEO();
    }, [page.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await client.post('/admin/seo/save.php', {
                page_id: page.id,
                ...seo
            });
            showToast('SEO settings updated successfully', 'success');
        } catch (err) {
            showToast('Failed to save SEO settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Search size={20} className="text-indigo-600" /> SEO & Visibility
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Optimize how your bio-tree appears on Google & Social Media</p>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="bg-slate-50 dark:bg-[#0b0f19] p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe size={16} className="text-slate-400" />
                        <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Search Result Preview</h4>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <p className="text-[#1a0dab] dark:text-[#8ab4f8] text-xl font-medium mb-1 truncate">
                            {seo.title_tag || `${page.displayName} | Social2Tree`}
                        </p>
                        <p className="text-[#006621] dark:text-[#34a853] text-sm mb-1 truncate">
                            social2tree.com/{page.slug}
                        </p>
                        <p className="text-[#4d5156] dark:text-[#bdc1c6] text-sm line-clamp-2">
                            {seo.meta_description || page.bio || 'Check out my Social2Tree page with all my latest links and social media accounts!'}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Meta Title Tag</label>
                        <input
                            type="text"
                            value={seo.title_tag}
                            onChange={(e) => setSeo({ ...seo, title_tag: e.target.value })}
                            placeholder={`${page.displayName} | Social2Tree`}
                            className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/50 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Meta Description</label>
                        <textarea
                            rows={3}
                            value={seo.meta_description}
                            onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })}
                            placeholder={page.bio || "Tell visitors what your page is about..."}
                            className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800/50 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-sm resize-none"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => setSeo({ ...seo, is_indexed: !seo.is_indexed })}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${seo.is_indexed ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20' : 'bg-slate-50 dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/50'}`}
                        >
                            <div className="flex items-center gap-3">
                                {seo.is_indexed ? <Eye size={18} className="text-indigo-600" /> : <EyeOff size={18} className="text-slate-400" />}
                                <span className={`text-[11px] font-black uppercase tracking-widest ${seo.is_indexed ? 'text-indigo-600' : 'text-slate-500'}`}>
                                    {seo.is_indexed ? 'Indexed' : 'Hidden'}
                                </span>
                            </div>
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${seo.is_indexed ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${seo.is_indexed ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </button>

                        <button
                            onClick={() => setSeo({ ...seo, include_in_sitemap: !seo.include_in_sitemap })}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${seo.include_in_sitemap ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20' : 'bg-slate-50 dark:bg-[#0b0f19] border-slate-200 dark:border-slate-800/50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className={seo.include_in_sitemap ? 'text-indigo-600' : 'text-slate-400'} />
                                <span className={`text-[11px] font-black uppercase tracking-widest ${seo.include_in_sitemap ? 'text-indigo-600' : 'text-slate-500'}`}>
                                    Sitemap
                                </span>
                            </div>
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${seo.include_in_sitemap ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${seo.include_in_sitemap ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-teal-400 transition-all shadow-lg dark:shadow-teal-500/20 shadow-indigo-100 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                </button>
            </div>
        </div>
    );
};

export default TreeSEO;
