
import React, { useState, useEffect } from 'react';
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
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          client.get('/admin/users/list.php'),
          client.get('/admin/rbac/get_roles.php')
        ]);
        if (usersRes.data.users) setUsers(usersRes.data.users);
        if (rolesRes.data.roles) setAllRoles(rolesRes.data.roles);
      } catch (err) {
        console.error('Failed to fetch admin users:', err);
        showToast('Failed to load management data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [showToast]);

  const handleAssignRole = async (userId: string, roles: string[]) => {
    try {
      await client.post('/admin/rbac/assign_role.php', { user_id: userId, roles });
      showToast('Roles updated', 'success');
      // Refresh user list
      const res = await client.get('/admin/users/list.php');
      setUsers(res.data.users);
    } catch (err) {
      showToast('Assignment failed', 'error');
    }
  };

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
    <div className="p-4 sm:p-8 lg:px-12 py-8 overflow-hidden pb-32 lg:pb-12">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tighter">User Management</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Roles, Access Control and Subscriptions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search name..."
              className="pl-12 pr-6 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none w-full sm:w-80 font-bold text-sm transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-indigo-600 hover:bg-indigo-100 transition-all">
            <Filter size={18} /> Filter
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl shadow-slate-100/50 border-2 border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b-2 border-slate-100">
                <th className="px-4 sm:px-8 py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User</th>
                <th className="hidden sm:table-cell px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Roles</th>
                <th className="px-4 sm:px-8 py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Plan</th>
                <th className="hidden lg:table-cell px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Engagement</th>
                <th className="px-4 sm:px-8 py-6 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 sm:px-8 py-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img src={user.avatarUrl} className="w-8 h-8 sm:w-12 sm:h-12 rounded-2xl border-2 border-slate-100 shadow-sm" alt="" />
                      <div>
                        <p className="font-black text-slate-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{user.displayName}</p>
                        <p className="text-[10px] text-indigo-500 font-bold">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-8 py-6">
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role: string) => (
                          <span key={role} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-indigo-100">
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{user.role} (Legacy)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-6">
                    {getPlanBadge(user.plan)}
                  </td>
                  <td className="hidden lg:table-cell px-8 py-6">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-black text-slate-700">{user.views.toLocaleString()} views</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-6">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsRoleModalOpen(true);
                        }}
                        className="p-2 sm:p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Manage Roles"
                      >
                        <ShieldAlert size={18} />
                      </button>
                      <button
                        onClick={() => handlePlanChange(user.id, user.plan === 'pro' ? 'free' : 'pro')}
                        className="p-2 sm:p-3 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                        title="Change Plan"
                      >
                        <CreditCard size={18} />
                      </button>
                      <a
                        href={`/${user.username}`}
                        target="_blank"
                        className="p-2 sm:p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="View Profile"
                      >
                        <ExternalLink size={18} />
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
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No users found.</p>
          </div>
        )}
      </div>

      {/* Role Assignment Modal */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsRoleModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Manage Roles</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">
              Assign roles for <span className="text-indigo-600">@{selectedUser.username}</span>
            </p>

            <div className="space-y-3 mb-10">
              {allRoles.map(role => (
                <label
                  key={role.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedUser?.roles?.includes(role.name)
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-lg shadow-indigo-100'
                    : 'bg-slate-50 border-slate-50 text-slate-500 hover:bg-white hover:border-slate-200'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedUser?.roles?.includes(role.name)}
                      onChange={() => {
                        const current = selectedUser.roles || [];
                        const updated = current.includes(role.name)
                          ? current.filter((r: string) => r !== role.name)
                          : [...current, role.name];
                        setSelectedUser({ ...selectedUser, roles: updated });
                      }}
                    />
                    <div className="w-5 h-5 rounded border-2 border-current flex items-center justify-center">
                      {selectedUser?.roles?.includes(role.name) && <div className="w-2.5 h-2.5 bg-current rounded-sm"></div>}
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">{role.name}</span>
                  </div>
                  <p className="text-[10px] font-bold opacity-60 max-w-[150px] text-right">{role.description}</p>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="flex-1 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAssignRole(selectedUser.id, selectedUser.roles);
                  setIsRoleModalOpen(false);
                }}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
