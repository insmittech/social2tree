
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

    const socialIcons = (page.links || []).filter((l: any) => l.type === 'social_icon');

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

            const newIcon = res?.data?.link;
            if (newIcon) {
                onUpdate({ links: [...(page.links || []), newIcon] });
            }
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
            onUpdate({ links: (page.links || []).filter((l: any) => l.id !== id) });
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
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-between mb-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-900">Add Connection</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Connect your digital presence</p>
                        </div>
                        <button onClick={() => setShowAddForm(false)} className="text-slate-300 hover:text-slate-900 p-2 bg-slate-50 rounded-full transition-all hover:rotate-90"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleAddSocial} className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 mb-4 block">1. Choose Platform</label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                                {SOCIAL_PLATFORMS.map(p => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSelectedPlatform(p.id)}
                                        className={`p-6 rounded-2xl flex flex-col items-center gap-3 border-2 transition-all group active:scale-95 ${selectedPlatform === p.id
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100/50'
                                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white'
                                            }`}
                                    >
                                        <span className={`${selectedPlatform === p.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                            {p.icon}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{p.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedPlatform && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                                    2. Enter {SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform)?.label} URL
                                </label>
                                <input
                                    placeholder={SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform)?.placeholder}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300"
                                    value={socialUrl}
                                    onChange={(e) => setSocialUrl(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-8 py-4 rounded-2xl text-slate-500 font-black hover:bg-slate-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedPlatform || !socialUrl}
                                className="bg-slate-950 text-white px-12 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
                            >
                                Add Icon
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
                {socialIcons.length === 0 ? (
                    <div className="sm:col-span-2 bg-white p-20 rounded-[3rem] border-2 border-slate-100 text-center space-y-6 shadow-sm">
                        <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto text-indigo-400">
                            <Share2 size={40} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-3xl tracking-tight">Connect Socials</h3>
                            <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto leading-relaxed">Add icons for Instagram, Twitter, GitHub and more to your footer.</p>
                        </div>
                        {!showAddForm && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                Add Your First Social Icon
                            </button>
                        )}
                    </div>
                ) : (
                    socialIcons.map((icon: any) => (
                        <div key={icon.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 group hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-inner">
                                {getSocialIcon(icon.title)}
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="font-black text-slate-900 text-base tracking-tight">{icon.title}</h4>
                                <p className="text-slate-400 text-xs font-mono truncate opacity-60 group-hover:opacity-100 transition-opacity">{icon.url}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(icon.id)}
                                className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default TreeSocial;
