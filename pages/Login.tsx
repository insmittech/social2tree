
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, ArrowLeft, Mail, Lock, ShieldCheck, User } from 'lucide-react';
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
  const { login, refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      // Sending 'email' state as 'username' field because the backend expects 'username' 
      // but handles it as (username OR email)
      const response = await client.post('/auth/login.php', {
        username: email,
        password
      });

      const partialUser = response.data.user;

      // Update global auth state by fetching full profile (including pages)
      // login(partialUser) // Don't use this as it might miss 'pages' array
      await refreshProfile();

      showToast('Welcome back!', 'success');
      // onLogin prop is likely redundant now but keeping it for compatibility if needed
      onLogin(partialUser.role === 'admin', partialUser);
      navigate(partialUser.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Login failed. Check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft size={18} /> Back to home
      </Link>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 p-3 rounded-2xl mb-4 shadow-xl">
            <TreePine className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Welcome back
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Log in to manage your tree
          </p>
        </div>

        {/* Role Switcher */}


        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 outline-none transition-all font-bold text-slate-700 focus:ring-indigo-100 focus:border-indigo-600"
                placeholder="alex@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-4 outline-none transition-all font-bold text-slate-700 focus:ring-indigo-100 focus:border-indigo-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl text-lg font-black transition-all shadow-xl active:scale-[0.98] bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
          >
            Log In
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 font-medium">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-black hover:underline">Sign up free</Link>
        </div>
      </div>

      <p className="mt-8 text-slate-400 text-sm font-medium">
        Demo Credentials: Use any email/password.
      </p>
    </div>
  );
};

export default Login;
