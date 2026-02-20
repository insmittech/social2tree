
import React, { useState } from 'react';
import { Plus, Trash2, X, ShieldAlert, Link as LinkIcon, Lock } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import client from '../../src/api/client';
import { useToast } from '../../src/context/ToastContext';
import SortableLink from '../SortableLink';
import { getSocialIcon } from '../../src/utils/socialIcons';

interface TreeLinksProps {
    page: any;
    onUpdate: (updatedPage: any) => void;
    plan: string;
}

const TreeLinks: React.FC<TreeLinksProps> = ({ page, onUpdate, plan }) => {
    const { showToast } = useToast();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newScheduledStart, setNewScheduledStart] = useState('');
    const [newScheduledEnd, setNewScheduledEnd] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const isFreePlan = plan === 'free';
    const linkLimit = isFreePlan ? 3 : Infinity;
    const mainLinks = page.links.filter((l: any) => l.type !== 'social_icon');
    const hasReachedLimit = mainLinks.length >= linkLimit;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUrl || !newTitle) return;
        if (hasReachedLimit) {
            showToast("You've reached your free link limit!", "warning");
            return;
        }

        try {
            const payload = {
                title: newTitle,
                url: newUrl,
                type: 'social',
                pageId: page.id,
                scheduledStart: newScheduledStart || null,
                scheduledEnd: newScheduledEnd || null,
                password: newPassword || null
            };

            const res = await client.post('/links/create.php', payload);
            onUpdate({ links: [...page.links, res.data.link] });

            setNewTitle('');
            setNewUrl('');
            setNewScheduledStart('');
            setNewScheduledEnd('');
            setNewPassword('');
            setShowAddForm(false);
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
            onUpdate({ links: page.links.filter((l: any) => l.id !== id) });
            showToast('Link deleted', 'info');
        } catch (err) {
            console.error("Failed to delete link", err);
            showToast('Failed to delete link', 'error');
        }
    };

    const handleToggleActive = async (id: string, active: boolean) => {
        const updatedLinks = page.links.map((l: any) => l.id === id ? { ...l, active } : l);
        onUpdate({ links: updatedLinks });

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
            const oldIndex = page.links.findIndex((l: any) => l.id === active.id);
            const newIndex = page.links.findIndex((l: any) => l.id === over.id);
            const newLinks = arrayMove(page.links, oldIndex, newIndex);

            onUpdate({ links: newLinks });

            try {
                await client.post('/links/reorder.php', { ids: newLinks.map((l: any) => l.id) });
                showToast('Order updated', 'success');
            } catch (err) {
                console.error("Failed to reorder links", err);
                showToast('Failed to save link order', 'error');
            }
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <LinkIcon size={20} className="text-indigo-600" /> My Links
                    </h2>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${hasReachedLimit ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                        {mainLinks.length} / {isFreePlan ? '3' : '∞'}
                    </span>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    disabled={hasReachedLimit}
                    className={`px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 text-sm ${hasReachedLimit ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                    <Plus size={18} /> Add New Link
                </button>
            </div>

            {hasReachedLimit && (
                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center gap-3 text-red-700 animate-pulse">
                    <ShieldAlert size={20} />
                    <p className="text-sm font-bold">Link limit reached. Upgrade to add more.</p>
                </div>
            )}

            {showAddForm && (
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-between mb-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-900">Add New Link</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Fill in the details below</p>
                        </div>
                        <button onClick={() => setShowAddForm(false)} className="text-slate-300 hover:text-slate-900 p-2 bg-slate-50 rounded-full transition-all hover:rotate-90"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleAddLink} className="space-y-8">
                        <div className="grid gap-8 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Display Title</label>
                                <input
                                    placeholder="e.g. Visit My Portfolio"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Destination URL</label>
                                <input
                                    placeholder="https://yourwebsite.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-mono text-sm placeholder:text-slate-300 shadow-sm"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Schedule Start</label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold shadow-sm"
                                    value={newScheduledStart}
                                    onChange={(e) => setNewScheduledStart(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Schedule End</label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold shadow-sm"
                                    value={newScheduledEnd}
                                    onChange={(e) => setNewScheduledEnd(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Access Control</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="Set a password to lock this link (Wait list access etc.)"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-14 py-4 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white outline-none transition-all text-sm font-bold placeholder:text-slate-300 shadow-sm"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>
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
                                className="bg-slate-950 text-white px-12 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                            >
                                Create Link
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={mainLinks.map((l: any) => l.id)} strategy={verticalListSortingStrategy}>
                        {mainLinks.length === 0 ? (
                            <div className="bg-white p-20 rounded-[3rem] border-2 border-slate-100 text-center space-y-6 shadow-sm">
                                <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto text-indigo-400 group hover:scale-110 transition-transform duration-500">
                                    <Plus size={40} className="group-hover:rotate-180 transition-transform duration-1000" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-3xl tracking-tight">Your tree is empty</h3>
                                    <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto leading-relaxed">Add social proof, websites, and more to start connecting with your audience.</p>
                                </div>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                >
                                    Add Your First Link
                                </button>
                            </div>
                        ) : (
                            mainLinks.map((link: any) => (
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
    );
};

export default TreeLinks;
