
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    TreePine,
    Layout,
    Palette,
    BarChart2,
    LayoutDashboard,
    Users,
    Settings,
    Shield,
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
    const location = useLocation();

    const userLinks = [
        { to: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
        { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { to: '/dashboard/links', icon: <Layout size={20} />, label: 'Bio Links' },
        { to: '/dashboard/themes', icon: <Palette size={20} />, label: 'Themes' },
        { to: '/dashboard/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
        { to: '/dashboard/plan', icon: <CreditCard size={20} />, label: 'Plan' },
        { to: '/dashboard/saved', icon: <Bookmark size={20} />, label: 'Saved Links' },
    ];

    const adminLinks = [
        { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { to: '/admin/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
        { to: '/admin/security', icon: <Shield size={20} />, label: 'Security' },
        { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    return (
        <aside className={`hidden lg:flex flex-col w-64 border-r sticky top-0 h-screen transition-colors duration-300 ${isAdmin ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
                        <TreePine className="text-white w-6 h-6" />
                    </div>
                    <span className={`text-xl font-black tracking-tighter ${isAdmin ? 'text-white' : 'text-slate-900'}`}>
                        S2T <span className="text-indigo-500 font-medium text-xs ml-1">{isAdmin ? 'ADM' : ''}</span>
                    </span>
                </div>

                <nav className="space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/dashboard' || link.to === '/admin'}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                ${isActive
                                    ? (isAdmin ? 'bg-white/10 text-white' : 'bg-indigo-50 text-indigo-600')
                                    : (isAdmin ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')
                                }
              `}
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-4">
                {userProfile && !isAdmin && userProfile.role === 'admin' && (
                    <NavLink
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                    >
                        <Shield size={20} />
                        Admin Panel
                    </NavLink>
                )}

                {isAdmin && (
                    <NavLink
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                        <User size={20} />
                        User Mode
                    </NavLink>
                )}

                <div className={`p-4 rounded-2xl border ${isAdmin ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <img
                            src={userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${userProfile?.username || 'User'}&background=6366f1&color=fff`}
                            className="w-10 h-10 rounded-full border border-indigo-500"
                        />
                        <div className="overflow-hidden">
                            <p className={`text-xs font-black uppercase tracking-widest truncate ${isAdmin ? 'text-white' : 'text-slate-900'}`}>
                                {userProfile?.username || 'User'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">{userProfile?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${isAdmin ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-white text-slate-600 hover:text-red-600 border border-slate-200'
                            }`}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
