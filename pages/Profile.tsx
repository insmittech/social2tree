
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Calendar, UserCircle, Save, CheckCircle2, AlertCircle, Camera, Trash2, Github, Twitter, Instagram, Zap } from 'lucide-react';
import client from '../src/api/client';
import { UserProfile } from '../types';
import { useToast } from '../src/context/ToastContext';
import { useAuth } from '../src/context/AuthContext';
import { formatDate } from '../src/utils/dateUtils';

const Profile: React.FC = () => {
    const { showToast } = useToast();
    const { user: profile, updateUser, refreshProfile } = useAuth();
    const [saving, setSaving] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        displayName: '',
        bio: '',
        avatarUrl: ''
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                email: profile.email || '',
                displayName: profile.displayName || '',
                bio: profile.bio || '',
                avatarUrl: profile.avatarUrl || ''
            });
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await client.post('/auth/update_profile.php', formData);
            showToast("Profile updated successfully!", "success");
            // Update global profile state
            updateUser(formData);
        } catch (err: any) {
            console.error("Failed to update profile", err);
            showToast(err.response?.data?.message || "Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }
        setSaving(true);
        try {
            await client.post('/auth/update_profile.php', { password: passwordData.newPassword });
            showToast("Password updated successfully!", "success");
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            console.error("Failed to update password", err);
            showToast(err.response?.data?.message || "Failed to update password", "error");
        } finally {
            setSaving(false);
        }
    };


    if (!profile) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-700/50 m-8">
                <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Profile Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Please try logging in again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Account Settings</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-[11px] sm:text-sm uppercase tracking-wider mt-1">Manage your identity and workspace preferences</p>
                </div>
                <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 p-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
                    <div className="bg-indigo-50 dark:bg-teal-500/10 px-4 py-2 rounded-xl flex items-center gap-2">
                        <Zap size={16} className="text-indigo-600 dark:text-teal-400" />
                        <span className="text-xs font-black text-indigo-700 dark:text-teal-400 uppercase tracking-widest">{profile?.role === 'admin' ? 'Administrator' : profile.plan + ' Member'}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
                {/* Left Column: Summary & Preview */}
                <aside className="space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-[#0b121e] rounded-[2.5rem] shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800/50 overflow-hidden relative group">
                        <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
                                Active Profile
                            </div>
                        </div>
                        <div className="px-8 pb-10 -mt-16 relative">
                            <div className="relative inline-block">
                                <img
                                    src={profile?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-[2.5rem] border-4 border-white dark:border-[#0b121e] shadow-2xl object-cover transform transition-transform group-hover:scale-[1.02]"
                                />
                                <button className="absolute -bottom-2 -right-2 bg-indigo-600 p-3 rounded-2xl text-white shadow-xl dark:shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all">
                                    <Camera size={20} />
                                </button>
                            </div>

                            <div className="mt-6 space-y-1">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white truncate">
                                    {profile?.displayName}
                                </h2>
                                <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                    @{profile?.username} · <Calendar size={12} className="inline" /> Joined {formatDate(profile.createdAt, profile.timezone, profile.timeFormat, false)}
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Account Type</p>
                                    <p className="text-sm font-black text-indigo-600 dark:text-teal-400 uppercase tracking-tighter">{profile.plan}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Total Views</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{profile.views.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pro Badge Card */}
                    <div className="bg-slate-900 dark:bg-[#05080f] p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 dark:shadow-none text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-indigo-500/30 transition-colors" />
                        <div className="relative space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                                    <CheckCircle2 size={24} className="text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight leading-none">Professional<br />Verification</h3>
                            </div>
                            <p className="text-white/60 font-medium text-sm leading-relaxed">
                                Your account is verified and fully professional. You have access to all premium features.
                            </p>
                            <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-[0.98] shadow-lg">
                                View Public Profile
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Right Column: Edit Forms */}
                <div className="lg:col-span-2 space-y-8 sm:space-y-10">
                    {/* Basic Information */}
                    <section className="bg-white dark:bg-[#0b121e] rounded-[2.5rem] p-8 sm:p-12 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <UserCircle size={120} />
                        </div>

                        <div className="relative">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-teal-400 rounded-2xl flex items-center justify-center">
                                    <UserCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Profile Details</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Update your public identity and account info</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block">Full Name Display</label>
                                        <input
                                            type="text"
                                            placeholder="What should we call you?"
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-200 dark:border-slate-800/50 rounded-2xl px-6 py-4.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-teal-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block">Core Username</label>
                                        <div className="relative">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                                            <input
                                                type="text"
                                                placeholder="username"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-200 dark:border-slate-800/50 rounded-2xl pl-11 pr-6 py-4.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-teal-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block">Primary Contact Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-200 dark:border-slate-800/50 rounded-2xl pl-14 pr-6 py-4.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-teal-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block">Bio & Description</label>
                                    <textarea
                                        placeholder="Write a short bio about yourself..."
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-200 dark:border-slate-800/50 rounded-2xl px-6 py-4.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-teal-500 outline-none transition-all font-medium text-slate-600 dark:text-slate-300 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 px-10 py-5 rounded-2xl font-black text-sm hover:bg-slate-800 dark:hover:bg-teal-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 dark:shadow-none active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Save size={20} /> {saving ? 'Applying Updates...' : 'Save Profile Changes'}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className="bg-white dark:bg-[#0b121e] rounded-[2.5rem] p-8 sm:p-12 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
                                <Lock size={22} />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Account Security</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your password and authentication</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-8">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-200 dark:border-slate-800/50 rounded-2xl px-6 py-4.5 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest block">Verify Password</label>
                                    <input
                                        type="password"
                                        placeholder="Type it again"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-200 dark:border-slate-800/50 rounded-2xl px-6 py-4.5 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving || !passwordData.newPassword}
                                className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-amber-400 px-10 py-5 rounded-2xl font-black text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                            >
                                <Lock size={20} /> {saving ? 'Security Update...' : 'Update Password'}
                            </button>
                        </form>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-red-50/30 dark:bg-red-950/20 rounded-[2.5rem] p-8 sm:p-12 border border-dashed border-red-200 dark:border-red-900/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-red-900 dark:text-red-400">Advanced Account Actions</h3>
                                <p className="text-red-700/70 dark:text-red-400/60 text-sm font-medium">Permanently delete your account and all associated data.</p>
                            </div>
                            <button className="whitespace-nowrap bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 dark:shadow-none active:scale-95 flex items-center justify-center gap-2">
                                <Trash2 size={16} /> Delete Account
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
