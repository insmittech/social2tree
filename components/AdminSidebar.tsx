
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings, ShieldAlert, Globe, Activity } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/admin' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <Activity size={20} />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <ShieldAlert size={20} />, label: 'Security', path: '/admin/security' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100-4rem)] sticky top-16 hidden md:flex flex-col p-6 space-y-8">
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-3">Management</h3>
        <nav className="space-y-1">
          {menuItems.slice(0, 3).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-3">System</h3>
        <nav className="space-y-1">
          {menuItems.slice(3).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-8 border-t border-slate-100">
        <div className="bg-slate-900 rounded-2xl p-4 text-white">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold">All Systems Live</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 flex items-center gap-1">
            <Globe size={10} /> nodes: US-EAST-1
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
