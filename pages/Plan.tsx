
import React, { useState, useEffect } from 'react';
import { UserProfile, PlanType } from '../types';
import client from '../src/api/client';
import { CreditCard, Check, Star } from 'lucide-react';

const Plan: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('/auth/me.php');
                if (res.data.user) {
                    setProfile(res.data.user);
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    const currentPlan = profile.plan;

    const planHierarchy: Record<PlanType, number> = {
        'free': 0,
        'pro': 1,
        'business': 2
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <CreditCard size={32} className="text-indigo-600" />
                    Manage Plan
                </h1>
                <p className="text-slate-500 font-medium mt-1">Choose the plan that's right for you</p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Free</h2>
                            <p className="text-slate-500 font-medium text-sm">Best for personal use</p>
                        </div>
                        {currentPlan === 'free' && (
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active Plan</span>
                        )}
                    </div>
                    <div className="mb-8">
                        <span className="text-4xl font-black text-slate-900">$0</span>
                        <span className="text-slate-400 font-bold ml-2">/ month</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {[
                            'Up to 3 bio links',
                            'Basic analytics (7 days)',
                            'Standard themes',
                            'S2T branding'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                                <div className="p-1 bg-emerald-50 text-emerald-600 rounded-full">
                                    <Check size={14} />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pro Plan */}
                <div className="bg-indigo-600 p-8 rounded-3xl border-2 border-indigo-500 shadow-xl shadow-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 font-black text-[10px] uppercase tracking-[0.2em] px-8 py-2 rotate-45 translate-x-10 translate-y-3">
                        Popular
                    </div>
                    <div className="flex justify-between items-start mb-6 text-white">
                        <div>
                            <h2 className="text-2xl font-black">Pro</h2>
                            <p className="text-indigo-100 font-medium text-sm">For creators & businesses</p>
                        </div>
                        <div className="p-2 bg-white/20 rounded-xl text-white">
                            <Star size={20} />
                        </div>
                    </div>
                    <div className="mb-8 text-white">
                        <span className="text-4xl font-black">$12</span>
                        <span className="text-indigo-100 font-bold ml-2">/ month</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {[
                            'Unlimited bio links',
                            'Advanced analytics (Lifetime)',
                            'Premium themes & colors',
                            'Custom domains',
                            'Priority support',
                            'Remove S2T branding'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-indigo-50 font-medium text-sm">
                                <div className="p-1 bg-white/20 text-white rounded-full">
                                    <Check size={14} />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    {currentPlan === 'free' ? (
                        <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-700/20">
                            Upgrade Now
                        </button>
                    ) : (
                        <div className="w-full bg-white/20 backdrop-blur-md text-white py-4 rounded-2xl font-black text-center">
                            Your Active Plan
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Plan;
