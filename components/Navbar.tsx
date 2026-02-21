import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Shield, Menu, X, Activity } from 'lucide-react';

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
  const defaultAvatar = userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || 'User')}&background=14b8a6&color=fff`;
  const location = useLocation();

  // Landing links to match OSINT design
  const landingLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
  ];

  const dashboardLinks = [
    { label: 'My Trees', to: '/dashboard/trees' },
    { label: 'Analytics', to: '/dashboard/analytics' },
  ];

  const linksToRender = customLinks && customLinks.length > 0 ? customLinks : (!isDashboard ? landingLinks : dashboardLinks);

  return (
    <nav className="fixed w-full z-50 top-0 border-b border-teal-900/30 bg-[#0b0f19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-900/20 border border-teal-500/30 group-hover:border-teal-400 transition-all duration-300">
              <Shield className="text-teal-400 w-5 h-5 absolute z-10" />
              <div className="absolute inset-0 bg-teal-500/10 blur-md rounded-xl"></div>
            </div>
            <span className="text-xl font-bold tracking-wide text-white">Social<span className="text-teal-400">2Tree</span></span>
          </Link>

          {/* Desktop Navigation Links (Centered) */}
          <div className="hidden md:flex items-center gap-8">
            {linksToRender.map((link, idx) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={`${link.to}-${idx}`}
                  to={link.to}
                  className={`text-sm font-medium transition-colors relative group ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  {link.label}
                  <span className={`absolute -bottom-[30px] left-0 w-full h-0.5 bg-teal-400 transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>
              );
            })}
          </div>

          {/* Actions (Right Side) */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4 pl-6 border-l border-slate-800">
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="text-right">
                    <p className="text-xs font-bold leading-none mb-1 text-white">{userProfile?.displayName.split(' ')[0]}</p>
                    <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">{userProfile?.role || 'User'}</p>
                  </div>
                  <img src={defaultAvatar} className="w-10 h-10 rounded-xl border border-teal-500/30 object-cover" alt="Avatar" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2">
                  Log In
                </Link>
                <Link
                  to="/contact"
                  className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">Contact <Activity size={16} /></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-slate-800 bg-[#0b0f19] p-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            {linksToRender.map((link, idx) => (
              <Link
                key={`${link.to}-mobile-${idx}`}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-base font-medium px-4 py-3 rounded-xl transition-all ${location.pathname === link.to ? 'text-teal-400 bg-teal-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setIsMenuOpen(false); navigate('/dashboard/profile'); }}
                  className="flexItems-center justify-center w-full py-4 font-bold text-white bg-slate-800 rounded-xl"
                >
                  My Profile
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); if (onLogout) onLogout(); }}
                  className="w-full py-4 text-center font-bold text-red-400 bg-red-500/10 rounded-xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-medium text-slate-300 border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/50 rounded-xl transition-colors">
                  Log In
                </Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                  Contact
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
