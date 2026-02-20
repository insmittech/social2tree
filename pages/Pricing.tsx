import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
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
                                <div key={plan.id} className={`bg-white rounded-2xl p-8 border ${plan.isPopular ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200'} flex flex-col`}>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-bold text-slate-900">${price}</span>
                                        <span className="text-slate-400 text-sm">/mo</span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">{plan.description}</p>

                                    <ul className="space-y-4 mb-8 flex-grow">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                                <Check size={16} className="text-indigo-600" /> {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={price === 0 ? "/register" : "/dashboard/plan"}
                                        className={`w-full block text-center py-3 rounded-lg font-bold text-sm transition ${plan.isPopular
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-slate-900 text-white hover:bg-slate-800'
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
        </div>
    );
};

export default PricingPage;
