import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../src/context/AuthContext';
import { Cpu, Database, Zap, Network, ChevronRight, Shield, Activity, Lock } from 'lucide-react';

const Contact: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    
    // State to simulate input focus/blur logic if needed
    const [focusedField, setFocusedField] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-300 font-sans selection:bg-teal-500/30 transition-colors duration-300">
            {/* We reuse the Navbar, it will have the same dark theme design */}
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            {/* Main Contact Section */}
            <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden flex min-h-screen items-center">
                
                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-900/20 blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-cyan-900/10 blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        
                        {/* Left Column: Information Area */}
                        <div className="max-w-xl">
                            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-8 transition-colors">
                                Contact Us
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed transition-colors">
                                Ready to uncover the unseen? Connect with our team to explore how Social2Tree's OSINT platform can supercharge your investigations.
                            </p>

                            {/* Value Proposition List */}
                            <div className="space-y-8 mb-16">
                                {[
                                    { icon: <Cpu size={24} />, title: "AI-Powered Analysis", desc: "Automate entity extraction and mapping across datasets." },
                                    { icon: <Database size={24} />, title: "Structured Data Access", desc: "Turn fragmented sources into normalized, queryable schemas." },
                                    { icon: <Zap size={24} />, title: "Fast Investigation", desc: "Reduce research time from days to minutes with real-time scraping." },
                                    { icon: <Network size={24} />, title: "Hidden Connections", desc: "Visualize complex relationships between disparate targets instantly." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-5">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#05080f] border border-slate-200 dark:border-teal-500/20 shadow-sm dark:shadow-[inset_0_0_15px_rgba(20,184,166,0.1)] flex items-center justify-center text-teal-600 dark:text-teal-400 transition-colors">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-wide transition-colors">{item.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Trust Badges */}
                            <div className="border-t border-slate-200 dark:border-slate-800/60 pt-8 transition-colors">
                                <p className="text-sm text-slate-500 font-medium mb-6 uppercase tracking-widest">
                                    Trusted by investigative teams globally
                                </p>
                                <div className="flex gap-8 opacity-50 grayscale text-slate-800 dark:text-white transition-colors">
                                    <div className="text-lg font-bold tracking-widest uppercase flex items-center gap-2"><Shield size={18} /> Interpol</div>
                                    <div className="text-lg font-bold tracking-widest uppercase flex items-center gap-2"><Activity size={18} /> CyberCom</div>
                                    <div className="text-lg font-bold tracking-widest uppercase flex items-center gap-2"><Lock size={18} /> SecurOps</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Glassmorphic Form Container */}
                        <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
                            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent rounded-[2.5rem] blur-xl -z-10"></div>
                            
                            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-xl dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-colors duration-300">
                                
                                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                    
                                    {/* Name Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">First Name</label>
                                            <input
                                                type="text"
                                                placeholder="John"
                                                className="w-full bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="Doe"
                                                className="w-full bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Business Email</label>
                                            <input
                                                type="email"
                                                placeholder="john@company.com"
                                                className="w-full bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Phone Number</label>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-4 text-slate-500 font-medium">+1</span>
                                                <input
                                                    type="tel"
                                                    placeholder="(555) 000-0000"
                                                    className="w-full bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Job Title</label>
                                            <input
                                                type="text"
                                                placeholder="Director of Intel"
                                                className="w-full bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Organization Name</label>
                                            <input
                                                type="text"
                                                placeholder="Acme Corp"
                                                className="w-full bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    {/* Selects Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Team Size</label>
                                            <select className="w-full appearance-none bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-200 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner">
                                                <option value="" disabled selected hidden className="text-slate-500 dark:text-slate-600">Select Size</option>
                                                <option value="1-10">1-10 Employees</option>
                                                <option value="11-50">11-50 Employees</option>
                                                <option value="51-200">51-200 Employees</option>
                                                <option value="201+">201+ Employees</option>
                                            </select>
                                            <ChevronRight size={16} className="absolute right-4 top-[38px] text-slate-500 rotate-90 pointer-events-none" />
                                        </div>
                                         <div className="space-y-2 relative">
                                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Role</label>
                                            <select className="w-full appearance-none bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-200 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner">
                                                <option value="" disabled selected hidden className="text-slate-500 dark:text-slate-600">Select Role</option>
                                                <option value="analyst">Analyst</option>
                                                <option value="investigator">Investigator</option>
                                                <option value="executive">Executive</option>
                                                <option value="it">IT / Security</option>
                                            </select>
                                            <ChevronRight size={16} className="absolute right-4 top-[38px] text-slate-500 rotate-90 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Company Type Row */}
                                    <div className="space-y-2 relative">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Company Type</label>
                                        <select className="w-full appearance-none bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-200 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner">
                                            <option value="" disabled selected hidden className="text-slate-500 dark:text-slate-600">Select Industry / Type</option>
                                            <option value="law_enforcement">Law Enforcement / Gov</option>
                                            <option value="cybersecurity">Cybersecurity Firm</option>
                                            <option value="enterprise">Enterprise Corporate</option>
                                            <option value="legal">Legal / Compliance</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <ChevronRight size={16} className="absolute right-4 top-[38px] text-slate-500 rotate-90 pointer-events-none" />
                                    </div>

                                    {/* Message Textarea */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1 transition-colors">Message</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Tell us about your OSINT requirements or use case..."
                                            className="w-full bg-slate-50 dark:bg-[#05080f]/80 border border-slate-200 dark:border-slate-700/60 focus:border-teal-500 rounded-xl px-4 py-4 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-sm dark:shadow-inner resize-none"
                                        />
                                    </div>

                                    {/* Checkbox */}
                                    <div className="flex items-start gap-3 pt-2">
                                        <div className="relative flex items-center mt-1">
                                            <input type="checkbox" id="privacy" className="peer w-5 h-5 appearance-none rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#05080f] checked:bg-teal-500 checked:border-teal-500 cursor-pointer transition-colors" />
                                            <svg className="absolute w-3 h-3 text-[length:0] text-white dark:text-[#05080f] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 peer-checked:text-[length:12px] opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <label htmlFor="privacy" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer select-none transition-colors">
                                            I agree to the <span className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors">Terms of Service</span> and <span className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors">Privacy Policy</span>.
                                        </label>
                                    </div>

                                    {/* CTA Button */}
                                    <button 
                                        type="button"
                                        className="w-full mt-6 relative group overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-[15px] font-bold tracking-widest uppercase hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-teal-400/50"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">Next Step <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>

                                </form>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* We reuse the Footer, it already has the dark theme design */}
            <Footer />
        </div>
    );
};

export default Contact;
