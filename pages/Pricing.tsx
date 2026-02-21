import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Info, ChevronDown } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { Link } from 'react-router-dom';

interface Plan {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    description: string;
    features: string[];
    isPopular: boolean;
    ctaText: string;
}

const PRICING_PLANS: Plan[] = [
    {
        id: 'starter',
        name: 'Starter',
        priceMonthly: 199,
        priceYearly: 1990,
        description: 'Essential OSINT tools for independent researchers and small teams.',
        isPopular: false,
        ctaText: 'Get Started',
        features: [
            'Basic Surface Web Crawling',
            'Up to 100 Search Queries/day',
            'Standard Entity Extraction',
            'Email Support',
            '1 API Key'
        ]
    },
    {
        id: 'professional',
        name: 'Professional',
        priceMonthly: 499,
        priceYearly: 4990,
        description: 'Advanced capabilities for dedicated intelligence analysts.',
        isPopular: true,
        ctaText: 'Go Pro',
        features: [
            'Deep & Dark Web Access',
            'Unlimited Search Queries',
            'Advanced AI Structuring',
            'Network Graph Visualization',
            'Priority 24/7 Support',
            '5 API Keys & Teams Integration'
        ]
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        priceMonthly: 2499,
        priceYearly: 24990,
        description: 'Custom deployments and unlimited scale for agencies.',
        isPopular: false,
        ctaText: 'Contact Sales',
        features: [
            'Custom Data Source Integration',
            'On-Premise Deployment Option',
            'Real-time Threat Monitoring',
            'Dedicated Account Manager',
            'Custom AI Model Training',
            'Unlimited API Access & Users'
        ]
    }
];

const FAQS = [
    {
        question: "How does the billing cycle work?",
        answer: "We offer both monthly and annual billing options. Annual plans are billed upfront and come with a 20% discount compared to the month-to-month rate."
    },
    {
        question: "Can I upgrade or downgrade my plan?",
        answer: "Yes, you can change your plan at any time from your account dashboard. Upgrades are prorated immediately, while downgrades take effect at the start of your next billing cycle."
    },
    {
        question: "What is included in 'Deep & Dark Web Access'?",
        answer: "Professional and Enterprise tiers grant access to our proprietary index of Tor, I2P, and specialized forums, updated in near real-time, allowing you to trace assets beyond the surface web."
    },
    {
        question: "Do you offer custom integrations?",
        answer: "Yes, our Enterprise plan includes custom integrations. Our engineering team will work with you to connect Social2Tree directly to your internal databases or existing threat intelligence platforms."
    }
];

const PricingPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [isYearly, setIsYearly] = useState(true);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans selection:bg-teal-500/30">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] max-w-[800px] h-[400px] rounded-[100%] bg-teal-900/10 blur-[120px]"></div>
                </div>
                
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 font-bold text-xs tracking-widest uppercase border border-teal-500/20 mb-8">
                        Transparent Pricing
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
                        Scale your <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">intelligence</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        Deploy industry-leading OSINT capabilities tailored to your operation's scale, whether you're a lone analyst or a global agency.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 bg-slate-900/50 p-2 rounded-full border border-slate-800 w-max mx-auto backdrop-blur-md">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isYearly ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative ${isYearly ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
                        >
                            Yearly
                            <span className="absolute -top-3 -right-3 bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section className="py-12 px-4 max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {PRICING_PLANS.map((plan) => {
                        const price = isYearly ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;

                        return (
                            <div 
                                key={plan.id} 
                                className={`bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300 flex flex-col relative h-full ${
                                    plan.isPopular 
                                    ? 'border-teal-500 shadow-[0_0_40px_rgba(20,184,166,0.15)] md:-rotate-1 md:scale-105 bg-[#0d1322] z-10' 
                                    : 'border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-6 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.4)]">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-white">${price}</span>
                                        <span className="text-slate-500 text-sm font-medium">/mo</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        {isYearly ? `Billed $${plan.priceYearly} annually` : 'Billed monthly'}
                                    </p>
                                </div>

                                <Link
                                    to={plan.id === 'enterprise' ? "/contact" : (isAuthenticated ? "/dashboard/plan" : "/login")}
                                    className={`w-full block text-center py-3.5 rounded-xl font-bold tracking-wide text-sm transition-all duration-300 mb-8 ${
                                        plan.isPopular
                                        ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]'
                                        : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700/50'
                                    }`}
                                >
                                    {plan.ctaText}
                                </Link>

                                <div className="flex-grow">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">What's included</p>
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center mt-0.5">
                                                    <Check size={12} className="text-teal-400" />
                                                </div>
                                                <span className="text-slate-300 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Enterprise Custom Text */}
            <section className="py-12 px-4 text-center">
                <div className="inline-flex items-center gap-2 text-slate-400 bg-slate-900/50 px-6 py-3 rounded-full border border-slate-800 text-sm">
                    <Info size={16} className="text-teal-500" />
                    Need processing for more than 1M targets/month? <Link to="/contact" className="text-white font-bold hover:text-teal-400 transition-colors underline decoration-slate-600 underline-offset-4">Talk to our architecture team.</Link>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-4 max-w-3xl mx-auto border-t border-slate-800/50">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-slate-400">Everything you need to know about billing and capabilities.</p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`border border-slate-800 rounded-2xl overflow-hidden transition-colors ${openFaqIndex === index ? 'bg-slate-900/60' : 'bg-slate-900/30 hover:bg-slate-900/50'}`}
                        >
                            <button 
                                onClick={() => toggleFaq(index)}
                                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                            >
                                <span className={`font-bold transition-colors ${openFaqIndex === index ? 'text-teal-400' : 'text-white'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown 
                                    size={20} 
                                    className={`text-slate-400 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : 'rotate-0'}`} 
                                />
                            </button>
                            <div 
                                className={`px-6 overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="text-slate-400 text-sm leading-relaxed">
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

