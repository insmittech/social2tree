import React from 'react';
import Navbar from '../components/Navbar';
import { Zap, BarChart3, Palette, QrCode, Shield, Globe, MousePointer2, Smartphone } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

const Features: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    const features = [
        {
            icon: <BarChart3 className="text-indigo-600" size={32} />,
            title: "Advanced Analytics",
            desc: "Understand your audience with deep-dive metrics. Track location, device types, and peak engagement times.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
        },
        {
            icon: <Globe className="text-purple-600" size={32} />,
            title: "Custom Domains",
            desc: "Professionalize your brand. Host your Social2Tree on your own domain like links.yourbrand.com.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
        },
        {
            icon: <Palette className="text-pink-600" size={32} />,
            title: "Premium Themes",
            desc: "Stand out from the crowd. Access high-fidelity themes with advanced glassmorphism and animations.",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
        },
        {
            icon: <Shield className="text-emerald-600" size={32} />,
            title: "Link Scheduling",
            desc: "Automate your marketing. Set start and end dates for time-sensitive promotions or event links.",
            image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            <header className="py-24 px-4 bg-white border-b border-slate-100 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                        The Platform
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 italic">Built for the next<br /><span className="text-indigo-600 not-italic">generation</span> of creators.</h1>
                    <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto">Scale your influence with tools as powerful as your content.</p>
                </div>
            </header>

            <section className="py-32 px-4 max-w-7xl mx-auto">
                <div className="space-y-32">
                    {features.map((feature, i) => (
                        <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-20`}>
                            <div className="flex-1 space-y-8">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
                                    {feature.icon}
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{feature.title}</h2>
                                <p className="text-lg text-slate-500 font-bold leading-relaxed">{feature.desc}</p>
                                <ul className="space-y-4 font-black text-xs uppercase tracking-widest text-slate-400">
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-amber-500" fill="currentColor" /> Real-time Performance</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-amber-500" fill="currentColor" /> One-click Implementation</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-amber-500" fill="currentColor" /> Multi-platform Support</li>
                                </ul>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                                    <img
                                        src={feature.image}
                                        className="relative w-full aspect-video object-cover rounded-[2.5rem] shadow-2xl border-8 border-white group-hover:scale-[1.02] transition-transform duration-700"
                                        alt={feature.title}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div>
                        <h4 className="text-4xl font-black mb-2 italic tracking-tighter">99.9%</h4>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Uptime</p>
                    </div>
                    <div>
                        <h4 className="text-4xl font-black mb-2 italic tracking-tighter">5M+</h4>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Users</p>
                    </div>
                    <div>
                        <h4 className="text-4xl font-black mb-2 italic tracking-tighter">24/7</h4>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Support</p>
                    </div>
                    <div>
                        <h4 className="text-4xl font-black mb-2 italic tracking-tighter">#1</h4>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Choice</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
