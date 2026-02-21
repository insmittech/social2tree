import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../src/context/AuthContext';
import { Link } from 'react-router-dom';
import { Shield, Target, Award, Users, ChevronRight, CheckCircle2, Cpu, Globe, Zap, Network, Lock, Linkedin } from 'lucide-react';

const TEAM = [
    { name: "Dr. Elena Rostova", role: "Chief Intelligence Officer", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    { name: "Marcus Thorne", role: "Head of AI Architecture", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" },
    { name: "Sarah Jenkins", role: "Lead Investigator", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" },
    { name: "David Chen", role: "VP of Engineering", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" },
];

const About: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-300 font-sans selection:bg-teal-500/30 transition-colors duration-300">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 mb-8 border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.1)] dark:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-colors">
                        <Shield className="text-teal-600 dark:text-teal-400 w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 transition-colors">About Us</h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 transition-colors">
                        We are on a mission to democratize open-source intelligence. Empowering analysts and researchers with the tools to map the invisible web.
                    </p>
                    
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-300"
                    >
                        Contact
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Our Mission */}
            <section className="py-24 px-4 max-w-5xl mx-auto text-center border-t border-slate-200 dark:border-slate-800/50 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 mb-6 border border-teal-500/30 transition-colors">
                    <Target className="text-teal-600 dark:text-teal-400 w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 transition-colors">Our Mission</h2>
                <p className="text-xl text-slate-700 dark:text-slate-400 leading-relaxed max-w-4xl mx-auto transition-colors">
                    To provide investigators, cybersecurity professionals, and enterprises with the most accurate, deep, and structured open-source intelligence available. We strip away the noise so you can find the truth faster.
                </p>
            </section>

            {/* What We Do (Features) */}
            <section className="py-24 px-4 bg-slate-100 dark:bg-[#05080f] border-y border-slate-200 dark:border-slate-800 relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">What We Do</h2>
                        <p className="text-slate-600 dark:text-slate-400 transition-colors">Pioneering the next generation of data extraction.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Globe size={24} />, title: "Global Reconnaissance", desc: "Automated crawling of surface, deep, and dark web sources to build comprehensive digital footprints." },
                            { icon: <Cpu size={24} />, title: "AI-Powered Structuring", desc: "Proprietary LLMs transform petabytes of unstructured noise into actionable, relational database entities." },
                            { icon: <Network size={24} />, title: "Entity Resolution", desc: "Advanced heuristics map hidden connections between wallets, emails, domains, and anonymous profiles." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900/40 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm hover:border-teal-400/50 dark:hover:border-teal-500/50 hover:-translate-y-2 shadow-sm dark:shadow-none transition-all duration-300 group">
                                <div className="w-14 h-14 bg-slate-50 dark:bg-[#0b0f19] text-teal-600 dark:text-teal-500 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-800 group-hover:border-teal-400/50 dark:group-hover:border-teal-500/50 group-hover:shadow-md dark:group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story (Timeline) */}
            <section className="py-24 px-4 max-w-4xl mx-auto">
                 <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-16 text-center transition-colors">Our Story</h2>
                 
                 <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-teal-500/50 before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                    {[
                        { year: "2022", title: "The Foundation", desc: "Started as a specialized research tool for infosec analysts mapping advanced persistent threats." },
                        { year: "2024", title: "AI Integration", desc: "Launched our proprietary NLP engine, reducing data structuring time by 90% for enterprise clients." },
                        { year: "2026", title: "Global Expansion", desc: "Surpassed 2 million daily queries and expanded our dark web monitoring capabilities." }
                    ].map((event, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-[#0b0f19] bg-teal-500 text-white shadow shadow-teal-500/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl backdrop-blur-sm shadow-lg dark:shadow-xl transition-colors duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg transition-colors">{event.title}</h4>
                                    <span className="text-teal-600 dark:text-teal-400 font-bold text-sm bg-teal-500/10 px-3 py-1 rounded-full transition-colors">{event.year}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{event.desc}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </section>

            {/* Leadership / Team */}
            <section className="py-24 px-4 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/50 transition-colors">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Leadership Team</h2>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors">Built by former intelligence officers and senior engineers.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {TEAM.map((member, i) => (
                        <div key={i} className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/30 aspect-[3/4] transition-colors duration-300">
                            <img 
                                src={member.image} 
                                alt={member.name} 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0b0f19] via-slate-50/60 dark:via-[#0b0f19]/60 to-transparent transition-colors duration-300"></div>
                            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">{member.name}</h3>
                                <p className="text-teal-600 dark:text-teal-400 text-sm font-medium mb-4 transition-colors">{member.role}</p>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    <a href="#" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-teal-500 dark:hover:bg-teal-500 transition-colors">
                                        <Linkedin size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust & Recognition */}
            <section className="py-20 px-4 bg-slate-100 dark:bg-[#05080f] border-t border-slate-200 dark:border-slate-800 text-center transition-colors duration-300">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-10">Trusted By Global Agencies & Enterprises</p>
                <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-50 grayscale transition-colors">
                    {/* Placeholder abstract trust logos */}
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white"><Shield /> SecureNet</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white"><Target /> CyberOps</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white"><Lock /> DataVault</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white"><Award /> GovTech</div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
