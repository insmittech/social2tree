import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    TreePine,
    Layout,
    BarChart2,
    LayoutDashboard,
    Users,
    Settings,
    Shield,
    Key,
    CreditCard,
    Bookmark,
    User,
    LogOut
} from 'lucide-react';

interface SidebarProps {
    isAdmin?: boolean;
    userProfile?: any;
    onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin, userProfile, onLogout }) => {
    const userLinks = [
        { to: '/dashboard/profile', icon: <User size={18} />, label: 'Profile' },
        { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview' },
        { to: '/dashboard/trees', icon: <Layout size={18} />, label: 'Bio Trees' },
        { to: '/dashboard/analytics', icon: <BarChart2 size={18} />, label: 'Analytics' },
        { to: '/dashboard/plan', icon: <CreditCard size={18} />, label: 'Plan' },
        { to: '/dashboard/saved', icon: <Bookmark size={18} />, label: 'Saved Links' },
    ];

    const adminLinks = [
        { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Overview' },
        { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
        { to: '/admin/analytics', icon: <BarChart2 size={18} />, label: 'Data Hub' },
        { to: '/admin/security', icon: <Shield size={18} />, label: 'Security' },
        { to: '/admin/rbac', icon: <Key size={18} />, label: 'Access Control' },
        { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    return (
        <aside className={`hidden lg:flex flex-col w-60 border-r sticky top-0 h-screen transition-colors ${isAdmin ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <TreePine className="text-white w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">Social2Tree</span>
                </div>

                <nav className="space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/dashboard' || link.to === '/admin'}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all
                                ${isActive
                                    ? (isAdmin ? 'bg-white/10 text-white' : 'bg-indigo-50 text-indigo-600')
                                    : (isAdmin ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50')
                                }
                            `}
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-slate-100/50">
                <div className={`p-4 rounded-xl border ${isAdmin ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${userProfile?.username || 'User'}&background=6366f1&color=fff`}
                            className="w-8 h-8 rounded-full border border-slate-200"
                            alt="Avatar"
                        />
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate">{userProfile?.displayName}</p>
                            <p className="text-[10px] text-slate-500 truncate lowercase">{userProfile?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-bold hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
