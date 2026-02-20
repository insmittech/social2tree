import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Check, Zap, Star, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [isYearly, setIsYearly] = useState(true);

    const plans = [
        {
            name: "Starter",
            price: "0",
            desc: "For individual creators starting their journey.",
            features: ["1 Bio Tree", "3 Links", "Basic Analytics", "Standard Themes", "Social Icons"],
            cta: "Join Free",
            color: "slate",
            pro: false
        },
        {
            name: "Pro",
            price: isYearly ? "12" : "15",
            desc: "Power your personal brand with pro tools.",
            features: ["Unlimited Bio Trees", "Unlimited Links", "Advanced Analytics", "Premium Themes", "Custom Domains", "Link Scheduling", "No Ads"],
            cta: "Go Pro",
            color: "indigo",
            pro: true,
            popular: true
        },
        {
            name: "Agency",
            price: isYearly ? "49" : "59",
            desc: "Manage multiple brands and teams.",
            features: ["Everything in Pro", "Team Collaboration", "API Access", "Priority Support", "White-labeling", "Bulk Link Management"],
            cta: "Scale Now",
            color: "slate",
            pro: true
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            <section className="py-24 px-4 text-center bg-white border-b border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 italic">Choose your <span className="text-indigo-600 not-italic">power.</span></h1>
                    <p className="text-xl text-slate-500 font-bold mb-12">Flexible plans for creators at every scale.</p>

                    <div className="flex items-center justify-center gap-4 mb-8">
                        <span className={`text-sm font-black ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-16 h-8 bg-slate-200 rounded-full p-1 relative transition-colors"
                        >
                            <div className={`w-6 h-6 bg-indigo-600 rounded-full shadow-lg transition-transform ${isYearly ? 'translate-x-8' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-black ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly (Save 20%)</span>
                    </div>
                </div>
            </section>

            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={i} className={`bg-white rounded-[3rem] p-1 shadow-sm border ${plan.popular ? 'border-indigo-600 scale-105' : 'border-slate-100'} relative overflow-hidden flex flex-col`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-10 flex-grow">
                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">${plan.price}</span>
                                    <span className="text-slate-400 font-bold">/mo</span>
                                </div>
                                <p className="text-slate-500 font-bold text-sm mb-10 leading-relaxed">{plan.desc}</p>

                                <ul className="space-y-4 mb-10">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                            <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-10 pt-0">
                                <Link
                                    to={plan.price === "0" ? "/register" : "/dashboard/plan"}
                                    className={`w-full block text-center py-5 rounded-2xl font-black text-sm transition-all shadow-xl ${plan.popular
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                            : 'bg-slate-900 text-white hover:bg-slate-800'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-24 border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-12">Secure & Professional</h4>
                    <div className="flex flex-wrap justify-center gap-12 items-center grayscale opacity-50">
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-900"><Shield className="text-indigo-600" /> Stripe</div>
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-900"><Star className="text-amber-500" /> Top Rated</div>
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-900"><Zap className="text-indigo-600" /> Fast Payouts</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
