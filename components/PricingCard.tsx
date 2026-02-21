import React from 'react';
import { Check, Star, ArrowRight, Zap, Target, TrendingUp, Shield } from 'lucide-react';

export interface PlanData {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    description: string;
    features: string[];
    isPopular: boolean;
}

interface PricingCardProps {
    plan: PlanData;
    billingCycle: 'monthly' | 'yearly';
    isCurrent?: boolean;
    isAuthenticated?: boolean;
    onAction?: (plan: PlanData) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
    plan,
    billingCycle,
    isCurrent,
    isAuthenticated,
    onAction
}) => {
    const isFree = plan.name.toLowerCase() === 'free';
    const isPro = plan.name.toLowerCase() === 'pro';
    const isAgency = plan.name.toLowerCase() === 'agency';
    const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
    const billedLabel = billingCycle === 'monthly' ? '/mo' : '/yr';

    return (
        <div
            className={`group relative rounded-[2.5rem] p-8 border-2 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full
                ${isCurrent
                    ? 'border-indigo-600 dark:border-teal-500 bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 shadow-[0_20px_50px_rgba(79,70,229,0.3)] dark:shadow-teal-500/20'
                    : plan.isPopular
                        ? 'border-indigo-100 bg-white dark:bg-[#0b121e] shadow-xl dark:shadow-none hover:shadow-2xl dark:hover:border-indigo-500/50'
                        : 'border-slate-50 dark:border-slate-800/50 bg-white/50 dark:bg-[#0b0f19]/50 backdrop-blur-sm'
                }`}
        >
            {/* Header Icons & Popular Label */}
            <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500
                    ${isCurrent
                        ? 'bg-white/20 text-white dark:text-slate-900'
                        : isFree
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                            : isPro
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-teal-400'
                                : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600'
                    }`}
                >
                    {isFree && <Target size={28} />}
                    {isPro && <Zap size={28} fill={plan.isPopular ? "currentColor" : "none"} />}
                    {isAgency && <Shield size={28} />}
                </div>

                {plan.isPopular && !isCurrent && (
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none animate-pulse-ring">
                        Recommended
                    </span>
                )}
                {isCurrent && (
                    <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md">
                        Your Current Plan
                    </span>
                )}
            </div>

            {/* Title & Description */}
            <div className="mb-6">
                <h3 className={`text-2xl font-black uppercase tracking-tight mb-2 ${isCurrent ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                    {plan.name}
                </h3>
                <p className={`text-sm font-bold leading-relaxed ${isCurrent ? 'text-indigo-50 dark:text-slate-800' : 'text-slate-400 dark:text-slate-500'}`}>
                    {plan.description}
                </p>
            </div>

            {/* Pricing */}
            <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black tracking-tighter ${isCurrent ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                        ${Math.floor(price)}
                    </span>
                    <span className={`text-lg font-black ${isCurrent ? 'text-indigo-100 dark:text-slate-800' : 'text-slate-400 dark:text-slate-500'}`}>
                        {price % 1 !== 0 && `.${(price % 1).toFixed(2).split('.')[1]}`}
                        {billedLabel}
                    </span>
                </div>
                {billingCycle === 'yearly' && price > 0 && (
                    <p className={`text-[10px] font-black uppercase mt-2 tracking-widest ${isCurrent ? 'text-indigo-200 dark:text-slate-800' : 'text-emerald-500'}`}>
                        Billed annually (Save 20%)
                    </p>
                )}
            </div>

            {/* Features List */}
            <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4">
                        <div className={`mt-0.5 p-1 rounded-lg flex-shrink-0 transition-colors
                            ${isCurrent
                                ? 'bg-white/20 text-white dark:text-slate-900'
                                : 'bg-emerald-500/10 text-emerald-500'
                            }`}
                        >
                            <Check size={14} strokeWidth={3} />
                        </div>
                        <span className={`text-sm font-bold ${isCurrent ? 'text-indigo-50 dark:text-slate-800' : 'text-slate-600 dark:text-slate-300'}`}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <button
                onClick={() => onAction?.(plan)}
                disabled={isCurrent}
                className={`group/btn w-full py-4 rounded-[1.25rem] text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden relative
                    ${isCurrent
                        ? 'bg-white/20 text-white dark:text-slate-900 cursor-default'
                        : isPro || isAgency
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
            >
                <span className="relative z-10">
                    {isCurrent ? 'Current Plan' : isFree ? 'Get Started' : `Upgrade to ${plan.name}`}
                </span>
                {!isCurrent && <ArrowRight size={14} className="relative z-10 transition-transform group-hover/btn:translate-x-1" />}

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            </button>

            {/* Background Decorative Element */}
            {!isCurrent && plan.isPopular && (
                <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                    <TrendingUp size={200} className="text-indigo-600" />
                </div>
            )}
        </div>
    );
};

export default PricingCard;
