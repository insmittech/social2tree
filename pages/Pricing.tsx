import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PricingCard, { PlanData } from '../components/PricingCard';
import { Info, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FAQS = [
    {
        question: "How does billing work?",
        answer: "We offer both monthly and annual billing. Annual plans save you 20% compared to monthly billing."
    },
    {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your subscription from your dashboard. You will continue to have access to your plan features until the end of your current billing period."
    },
    {
        question: "What happens if I exceed my link limit?",
        answer: "On the Free plan, you can have up to 3 links. If you need more, you'll need to upgrade to a Pro or Agency plan which offers unlimited links and trees."
    },
    {
        question: "Do you offer custom themes for Agency plans?",
        answer: "Yes! Agency plans include priority support and early access to all premium themes and advanced CSS customization features."
    }
];

const PricingPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [isYearly, setIsYearly] = useState(true);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [plans, setPlans] = useState<PlanData[]>([]);
    const [loading, setLoading] = useState(true);

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

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const handleAction = (plan: PlanData) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/dashboard/plan');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-300 font-sans selection:bg-indigo-500/30 transition-colors duration-300">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] max-w-[800px] h-[400px] rounded-[100%] bg-indigo-900/10 blur-[120px]"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-widest uppercase border border-indigo-500/20 mb-8 transition-colors">
                        Simple & Transparent
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 transition-colors italic uppercase">
                        Scale your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-500">digital presence</span>
                    </h1>
                    <p className="text-lg md:text-xl font-bold text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto transition-colors uppercase tracking-tight">
                        Choose the perfect plan to grow your audience and unify your digital identity across all platforms.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 bg-white dark:bg-slate-900/50 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 w-max mx-auto backdrop-blur-md transition-colors shadow-xl">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${!isYearly ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all relative ${isYearly ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600'}`}
                        >
                            Yearly
                            <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full shadow-lg font-black">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-12 px-4 max-w-7xl mx-auto relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={40} className="animate-spin text-indigo-600" />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading premium plans...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 items-stretch">
                        {plans.map((plan) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                billingCycle={isYearly ? 'yearly' : 'monthly'}
                                isAuthenticated={isAuthenticated}
                                onAction={handleAction}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Enterprise Custom Text */}
            <section className="py-12 px-4 text-center">
                <div className="inline-flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/50 px-8 py-4 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs font-bold transition-colors shadow-sm">
                    <Info size={16} className="text-indigo-600 dark:text-indigo-500" />
                    Need custom white-label solutions? <button onClick={() => navigate('/contact')} className="text-slate-900 dark:text-white font-black hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest underline decoration-indigo-400 dark:decoration-indigo-600 underline-offset-8">Talk to our team.</button>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-4 max-w-3xl mx-auto border-t border-slate-200 dark:border-slate-800/50 transition-colors">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 transition-colors uppercase tracking-tighter italic">FAQ</h2>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 transition-colors">Everything you need to know about our plans.</p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className={`border transition-all duration-300 rounded-3xl overflow-hidden ${openFaqIndex === index ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-500/30 shadow-xl' : 'bg-white/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900'}`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full text-left px-8 py-6 flex items-center justify-between focus:outline-none"
                            >
                                <span className={`text-sm font-black uppercase tracking-tight transition-colors ${openFaqIndex === index ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`text-slate-400 transition-transform duration-500 ${openFaqIndex === index ? 'rotate-180 text-indigo-600' : 'rotate-0'}`}
                                />
                            </button>
                            <div
                                className={`px-8 overflow-hidden transition-all duration-500 ${openFaqIndex === index ? 'max-h-60 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PricingPage;

