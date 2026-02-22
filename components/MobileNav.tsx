import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, BarChart2, User, LayoutDashboard, Users, Settings } from 'lucide-react';
import client from '../src/api/client';
import IconRenderer from './IconRenderer';

interface MobileNavProps {
  isAdmin?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isAdmin }) => {
  const location = useLocation();
  const [dynamicLinks, setDynamicLinks] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      const fetchMenus = async () => {
        try {
          const res = await client.get('/admin/settings/get.php');
          const s = res.data.settings || {};
          const links = JSON.parse(s.dashboard_menu_links || '[]');
          if (links.length > 0) {
            setDynamicLinks(links);
          }
        } catch (err) {
          console.error('Failed to load mobile nav links:', err);
        }
      };
      fetchMenus();
    }
  }, [isAdmin]);

  const defaultUserLinks = [
    { to: '/dashboard/trees', icon: <Layout size={20} />, label: 'Trees' },
    { to: '/dashboard/analytics', icon: <BarChart2 size={20} />, label: 'Stats' },
    { to: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Admin' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Setup' },
  ];

  const userLinks = dynamicLinks.length > 0
    ? dynamicLinks.map(l => ({
      to: l.to,
      icon: <IconRenderer iconName={l.icon || 'LayoutDashboard'} size={20} />,
      label: l.label
    }))
    : defaultUserLinks;

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0b0f19] border-t border-slate-100 dark:border-slate-800 px-2 py-3 transition-colors duration-300">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
                             flex flex-col items-center gap-1 transition-colors
                             ${isActive ? 'text-indigo-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}
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
