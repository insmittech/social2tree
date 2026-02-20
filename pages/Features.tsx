import React from 'react';
import Navbar from '../components/Navbar';
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
        <div className="min-h-screen bg-white">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            <header className="py-20 px-4 bg-white border-b border-slate-100 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-6">
                        Features
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Built for simplicity.</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to manage your digital presence, without the clutter.</p>
                </div>
            </header>

            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-slate-50 p-10 rounded-xl border border-slate-200">
                            <div className="w-12 h-12 bg-white text-indigo-600 rounded-lg flex items-center justify-center mb-6 border border-slate-200">
                                {feature.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h2>
                            <p className="text-slate-600 leading-relaxed mb-6">{feature.desc}</p>
                            <ul className="space-y-3 text-sm font-medium text-slate-500">
                                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600" /> Fast loading</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600" /> Easy setup</li>
                                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600" /> Clean interface</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div>
                        <h4 className="text-3xl font-bold mb-1">99.9%</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Uptime</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold mb-1">5M+</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Users</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold mb-1">24/7</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Support</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold mb-1">Free</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Starter Plan</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
