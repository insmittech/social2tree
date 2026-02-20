
import React, { useState, useEffect } from 'react';
import {
    Menu,
    Plus,
    Save,
    GripVertical,
    Trash2,
    ExternalLink,
    Home,
    LayoutDashboard,
    Globe,
    Link as LinkIcon,
    ChevronRight,
    Search, ShieldCheck
} from 'lucide-react';
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
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

interface MenuItem {
    id: string;
    label: string;
    to: string;
    type: 'custom' | 'page' | 'dynamic';
    icon?: string;
}

interface SortableItemProps {
    item: MenuItem;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<MenuItem>) => void;
    allPages: any[];
}

const SortableMenuItem: React.FC<SortableItemProps> = ({ item, onRemove, onUpdate, allPages }) => {
    const dynamicLinks = [
        { label: 'Login', to: '/login' },
        { label: 'Register', to: '/register' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Bio-Trees', to: '/dashboard/trees' },
        { label: 'Pricing', to: '/pricing' },
        { label: 'Features', to: '/features' },
        { label: 'Contact', to: '/contact' },
        { label: 'Admin Dashboard', to: '/admin' },
        { label: 'Manage Users', to: '/admin/users' },
        { label: 'Subscription Plans', to: '/admin/settings/plans' },
        { label: 'Platform Themes', to: '/admin/settings/themes' },
        { label: 'Platform Analytics', to: '/admin/analytics' },
        { label: 'RBAC (Roles)', to: '/admin/rbac' },
    ];

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-4 p-4 bg-white border-2 rounded-2xl mb-3 transition-all ${isDragging ? 'border-indigo-600 shadow-2xl scale-[1.02] opacity-90' : 'border-slate-100'
                }`}
        >
            <button {...attributes} {...listeners} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                <GripVertical size={20} />
            </button>

            <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="flex-[2] flex flex-col gap-2">
                    <input
                        type="text"
                        value={item.label}
                        onChange={(e) => onUpdate(item.id, { label: e.target.value })}
                        placeholder="Link Label"
                        className="bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                    />
                    <select
                        value={item.type || 'custom'}
                        onChange={(e) => onUpdate(item.id, { type: e.target.value as any, to: '' })}
                        className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                    >
                        <option value="custom">Custom URL</option>
                        <option value="page">Bio-Tree Page</option>
                        <option value="dynamic">System Link</option>
                    </select>
                </div>

                <div className="flex-[3]">
                    {item.type === 'page' ? (
                        <select
                            value={item.to}
                            onChange={(e) => onUpdate(item.id, { to: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none h-full min-h-[50px]"
                        >
                            <option value="">Select a Page...</option>
                            {allPages.map(p => (
                                <option key={p.slug} value={`/${p.slug}`}>{p.displayName} (/{p.slug})</option>
                            ))}
                        </select>
                    ) : item.type === 'dynamic' ? (
                        <select
                            value={item.to}
                            onChange={(e) => onUpdate(item.id, { to: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none h-full min-h-[50px]"
                        >
                            <option value="">Select a Link...</option>
                            {dynamicLinks.map(l => (
                                <option key={l.to} value={l.to}>{l.label}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={item.to}
                            onChange={(e) => onUpdate(item.id, { to: e.target.value })}
                            placeholder="/path or https://"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none h-full min-h-[50px]"
                        />
                    )}
                </div>
            </div>

            <button
                onClick={() => onRemove(item.id)}
                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};

const AdminMenus: React.FC = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'navbar' | 'footer_explore' | 'footer_legal' | 'dashboard'>('navbar');
    const [allPages, setAllPages] = useState<any[]>([]);

    const [menus, setMenus] = useState<{
        navbar: MenuItem[];
        footer_explore: MenuItem[];
        footer_legal: MenuItem[];
        dashboard: MenuItem[];
    }>({
        navbar: [],
        footer_explore: [],
        footer_legal: [],
        dashboard: []
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, pagesRes] = await Promise.all([
                    client.get('/admin/settings/get.php'),
                    client.get('/admin/settings/get_all_pages.php')
                ]);

                const s = settingsRes.data.settings || {};
                const p = pagesRes.data.pages || [];

                setAllPages(p);
                setMenus({
                    navbar: JSON.parse(s.navbar_links || '[]').map((m: any, i: number) => ({ ...m, type: m.type || 'custom', id: m.id || `nav-${i}` })),
                    footer_explore: JSON.parse(s.footer_explore_links || '[]').map((m: any, i: number) => ({ ...m, type: m.type || 'custom', id: m.id || `exp-${i}` })),
                    footer_legal: JSON.parse(s.footer_legal_links || '[]').map((m: any, i: number) => ({ ...m, type: m.type || 'custom', id: m.id || `leg-${i}` })),
                    dashboard: JSON.parse(s.dashboard_menu_links || '[]').map((m: any, i: number) => ({ ...m, type: m.type || 'custom', id: m.id || `dash-${i}` }))
                });
            } catch (err) {
                showToast('Failed to load menu data', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showToast]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setMenus((prev) => {
                const currentList = prev[activeTab];
                const oldIndex = currentList.findIndex(i => i.id === active.id);
                const newIndex = currentList.findIndex(i => i.id === over.id);
                return {
                    ...prev,
                    [activeTab]: arrayMove(currentList, oldIndex, newIndex)
                };
            });
        }
    };

    const addItem = () => {
        const newItem: MenuItem = {
            id: `${activeTab}-${Date.now()}`,
            label: 'New Link',
            to: '/',
            type: 'custom'
        };
        setMenus(prev => ({
            ...prev,
            [activeTab]: [...prev[activeTab], newItem]
        }));
    };

    const removeItem = (id: string) => {
        setMenus(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(i => i.id !== id)
        }));
    };

    const updateItem = (id: string, updates: Partial<MenuItem>) => {
        setMenus(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(i => i.id === id ? { ...i, ...updates } : i)
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await client.post('/admin/settings/update.php', {
                navbar_links: JSON.stringify(menus.navbar),
                footer_explore_links: JSON.stringify(menus.footer_explore),
                footer_legal_links: JSON.stringify(menus.footer_legal),
                dashboard_menu_links: JSON.stringify(menus.dashboard)
            });
            showToast('Navigation menus updated', 'success');
        } catch (err) {
            showToast('Failed to save menus', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'navbar', label: 'Navbar', icon: <Globe size={16} /> },
        { id: 'footer_explore', label: 'Footer Explore', icon: <LinkIcon size={16} /> },
        { id: 'footer_legal', label: 'Footer Legal', icon: <ShieldCheck size={16} /> },
        { id: 'dashboard', label: 'User Dashboard', icon: <LayoutDashboard size={16} /> },
    ];

    return (
        <div className="p-4 sm:p-8 lg:px-12 py-8 overflow-hidden pb-32 lg:pb-12">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Menu Management</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Draggable Reordering & Navigation Links</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={addItem}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        <Plus size={18} /> Add Item
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : <><Save size={18} /> Save Menus</>}
                    </button>
                </div>
            </header>

            <div className="grid lg:grid-cols-[280px,1fr] gap-8">
                {/* Tab List */}
                <div className="space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all font-black text-xs uppercase tracking-widest ${activeTab === tab.id
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100'
                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {tab.icon}
                                {tab.label}
                            </div>
                            <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-slate-900 rounded-[2.5rem] text-white">
                        <div className="bg-indigo-500/20 p-3 rounded-2xl w-fit mb-4 text-indigo-400">
                            <Plus size={24} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-2">Editor Tip</h3>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            Drag the handle on the left to reorder items. Changes will be reflected globally across the site after saving.
                        </p>
                    </div>
                </div>

                {/* Draggable List */}
                <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-8 shadow-2xl shadow-slate-100/50">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <Menu size={20} className="text-indigo-600" />
                            {tabs.find(t => t.id === activeTab)?.label} Links
                        </h2>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                            {menus[activeTab].length} Items
                        </span>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={menus[activeTab].map(m => m.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="min-h-[400px]">
                                {menus[activeTab].length > 0 ? (
                                    menus[activeTab].map((item) => (
                                        <SortableMenuItem
                                            key={item.id}
                                            item={item}
                                            onRemove={removeItem}
                                            onUpdate={updateItem}
                                            allPages={allPages}
                                        />
                                    ))
                                ) : (
                                    <div className="h-[400px] flex flex-col items-center justify-center text-center">
                                        <div className="bg-slate-50 p-6 rounded-full mb-4 text-slate-300">
                                            <LinkIcon size={40} />
                                        </div>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No links added yet</p>
                                        <button onClick={addItem} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Click to add your first link</button>
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </div>
    );
};

export default AdminMenus;
