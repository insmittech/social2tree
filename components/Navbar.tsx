
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TreePine, LogOut, BarChart2, Palette, Shield, Layout, Settings, User } from 'lucide-react';

interface NavbarProps {
  isDashboard?: boolean;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userProfile?: any;
}

const Navbar: React.FC<NavbarProps> = ({ isDashboard, onLogout, isAuthenticated, userProfile }) => {
  const navigate = useNavigate();
  const isAdmin = userProfile?.role === 'admin';
  const defaultAvatar = userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || 'User')}&background=1e293b&color=fff`;
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${isAdminPath
      ? 'bg-slate-900/90 border-b border-white/5 backdrop-blur-xl text-white shadow-2xl'
      : 'bg-white/70 border-b border-indigo-100/30 backdrop-blur-xl text-slate-900'
      }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-slate-950 p-2.5 rounded-[1.2rem] shadow-2xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <TreePine className="text-white w-6 h-6" />
            </div>
            <span className={`text-2xl font-black tracking-tighter italic ${isAdminPath ? 'text-white' : 'text-slate-900'}`}>
              S2T <span className="hidden xs:inline">Social2Tree</span>
              <span className="text-indigo-500 font-bold text-[10px] ml-1.5 align-top tracking-[0.2em]">{isAdminPath ? 'ADM' : 'PRO'}</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            {isDashboard || isAuthenticated ? (
              <>
                {/* Mode Switcher */}
                {isAdmin && isDashboard && (
                  <Link
                    to={isAdminPath ? "/dashboard" : "/admin"}
                    className={`flex items-center gap-2 font-black text-[10px] sm:text-xs px-4 py-2.5 rounded-2xl transition-all shadow-sm active:scale-95 ${isAdminPath
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-100'
                      }`}
                  >
                    {isAdminPath ? <User size={16} /> : <Shield size={16} />}
                    <span className="hidden sm:inline">{isAdminPath ? "User Mode" : "Admin Command"}</span>
                    <span className="sm:hidden">{isAdminPath ? "User" : "Admin"}</span>
                  </Link>
                )}

                {/* Desktop-only Links */}
                {isDashboard && !isAdminPath && (
                  <div className="hidden xl:flex items-center gap-8">
                    <Link to="/dashboard/links" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5">
                      <Layout size={18} /> Links
                    </Link>
                    <Link to="/dashboard/themes" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5">
                      <Palette size={18} /> Themes
                    </Link>
                    <Link to="/dashboard/analytics" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-0.5">
                      <BarChart2 size={18} /> Analytics
                    </Link>
                  </div>
                )}

                {!isDashboard && (
                  <div className="hidden lg:flex items-center gap-10 mr-6">
                    <Link to="/features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">Features</Link>
                    <Link to="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">Pricing</Link>
                    <Link to="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">Contact</Link>
                  </div>
                )}

                {!isDashboard && isAuthenticated && (
                  <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-slate-900 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all mr-4">
                    <Layout size={18} /> Dashboard
                  </Link>
                )}

                {/* Profile / Logout */}
                <div className="flex items-center gap-3 sm:gap-5 ml-2 pl-6 border-l-2 border-slate-100/50">
                  <div className="hidden lg:flex flex-col items-end">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 ${isAdminPath ? 'text-indigo-300' : 'text-slate-400'}`}>
                      {userProfile?.username || 'Architect'}
                    </span>
                    <span className={`text-xs font-black ${isAdminPath ? 'text-white' : 'text-slate-900'}`}>{userProfile?.displayName.split(' ')[0]}</span>
                  </div>
                  <div className="relative group cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
                    <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
                    <img src={defaultAvatar} className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white shadow-xl" alt="Avatar" />
                  </div>
                  {isDashboard && (
                    <button
                      onClick={onLogout}
                      className={`flex items-center justify-center p-3 rounded-2xl transition-all active:scale-90 ${isAdminPath ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/10'}`}
                    >
                      <LogOut size={20} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-500 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-colors">Log In</Link>
                <Link to="/register" className="bg-slate-950 text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-600 hover:-translate-y-1 transition-all shadow-2xl shadow-indigo-100/20 active:scale-95">
                  Start Building <span className="hidden sm:inline">&rarr;</span>
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
