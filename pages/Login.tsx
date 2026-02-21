import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, ArrowLeft, Mail, Lock } from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';
import { useAuth } from '../src/context/AuthContext';

interface LoginProps {
  onLogin: (isAdmin: boolean, user: any) => void;
  isAuthenticated: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isAuthenticated }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await client.post('/auth/login.php', { username: email, password });
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      login(user);
      const isAdmin = user.roles?.includes('admin') || user.role === 'admin';
      onLogin(isAdmin, user);

      showToast('Welcome back!', 'success');

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center px-4 transition-colors duration-300">
      <Link to="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-sm">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="max-w-md w-full bg-white dark:bg-slate-900/40 p-8 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-colors duration-300">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 dark:bg-teal-600 p-2.5 rounded-xl shadow-lg transition-colors">
            <TreePine className="text-white w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Log in to manage your Social2Tree identity.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 transition-colors">Email or Username</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors" size={18} />
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-[#05080f]/50 border border-slate-200 dark:border-slate-700/50 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 outline-none transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 shadow-sm dark:shadow-inner"
                placeholder="alex@example.com or username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 transition-colors">Password</label>
              <a href="#" className="text-xs font-medium text-indigo-600 dark:text-teal-500 hover:text-indigo-700 dark:hover:text-teal-400 hover:underline transition-colors">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-[#05080f]/50 border border-slate-200 dark:border-slate-700/50 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500 outline-none transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 shadow-sm dark:shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 dark:bg-teal-600 text-white font-bold hover:bg-indigo-700 dark:hover:bg-teal-700 transition flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-full h-px bg-slate-100 dark:bg-slate-800/50 transition-colors"></div>
            <span className="relative bg-white dark:bg-slate-900/40 px-4 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Or continue with</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700/50 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-bold text-sm text-slate-600 dark:text-slate-300">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700/50 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-bold text-sm text-slate-600 dark:text-slate-300">
              Apple
            </button>
          </div>
        </div>

        <div className="mt-10 text-center text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">
          Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-teal-500 font-bold hover:text-indigo-700 dark:hover:text-teal-400 hover:underline transition-colors">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
