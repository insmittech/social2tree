
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
    userProfile: any;
    onLogout: () => void;
    isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, userProfile, onLogout, isAdmin }) => {
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar for Desktop */}
            <Sidebar
                isAdmin={isAdmin || isAdminPath}
                userProfile={userProfile}
                onLogout={onLogout}
            />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Navbar at top */}
                <Navbar
                    isDashboard
                    onLogout={onLogout}
                    isAuthenticated={true}
                    userProfile={userProfile}
                />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </main>

                {/* Mobile Navigation at bottom */}
                <MobileNav isAdmin={isAdmin || isAdminPath} />
            </div>
        </div>
    );
};

export default Layout;
