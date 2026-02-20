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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Link to="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="max-w-md w-full bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg">
            <TreePine className="text-white w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500 text-sm font-medium">Join 5M+ creators claiming their digital space.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700"
                placeholder="yourname"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700"
                placeholder="alex@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium text-center">
            By joining, you agree to our <a href="#" className="text-indigo-600 underline">Terms</a> and <a href="#" className="text-indigo-600 underline">Privacy</a>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-medium text-slate-500">
          Already a member? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
