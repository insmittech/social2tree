
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Calendar, UserCircle, Save, CheckCircle2, AlertCircle, Camera, Trash2, Github, Twitter, Instagram, Zap } from 'lucide-react';
import client from '../src/api/client';
import { UserProfile } from '../types';
import { useToast } from '../src/context/ToastContext';
import { useAuth } from '../src/context/AuthContext';

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
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 m-8">
                <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                <h2 className="text-xl font-black text-slate-900">Profile Not Found</h2>
                <p className="text-slate-500 font-medium">Please try logging in again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 pb-32 sm:pb-10">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">Account Settings</h1>
                    <p className="text-slate-400 font-bold text-[11px] sm:text-sm uppercase tracking-wider mt-1">Manage your identity and preferences</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Zap size={16} className="text-indigo-600" />
                    <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">{profile?.role === 'admin' ? 'Admin' : 'Pro Plan'}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 sm:gap-10">
                {/* Profile Card */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="h-24 sm:h-32 bg-gradient-to-r from-indigo-500 to-violet-500" />
                    <div className="px-5 sm:px-8 pb-8 -mt-12 sm:-mt-16">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                            <div className="relative inline-block">
                                <img
                                    src={profile?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"}
                                    alt="Avatar"
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] border-4 border-white shadow-xl object-cover"
                                />
                                <button className="absolute -bottom-2 -right-2 bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg hover:scale-110 transition-transform">
                                    <Camera size={18} />
                                </button>
                            </div>
                            <div className="flex-1 min-w-0 pt-2 sm:pt-0">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                                    {profile?.displayName}
                                </h2>
                                <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-widest mt-1">
                                    Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Join Date'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Plan</p>
                                <p className="text-indigo-600 font-black flex items-center justify-center gap-1">
                                    <Shield size={14} /> {profile.plan.toUpperCase()}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Joined</p>
                                <p className="text-slate-700 font-bold flex items-center justify-center gap-1">
                                    <Calendar size={14} /> {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-lg font-black">Professional Profile</h3>
                        </div>
                        <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-6">
                            Your global profile settings affect how your identity is displayed to visitors and other users.
                        </p>
                        <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                            View Public Bio Link
                        </button>
                    </div>
                </div>

                {/* Right Column: Edit Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <section className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <UserCircle size={22} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Profile Details</h3>
                                <p className="text-slate-500 text-sm font-medium">Update your public identity and bio</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2 block">Display Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2 block">Account Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="username"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-11 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-11 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2 block">Biography</label>
                                <textarea
                                    placeholder="Tell clinical about yourself..."
                                    rows={4}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                            >
                                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </section>

                    {/* Security Section */}
                    <section className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Security</h3>
                                <p className="text-slate-500 text-sm font-medium">Keep your account safe and updated</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2 block">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2 block">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Match new password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving || !passwordData.newPassword}
                                className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-100 active:scale-95 disabled:opacity-50"
                            >
                                <Lock size={18} /> Update Password
                            </button>
                        </form>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-red-50/30 rounded-[2.5rem] p-8 sm:p-10 border border-red-100">
                        <div className="flex items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-black text-red-900">Danger Zone</h3>
                                <p className="text-red-700 text-xs font-medium mt-1">Permanently delete your account and all associated pages.</p>
                            </div>
                            <button className="whitespace-nowrap bg-red-600 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95">
                                Delete Account
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
