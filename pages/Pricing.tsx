import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Check } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [isYearly, setIsYearly] = useState(true);

    const plans = [
        {
            name: "Starter",
            price: "0",
            desc: "For individuals starting out.",
            features: ["1 Bio Tree", "3 Links", "Basic Stats"],
            cta: "Join Free",
            popular: false
        },
        {
            name: "Pro",
            price: isYearly ? "12" : "15",
            desc: "For serious creators.",
            features: ["Unlimited Trees", "Unlimited Links", "Advanced Stats", "Custom Domain"],
            cta: "Go Pro",
            popular: true
        },
        {
            name: "Agency",
            price: isYearly ? "49" : "59",
            desc: "For teams and brands.",
            features: ["Everything in Pro", "Team Access", "API Access", "Priority Support"],
            cta: "Scale Now",
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            <section className="py-20 px-4 text-center bg-white border-b border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Simple pricing.</h1>
                    <p className="text-lg text-slate-500 mb-10">Choose the plan that fits your growth.</p>

                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-12 h-6 bg-slate-200 rounded-full p-1 relative transition-colors"
                        >
                            <div className={`w-4 h-4 bg-indigo-600 rounded-full shadow transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly <span className="text-indigo-600 text-[10px] ml-1">-20%</span></span>
                    </div>
                </div>
            </section>

            <section className="py-24 px-4 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={i} className={`bg-white rounded-2xl p-8 border ${plan.popular ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200'} flex flex-col`}>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                                <span className="text-slate-400 text-sm">/mo</span>
                            </div>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">{plan.desc}</p>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                        <Check size={16} className="text-indigo-600" /> {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={plan.price === "0" ? "/register" : "/dashboard/plan"}
                                className={`w-full block text-center py-3 rounded-lg font-bold text-sm transition ${plan.popular
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
