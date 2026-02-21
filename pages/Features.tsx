import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BarChart3, Globe, Palette, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

const Features: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    const features = [
        {
            icon: <BarChart3 size={24} />,
            title: "Advanced Analytics",
            desc: "Understand your audience with simple, actionable metrics. Track clicks and views in real-time."
        },
        {
            icon: <Globe size={24} />,
            title: "Custom Domains",
            desc: "Host your profile on your own domain like links.yourbrand.com for a professional look."
        },
        {
            icon: <Palette size={24} />,
            title: "Minimal Themes",
            desc: "Focus on your content. Choose from professional, clean themes that highlight your links."
        },
        {
            icon: <Shield size={24} />,
            title: "Link Scheduling",
            desc: "Set start and end dates for your promotions. Automate your profile management effortlessly."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans selection:bg-teal-500/30">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            <header className="pt-32 pb-20 px-4 border-b border-teal-900/30 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-1.5 border border-teal-500/30 bg-teal-500/10 text-teal-400 rounded-full text-xs font-bold mb-6 backdrop-blur-sm">
                        <span>Capabilities</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Built for precision.</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">Everything you need to extract and manage intelligence, without the clutter.</p>
                </div>
            </header>

            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-slate-900/50 p-10 rounded-2xl border border-slate-800 backdrop-blur-xl">
                            <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/30 flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">{feature.title}</h2>
                            <p className="text-slate-400 leading-relaxed mb-6">{feature.desc}</p>
                            <ul className="space-y-3 text-sm font-medium text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-500" /> Fast loading</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-500" /> Easy setup</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-teal-500" /> Secure platform</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Stats */}
            {/* Quick Stats */}
            <section className="py-20 bg-[#05080f] border-t border-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div>
                        <h4 className="text-3xl font-bold mb-1">99.9%</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Uptime</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold mb-1">2M+</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Queries</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold mb-1">24/7</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Support</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold mb-1">Scale</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Enterprise Ready</p>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default Features;
