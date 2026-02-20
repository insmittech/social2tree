import React from 'react';
import Navbar from '../components/Navbar';
import { Mail, MessageSquare, Twitter, Send } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

const Contact: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen bg-white">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            <section className="py-20 px-4 bg-white border-b border-slate-100 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-6">
                        Contact
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">Let's build something great.</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Have questions? We're here to help you scale your digital presence.
                    </p>
                </div>
            </section>

            <section className="py-24 px-4 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Get in touch</h2>
                        <div className="space-y-8">
                            {[
                                { icon: <Mail size={20} />, title: "Email Support", desc: "support@social2tree.me" },
                                { icon: <MessageSquare size={20} />, title: "Community", desc: "Join our Discord hub" },
                                { icon: <Twitter size={20} />, title: "Twitter", desc: "@Social2Tree_App" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                                        <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200">
                        <form className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Alex Rivera"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="alex@brand.com"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us what you're building..."
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-700 resize-none"
                                />
                            </div>
                            <button className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
