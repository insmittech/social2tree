import React, { useEffect, useState } from 'react';
import { Shield, Plus, Edit2, Trash2, CheckCircle2, ChevronRight, Lock, Key, Users } from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

interface Permission {
    id: number;
    name: string;
    module: string;
    description: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
    permissions: string[];
}

const AdminRBAC: React.FC = () => {
    const { showToast } = useToast();
    const [roles, setRoles] = useState<Role[]>([]);
    const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Partial<Role> | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await client.get('/admin/rbac/get_roles.php');
            setRoles(res.data.roles);
            setAvailablePermissions(res.data.available_permissions);
        } catch (err) {
            console.error('Failed to fetch RBAC data', err);
            showToast('Failed to load RBAC data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole?.name) return;

        try {
            await client.post('/admin/rbac/save_role.php', editingRole);
            showToast('Role saved successfully', 'success');
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to save role', 'error');
        }
    };

    const togglePermission = (permissionName: string) => {
        if (!editingRole) return;
        const current = editingRole.permissions || [];
        const updated = current.includes(permissionName)
            ? current.filter(p => p !== permissionName)
            : [...current, permissionName];
        setEditingRole({ ...editingRole, permissions: updated });
    };

    const groupedPermissions = availablePermissions.reduce((acc, p) => {
        if (!acc[p.module]) acc[p.module] = [];
        acc[p.module].push(p);
        return acc;
    }, {} as Record<string, Permission[]>);

    if (loading && roles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-indigo-100">
                        <Lock size={12} /> RBAC Core
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
                        Roles & Permissions
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Define granular access control for your staff and users.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingRole({ name: '', description: '', permissions: [] });
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-100"
                >
                    <Plus size={20} /> Create New Role
                </button>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className="group bg-white dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800/50 p-8 hover:border-indigo-200 transition-all hover:shadow-2xl hover:shadow-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    setEditingRole(role);
                                    setIsModalOpen(true);
                                }}
                                className="p-3 bg-slate-50 dark:bg-[#0b0f19] text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            >
                                <Edit2 size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:bg-indigo-600 transition-colors">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{role.name}</h3>
                                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{role.permissions.length} Permissions Granted</p>
                            </div>
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                            {role.description || 'No description provided for this role.'}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {role.permissions.slice(0, 5).map(p => (
                                <span key={p} className="px-3 py-1.5 bg-slate-50 dark:bg-[#0b0f19] text-slate-500 dark:text-slate-400 rounded-lg text-xs font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800/50">
                                    {p.split(':')[1] || p}
                                </span>
                            ))}
                            {role.permissions.length > 5 && (
                                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-widest border border-indigo-100">
                                    +{role.permissions.length - 5} More
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Role Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900/40 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3.5rem] shadow-2xl dark:shadow-none flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-[#0b0f19]/50">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                                    {editingRole?.id ? 'Edit Role' : 'Create Role'}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Configure access for this collection of permissions.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-900">
                                <Lock size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Role Name</label>
                                    <input
                                        type="text"
                                        value={editingRole?.name}
                                        onChange={e => setEditingRole({ ...editingRole, name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#0b0f19] border-2 border-slate-50 dark:border-slate-800/50 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
                                        placeholder="e.g. Content Manager"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Description</label>
                                    <input
                                        type="text"
                                        value={editingRole?.description}
                                        onChange={e => setEditingRole({ ...editingRole, description: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#0b0f19] border-2 border-slate-50 dark:border-slate-800/50 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
                                        placeholder="Describe what this role does..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight border-b-2 border-slate-100 dark:border-slate-800/50 pb-4">Permission Checklist</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {Object.entries(groupedPermissions).map(([module, perms]) => (
                                        <div key={module} className="bg-slate-50 dark:bg-[#0b0f19]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50">
                                            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Key size={14} /> {module.replace('_', ' ')}
                                            </h4>
                                            <div className="space-y-3">
                                                {perms.map(p => (
                                                    <label
                                                        key={p.id}
                                                        className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${editingRole?.permissions?.includes(p.name)
                                                                ? 'bg-white dark:bg-slate-900/40 border-indigo-600 shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-100'
                                                                : 'bg-transparent border-transparent hover:bg-white/50'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={editingRole?.permissions?.includes(p.name)}
                                                            onChange={() => togglePermission(p.name)}
                                                        />
                                                        <div className="pt-0.5">
                                                            {editingRole?.permissions?.includes(p.name) ? (
                                                                <CheckCircle2 size={16} className="text-indigo-600" />
                                                            ) : (
                                                                <div className="w-4 h-4 rounded border-2 border-slate-200 dark:border-slate-700/50 mt-0.5"></div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className={`text-xs font-black uppercase tracking-widest ${editingRole?.permissions?.includes(p.name) ? 'text-indigo-600' : 'text-slate-700 dark:text-slate-200'}`}>
                                                                {p.name.split(':')[1]}
                                                            </p>
                                                            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight mt-0.5">{p.description}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-[#0b0f19]/50 flex justify-end gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 py-4 text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveRole}
                                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-100 flex items-center gap-3"
                            >
                                Save Changes <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRBAC;
