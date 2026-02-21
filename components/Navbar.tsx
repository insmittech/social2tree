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
  const isAdmin = userProfile?.roles?.includes('admin') || userProfile?.role === 'admin';
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
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-2 sm:gap-8">
            <Link to={isAuthenticated ? "/dashboard/trees" : "/"} className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
                <TreePine size={20} />
              </div>
              <span className={`text-lg sm:text-2xl font-black text-slate-900 tracking-tighter ${isDashboard ? 'hidden sm:block' : 'block'}`}>
                Social<span className="text-indigo-600">2</span>Tree
              </span>
            </Link>

            {!isDashboard && (
              <div className="hidden md:flex items-center gap-6">
                <Link to="/features" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Features</Link>
                <Link to="/pricing" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Pricing</Link>
                {customLinks && customLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <span className="text-sm font-black text-slate-900 leading-none">{userProfile?.displayName || 'User'}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {userProfile?.isAdmin ? 'Admin Plan' : 'Pro Plan'}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors"
                >
                  <User size={18} />
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:h-11 bg-slate-50 text-slate-600 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black hover:bg-slate-100 transition-all border border-slate-100"
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

            {/* Mobile Toggle - Only on Landing */}
            {!isDashboard && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only on Landing */}
      {!isDashboard && isMenuOpen && (
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
          {!isAuthenticated && (
            <div className="grid gap-3 pt-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-bold text-slate-600 bg-slate-50 rounded-xl">Log In</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">Join Free</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
