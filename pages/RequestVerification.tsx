import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, Clock, AlertCircle, CheckCircle2, RotateCw, ArrowRight, UserCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RequestVerification: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const response = await axios.get('/api/verification/status.php');
            if (response.data) {
                setStatus(response.data.status);
                setRejectionReason(response.data.rejectionReason || '');
                if (response.data.details) setDetails(response.data.details);
            }
        } catch (err) {
            console.error('Failed to fetch verification status');
        } finally {
            setIsInitialLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/verification/request.php', { details: details || 'Requesting verification' });
            if (response.status === 201 || response.status === 200) {
                setStatus('pending');
                fetchStatus();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request.');
        } finally {
            setLoading(false);
        }
    };

    if (isInitialLoading || !user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    const isAdmin = user.role === 'admin';

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16 font-sans selection:bg-indigo-500/30">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 sm:mb-20">
                <div className="relative">
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-600 dark:bg-teal-500 rounded-full blur-sm opacity-50 hidden md:block" />
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-3 uppercase italic leading-none">
                        Verification <span className="text-indigo-600 dark:text-teal-400">Portal</span>
                    </h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <span className="w-8 h-px bg-slate-200 dark:bg-slate-800" /> Professional Identity System
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-[#0b121e] p-2 pl-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none hover:shadow-2xl transition-all group">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Trusted by over</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">12,000 Verified Users</span>
                    </div>
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-1 group-hover:rotate-3 shadow-md">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-900 bg-indigo-600 dark:bg-teal-500 flex items-center justify-center text-[10px] font-black text-white dark:text-slate-950 shadow-md group-hover:-translate-y-1 group-hover:-rotate-3 transition-transform">
                            +12k
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Status Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 dark:from-teal-500/5 dark:to-emerald-500/5 rounded-[3rem] blur-2xl opacity-50 -z-10" />

                        <div className="bg-white dark:bg-[#0b121e] rounded-[3rem] p-10 md:p-14 border border-slate-100 dark:border-slate-800 shadow-2xl dark:shadow-none transition-all relative overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                                {/* Icon Container */}
                                <div className="relative shrink-0">
                                    <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center relative transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 shadow-2xl
                                        ${status === 'pending' ? 'bg-emerald-50 dark:bg-emerald-500/10' :
                                            isAdmin || status === 'approved' ? 'bg-indigo-50 dark:bg-indigo-500/10' :
                                                status === 'none' ? 'bg-slate-50 dark:bg-slate-800/50' :
                                                    'bg-rose-50 dark:bg-rose-500/10'}`}>

                                        {status === 'pending' && <RotateCw className="text-emerald-500 w-12 h-12 animate-spin-slow" />}
                                        {isAdmin || status === 'approved' ? <ShieldCheck className="text-indigo-600 dark:text-teal-400 w-12 h-12" /> :
                                            status === 'none' ? <UserCheck className="text-slate-400 dark:text-slate-500 w-12 h-12" /> :
                                                <AlertCircle className="text-rose-500 w-12 h-12" />}

                                        {/* Animated pulse rings */}
                                        <div className="absolute inset-0 rounded-[2.5rem] bg-current opacity-10 animate-ping shadow-inner" style={{ animationDuration: '3s' }} />
                                    </div>
                                </div>

                                {/* Status Text */}
                                <div className="text-center md:text-left flex-1">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic leading-tight">
                                            {isAdmin ? 'System Master' :
                                                status === 'none' ? 'Identity Verification' :
                                                    status === 'pending' ? 'Under Review' :
                                                        status === 'approved' ? 'Verified Profile' :
                                                            'Action Required'}
                                        </h2>
                                        {status !== 'none' && (
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm
                                                ${status === 'pending' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                                                    isAdmin || status === 'approved' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20' :
                                                        'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20'}`}>
                                                {status}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-base font-bold text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
                                        {isAdmin ? "You have administrative verification enabled by default. Your profile carries maximum trust across the entire ecosystem." :
                                            status === 'none' ? "Start your journey to becoming a trusted creator. Our verification process confirms your authenticity and builds community confidence." :
                                                status === 'pending' ? "Your application is in the queue. Our security team is carefully reviewing your credentials. This typically takes 24-48 hours." :
                                                    status === 'approved' ? "Congratulations! Your profile is officially verified. The iconic blue badge is now active on all your public link pages." :
                                                        `Rejected: ${rejectionReason || 'Your submission did not meet our verification criteria at this time.'}`}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                        {!isAdmin && status === 'none' && (
                                            <button
                                                onClick={() => handleSubmit()}
                                                disabled={loading}
                                                className="px-10 py-5 bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-900 dark:hover:bg-teal-400 transition-all shadow-2xl shadow-indigo-100 dark:shadow-teal-500/20 flex items-center gap-3 group/btn"
                                            >
                                                {loading ? 'Processing...' : 'Submit Credentials'}
                                                {!loading && <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />}
                                            </button>
                                        )}

                                        {!isAdmin && status === 'rejected' && (
                                            <button
                                                onClick={() => setStatus('none')}
                                                className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl"
                                            >
                                                Restart Application
                                            </button>
                                        )}

                                        <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 dark:hover:text-teal-400 transition-colors font-black uppercase tracking-widest text-[10px]">
                                            <Info size={14} /> Learn more about policies
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 dark:bg-emerald-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                        </div>
                    </div>

                    {/* Features/Trust Section */}
                    <div className="bg-slate-900 dark:bg-[#05080f] rounded-[3rem] p-10 md:p-16 text-white overflow-hidden relative group">
                        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={32} className="text-teal-400" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                                    Premium <br />Trust Factor
                                </h2>
                                <p className="text-slate-400 font-bold leading-relaxed mb-8 max-w-sm">
                                    Our verification system is more than just a badge; it's a commitment to transparency and professional excellence.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: "Universal Recognition", desc: "Instantly recognizable checkmark icon" },
                                    { title: "Priority Support", desc: "Verified users get faster resolution times" },
                                    { title: "Impersonation Guard", desc: "Proactive monitoring of fake accounts" },
                                    { title: "Premium Visuals", desc: "Elegant styling for your digital identity" }
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-widest">{feature.title}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Background Mesh */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(20,184,166,0.15),transparent)] pointer-events-none" />
                        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white/5 to-transparent" />
                        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-white/5 to-transparent" />
                    </div>
                </div>

                {/* Sidebar area: Requirements & Plans */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Instant Access Widget */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-teal-500 dark:to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Verified Pro</span>
                                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                                    Recommended
                                </div>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 leading-none italic">
                                Instant <br />Verification
                            </h3>
                            <p className="text-xs font-bold text-white/80 leading-relaxed mb-10">
                                Skip the queue! Get automatically verified when you upgrade to a Professional or VIP plan.
                            </p>
                            <button
                                onClick={() => navigate('/dashboard/plan')}
                                className="w-full py-4 bg-white text-indigo-700 dark:text-emerald-800 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                            >
                                Upgrade Now <ArrowRight size={14} />
                            </button>
                        </div>

                        {/* Abstract shapes */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    </div>

                    {/* Manual Path Widget */}
                    <div className="bg-white dark:bg-[#0b121e] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none group">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2">
                            <Clock size={14} className="text-slate-300" /> Standard Process
                        </h4>
                        <div className="space-y-6">
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10" />
                                <div className="absolute left-[7px] top-5 w-[2px] h-full bg-slate-100 dark:bg-slate-800" />
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">Submit Request</h5>
                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-normal">Initial application submission</p>
                            </div>

                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10" />
                                <div className="absolute left-[7px] top-5 w-[2px] h-full bg-slate-100 dark:bg-slate-800" />
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Curation & Review</h5>
                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-normal">Our team verifies your profile authenticity</p>
                            </div>

                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10" />
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Final Approval</h5>
                                <p className="text-[10px] font-bold text-slate-400 uppercase leading-normal">Verification badge is applied</p>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 italic uppercase leading-relaxed text-center">
                                * Standard review takes 3 to 5 business days for non-premium accounts.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestVerification;
