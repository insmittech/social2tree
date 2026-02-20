import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    Search,
    Bell,
    Activity,
    ListTodo,
    HelpCircle,
    Home,
    Menu,
    TableProperties,
    Palette
} from 'lucide-react';

interface SidebarProps {
    isAdmin?: boolean;
    userProfile?: any;
    onLogout?: () => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin, userProfile, onLogout, isCollapsed, setIsCollapsed }) => {
    const [dynamicUserLinks, setDynamicUserLinks] = React.useState<any[]>([]);

    React.useEffect(() => {
        if (!isAdmin) {
            const fetchSettings = async () => {
                try {
                    const res = await client.get('/admin/settings/get.php');
                    const s = res.data.settings || {};
                    const links = JSON.parse(s.dashboard_menu_links || '[]');
                    if (links.length > 0) {
                        setDynamicUserLinks(links);
                    }
                } catch (err) {
                    console.error('Failed to load dynamic sidebar links:', err);
                }
            };
            fetchSettings();
        }
    }, [isAdmin]);

    const userLinks = [
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

    const links = isAdmin ? [] : (dynamicUserLinks.length > 0 ? dynamicUserLinks.map(l => ({
        ...l,
        icon: <LayoutDashboard size={18} /> // Default icon for dynamic links
    })) : userLinks);

    return (
        <aside
            className={`hidden lg:flex flex-col border-r sticky top-0 h-screen transition-all duration-300 ease-in-out relative
                ${isCollapsed ? 'w-20' : 'w-72'} 
                ${isAdmin ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xl shadow-slate-200/50'}
            `}
        >
            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`absolute -right-3.5 top-8 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-50`}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className="flex flex-col h-full overflow-hidden">
                {/* Logo Section */}
                <div className={`p-6 mb-2 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 flex-shrink-0">
                        <TreePine className="text-white w-6 h-6" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-black tracking-tighter uppercase italic truncate">Social2Tree</span>
                    )}
                </div>

                {/* Search Section */}
                <div className="px-6 mb-8 mt-4">
                    <div className={`relative group flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className={`flex items-center bg-slate-50 rounded-2xl transition-all duration-300 ${isCollapsed ? 'w-10 h-10 justify-center' : 'w-full px-4 py-3 border border-slate-100'}`}>
                            <Search size={18} className="text-slate-400 group-focus-within:text-indigo-600" />
                            {!isCollapsed && (
                                <input
                                    type="text"
                                    placeholder="Search.."
                                    className="bg-transparent border-none outline-none text-sm font-bold ml-2 w-full text-slate-600 placeholder:text-slate-400"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8">
                    <div className={`mb-4 px-2 ${isCollapsed ? 'text-center' : ''}`}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Menu</p>
                    </div>

                    <nav className="space-y-1">
                        {!isAdmin ? (
                            links.map((link) => {
                                const hasBadge = !isAdmin && (link.label === 'Bio Trees' || link.label === 'Verification');
                                const badgeValue = link.label === 'Bio Trees' ? '26' : (link.label === 'Verification' ? '17' : null);

                                return (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        end={link.to === '/dashboard' || link.to === '/admin'}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative group
                                            ${isActive
                                                ? 'bg-slate-50 text-indigo-600 shadow-sm border border-slate-100'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                            }
                                            ${isCollapsed ? 'justify-center' : ''}
                                        `}
                                    >
                                        <span className={`${isCollapsed ? 'scale-110' : ''} transition-transform`}>{link.icon}</span>
                                        {!isCollapsed && (
                                            <>
                                                <span className="flex-1">{link.label}</span>
                                                {hasBadge && (
                                                    <span className="bg-rose-400 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                                                        {badgeValue}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                        {isCollapsed && (
                                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                                                {link.label}
                                            </div>
                                        )}
                                    </NavLink>
                                );
                            })
                        ) : (
                            adminLinkGroups.map((group) => (
                                <div key={group.title} className="mb-4">
                                    {!isCollapsed && (
                                        <div className="px-4 py-2">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{group.title}</p>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        {group.links.map((link) => (
                                            <NavLink
                                                key={link.to}
                                                to={link.to}
                                                end={link.to === '/admin'}
                                                className={({ isActive }) => `
                                                    flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative group
                                                    ${isActive
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                                                    }
                                                    ${isCollapsed ? 'justify-center' : ''}
                                                `}
                                            >
                                                <span className={`${isCollapsed ? 'scale-110' : ''} transition-transform`}>{link.icon}</span>
                                                {!isCollapsed && <span className="flex-1">{link.label}</span>}
                                                {isCollapsed && (
                                                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                                                        {link.label}
                                                    </div>
                                                )}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </nav>

                    {!isAdmin && !isCollapsed && (
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <nav className="space-y-1">
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                    <HelpCircle size={18} />
                                    <span>Support</span>
                                </button>
                            </nav>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="p-4 mt-auto border-t border-slate-100">
                    <div className={`p-4 rounded-3xl border transition-all duration-300 ${isAdmin ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} ${isCollapsed ? 'items-center justify-center p-2' : ''}`}>
                        <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col justify-center' : 'mb-4'}`}>
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
                                className="mt-2 w-full flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
