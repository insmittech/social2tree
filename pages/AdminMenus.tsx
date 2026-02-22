
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
    ChevronDown,
    Search, ShieldCheck,
    FolderOpen,
    HelpCircle
} from 'lucide-react';
import IconRenderer, { availableIcons } from '../components/IconRenderer';
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

interface SubMenuItem {
    id: string;
    label: string;
    to: string;
    type: 'custom' | 'page' | 'dynamic';
}

interface MenuItem {
    id: string;
    label: string;
    to: string;
    type: 'custom' | 'page' | 'dynamic';
    icon?: string;
    children?: SubMenuItem[];
}

interface SortableItemProps {
    item: MenuItem;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<MenuItem>) => void;
    allPages: any[];
    isDashboardTab: boolean;
}

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

const UrlInput: React.FC<{
    item: SubMenuItem | MenuItem;
    onChange: (updates: Partial<SubMenuItem | MenuItem>) => void;
    allPages: any[];
    compact?: boolean;
}> = ({ item, onChange, allPages, compact }) => {
    const cls = `w-full bg-slate-50 dark:bg-[#0b0f19] border-none rounded-xl px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-100 outline-none ${compact ? 'text-xs' : ''}`;
    return (
        <>
            <select
                value={item.type || 'custom'}
                onChange={(e) => onChange({ type: e.target.value as any, to: '' })}
                className="bg-slate-50 dark:bg-[#0b0f19] border-none rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            >
                <option value="custom">Custom URL</option>
                <option value="page">Bio-Tree Page</option>
                <option value="dynamic">System Link</option>
            </select>
            {item.type === 'page' ? (
                <select value={item.to} onChange={(e) => onChange({ to: e.target.value })} className={cls}>
                    <option value="">Select a Page...</option>
                    {allPages.map((p: any) => (
                        <option key={p.slug} value={`/${p.slug}`}>{p.displayName} (/{p.slug})</option>
                    ))}
                </select>
            ) : item.type === 'dynamic' ? (
                <select value={item.to} onChange={(e) => onChange({ to: e.target.value })} className={cls}>
                    <option value="">Select a Link...</option>
                    {dynamicLinks.map(l => (
                        <option key={l.to} value={l.to}>{l.label}</option>
                    ))}
                </select>
            ) : (
                <input
                    type="text"
                    value={item.to}
                    onChange={(e) => onChange({ to: e.target.value })}
                    placeholder="/path or https://"
                    className={cls}
                />
            )}

            {/* Icon Picker (only for parent items) */}
            {!("children" in item) === false && (
                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-slate-50 dark:bg-[#0b0f19] rounded-xl border-2 border-slate-100 dark:border-slate-800/50">
                    <div className="w-full mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Icon</span>
                        <IconRenderer iconName={(item as MenuItem).icon || 'HelpCircle'} size={16} className="text-indigo-600" />
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto no-scrollbar">
                        {availableIcons.map(icon => (
                            <button
                                key={icon}
                                onClick={() => onChange({ icon })}
                                className={`p-2 rounded-lg transition-all ${(item as MenuItem).icon === icon ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                title={icon}
                            >
                                <IconRenderer iconName={icon} size={14} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};


const SortableMenuItem: React.FC<SortableItemProps> = ({ item, onRemove, onUpdate, allPages, isDashboardTab }) => {
    const [showChildren, setShowChildren] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
    };

    const addChild = () => {
        const child: SubMenuItem = {
            id: `child-${Date.now()}`,
            label: 'Sub Item',
            to: '/',
            type: 'custom'
        };
        onUpdate(item.id, { children: [...(item.children || []), child] });
    };

    const removeChild = (childId: string) => {
        onUpdate(item.id, { children: (item.children || []).filter(c => c.id !== childId) });
    };

    const updateChild = (childId: string, updates: Partial<SubMenuItem>) => {
        onUpdate(item.id, {
            children: (item.children || []).map(c => c.id === childId ? { ...c, ...updates } : c)
        });
    };

    const hasChildren = (item.children || []).length > 0;

    return (
        <div ref={setNodeRef} style={style} className={`mb-3 ${isDragging ? 'opacity-90' : ''}`}>
            {/* Parent row */}
            <div className={`flex items-start gap-3 p-4 bg-white dark:bg-slate-900/40 border-2 rounded-2xl transition-all ${isDragging ? 'border-indigo-600 shadow-2xl dark:shadow-none scale-[1.02]' : 'border-slate-100 dark:border-slate-800/50'}`}>
                <button {...attributes} {...listeners} className="mt-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing flex-shrink-0">
                    <GripVertical size={20} />
                </button>

                <div className="flex-1 flex flex-col gap-3">
                    {/* Label */}
                    <input
                        type="text"
                        value={item.label}
                        onChange={(e) => onUpdate(item.id, { label: e.target.value })}
                        placeholder="Link Label"
                        className="bg-slate-50 dark:bg-[#0b0f19] border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                    />
                    {/* URL fields */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <UrlInput item={item} onChange={(u) => onUpdate(item.id, u as any)} allPages={allPages} />
                    </div>

                    {/* Sub-items panel — only for dashboard tab */}
                    {isDashboardTab && (
                        <div className="mt-1">
                            <button
                                onClick={() => setShowChildren(!showChildren)}
                                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${hasChildren ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
                            >
                                {showChildren ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                <FolderOpen size={12} />
                                Sub-items {hasChildren ? `(${item.children!.length})` : ''}
                            </button>

                            {showChildren && (
                                <div className="mt-3 ml-4 border-l-2 border-indigo-100 pl-4 space-y-2">
                                    {(item.children || []).map(child => (
                                        <div key={child.id} className="flex items-start gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                            <div className="flex-1 flex flex-col gap-1.5">
                                                <input
                                                    type="text"
                                                    value={child.label}
                                                    onChange={(e) => updateChild(child.id, { label: e.target.value })}
                                                    placeholder="Sub-item label"
                                                    className="bg-white dark:bg-slate-900/40 border-none rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-100 outline-none w-full"
                                                />
                                                <UrlInput item={child} onChange={(u) => updateChild(child.id, u as any)} allPages={allPages} compact />
                                            </div>
                                            <button
                                                onClick={() => removeChild(child.id)}
                                                className="mt-1 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addChild}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 py-1"
                                    >
                                        <Plus size={12} /> Add Sub-item
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button onClick={() => onRemove(item.id)} className="mt-1 p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex-shrink-0">
                    <Trash2 size={18} />
                </button>
            </div>
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
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch settings (critical)
                const settingsRes = await client.get('/admin/settings/get.php');
                const s = settingsRes.data.settings || {};

                // Fetch pages list (optional — don't let it break menu loading)
                try {
                    const pagesRes = await client.get('/admin/settings/get_all_pages.php');
                    setAllPages(pagesRes.data.pages || []);
                } catch {
                    setAllPages([]);
                }

                setMenus({
                    navbar: JSON.parse(s.navbar_links || '[]').map((m: any, i: number) => ({ ...m, type: m.type || 'custom', id: m.id || `nav-${i}` })),
                    footer_explore: JSON.parse(s.footer_explore_links || '[]').map((m: any, i: number) => ({ ...m, type: m.type || 'custom', id: m.id || `exp-${i}` })),
                    footer_legal: JSON.parse(s.footer_legal_links || '[]').map((m: any, i: number) => ({ ...m, type: m.type || 'custom', id: m.id || `leg-${i}` })),
                    dashboard: JSON.parse(s.dashboard_menu_links || '[]').map((m: any, i: number) => ({ ...m, type: m.type || 'custom', id: m.id || `dash-${i}`, children: m.children || [] }))
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
                return { ...prev, [activeTab]: arrayMove(currentList, oldIndex, newIndex) };
            });
        }
    };

    const addItem = () => {
        const newItem: MenuItem = {
            id: `${activeTab}-${Date.now()}`,
            label: 'New Link',
            to: '/',
            type: 'custom',
            children: []
        };
        setMenus(prev => ({ ...prev, [activeTab]: [...prev[activeTab], newItem] }));
    };

    const removeItem = (id: string) => {
        setMenus(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(i => i.id !== id) }));
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
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Menu Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Draggable Reordering & Nested Sub-Menus</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={addItem}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-slate-200"
                    >
                        <Plus size={18} /> Add Item
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-200 disabled:opacity-50"
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
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-100'
                                : 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50 text-slate-400 dark:text-slate-500 hover:border-slate-200 hover:text-slate-600'
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
                            <FolderOpen size={24} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-2">Sub-items</h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                            On the <span className="text-white font-bold">User Dashboard</span> tab, each menu item can have nested sub-items that expand inline or appear as a flyout popup.
                        </p>
                    </div>
                </div>

                {/* Draggable List */}
                <div className="bg-white dark:bg-slate-900/40 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800/50 p-8 shadow-2xl dark:shadow-none shadow-slate-100/50">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <Menu size={20} className="text-indigo-600" />
                            {tabs.find(t => t.id === activeTab)?.label} Links
                        </h2>
                        <div className="flex items-center gap-2">
                            {activeTab === 'dashboard' && (
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                    Sub-items enabled
                                </span>
                            )}
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-[#0b0f19] px-3 py-1 rounded-full">
                                {menus[activeTab].length} Items
                            </span>
                        </div>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={menus[activeTab].map(m => m.id)} strategy={verticalListSortingStrategy}>
                            <div className="min-h-[400px]">
                                {menus[activeTab].length > 0 ? (
                                    menus[activeTab].map((item) => (
                                        <SortableMenuItem
                                            key={item.id}
                                            item={item}
                                            onRemove={removeItem}
                                            onUpdate={updateItem}
                                            allPages={allPages}
                                            isDashboardTab={activeTab === 'dashboard'}
                                        />
                                    ))
                                ) : (
                                    <div className="h-[400px] flex flex-col items-center justify-center text-center">
                                        <div className="bg-slate-50 dark:bg-[#0b0f19] p-6 rounded-full mb-4 text-slate-300">
                                            <LinkIcon size={40} />
                                        </div>
                                        <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs">No links added yet</p>
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
