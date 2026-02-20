import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, BarChart2, User, LayoutDashboard, Users, Settings } from 'lucide-react';

interface MobileNavProps {
  isAdmin?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isAdmin }) => {
  const location = useLocation();

  const userLinks = [
    { to: '/dashboard/trees', icon: <Layout size={20} />, label: 'Trees' },
    { to: '/dashboard/analytics', icon: <BarChart2 size={20} />, label: 'Stats' },
    { to: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Admin' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Setup' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-2 py-3">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
                            flex flex-col items-center gap-1 transition-colors
                            ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
                        `}
          >
            {link.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
