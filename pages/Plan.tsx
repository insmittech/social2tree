import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Check, Star, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

interface DbPlan {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    description: string;
    features: string[];
    isPopular: boolean;
    sortOrder: number;
}

const Plan: React.FC = () => {
    const { user: profile } = useAuth();
    const [plans, setPlans] = useState<DbPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await axios.get('/api/public/plans.php');
                setPlans(res.data.plans || []);
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
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    const currentPlan = (profile.plan || 'free').toLowerCase();

    // Determine the plan rank for showing "upgrade" vs "active" vs "downgrade"
    const getPlanRank = (planName: string) => {
        const order = plans.map((p) => p.name.toLowerCase());
        return order.indexOf(planName.toLowerCase());
    };

    const currentRank = getPlanRank(currentPlan);

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="mb-10">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic mb-2">Your Plan</h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Manage your subscription & upgrade for more features</p>
            </div>

            {/* Current Plan Badge */}
            <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 mb-8 flex flex-wrap items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <CreditCard className="text-indigo-600 w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Current Plan</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white capitalize">{currentPlan}</p>
                </div>
                <div className="ml-auto">
                    <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                        <Zap size={12} /> Active
                    </span>
                </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-100 inline-flex p-1 rounded-2xl gap-1">
                    <button
                        onClick={() => setBilling('monthly')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billing === 'monthly' ? 'bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling('yearly')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billing === 'yearly' ? 'bg-white dark:bg-slate-900/40 text-slate-900 dark:text-white shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Yearly
                        <span className="ml-2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">Save 20%</span>
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            {plans.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-bold">No plans available.</div>
            ) : (
                <div className={`grid gap-6 ${plans.length === 2 ? 'md:grid-cols-2' : plans.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
                    {plans.map((plan) => {
                        const planRank = getPlanRank(plan.name);
                        const isCurrentPlan = plan.name.toLowerCase() === currentPlan;
                        const isUpgrade = planRank > currentRank;
                        const price = billing === 'monthly' ? plan.priceMonthly : plan.priceYearly;

                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-[2rem] p-8 border-2 transition-all flex flex-col
                                    ${isCurrentPlan
                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xl dark:shadow-none shadow-indigo-200'
                                        : plan.isPopular && isUpgrade
                                            ? 'border-indigo-200 bg-white dark:bg-slate-900/40 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
                                            : 'border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/40 shadow-sm dark:shadow-none'
                                    }`}
                            >
                                {plan.isPopular && isUpgrade && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-amber-400 text-amber-900 font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1">
                                            <Star size={10} fill="currentColor" /> Popular
                                        </span>
                                    </div>
                                )}

                                {isCurrentPlan && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-white dark:bg-slate-900/40 text-indigo-600 border border-indigo-100 font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                            Your Plan
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h2 className={`text-2xl font-black uppercase tracking-tight mb-1 ${isCurrentPlan ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                        {plan.name}
                                    </h2>
                                    <p className={`text-sm font-medium ${isCurrentPlan ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <span className={`text-5xl font-black ${isCurrentPlan ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                        ${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}
                                    </span>
                                    <span className={`font-bold ml-2 text-sm ${isCurrentPlan ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                        / {billing === 'monthly' ? 'month' : 'year'}
                                    </span>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {(plan.features || []).map((feature, i) => (
                                        <li key={i} className={`flex items-start gap-3 text-sm font-medium ${isCurrentPlan ? 'text-indigo-50' : 'text-slate-600 dark:text-slate-300'}`}>
                                            <div className={`mt-0.5 p-1 rounded-full flex-shrink-0 ${isCurrentPlan ? 'bg-white dark:bg-slate-900/40/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                                                <Check size={12} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div>
                                    {isCurrentPlan ? (
                                        <div className="w-full py-4 bg-white dark:bg-slate-900/40/20 text-white text-center rounded-2xl text-xs font-black uppercase tracking-widest">
                                            Active Plan
                                        </div>
                                    ) : isUpgrade ? (
                                        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-100 flex items-center justify-center gap-2 group">
                                            Upgrade to {plan.name}
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ) : (
                                        <button className="w-full py-4 bg-slate-100 text-slate-500 dark:text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                            Downgrade
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Plan;
