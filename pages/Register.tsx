
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TreePine, ArrowLeft, User, Mail, Lock } from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <Link to="/" className="absolute top-12 left-12 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={18} /> Back
      </Link>

      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 p-2.5 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <TreePine className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 text-center">Join 40M+ creators</h1>
          <p className="text-slate-500 mt-2">Get started for free</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                placeholder="yourname"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                placeholder="Choose a strong password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center px-4">
            By signing up, you agree to our Terms and Privacy Policy.
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-100 active:scale-[0.98]"
          >
            Create My Account
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
