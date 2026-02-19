
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TreePine, LogOut, BarChart2, Palette, Shield, Layout, Settings, User } from 'lucide-react';

interface NavbarProps {
  isDashboard?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDashboard, onLogout }) => {
  // TODO: Get profile from context or props if needed for display
  const isAdmin = false; // Placeholder - would be determined by auth context
  const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff';
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <nav className={`border-b sticky top-0 z-50 transition-colors duration-300 ${isAdminPath ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
              <TreePine className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className={`text-lg sm:text-xl font-black tracking-tighter ${isAdminPath ? 'text-white' : 'text-slate-900'}`}>
              S2T <span className="hidden xs:inline">Social2Tree</span>
              <span className="text-indigo-500 font-medium text-xs ml-1">{isAdminPath ? 'ADM' : ''}</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-6">
            {isDashboard ? (
              <>
                {/* Mode Switcher */}
                {isAdmin && (
                  <Link
                    to={isAdminPath ? "/dashboard" : "/admin"}
                    className={`flex items-center gap-1.5 font-bold text-[10px] sm:text-xs px-2 sm:px-3 py-2 rounded-xl transition-all ${isAdminPath
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                  >
                    {isAdminPath ? <User size={14} /> : <Shield size={14} />}
                    <span className="hidden sm:inline">{isAdminPath ? "User Mode" : "Admin Panel"}</span>
                    <span className="sm:hidden">{isAdminPath ? "User" : "Admin"}</span>
                  </Link>
                )}

                {/* Desktop-only Links */}
                {!isAdminPath && (
                  <div className="hidden lg:flex items-center gap-6">
                    <Link to="/dashboard/links" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors">
                      <Layout size={18} /> Links
                    </Link>
                    <Link to="/dashboard/themes" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors">
                      <Palette size={18} /> Themes
                    </Link>
                    <Link to="/dashboard/analytics" className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors">
                      <BarChart2 size={18} /> Analytics
                    </Link>
                  </div>
                )}

                {/* Profile / Logout */}
                <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:pl-4 border-l border-slate-200/20">
                  <img src={defaultAvatar} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-indigo-500" />
                  <button
                    onClick={onLogout}
                    className={`flex items-center gap-1.5 font-medium text-sm transition-colors ${isAdminPath ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-red-600'}`}
                  >
                    <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-bold text-sm">Log In</Link>
                <Link to="/register" className="bg-slate-900 text-white px-4 sm:px-5 py-2.5 rounded-xl font-black text-sm hover:bg-slate-800 transition-all">
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
