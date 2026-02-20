import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TreePine, LogOut, BarChart2, Palette, Shield, Layout, User } from 'lucide-react';

interface NavbarProps {
  isDashboard?: boolean;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  userProfile?: any;
}

const Navbar: React.FC<NavbarProps> = ({ isDashboard, onLogout, isAuthenticated, userProfile }) => {
  const navigate = useNavigate();
  const isAdmin = userProfile?.role === 'admin';
  const defaultAvatar = userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || 'User')}&background=6366f1&color=fff`;
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <nav className={`sticky top-0 z-50 bg-white border-b ${isAdminPath ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <TreePine className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Social2Tree</span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-6">
                  {!isDashboard ? (
                    <>
                      <Link to="/features" className="text-sm font-medium text-slate-500 hover:text-slate-900">Features</Link>
                      <Link to="/pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900">Pricing</Link>
                      <Link to="/dashboard" className="text-sm font-bold text-indigo-600">Dashboard</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard/trees" className="text-sm font-medium text-slate-500 hover:text-slate-900">My Trees</Link>
                      <Link to="/dashboard/analytics" className="text-sm font-medium text-slate-500 hover:text-slate-900">Analytics</Link>
                      {isAdmin && (
                        <Link to={isAdminPath ? "/dashboard" : "/admin"} className="text-sm font-medium text-indigo-600 flex items-center gap-1">
                          {isAdminPath ? <User size={14} /> : <Shield size={14} />}
                          {isAdminPath ? "User View" : "Admin Panel"}
                        </Link>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                  <button
                    onClick={() => navigate('/dashboard/profile')}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="hidden lg:block text-right">
                      <p className="text-xs font-bold text-slate-900">{userProfile?.displayName.split(' ')[0]}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{userProfile?.role}</p>
                    </div>
                    <img src={defaultAvatar} className="w-8 h-8 rounded-full border border-slate-200" alt="Avatar" />
                  </button>
                  {isDashboard && (
                    <button
                      onClick={onLogout}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900">Log In</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
