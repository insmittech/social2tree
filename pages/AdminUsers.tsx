
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import MobileNav from '../components/MobileNav';
import { UserProfile, PlanType } from '../types';
import { Search, Filter, MoreHorizontal, UserCheck, ShieldAlert, CreditCard, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

interface AdminUsersProps {
  onLogout: () => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ onLogout }) => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await client.get('/admin/users/list.php');
        if (res.data.users) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error('Failed to fetch admin users:', err);
        showToast('Failed to load users', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [showToast]);

  const filteredUsers = users.filter(u =>
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const handlePlanChange = async (userId: string, plan: PlanType) => {
    // TODO: Call API to update user plan
    console.log('Update plan for user', userId, 'to', plan);
  };

  const getPlanBadge = (plan: PlanType) => {
    switch (plan) {
      case 'business': return <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg text-[8px] font-black uppercase tracking-wider">Business</span>;
      case 'pro': return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg text-[8px] font-black uppercase tracking-wider">Pro</span>;
      default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[8px] font-black uppercase tracking-wider">Free</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isDashboard onLogout={onLogout} />

      <div className="max-w-[1600px] mx-auto flex">
        <AdminSidebar />

        <main className="flex-grow p-4 sm:p-8 lg:p-12 overflow-hidden pb-32 lg:pb-12">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">User Management</h1>
              <p className="text-slate-500 font-medium">Roles and subscriptions</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search name..."
                  className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none w-full sm:w-80 font-bold text-sm transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={18} /> Filter
              </button>
            </div>
          </header>

          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-4 sm:px-8 py-5 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User</th>
                    <th className="hidden sm:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                    <th className="px-4 sm:px-8 py-5 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Plan</th>
                    <th className="hidden lg:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Engagement</th>
                    <th className="px-4 sm:px-8 py-5 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 sm:px-8 py-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img src={user.avatarUrl} className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border-2 border-slate-100 shadow-sm" alt="" />
                          <div>
                            <p className="font-black text-slate-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{user.displayName}</p>
                            <p className="text-[10px] text-indigo-500 font-bold">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-8 py-5">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-8 py-5">
                        {getPlanBadge(user.plan)}
                      </td>
                      <td className="hidden lg:table-cell px-8 py-5">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-xs font-black text-slate-700">{user.views.toLocaleString()} views</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-5">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handlePlanChange(user.id, user.plan === 'pro' ? 'free' : 'pro')}
                            className="p-2 sm:p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <CreditCard size={16} />
                          </button>
                          <a
                            href={`/${user.username}`}
                            target="_blank"
                            className="p-2 sm:p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-slate-400 font-bold">No users found.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav isAdmin />
    </div>
  );
};

export default AdminUsers;
