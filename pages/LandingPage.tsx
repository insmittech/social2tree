import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileThemeShowcase from '../components/MobileThemeShowcase';
import { Shield, ChevronRight, Activity, Search, Globe, Lock, Cpu, Database, Eye, Fingerprint, Expand, Layers, BoxSelect, Zap, ShieldCheck, Sparkles, Network, User } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 font-sans tracking-tight">
      <Navbar
        isAuthenticated={isAuthenticated}
        userProfile={userProfile}
        customLinks={menuLinks.navbar.length > 0 ? menuLinks.navbar : undefined}
      />

      {/* Hero Section */}
      <section className="bg-white pt-24 pb-32 px-4 overflow-hidden relative border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl text-sm font-black uppercase tracking-[0.2em] mb-10 border border-indigo-100 shadow-sm shadow-indigo-100">
              <Zap size={16} fill="currentColor" /> Premium Identity
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-slate-900 leading-[0.85] tracking-tighter mb-10 italic uppercase">
              Your World <br />
              <span className="text-indigo-600">In One Link.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-12 font-bold uppercase tracking-widest">
              The professional way to connect your audience to all of your content.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 mb-12">
              <div className="relative w-full sm:w-auto rounded-[2rem] overflow-hidden border-4 border-slate-100 bg-white shadow-2xl shadow-slate-200">
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-sm uppercase tracking-widest">s2t.me/</span>
                <input
                  type="text"
                  placeholder="username"
                  className="w-full sm:w-80 pl-28 pr-8 py-6 bg-transparent outline-none font-black text-lg text-slate-900 uppercase tracking-tighter"
                />
              </div>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-6 rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-300 flex items-center justify-center gap-4 group"
              >
                Join Free <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-slate-50 w-full lg:w-fit">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?img=${i + 30}`} className="w-12 h-12 rounded-[1.2rem] border-4 border-white shadow-2xl rotate-3 first:rotate-0" alt="user" />
                ))}
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-slate-900 leading-none">5,000,000+</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Global Creators</p>
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
              The Most Accurate and <br className="hidden sm:block" />
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
      {/* Core Ecosystem Section – Designed for Impact */}
      <section className="relative py-24 lg:py-32 bg-[#0b0f19] border-t border-slate-800/50 overflow-hidden">

        {/* Network Style Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Subtle connected nodes SVG background */}
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="network-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="#14b8a6"></circle>
                <circle cx="80" cy="50" r="1" fill="#06b6d4"></circle>
                <circle cx="40" cy="80" r="2" fill="#14b8a6"></circle>
                <path d="M 20 20 L 80 50 L 40 80 Z" fill="none" stroke="rgba(20,184,166,0.15)" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#network-pattern)"></rect>
          </svg>
          {/* Glowing center radial blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Ecosystem</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed font-medium uppercase tracking-widest">
              — Designed for Impact —
            </p>
          </div>

          {/* 6-Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: <Globe size={28} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />,
                title: "Global Mapper",
                desc: "Map global digital footprints instantly. Cross-reference billions of records across surface and deep web sources.",
                delay: "0ms"
              },
              {
                icon: <Search size={28} className="text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]" />,
                title: "Deep Search Intelligence",
                desc: "Boolean-powered search engine designed specifically for unstructured threat data and leaked credentials.",
                delay: "100ms"
              },
              {
                icon: <Activity size={28} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />,
                title: "Pulse Monitoring",
                desc: "Set persistent watches on target entities, keywords, or wallets. Receive cryptographic alerts in real-time.",
                delay: "200ms"
              },
              {
                icon: <Network size={28} className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />,
                title: "Link Analysis Engine",
                desc: "Visualize complex criminal networks. Automatically generate relationship graphs from raw textual inputs.",
                delay: "300ms"
              },
              {
                icon: <ShieldCheck size={28} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />,
                title: "Entity Verification",
                desc: "Triangulate identities using machine learning to link disparate aliases to a single, verified threat actor.",
                delay: "400ms"
              },
              {
                icon: <Database size={28} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />,
                title: "Secure Vault API",
                desc: "Integrate our intelligence lake directly into your existing SOAR/SIEM via our hyper-secure, low-latency API.",
                delay: "500ms"
              }
            ].map((module, idx) => (
              <div
                key={idx}
                className={`group relative p-8 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-teal-500/50 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_15px_40px_-15px_rgba(20,184,166,0.2)] overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-8`}
                style={{ animationDelay: module.delay, animationFillMode: 'both' }}
              >
                {/* Neon Glow on Hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0b0f19] border border-slate-700 flex items-center justify-center group-hover:border-teal-500/30 group-hover:bg-teal-900/20 transition-all duration-500 relative">
                    {/* Pulse behind icon */}
                    <div className="absolute inset-0 rounded-xl bg-teal-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10">{module.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                    {module.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed text-sm flex-grow group-hover:text-slate-300 transition-colors">
                  {module.desc}
                </p>

                {/* Bottom decorative line */}
                <div className="mt-6 w-8 h-px bg-slate-700 group-hover:bg-teal-500 group-hover:w-16 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile-First Intelligence Slider */}
      <section className="relative py-24 lg:py-32 bg-[#05080f] overflow-hidden">

        {/* Deep background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#05080f] to-[#0b0f19] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-semibold tracking-widest uppercase mb-6 backdrop-blur-sm">
            Platform Portability
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Mobile-First <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Intelligence</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Investigate Anytime. Anywhere.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative z-10 w-full overflow-hidden flex flex-col items-center">

          {/* Scrollable Area */}
          <div className="w-full flex gap-8 overflow-x-auto snap-x snap-mandatory px-[10vw] md:px-[30vw] pb-12 pt-8 hide-scrollbar scroll-smooth">

            {/* Phone 1: Dashboard */}
            <div className="snap-center shrink-0 group relative transition-transform duration-500 hover:scale-[1.03]">
              {/* Phone Frame */}
              <div className="relative w-[300px] h-[620px] bg-[#0b0f19] rounded-[48px] border-[8px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/10 group-hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-shadow">

                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-50 flex items-center justify-between px-3">
                  <div className="w-3 h-3 rounded-full bg-slate-800 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-cyan-900 rounded-full"></div></div>
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>

                {/* Status Bar */}
                <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-between px-6 z-40 text-[10px] font-medium text-slate-300">
                  <span>9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-4 h-3 rounded-sm border border-slate-400 relative">
                      <span className="absolute top-0.5 left-0.5 right-1 bottom-0.5 bg-white rounded-sm"></span>
                    </span>
                  </div>
                </div>

                {/* UI Content: Dashboard */}
                <div className="w-full h-full pt-16 px-5 pb-8 overflow-y-auto hide-scrollbar bg-gradient-to-b from-teal-900/20 to-[#0b0f19]">

                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-white text-lg font-bold">Good morning,</h4>
                      <p className="text-teal-400 text-sm font-medium">Agent Smith</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-teal-500/30 overflow-hidden">
                      <img src="https://ui-avatars.com/api/?name=Agent+Smith&background=14b8a6&color=fff" alt="User" />
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="w-full h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center px-4 mb-6">
                    <Search size={16} className="text-slate-500 mr-2" />
                    <span className="text-slate-500 text-xs">Search entities...</span>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-900/20 border border-teal-500/30 flex flex-col justify-center px-4">
                      <Search size={16} className="text-teal-400 mb-1" />
                      <span className="text-white text-xs font-semibold">New Search</span>
                    </div>
                    <div className="h-16 rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-col justify-center px-4">
                      <Activity size={16} className="text-slate-400 mb-1" />
                      <span className="text-white text-xs font-semibold">Alerts (3)</span>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <h5 className="text-white text-sm font-bold mb-3">Recent Targets</h5>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-full p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center">
                          <Globe size={14} className="text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-xs font-medium">DarkNet Forum #{i}</p>
                          <p className="text-slate-500 text-[10px]">Scanned 2m ago</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-500" />
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            {/* Phone 2: Analytics Central */}
            <div className="snap-center shrink-0 group relative transition-transform duration-500 hover:scale-[1.03]">
              <div className="relative w-[300px] h-[620px] bg-[#0b0f19] rounded-[48px] border-[8px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/10 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-shadow">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-50 flex items-center justify-between px-3">
                  <div className="w-3 h-3 rounded-full bg-slate-800 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-cyan-900 rounded-full"></div></div>
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>
                {/* Status Bar */}
                <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-between px-6 z-40 text-[10px] font-medium text-slate-300">
                  <span>9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-4 h-3 rounded-sm border border-slate-400 relative">
                      <span className="absolute top-0.5 left-0.5 right-1 bottom-0.5 bg-white rounded-sm"></span>
                    </span>
                  </div>
                </div>

                {/* UI Content: Analytics */}
                <div className="w-full h-full pt-16 px-5 pb-8 overflow-y-auto hide-scrollbar bg-[#0b0f19]">

                  <h4 className="text-white text-lg font-bold mb-6">Threat Analytics</h4>

                  {/* Main Chart Widget */}
                  <div className="w-full p-4 rounded-2xl bg-slate-800/30 border border-slate-700 mb-6">
                    <p className="text-slate-400 text-xs font-medium mb-1">Total Mentions</p>
                    <p className="text-white text-2xl font-bold mb-4">12,490</p>

                    {/* Simulated Bar Chart */}
                    <div className="flex items-end gap-2 h-24 mb-2">
                      {['40%', '60%', '30%', '80%', '50%', '90%', '70%'].map((h, i) => (
                        <div key={i} className="flex-1 bg-slate-700 rounded-t-sm relative group cursor-pointer hover:bg-cyan-500/50 transition-colors" style={{ height: h }}>
                          {i === 5 && <div className="absolute inset-0 bg-cyan-400 rounded-t-sm animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                  </div>

                  {/* Data Sources Details */}
                  <h5 className="text-white text-sm font-bold mb-3">Sources</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700">
                      <div className="flex gap-3">
                        <Eye size={16} className="text-blue-400" />
                        <span className="text-white text-xs font-medium">Dark Web Forums</span>
                      </div>
                      <span className="text-blue-400 text-xs font-bold">45%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700">
                      <div className="flex gap-3">
                        <Globe size={16} className="text-emerald-400" />
                        <span className="text-white text-xs font-medium">Social Media</span>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold">30%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700">
                      <div className="flex gap-3">
                        <Database size={16} className="text-teal-400" />
                        <span className="text-white text-xs font-medium">Leaked DBs</span>
                      </div>
                      <span className="text-teal-400 text-xs font-bold">25%</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Phone 3: Investigation Link Graph */}
            <div className="snap-center shrink-0 group relative transition-transform duration-500 hover:scale-[1.03]">
              <div className="relative w-[300px] h-[620px] bg-[#0b0f19] rounded-[48px] border-[8px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/10 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-shadow">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-50 flex items-center justify-between px-3">
                  <div className="w-3 h-3 rounded-full bg-slate-800 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-cyan-900 rounded-full"></div></div>
                  <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>
                <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-between px-6 z-40 text-[10px] font-medium text-slate-300">
                  <span>9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-4 h-3 rounded-sm border border-slate-400 relative">
                      <span className="absolute top-0.5 left-0.5 right-1 bottom-0.5 bg-white rounded-sm"></span>
                    </span>
                  </div>
                </div>

                {/* UI Content: Activity Feed */}
                <div className="w-full h-full pt-16 px-5 pb-8 overflow-y-auto hide-scrollbar bg-[#0b0f19]">

                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-white text-lg font-bold">Live Activity</h4>
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">LIVE</div>
                  </div>

                  {/* Network Graph Simulation */}
                  <div className="w-full h-40 rounded-2xl bg-slate-900 border border-slate-700 mb-6 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute w-full h-full opacity-30">
                      {/* Connecting Lines */}
                      <svg className="w-full h-full">
                        <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#10b981" strokeWidth="1" />
                        <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#10b981" strokeWidth="1" />
                        <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#10b981" strokeWidth="1" />
                        <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="#10b981" strokeWidth="1" />
                      </svg>
                    </div>
                    {/* Nodes */}
                    <div className="absolute w-3 h-3 rounded-full bg-emerald-400 top-[20%] left-[20%] animate-pulse"></div>
                    <div className="absolute w-2 h-2 rounded-full bg-cyan-400 top-[30%] left-[80%]"></div>
                    <div className="absolute w-4 h-4 rounded-full bg-teal-400 top-[80%] left-[30%]"></div>
                    <div className="absolute w-2 h-2 rounded-full bg-blue-400 top-[70%] left-[70%]"></div>

                    <div className="relative w-10 h-10 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                      <User size={16} className="text-emerald-400" />
                    </div>
                  </div>

                  {/* Event Log */}
                  <h5 className="text-white text-sm font-bold mb-3">Event Log</h5>
                  <div className="relative border-l border-slate-700 ml-3 space-y-4">
                    {[
                      { time: 'Just now', action: 'New alias linked', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500' },
                      { time: '2m ago', action: 'Location spotted', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500' },
                      { time: '15m ago', action: 'Wallet tx detected', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500' },
                    ].map((log, i) => (
                      <div key={i} className="pl-6 relative">
                        <div className={`absolute top-1 -left-[5px] w-2 h-2 rounded-full ${log.bg} border ${log.border}`}></div>
                        <p className="text-white text-xs font-medium">{log.action}</p>
                        <p className="text-slate-500 text-[10px]">{log.time}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Instructions */}
          <div className="flex items-center gap-2 mt-4 text-slate-500 text-sm font-medium animate-pulse">
            <ChevronRight size={16} className="rotate-180" /> Swipe to explore <ChevronRight size={16} />
          </div>

        </div>
      </section>

      {/* Explore Interface Themes (Mobile Theme Showcase) */}
      <MobileThemeShowcase />

      {/* Add padding to the bottom so footer isn't right below hero if we had more sections */}
      <div className="h-32 border-t border-slate-800/50 bg-[#0b0f19]"></div>

      {/* Render the new Dark OSINT Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
