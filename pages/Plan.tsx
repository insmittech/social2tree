import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Zap, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import PricingCard, { PlanData } from '../components/PricingCard';

const Plan: React.FC = () => {
    const { user: profile } = useAuth();
    const [plans, setPlans] = useState<PlanData[]>([]);
    const [loading, setLoading] = useState(true);
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await axios.get('/api/public/plans.php');
                const sortedPlans = (res.data.plans || []).sort((a: PlanData, b: PlanData) => (a as any).sortOrder - (b as any).sortOrder);
                setPlans(sortedPlans);
            } catch (err) {
                console.error('Failed to fetch plans', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (!profile || loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-indigo-600" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing your account status...</p>
            </div>
        );
    }

    const currentPlan = (profile.plan || 'free').toLowerCase();

    const handlePlanAction = (plan: PlanData) => {
        // Implementation for checkout/upgrade flow would go here
        console.log('Selected plan:', plan.name);
        alert(`Upgrade to ${plan.name} is coming soon! Stay tuned for full payment integration.`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 dark:bg-teal-500/10 text-indigo-600 dark:text-teal-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-100 dark:border-teal-500/20 transition-colors">
                        Subscription Management
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight italic uppercase transition-colors">
                        Empower your <span className="text-indigo-600 dark:text-teal-400 transition-colors">Growth</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2 transition-colors">
                        Unlock premium features and scale your digital empire.
                    </p>
                </div>
            </header>

            {/* Current Plan Overview */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#0b121e] rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-xl dark:shadow-none p-8 h-full flex flex-col justify-between transition-colors">
                        <div>
                            <div className="w-16 h-16 bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-teal-500/20 mb-6 transition-all">
                                <CreditCard size={32} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 transition-colors">Current Active Tier</h2>
                            <p className="text-4xl font-black text-slate-900 dark:text-white capitalize italic transition-colors">{currentPlan}</p>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">System Standing: Optimal</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Renewal Date: March 20, 2026</span>
                                </div>
                            </div>
                        </div>

                        <button className="mt-10 flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all group">
                            View Billing History <ArrowRight size={14} className="group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden h-full flex flex-col justify-center">
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
                                <Zap size={12} fill="currentColor" /> Exclusive Offer
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black italic uppercase leading-tight tracking-tighter mb-4">
                                Upgrade to <span className="text-indigo-200">AGENCY</span><br />
                                and Save Big
                            </h2>
                            <p className="text-indigo-100 font-bold max-w-lg mb-8 text-sm md:text-base">
                                Switch to annual billing today and save up to 20% on all premium plans. Get unlimited trees, advanced analytics, and custom domains.
                            </p>
                            <button
                                onClick={() => setBilling('yearly')}
                                className="bg-white dark:bg-teal-500 text-indigo-600 dark:text-slate-950 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-900/20 dark:shadow-teal-500/20"
                            >
                                Switch to Yearly
                            </button>
                        </div>

                        {/* Decorative Background Circles */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl" />
                    </div>
                </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex flex-col items-center mb-12">
                <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-3xl inline-flex gap-1 shadow-inner group">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${billing === 'monthly' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling('yearly')}
                        className={`px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${billing === 'yearly' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Yearly
                        <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full shadow-lg font-black group-hover:scale-110 transition-transform">
                            -20%
                        </span>
                    </button>
                </div>
            </div>

            {/* Plans Comparison */}
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
                {plans.map((plan) => (
                    <PricingCard
                        key={plan.id}
                        plan={plan}
                        billingCycle={billing}
                        isCurrent={plan.name.toLowerCase() === currentPlan}
                        onAction={handlePlanAction}
                    />
                ))}
            </div>
        </div>
    );
};

export default Plan;
