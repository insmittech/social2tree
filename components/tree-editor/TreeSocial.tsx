
import React, { useState } from 'react';
import { Plus, Trash2, X, Share2, Instagram, Twitter, Github, Youtube, Linkedin, Facebook, Mail, Phone, Globe } from 'lucide-react';
import client from '../../src/api/client';
import { useToast } from '../../src/context/ToastContext';
import { getSocialIcon } from '../../src/utils/socialIcons';

interface TreeSocialProps {
    page: any;
    onUpdate: (updatedPage: any) => void;
}

const SOCIAL_PLATFORMS = [
    { id: 'instagram', icon: <Instagram size={18} />, label: 'Instagram', placeholder: 'https://instagram.com/username' },
    { id: 'twitter', icon: <Twitter size={18} />, label: 'X (Twitter)', placeholder: 'https://twitter.com/username' },
    { id: 'github', icon: <Github size={18} />, label: 'GitHub', placeholder: 'https://github.com/username' },
    { id: 'youtube', icon: <Youtube size={18} />, label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
    { id: 'linkedin', icon: <Linkedin size={18} />, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { id: 'facebook', icon: <Facebook size={18} />, label: 'Facebook', placeholder: 'https://facebook.com/username' },
    { id: 'mail', icon: <Mail size={18} />, label: 'Email', placeholder: 'mailto:name@example.com' },
    { id: 'phone', icon: <Phone size={18} />, label: 'Phone', placeholder: 'tel:+1234567890' },
    { id: 'website', icon: <Globe size={18} />, label: 'Website', placeholder: 'https://yourwebsite.com' },
];

const TreeSocial: React.FC<TreeSocialProps> = ({ page, onUpdate }) => {
    const { showToast } = useToast();
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [socialUrl, setSocialUrl] = useState('');

    const socialIcons = page.links.filter((l: any) => l.type === 'social_icon');

    const handleAddSocial = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlatform || !socialUrl) return;

        try {
            const platform = SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform);
            const res = await client.post('/links/create.php', {
                title: platform?.label || selectedPlatform,
                url: socialUrl,
                type: 'social_icon',
                pageId: page.id
            });

            onUpdate({ links: [...page.links, res.data.link] });
            setSelectedPlatform('');
            setSocialUrl('');
            setShowAddForm(false);
            showToast('Social icon added!', 'success');
        } catch (err) {
            console.error("Failed to add social icon", err);
            showToast('Failed to add social icon', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await client.post('/links/delete.php', { id });
            onUpdate({ links: page.links.filter((l: any) => l.id !== id) });
            showToast('Social icon removed', 'info');
        } catch (err) {
            console.error("Failed to delete social icon", err);
            showToast('Failed to remove icon', 'error');
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Share2 size={20} className="text-indigo-600" /> Social Icons
                </h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                    <Plus size={18} /> Add Social Icon
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between mb-6">
                        <h3 className="font-black text-lg">Add Connection</h3>
                        <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleAddSocial} className="space-y-6">
                        <div>
                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3 block">Choose Platform</label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {SOCIAL_PLATFORMS.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSelectedPlatform(p.id)}
                                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${selectedPlatform === p.id
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                                : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                                            }`}
                                    >
                                        {p.icon}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{p.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedPlatform && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2 block">
                                    {SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform)?.label} URL
                                </label>
                                <input
                                    placeholder={SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform)?.placeholder}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                                    value={socialUrl}
                                    onChange={(e) => setSocialUrl(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-6 py-4 rounded-2xl text-slate-500 font-black hover:bg-slate-50 transition-all font-mono"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedPlatform || !socialUrl}
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                            >
                                Add Icon
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
                {socialIcons.length === 0 ? (
                    <div className="sm:col-span-2 bg-white p-16 rounded-[2.5rem] border-4 border-dashed border-slate-50 text-center space-y-4">
                        <Share2 size={32} className="mx-auto text-slate-200" />
                        <p className="text-slate-400 font-black uppercase tracking-[0.15em] text-xs">No social icons added</p>
                    </div>
                ) : (
                    socialIcons.map((icon: any) => (
                        <div key={icon.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:border-indigo-100 transition-all">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                {getSocialIcon(icon.title)}
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="font-black text-slate-900 text-sm truncate">{icon.title}</h4>
                                <p className="text-slate-400 text-xs font-mono truncate">{icon.url}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(icon.id)}
                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default TreeSocial;
