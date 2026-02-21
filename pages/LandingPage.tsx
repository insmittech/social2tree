import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, ChevronRight, Activity, Search, Globe, Lock, Cpu, Database, Eye, Fingerprint, Expand, Layers, BoxSelect, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import client from '../src/api/client';

interface LandingPageProps {
  isAuthenticated: boolean;
  userProfile: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ isAuthenticated, userProfile }) => {
  const [menuLinks, setMenuLinks] = useState<{ navbar: any[], footer_explore: any[], footer_legal: any[] }>({
    navbar: [],
    footer_explore: [],
    footer_legal: []
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await client.get('/admin/settings/get.php');
        const settings = res.data.settings;
        if (settings) {
          setMenuLinks({
            navbar: JSON.parse(settings.navbar_links || '[]'),
            footer_explore: JSON.parse(settings.footer_explore_links || '[]'),
            footer_legal: JSON.parse(settings.footer_legal_links || '[]')
          });
        }
      } catch (err) {
        console.error('Failed to load menu settings:', err);
      }
    };
    fetchMenu();
  }, []);

  // Custom Links for the Header as requested
  const headerLinks = [
    { label: 'Products', to: '/products' },
    { label: 'Cases', to: '/cases' },
    { label: 'Industries', to: '/industries' },
    { label: 'Resources', to: '/resources' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300 font-sans selection:bg-teal-500/30">
      
      {/* Standardized OSINT Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-teal-900/20 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/10 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content Area */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Enterprise Intelligence
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Industry-Leading <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                OSINT Solutions
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
              Empowering law enforcement and cybersecurity professionals with advanced analytics, extracting actionable intelligence from the deepest layers of the web.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Link 
                to="/demo" 
                className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-base font-semibold tracking-wide hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Book a Demo <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/cases" 
                className="px-8 py-4 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:text-white text-slate-300 text-base font-semibold transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
              >
                Explore Cases
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-slate-800 pt-8">
              <p className="text-sm text-slate-500 font-medium mb-4 flex items-center gap-2">
                <Shield size={16} className="text-teal-500" /> Trusted by global agencies
              </p>
              <div className="flex gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                 {/* Placeholder for real logos */}
                 <div className="text-xl font-bold tracking-widest uppercase flex items-center gap-1"><Shield size={20}/> Interpol</div>
                 <div className="text-xl font-bold tracking-widest uppercase flex items-center gap-1"><Activity size={20}/> CyberCom</div>
                 <div className="text-xl font-bold tracking-widest uppercase flex items-center gap-1"><Lock size={20}/> SecurOps</div>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="relative h-[600px] w-full hidden lg:flex items-center justify-center">
            
            {/* Static Grid Background inside viz */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

            {/* Radar Animation Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Rings */}
              <div className="radar-ring radar-ring-4"></div>
              <div className="radar-ring radar-ring-3"></div>
              <div className="radar-ring radar-ring-2"></div>
              <div className="radar-ring radar-ring-1"></div>

              {/* Sweeping Radar Line */}
              <div className="absolute top-1/2 left-1/2 w-[375px] h-[375px] origin-top-left border-l border-teal-500/50 bg-gradient-to-br from-teal-500/10 to-transparent animate-spin-slow rounded-tl-full [mask-image:linear-gradient(to_bottom_right,white,transparent_50%)]"></div>

              {/* Center Node */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-slate-900 border border-teal-500/50 shadow-[0_0_30px_rgba(20,184,166,0.3)] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full animate-pulse-ring"></div>
                <Search size={32} className="text-teal-400" />
              </div>

              {/* Data Nodes Container (Rotating Reverse to Radar) */}
              <div className="absolute top-0 left-0 w-full h-full animate-spin-reverse">
                
                {/* Node 1: Social Media (Ring 2) */}
                <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                   <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '0s' }}>
                      <div className="w-12 h-12 rounded-full bg-[#0b0f19] border border-cyan-500/40 group-hover:bg-cyan-900/50 group-hover:border-cyan-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                         <Globe size={20} className="text-cyan-400" />
                      </div>
                      <span className="text-xs font-medium text-cyan-300/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 px-2 py-1 rounded">Social Media</span>
                   </div>
                </div>

                {/* Node 2: Dark Web (Ring 3) */}
                <div className="absolute top-[75%] left-[15%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                   <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '1s' }}>
                      <div className="w-12 h-12 rounded-full bg-[#0b0f19] border border-blue-500/40 group-hover:bg-blue-900/50 group-hover:border-blue-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                         <Eye size={20} className="text-blue-400" />
                      </div>
                      <span className="text-xs font-medium text-blue-300/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 px-2 py-1 rounded">Dark Web</span>
                   </div>
                </div>

                {/* Node 3: Blockchain (Ring 4) */}
                <div className="absolute top-[10%] left-[60%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                   <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '2s' }}>
                      <div className="w-12 h-12 rounded-full bg-[#0b0f19] border border-teal-500/40 group-hover:bg-teal-900/50 group-hover:border-teal-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                         <Database size={20} className="text-teal-400" />
                      </div>
                      <span className="text-xs font-medium text-teal-300/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 px-2 py-1 rounded">Blockchain Data</span>
                   </div>
                </div>

                {/* Node 4: Telecom (Ring 2) */}
                <div className="absolute top-[80%] left-[80%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                   <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '0.5s' }}>
                      <div className="w-12 h-12 rounded-full bg-[#0b0f19] border border-emerald-500/40 group-hover:bg-emerald-900/50 group-hover:border-emerald-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                         <Cpu size={20} className="text-emerald-400" />
                      </div>
                      <span className="text-xs font-medium text-emerald-300/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 px-2 py-1 rounded">Telecom & Devices</span>
                   </div>
                </div>

                 {/* Node 5: Identities (Ring 3) */}
                 <div className="absolute top-[40%] left-[85%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                   <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '1.5s' }}>
                      <div className="w-12 h-12 rounded-full bg-[#0b0f19] border border-indigo-500/40 group-hover:bg-indigo-900/50 group-hover:border-indigo-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                         <Fingerprint size={20} className="text-indigo-400" />
                      </div>
                      <span className="text-xs font-medium text-indigo-300/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 px-2 py-1 rounded">Identities</span>
                   </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: The Most Accurate and In-Depth Data */}
      <section className="relative py-24 lg:py-32 bg-[#0b0f19] overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-teal-900/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.03),transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              The Most Accurate and <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                 In-Depth Data
              </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Unrivaled access to open-source intelligence. We aggregate, structure, and analyze fragmented endpoints into actionable clarity.
            </p>
          </div>

          {/* 6-Card Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Expand size={28} className="text-teal-400" />,
                title: "Wide Coverage",
                desc: "Monitor thousands of sources across the surface, deep, and dark web. Leave no digital footprint undiscovered."
              },
              {
                icon: <Layers size={28} className="text-cyan-400" />,
                title: "All-in-One Extraction",
                desc: "Consolidate your investigations. Extract emails, phone numbers, crypto wallets, and social profiles through a single pane of glass."
              },
              {
                icon: <BoxSelect size={28} className="text-emerald-400" />,
                title: "Maximum Structure",
                desc: "Unstructured noise transformed into clean, visual graphs and standardized schemas, ready for immediate analysis."
              },
              {
                icon: <Zap size={28} className="text-amber-400" />,
                title: "Real-Time Data",
                desc: "Intelligence isn't static. Receive live updates, alerts, and continuous monitoring of target entities with zero latency."
              },
              {
                icon: <ShieldCheck size={28} className="text-blue-400" />,
                title: "Anonymity Assurance",
                desc: "Conduct complex, deep investigations behind enterprise-grade proxies and secure infrastructure. Total operational security."
              },
              {
                icon: <Sparkles size={28} className="text-indigo-400" />,
                title: "AI-Powered Insights",
                desc: "Leverage advanced machine learning to detect patterns, translate languages, and flag hidden connections automatically."
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-teal-500/10 hover:border-teal-400/40 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(20,184,166,0.15)] flex flex-col items-start text-left overflow-hidden"
              >
                {/* Inner Glow Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-10 group-hover:from-teal-500/20 group-hover:to-cyan-500/10 transition-all duration-500 z-0 pointer-events-none"></div>
                
                {/* Icon Container */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#0b0f19] border border-teal-500/20 flex items-center justify-center mb-6 shadow-inner group-hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-shadow duration-500">
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="relative z-10 text-xl font-bold text-slate-100 uppercase tracking-wide mb-4 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="relative z-10 text-slate-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Add padding to the bottom so footer isn't right below hero if we had more sections */}
      <div className="h-32 border-t border-slate-800/50 bg-[#0b0f19]"></div>

      {/* Render the new Dark OSINT Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
