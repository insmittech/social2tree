
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
      const response = await client.post('/auth/login.php', {
        username: email,
        password
      });

      const partialUser = response.data.user;
      await refreshProfile();

      showToast('Welcome back!', 'success');
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
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Brand Side - Hidden on Mobile */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/20"></div>
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10 text-center">
          <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 shadow-2xl mb-12 inline-block">
            <TreePine className="text-white w-20 h-20" />
          </div>
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter italic mb-6">
            Connect your<br />entire world.
          </h2>
          <p className="text-slate-400 text-lg font-bold max-w-sm mx-auto leading-relaxed">
            Join the world's best creators staging their digital presence in one beautiful link.
          </p>
        </div>

        {/* Floating cards for visual flair */}
        <div className="absolute top-20 right-20 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 rotate-12 animate-pulse">
          <div className="w-12 h-2 bg-white/20 rounded-full mb-2"></div>
          <div className="w-8 h-2 bg-white/10 rounded-full"></div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative">
        <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-16 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic mb-3">
              Welcome back
            </h1>
            <p className="text-slate-500 font-bold">
              Log in to manage your Social2Tree identity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 py-5 focus:ring-4 outline-none transition-all font-black text-slate-700 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white placeholder:text-slate-200"
                  placeholder="alex@example.com"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                <a href="#" className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.1em] hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 py-5 focus:ring-4 outline-none transition-all font-black text-slate-700 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white placeholder:text-slate-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-[2rem] text-lg font-black transition-all shadow-2xl active:scale-[0.97] bg-slate-950 text-white hover:bg-indigo-600 shadow-indigo-100/20 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Auth Mocks */}
          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute w-full h-px bg-slate-100"></div>
              <span className="relative bg-white px-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Or continue with</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-sm text-slate-600 active:scale-95">
                <div className="w-5 h-5 bg-rose-500 rounded-full"></div> Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-sm text-slate-600 active:scale-95">
                <div className="w-5 h-5 bg-slate-900 rounded-full"></div> Apple
              </button>
            </div>
          </div>

          <div className="mt-12 text-center text-slate-500 font-bold">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-black hover:underline uppercase tracking-widest text-xs ml-2">Sign up free</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
