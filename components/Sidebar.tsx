import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import client from '../src/api/client';
import {
    TreePine,
    Layout,
    BarChart2,
    LayoutDashboard,
    Users,
    Settings,
    Shield,
    ShieldCheck,
    Key,
    CreditCard,
    Bookmark,
    User,
    LogOut,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Search,
    Activity,
    HelpCircle,
    Menu,
    Palette,
    X,
} from 'lucide-react';

interface SubMenuItem {
    id: string;
    label: string;
    to: string;
    type: string;
}

interface NavLinkItem {
    to: string;
    icon: React.ReactNode;
    label: string;
    children?: SubMenuItem[];
}

interface SidebarProps {
    isAdmin?: boolean;
    userProfile?: any;
    onLogout?: () => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin, userProfile, onLogout, isCollapsed, setIsCollapsed }) => {
    const [dynamicUserLinks, setDynamicUserLinks] = React.useState<NavLinkItem[]>([]);
    const [tooltip, setTooltip] = useState<{ label: string; y: number } | null>(null);
    const [flyout, setFlyout] = useState<{ label: string; y: number; children: SubMenuItem[] } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const navigate = useNavigate();
    const isUserAdmin = userProfile?.roles?.includes('admin') || userProfile?.role === 'admin';

    const toggleGroup = (label: string) => {
        setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const handleMouseEnter = (label: string, e: React.MouseEvent, children?: SubMenuItem[]) => {
        if (isCollapsed) {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const y = rect.top + rect.height / 2;
            if (children && children.length > 0) {
                setFlyout({ label, y, children });
                setTooltip(null);
            } else {
                setTooltip({ label, y });
                setFlyout(null);
            }
        }
    };
    const handleMouseLeave = () => {
        setTooltip(null);
    };
    const handleFlyoutLeave = () => {
        setFlyout(null);
    };

    React.useEffect(() => {
        if (!isAdmin) {
            const fetchSettings = async () => {
                try {
                    const res = await client.get('/admin/settings/get.php');
                    const s = res.data.settings || {};
                    const links = JSON.parse(s.dashboard_menu_links || '[]');
                    if (links.length > 0) {
                        setDynamicUserLinks(links.map((l: any) => ({
                            ...l,
                            icon: <LayoutDashboard size={18} />,
                            children: l.children || []
                        })));
                    }
                } catch (err) {
                    console.error('Failed to load dynamic sidebar links:', err);
                }
            };
            fetchSettings();
        }
    }, [isAdmin]);

    const userLinks: NavLinkItem[] = [
        { to: '/dashboard/profile', icon: <User size={18} />, label: 'Profile' },
        { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview' },
        { to: '/dashboard/trees', icon: <Layout size={18} />, label: 'Bio Trees' },
        { to: '/dashboard/analytics', icon: <BarChart2 size={18} />, label: 'Analytics' },
        { to: '/dashboard/plan', icon: <CreditCard size={18} />, label: 'Plan' },
        { to: '/dashboard/saved', icon: <Bookmark size={18} />, label: 'Saved Links' },
        { to: '/dashboard/verification', icon: <ShieldCheck size={18} />, label: 'Verification' },
    ];

    const adminLinkGroups = [
        {
            title: 'Core',
            links: [
                { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Overview' },
                { to: '/admin/analytics', icon: <Activity size={18} />, label: 'Data Hub' },
            ]
        },
        {
            title: 'Management',
            links: [
                { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
                { to: '/admin/verification', icon: <CheckCircle size={18} />, label: 'Verify Requests' },
            ]
        },
        {
            title: 'Design',
            links: [
                { to: '/admin/settings/themes', icon: <Palette size={18} />, label: 'Platform Themes' },
                { to: '/admin/settings/menus', icon: <Menu size={18} />, label: 'Navigation Menus' },
                { to: '/admin/settings/plans', icon: <CreditCard size={18} />, label: 'Subscription Plans' },
            ]
        },
        {
            title: 'System',
            links: [
                { to: '/admin/security', icon: <Shield size={18} />, label: 'Security' },
                { to: '/admin/rbac', icon: <Key size={18} />, label: 'Access Control' },
                { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
            ]
        }
    ];

    const links: NavLinkItem[] = isAdmin ? [] : (dynamicUserLinks.length > 0 ? dynamicUserLinks : userLinks);

    // --- Deep search ---
    const q = searchQuery.toLowerCase().trim();

    const flatLinks = links.flatMap(l =>
        [l, ...(l.children || []).map(c => ({ to: c.to, icon: l.icon, label: `${l.label} › ${c.label}`, children: [] }))]
    );
    const filteredUserLinks = q ? flatLinks.filter(l => l.label.toLowerCase().includes(q)) : links;
    const filteredAdminGroups = q
        ? adminLinkGroups.map(g => ({ ...g, links: g.links.filter(l => l.label.toLowerCase().includes(q)) })).filter(g => g.links.length > 0)
        : adminLinkGroups;
    const hasSearchResults = isAdmin ? filteredAdminGroups.length > 0 : filteredUserLinks.length > 0;

    const sidebarWidth = isCollapsed ? 80 : 288;

    // Render a single nav link with optional children
    const renderNavLink = (link: NavLinkItem) => {
        const hasChildren = (link.children || []).length > 0;
        const isOpen = openGroups[link.label];

        return (
            <div key={link.label + link.to}>
                {hasChildren ? (
                    // Parent with children — not navigable itself, just a toggle
                    <button
                        onClick={() => !isCollapsed && toggleGroup(link.label)}
                        onMouseEnter={(e) => handleMouseEnter(link.label, e, link.children)}
                        onMouseLeave={handleMouseLeave}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                            ${isCollapsed ? 'justify-center' : ''}
                            text-slate-500 hover:text-slate-900 hover:bg-slate-50`}
                    >
                        <span className={`${isCollapsed ? 'scale-110' : ''} transition-transform flex-shrink-0`}>{link.icon}</span>
                        {!isCollapsed && (
                            <>
                                <span className="flex-1 text-left">{link.label}</span>
                                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''} text-slate-400`} />
                            </>
                        )}
                    </button>
                ) : (
                    <NavLink
                        to={link.to}
                        end={link.to === '/dashboard'}
                        onMouseEnter={(e) => handleMouseEnter(link.label, e)}
                        onMouseLeave={handleMouseLeave}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                            ${isActive ? 'bg-slate-50 text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
                    >
                        <span className={`${isCollapsed ? 'scale-110' : ''} transition-transform flex-shrink-0`}>{link.icon}</span>
                        {!isCollapsed && <span className="flex-1">{link.label}</span>}
                    </NavLink>
                )}

                {/* Inline children — only in expanded mode */}
                {hasChildren && isOpen && !isCollapsed && (
                    <div className="ml-5 mt-1 mb-1 border-l-2 border-slate-100 pl-3 space-y-0.5">
                        {(link.children || []).map(child => (
                            <NavLink
                                key={child.id}
                                to={child.to}
                                className={({ isActive }) => `
                                    flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all
                                    ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'}
                                `}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0" />
                                {child.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside
            className={`hidden lg:flex flex-col border-r sticky top-0 h-screen transition-all duration-300 ease-in-out relative
                ${isCollapsed ? 'w-20' : 'w-72'}
                ${isAdmin ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xl shadow-slate-200/50'}
            `}
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3.5 top-8 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-50"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className="flex flex-col h-full overflow-hidden">
                {/* Logo */}
                <div className={`p-6 mb-2 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 flex-shrink-0">
                        <TreePine className="text-white w-6 h-6" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-black tracking-tighter uppercase italic truncate">Social2Tree</span>
                    )}
                </div>

                {/* Search */}
                <div className="px-4 mb-4 mt-1">
                    <div className={`relative flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className={`flex items-center rounded-2xl transition-all duration-300
                            ${isCollapsed
                                ? 'w-10 h-10 justify-center bg-slate-50'
                                : `w-full px-4 py-3 border ${q ? 'border-indigo-300 bg-indigo-50' : 'border-slate-100 bg-slate-50'}`
                            }`}
                        >
                            <Search size={16} className={`flex-shrink-0 ${q ? 'text-indigo-500' : 'text-slate-400'}`} />
                            {!isCollapsed && (
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search menus..."
                                    className="bg-transparent border-none outline-none text-sm font-bold ml-2 w-full text-slate-700 placeholder:text-slate-400"
                                />
                            )}
                            {!isCollapsed && q && (
                                <button onClick={() => setSearchQuery('')} className="ml-1 text-slate-400 hover:text-slate-600 flex-shrink-0">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nav area */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
                    {q && !isCollapsed ? (
                        /* --- SEARCH RESULTS --- */
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 mb-3 ${hasSearchResults ? 'text-indigo-400' : 'text-rose-400'}`}>
                                {hasSearchResults ? `Results for "${searchQuery}"` : 'No results found'}
                            </p>
                            {!hasSearchResults && (
                                <p className="text-center text-slate-400 text-xs font-bold py-6">Nothing matched your search.</p>
                            )}
                            <nav className="space-y-1">
                                {isAdmin
                                    ? filteredAdminGroups.map(group => (
                                        <div key={group.title} className="mb-4">
                                            <div className="px-4 py-1">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{group.title}</p>
                                            </div>
                                            {group.links.map(link => (
                                                <NavLink
                                                    key={link.to}
                                                    to={link.to}
                                                    onClick={() => setSearchQuery('')}
                                                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                                                        ${isActive ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                                >
                                                    <span>{link.icon}</span>
                                                    <span className="flex-1">{link.label}</span>
                                                </NavLink>
                                            ))}
                                        </div>
                                    ))
                                    : filteredUserLinks.map(link => (
                                        <NavLink
                                            key={link.to + link.label}
                                            to={link.to}
                                            onClick={() => setSearchQuery('')}
                                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                                                ${isActive
                                                    ? 'bg-slate-50 text-indigo-600 shadow-sm border border-slate-100'
                                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                                        >
                                            <span>{link.icon}</span>
                                            <span className="flex-1">{link.label}</span>
                                        </NavLink>
                                    ))
                                }
                            </nav>
                        </div>
                    ) : (
                        /* --- NORMAL MENU --- */
                        <>
                            <div className={`mb-4 px-2 ${isCollapsed ? 'text-center' : ''}`}>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Menu</p>
                            </div>

                            {!isAdmin ? (
                                <nav className="space-y-0.5">
                                    {links.map(link => renderNavLink(link))}
                                </nav>
                            ) : (
                                <nav className="space-y-1">
                                    {adminLinkGroups.map((group) => (
                                        <div key={group.title} className="mb-4">
                                            {!isCollapsed && (
                                                <div className="px-4 py-2">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{group.title}</p>
                                                </div>
                                            )}
                                            <div className="space-y-0.5">
                                                {group.links.map((link) => (
                                                    <NavLink
                                                        key={link.to}
                                                        to={link.to}
                                                        end={link.to === '/admin'}
                                                        onMouseEnter={(e) => handleMouseEnter(link.label, e)}
                                                        onMouseLeave={handleMouseLeave}
                                                        className={({ isActive }) => `
                                                            flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                                                            ${isActive ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}
                                                            ${isCollapsed ? 'justify-center' : ''}
                                                        `}
                                                    >
                                                        <span className={`${isCollapsed ? 'scale-110' : ''} transition-transform`}>{link.icon}</span>
                                                        {!isCollapsed && <span className="flex-1">{link.label}</span>}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </nav>
                            )}

                            {/* Admin Panel button — user sidebar only */}
                            {!isAdmin && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    {isUserAdmin && (
                                        <button
                                            onClick={() => navigate('/admin')}
                                            onMouseEnter={(e) => handleMouseEnter('Admin Panel', e)}
                                            onMouseLeave={handleMouseLeave}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all mb-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100
                                                ${isCollapsed ? 'justify-center' : ''}`}
                                        >
                                            <Shield size={18} />
                                            {!isCollapsed && <span className="flex-1 text-left">Admin Panel</span>}
                                        </button>
                                    )}
                                    {!isCollapsed && (
                                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                            <HelpCircle size={18} />
                                            <span>Support</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 mt-auto border-t border-slate-100">
                    <div className={`rounded-3xl border transition-all duration-300
                        ${isAdmin ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}
                        ${isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-4'}`}
                    >
                        <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col' : 'mb-4'}`}>
                            <img
                                src={userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || 'User')}&background=6366f1&color=fff`}
                                className="w-9 h-9 rounded-2xl border-2 border-white shadow-sm object-cover flex-shrink-0"
                                alt="Avatar"
                            />
                            {!isCollapsed && (
                                <div className="overflow-hidden">
                                    <p className="text-xs font-black truncate text-slate-900">{userProfile?.displayName}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{userProfile?.role}</p>
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <button
                                onClick={onLogout}
                                className="w-full py-3 bg-white text-slate-600 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                <LogOut size={14} /> Logout
                            </button>
                        )}
                        {isCollapsed && (
                            <button
                                onClick={onLogout}
                                className="mt-1 w-full flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Fixed tooltip (no children) */}
            {tooltip && isCollapsed && (
                <div
                    className="fixed z-[999] px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg whitespace-nowrap shadow-xl pointer-events-none"
                    style={{ top: tooltip.y - 12, left: sidebarWidth + 12 }}
                >
                    {tooltip.label}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-slate-900 rotate-45" />
                </div>
            )}

            {/* Flyout submenu (items with children, collapsed mode) */}
            {flyout && isCollapsed && (
                <div
                    className="fixed z-[999] bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200 py-2 min-w-[160px]"
                    style={{ top: flyout.y - 20, left: sidebarWidth + 12 }}
                    onMouseEnter={() => {/* keep open */ }}
                    onMouseLeave={handleFlyoutLeave}
                >
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{flyout.label}</p>
                    </div>
                    {flyout.children.map(child => (
                        <NavLink
                            key={child.id}
                            to={child.to}
                            onClick={() => setFlyout(null)}
                            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-all
                                ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0" />
                            {child.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
