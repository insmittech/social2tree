
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../src/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface LayoutProps {
    children: React.ReactNode;
    userProfile: any;
    onLogout: () => void;
    isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, userProfile, onLogout, isAdmin }) => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const isAdminPath = location.pathname.startsWith('/admin');
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Dynamic Title Logic
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.startsWith('/admin')) {
            if (path.includes('/users')) return 'Users | Admin';
            if (path.includes('/settings/menus')) return 'Menus | Admin';
            if (path.includes('/settings')) return 'Settings | Admin';
            return 'Admin Dashboard';
        }
        if (path.startsWith('/dashboard')) {
            if (path.includes('/trees/')) return 'Editing Tree';
            if (path.includes('/trees')) return 'Bio-Trees';
            if (path.includes('/analytics')) return 'Analytics';
            if (path.includes('/profile')) return 'Profile';
            if (path.includes('/settings')) return 'Account Settings';
            return 'Dashboard';
        }
        return 'Social2Tree';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex transition-colors duration-300">
            {/* Sidebar for Desktop */}
            <Sidebar
                isAdmin={isAdmin || isAdminPath}
                userProfile={userProfile}
                onLogout={onLogout}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300`}>
                {/* Navbar at top */}
                <div className="lg:hidden">
                    <Navbar
                        isDashboard
                        onLogout={onLogout}
                        isAuthenticated={true}
                        userProfile={userProfile}
                    />
                </div>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </main>

                {/* Mobile Navigation at bottom */}
                <MobileNav isAdmin={isAdmin || isAdminPath} />
            </div>

            {/* Floating Theme Toggle for Desktop */}
            <div className="hidden lg:block fixed bottom-8 right-8 z-[60]">
                <button
                    onClick={toggleTheme}
                    className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 hover:shadow-teal-500/20 active:scale-95 transition-all duration-300 group"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        {theme === 'dark' ? (
                            <Sun className="w-6 h-6 text-teal-400 animate-in zoom-in spin-in-90 duration-500" />
                        ) : (
                            <Moon className="w-6 h-6 text-indigo-600 animate-in zoom-in -spin-in-90 duration-500" />
                        )}
                    </div>

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap border border-slate-800 shadow-xl">
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Layout;
