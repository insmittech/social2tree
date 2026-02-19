
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, Palette, BarChart2, LayoutDashboard, Users, Settings, User } from 'lucide-react';

interface MobileNavProps {
  isAdmin?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isAdmin }) => {
  const location = useLocation();

  const userLinks = [
    { to: '/dashboard/links', icon: <Layout size={20} />, label: 'Links' },
    { to: '/dashboard/themes', icon: <Palette size={20} />, label: 'Themes' },
    { to: '/dashboard/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
    { to: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const currentPath = location.pathname;
    const index = links.findIndex(l =>
      l.to === currentPath ||
      (l.to === '/dashboard/links' && currentPath === '/dashboard')
    );
    if (index !== -1) setActiveIndex(index);
  }, [location.pathname, links]);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 select-none pointer-events-none">
      <div className="relative max-w-sm mx-auto h-20 bg-white shadow-[0_-1px_30px_rgba(0,0,0,0.08)] border border-slate-200/50 rounded-[2rem] pointer-events-auto flex items-center justify-around px-2">

        {/* Curved Indicator Background */}
        <div
          className="absolute -top-[34px] transition-all duration-500 ease-out pointer-events-none"
          style={{
            left: `calc(${(activeIndex * 100) / links.length}% + (100% / ${links.length} / 2) - 40px)`,
            width: '80px',
            height: '80px'
          }}
        >
          {/* Main Bubble White Background */}
          <div className="absolute inset-0 bg-white rounded-full border border-slate-200/50 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]"></div>

          {/* The Dip / Curve wings using masked pseudo-elements for a more authentic recursive curve */}
          <div className="absolute -left-4 top-[34px] w-4 h-4 bg-white">
            <div className="w-full h-full bg-slate-50 rounded-tr-[20px] border-t border-r border-slate-200/50"></div>
          </div>
          <div className="absolute -right-4 top-[34px] w-4 h-4 bg-white">
            <div className="w-full h-full bg-slate-50 rounded-tl-[20px] border-t border-l border-slate-200/50"></div>
          </div>
        </div>

        {links.map((link, idx) => {
          const isActive = idx === activeIndex;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className="relative flex flex-col items-center justify-center w-full h-full z-10"
            >
              {/* Floating Icon Container */}
              <div
                className={`transition-all duration-500 ease-out flex items-center justify-center rounded-2xl ${isActive
                  ? '-translate-y-10 bg-indigo-600 text-white w-14 h-14 shadow-xl shadow-indigo-200 scale-110'
                  : 'text-slate-400 hover:text-slate-600 h-full'
                  }`}
              >
                {link.icon}
              </div>

              {/* Label */}
              <span
                className={`absolute bottom-3 text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${isActive ? 'opacity-100 translate-y-0 text-indigo-600' : 'opacity-0 translate-y-4'
                  }`}
              >
                {link.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
