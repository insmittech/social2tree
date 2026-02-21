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
    const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected' | 'more_info'>('none');
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

    const isPremiumPlan = user.plan === 'pro' || user.plan === 'vip' || user.plan === 'business' || user.plan === 'agency';

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 uppercase italic">
                        Verification
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 pl-1">
                        Step-by-step onboarding guide
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-[#0b121e] px-5 py-2.5 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden transition-colors">
                                <img src={`https://i.pravatar.cc/100?u=v${i}`} alt="User" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 dark:bg-teal-500 flex items-center justify-center text-[8px] font-black text-white dark:text-slate-950 transition-colors">
                            +12k
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors">Join 12,000+ verified users</span>
                </div>
            </div>

            {/* Status Section */}
            <div className="mb-16">
                <div className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] p-10 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none transition-all hover:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center relative transition-colors
                            ${status === 'pending' ? 'bg-emerald-50 dark:bg-emerald-500/10' :
                                status === 'none' ? 'bg-indigo-50 dark:bg-teal-500/10' :
                                    status === 'approved' ? 'bg-indigo-50 dark:bg-teal-500/10' :
                                        'bg-rose-50 dark:bg-rose-500/10'}`}>
                            {status === 'pending' && <RotateCw className="text-emerald-500 w-10 h-10 animate-spin-slow" />}
                            {status === 'none' && <UserCheck className="text-indigo-600 dark:text-teal-400 w-10 h-10" />}
                            {status === 'approved' && <ShieldCheck className="text-indigo-600 dark:text-teal-400 w-10 h-10" />}
                            {status === 'rejected' && <AlertCircle className="text-rose-500 w-10 h-10" />}

                            <div className="absolute inset-0 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-full animate-spin-reverse opacity-50" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2 italic">
                                {status === 'none' ? 'Start Verification' :
                                    status === 'pending' ? 'Request Pending' :
                                        status === 'approved' ? 'You are Verified!' :
                                            'Needs Attention'}
                            </h2>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                                {status === 'none' ? "You're just a few steps away from getting your official checkmark. Choose your path below." :
                                    status === 'pending' ? "We've received your request! Our team will review your profile shortly. Keep an eye on your dashboard for the badge." :
                                        status === 'approved' ? "Your account is officially verified. The checkmark is now visible on your public bio-link pages." :
                                            `Your request encountered an issue: ${rejectionReason || 'Please review your details and try again.'}`}
                            </p>
                        </div>
                    </div>

                    {status === 'none' ? (
                        <button
                            onClick={() => handleSubmit()}
                            disabled={loading}
                            className="px-10 py-5 bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 dark:hover:bg-teal-400 transition-all shadow-xl shadow-indigo-100 dark:shadow-teal-500/20 flex items-center gap-3 group"
                        >
                            {loading ? 'Processing...' : 'Submit Request'}
                            {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    ) : (
                        <button
                            onClick={() => setStatus('none')}
                            className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            Edit Details
                        </button>
                    )}
                </div>
            </div>

            {/* Verification Path Title */}
            <div className="flex items-center gap-6 mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 flex-shrink-0 transition-colors">Your Verification Path</span>
                <div className="h-px bg-slate-100 dark:bg-slate-800/50 flex-grow transition-colors" />
            </div>

            {/* Why Get Verified Section */}
            <div className="mb-16">
                <div className="bg-indigo-600 dark:bg-teal-500 rounded-[3rem] p-12 md:p-16 text-white dark:text-slate-950 relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-teal-500/20 transition-colors">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-md">
                                <ShieldCheck size={32} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-8 max-w-sm leading-[0.9]">
                                Why get <br />Verified?
                            </h2>
                            <p className="text-indigo-100 font-bold max-w-sm leading-relaxed mb-6">
                                Establish your professional presence and stand out in the community with our official checkmark system.
                            </p>
                            <div className="w-1 h-32 bg-white/20 rounded-full md:block hidden" />
                        </div>

                        <div className="flex-1">
                            <ul className="space-y-6">
                                {[
                                    "Enhanced trust with your audience",
                                    "Official recognition of your profile",
                                    "Protection against impersonation",
                                    "Premium aesthetic for your bio-link"
                                ].map((text, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-400 group-hover:text-white transition-all duration-300">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="text-sm md:text-base font-black uppercase tracking-tight text-white/90">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Connector Line */}
            <div className="flex justify-center mb-16">
                <div className="w-px h-24 bg-slate-100 dark:bg-slate-800/50 pl-4 border-l border-slate-100 dark:border-slate-800/50 transition-colors" />
            </div>

            {/* Advantages Section */}
            <div className="bg-white dark:bg-slate-900/40 rounded-[3rem] p-12 md:p-20 border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                <CheckCircle2 size={16} fill="currentColor" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Step 2</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-8 leading-none">
                            Unlock your <br />Advantages
                        </h2>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                            Compare our verification tiers and choose the path that best fits your needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Instant Verification Card */}
                        <div className="bg-indigo-50/50 dark:bg-teal-500/5 rounded-[2.5rem] p-8 border-2 border-indigo-600/40 dark:border-teal-500/30 relative group hover:border-indigo-600 dark:hover:border-teal-500 transition-all duration-500">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-teal-400 transition-colors">Pro & VIP Plans</span>
                                <span className="bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse transition-colors">Fastest</span>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-3 transition-colors">Instant Verification</h3>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed mb-10 transition-colors">
                                Verified checkmark is granted automatically upon subscription upgrade.
                            </p>
                            <button
                                onClick={() => navigate('/dashboard/plan')}
                                className="text-indigo-600 dark:text-teal-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
                            >
                                Upgrade Now <ArrowRight size={14} />
                            </button>
                        </div>

                        {/* Manual Review Card */}
                        <div className="bg-slate-50 dark:bg-slate-950/20 rounded-[2.5rem] p-8 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-500">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Free Plan</span>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-3">Manual Review</h3>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                                Standard submission required. Review typically takes 3-5 business days.
                            </p>
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                {isPremiumPlan ? 'Alternative Path' : 'Currently Active'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestVerification;
