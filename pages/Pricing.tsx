import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { Link } from 'react-router-dom';
import client from '../src/api/client';

interface Plan {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    description: string;
    features: string[];
    isPopular: boolean;
}

const PricingPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [isYearly, setIsYearly] = useState(true);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await client.get('/public/plans.php');
                setPlans(res.data.plans || []);
            } catch (err) {
                console.error('Failed to fetch plans', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans selection:bg-teal-500/30">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            <section className="pt-32 pb-20 px-4 text-center border-b border-teal-900/30 relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-teal-900/10 blur-[100px]"></div>
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Simple pricing.</h1>
                    <p className="text-lg text-slate-400 mb-10">Deploy OSINT capabilities at your own scale.</p>

                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold ${!isYearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-12 h-6 bg-slate-800 rounded-full p-1 relative transition-colors"
                        >
                            <div className={`w-4 h-4 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)] transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-bold ${isYearly ? 'text-white' : 'text-slate-500'}`}>Yearly <span className="text-teal-400 text-[10px] ml-1">-20%</span></span>
                    </div>
                </div>
            </section>

            <section className="py-24 px-4 max-w-6xl mx-auto">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => {
                            const price = isYearly
                                ? Math.round(plan.priceYearly / 12)
                                : plan.priceMonthly;

                            return (
                                <div key={plan.id} className={`bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border ${plan.isPopular ? 'border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.1)]' : 'border-slate-800'} flex flex-col relative overflow-hidden`}>
                                    {plan.isPopular && <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-500 to-cyan-600 text-white text-[10px] font-black uppercase tracking-widest py-1 px-8 translate-x-[30%] translate-y-[100%] rotate-45">Popular</div>}
                                    <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-black text-white">${price}</span>
                                        <span className="text-slate-500 text-sm">/mo</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">{plan.description}</p>

                                    <ul className="space-y-4 mb-8 flex-grow">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center">
                                                    <Check size={12} className="text-teal-400" />
                                                </div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={price === 0 ? "/register" : "/dashboard/plan"}
                                        className={`w-full block text-center py-3.5 rounded-xl font-bold tracking-wide text-sm transition-all duration-300 ${plan.isPopular
                                            ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]'
                                            : 'bg-slate-800 text-white hover:bg-slate-700'
                                            }`}
                                    >
                                        {price === 0 ? "Join Free" : (plan.name === 'Pro' ? "Go Pro" : "Scale Now")}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
            
            <Footer />
        </div>
    );
};

export default PricingPage;
