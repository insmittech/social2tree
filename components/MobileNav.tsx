
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, Palette, BarChart2, LayoutDashboard, Users, Settings, Shield } from 'lucide-react';

interface MobileNavProps {
  isAdmin?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isAdmin }) => {
  const location = useLocation();
  
  const userLinks = [
    { to: '/dashboard', icon: <Layout size={20} />, label: 'Links' },
    { to: '/dashboard/themes', icon: <Palette size={20} />, label: 'Themes' },
    { to: '/dashboard/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/admin'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {link.icon}
            <span className="text-[10px] font-black uppercase tracking-wider">{link.label}</span>
            <div className={`w-1 h-1 rounded-full bg-indigo-600 transition-all duration-300 ${
              location.pathname === link.to || (link.to === '/dashboard' && location.pathname === '/dashboard') ? 'opacity-100' : 'opacity-0'
            }`} />
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
