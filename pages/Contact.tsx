import React from 'react';
import Navbar from '../components/Navbar';
import { Mail, MessageSquare, Twitter, MapPin, Send } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

const Contact: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            <section className="py-24 px-4 bg-white border-b border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50/30 -skew-x-12 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            Drop a line
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 italic">Let's build<br />something <span className="text-indigo-600 not-italic">great.</span></h1>
                        <p className="text-xl text-slate-500 font-bold mb-12 max-w-lg leading-relaxed">
                            Have questions? We're here to help you scale your digital presence. Speak to our team.
                        </p>

                        <div className="space-y-10">
                            {[
                                { icon: <Mail size={24} />, title: "Email Support", desc: "support@social2tree.me", color: "indigo" },
                                { icon: <MessageSquare size={24} />, title: "Creator Community", desc: "Join our Discord hub", color: "purple" },
                                { icon: <Twitter size={24} />, title: "Live Updates", desc: "@Social2Tree_App", color: "blue" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-6 group">
                                    <div className={`p-4 bg-${item.color}-50 text-${item.color}-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                                        <p className="text-slate-500 font-bold">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 z-10">
                        <form className="space-y-8">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Alex Rivera"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-slate-700 placeholder:text-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                    <input
                                        type="email"
                                        placeholder="alex@brand.com"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-slate-700 placeholder:text-slate-200"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-slate-700">
                                    <option>Account Support</option>
                                    <option>Pro Billing</option>
                                    <option>Partnership Inquiry</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="Tell us what you're building..."
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] px-6 py-5 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-600 resize-none placeholder:text-slate-200"
                                />
                            </div>
                            <button className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group">
                                Send Message <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
