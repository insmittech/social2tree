
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, Calendar, UserCircle, Save, CheckCircle2, AlertCircle, Camera, Trash2, Github, Twitter, Instagram } from 'lucide-react';
import client from '../src/api/client';
import { UserProfile } from '../types';
import { useToast } from '../src/context/ToastContext';

const Profile: React.FC = () => {
    const { showToast } = useToast();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
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
        const fetchProfile = async () => {
            try {
                const res = await client.get('/auth/me.php');
                if (res.data.user) {
                    setProfile(res.data.user);
                    setFormData({
                        username: res.data.user.username || '',
                        email: res.data.user.email || '',
                        displayName: res.data.user.displayName || '',
                        bio: res.data.user.bio || '',
                        avatarUrl: res.data.user.avatarUrl || ''
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
                showToast("Failed to load profile data", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await client.post('/auth/update_profile.php', formData);
            showToast("Profile updated successfully!", "success");
            // Update local profile state
            if (profile) {
                setProfile({ ...profile, ...formData });
            }
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

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-32 lg:pb-12">
            <header className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your identity and security across the platform</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <img
                                src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${profile.username}&background=6366f1&color=fff`}
                                alt={profile.username}
                                className="w-32 h-32 rounded-full border-4 border-indigo-50 shadow-xl object-cover"
                            />
                            <label className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95">
                                <Camera size={18} />
                                <input type="file" className="hidden" />
                            </label>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">{formData.displayName || profile.username}</h2>
                        <p className="text-slate-500 font-medium text-sm">@{formData.username}</p>

                        <div className="mt-8 pt-8 border-t border-slate-50 w-full grid grid-cols-2 gap-4">
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
