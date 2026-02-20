
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, ArrowLeft, User, Mail, Lock } from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

interface RegisterProps {
  isAuthenticated: boolean;
}

const Register: React.FC<RegisterProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
      await client.post('/auth/register.php', formData);
      showToast('Registration successful! Please log in.', 'success');
      navigate('/login');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Form Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative overflow-y-auto">
        <Link to="/" className="absolute top-8 left-8 sm:top-12 sm:left-16 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic mb-3">
              Join the Hub
            </h1>
            <p className="text-slate-500 font-bold">
              Join 5M+ creators claiming their digital space.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 py-5 focus:ring-4 outline-none transition-all font-black text-slate-700 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white placeholder:text-slate-200"
                  placeholder="yourname"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 py-5 focus:ring-4 outline-none transition-all font-black text-slate-700 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white placeholder:text-slate-200"
                  placeholder="alex@example.com"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 py-5 focus:ring-4 outline-none transition-all font-black text-slate-700 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white placeholder:text-slate-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold px-2 text-center">
              By joining, you agree to our <a href="#" className="text-indigo-600 underline">Terms</a> and <a href="#" className="text-indigo-600 underline">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-[2rem] text-lg font-black transition-all shadow-2xl active:scale-[0.97] bg-slate-950 text-white hover:bg-indigo-600 shadow-indigo-100/20 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-12 text-center text-slate-500 font-bold">
            Already a member? <Link to="/login" className="text-indigo-600 font-black hover:underline uppercase tracking-widest text-xs ml-2">Log in here</Link>
          </div>
        </div>
      </div>

      {/* Brand Side - Order 1 on Tablet/Desktop for Register? No, let's keep it consistent or flip for variety */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-600/20 via-transparent to-indigo-600/20"></div>
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10 text-center">
          <div className="flex -space-x-4 mb-12 justify-center">
            {[1, 2, 3, 4, 5].map(i => (
              <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-16 h-16 rounded-full border-4 border-slate-900 shadow-2xl" alt="user" />
            ))}
          </div>
          <h2 className="text-5xl font-black text-white leading-tight tracking-tighter italic mb-6">
            Claim your<br />uniqueness.
          </h2>
          <p className="text-slate-400 text-lg font-bold max-w-sm mx-auto leading-relaxed">
            It takes less than 30 seconds to set up your first Social2Tree profile.
          </p>
        </div>

        {/* Floating cards for visual flair */}
        <div className="absolute bottom-20 left-20 bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 -rotate-12 animate-bounce duration-[4000ms]">
          <div className="w-24 h-4 bg-indigo-500/40 rounded-full mb-4"></div>
          <div className="w-16 h-4 bg-white/10 rounded-full mb-4"></div>
          <div className="w-20 h-4 bg-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
