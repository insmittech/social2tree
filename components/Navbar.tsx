import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TreePine, LogOut, Shield, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  isDashboard?: boolean;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userProfile?: any;
  customLinks?: { label: string; to: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ isDashboard, onLogout, isAuthenticated, userProfile, customLinks }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = userProfile?.role === 'admin';
  const defaultAvatar = userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || 'User')}&background=6366f1&color=fff`;
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const landingLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Contact', to: '/contact' },
  ];

  const dashboardLinks = [
    { label: 'My Trees', to: '/dashboard/trees' },
    { label: 'Analytics', to: '/dashboard/analytics' },
  ];

  const linksToRender = customLinks && customLinks.length > 0 ? customLinks : (!isDashboard ? landingLinks : dashboardLinks);

  return (
    <nav className={`sticky top-0 z-50 transition-all ${isAdminPath ? 'border-b border-slate-800 bg-slate-900 text-white' : 'border-b border-slate-100 bg-white/80 backdrop-blur-md text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-200">
              <TreePine className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Social2Tree</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {linksToRender.map((link, idx) => (
              <Link
                key={`${link.to}-${idx}`}
                to={link.to}
                className={`text-sm font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors ${location.pathname === link.to ? 'text-indigo-600' : 'text-slate-500'}`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && isDashboard && isAdmin && (
              <Link to={isAdminPath ? "/dashboard" : "/admin"} className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all">
                {isAdminPath ? <User size={14} /> : <Shield size={14} />}
                {isAdminPath ? "User Mode" : "Admin Panel"}
              </Link>
            )}

            {isAuthenticated && !isDashboard && (
              <Link to="/dashboard" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="hidden lg:block text-right">
                    <p className={`text-xs font-black leading-none mb-1 ${isAdminPath ? 'text-white' : 'text-slate-900'}`}>{userProfile?.displayName.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{userProfile?.role}</p>
                  </div>
                  <img src={defaultAvatar} className="w-10 h-10 rounded-2xl border-2 border-slate-50 shadow-sm object-cover" alt="Avatar" />
                </button>
                {isDashboard && (
                  <button
                    onClick={onLogout}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 px-4">Log In</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 border-b p-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-300 ${isAdminPath ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          {linksToRender.map((link, idx) => (
            <Link
              key={`${link.to}-mobile-${idx}`}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={`block text-base font-bold px-4 py-3 rounded-xl transition-all ${isAdminPath ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="grid gap-3 pt-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-bold text-slate-600 bg-slate-50 rounded-xl">Log In</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">Join Free</Link>
            </div>
          ) : (
            isAdmin && (
              <Link
                to={isAdminPath ? "/dashboard" : "/admin"}
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-bold text-indigo-600 bg-indigo-50 px-4 py-3 rounded-xl mt-4"
              >
                {isAdminPath ? "Back to Dashboard" : "Admin Panel"}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
