import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Database, Network, Search, Eye, Fingerprint, Activity, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

const Features: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    const features = [
        {
            icon: <Search size={24} />,
            title: "Global Reconnaissance",
            desc: "Continuous, automated crawling of surface, deep, and dark web sources to build comprehensive digital footprints instantly.",
            highlights: ["Automated Crawling", "Deep & Dark Web", "Instant Results"]
        },
        {
            icon: <Database size={24} />,
            title: "Identity Resolution",
            desc: "Advanced algorithms disambiguate targets, linking seemingly unrelated aliases, emails, and phone numbers to a single entity.",
            highlights: ["Alias Tracking", "Cross-referencing", "Confidence Scoring"]
        },
        {
            icon: <Network size={24} />,
            title: "Network Graphing",
            desc: "Visualize complex relationships through interactive node graphs, exposing hidden connections between organizations and individuals.",
            highlights: ["Interactive Nodes", "Relationship Mapping", "Exportable Graphs"]
        },
        {
            icon: <Eye size={24} />,
            title: "Threat Intelligence",
            desc: "Monitor illicit forums and marketplaces in real-time, receiving instant alerts when keywords or target assets are mentioned.",
            highlights: ["Real-time Alerts", "Forum Monitoring", "Breach Data"]
        },
        {
            icon: <Fingerprint size={24} />,
            title: "Crypto Traceability",
            desc: "Follow the money across public blockchains. Map wallet connections, identify tumbling services, and unmask illicit transactions.",
            highlights: ["Wallet Mapping", "Transaction Tracking", "De-anonymization"]
        },
        {
            icon: <Activity size={24} />,
            title: "AI-Powered Structuring",
            desc: "Proprietary LLMs ingest petabytes of unstructured noise—like social media posts and forum dumps—into actionable, relational data.",
            highlights: ["NLP Analysis", "Entity Extraction", "Sentiment Scoring"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans selection:bg-teal-500/30">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            <header className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60%] lg:w-[40%] aspect-square rounded-[100%] bg-teal-900/10 blur-[120px]"></div>
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center px-4 py-1.5 border border-teal-500/30 bg-teal-500/10 text-teal-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                        <span>Platform Capabilities</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">Built for precision.</h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                        Everything you need to extract, structure, and visualize open-source intelligence—without the noise.
                    </p>
                </div>
            </header>

            <section className="py-16 px-4 max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-slate-900/40 p-10 rounded-3xl border border-slate-800 backdrop-blur-xl hover:border-teal-500/50 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(20,184,166,0.1)] transition-all duration-300 group flex flex-col">
                            <div className="w-14 h-14 bg-[#0b0f19] text-teal-500 rounded-2xl flex items-center justify-center mb-8 border border-slate-800 group-hover:border-teal-500/50 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all">
                                {feature.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">{feature.title}</h2>
                            <p className="text-slate-400 leading-relaxed mb-8 flex-grow">{feature.desc}</p>
                            <ul className="space-y-3 text-sm font-medium text-slate-400">
                                {feature.highlights.map((highlight, j) => (
                                    <li key={j} className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-teal-500 shrink-0" /> 
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Enterprise Data Scale Stats */}
            <section className="py-24 bg-[#05080f] border-t border-slate-800 relative overflow-hidden text-center">
                 <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.05),transparent_70%)] pointer-events-none"></div>
                 
                 <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-12">Operating at Global Scale</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 gap-y-16">
                        <div>
                            <h4 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">5B+</h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Records Scanned Daily</p>
                        </div>
                        <div>
                            <h4 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">&lt;200ms</h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Query Latency</p>
                        </div>
                        <div>
                            <h4 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">180+</h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Data Sources</p>
                        </div>
                        <div>
                            <h4 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">99.99%</h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Platform Uptime</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default Features;
