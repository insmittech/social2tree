import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileThemeShowcase from '../components/MobileThemeShowcase';
import AIAssistantShowcase from '../components/AIAssistantShowcase';
import { Shield, ChevronRight, Activity, Search, Globe, Lock, Cpu, Database, Eye, Fingerprint, Expand, Layers, BoxSelect, Zap, ShieldCheck, Sparkles, Network, User, ArrowRight } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaWhatsapp, FaYoutube, FaTwitter, FaSnapchat, FaXTwitter, FaPinterest, FaDiscord, FaTelegram, FaGithub } from 'react-icons/fa6';
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] font-sans tracking-tight transition-colors duration-300">
      <Navbar
        isAuthenticated={isAuthenticated}
        userProfile={userProfile}
        customLinks={menuLinks.navbar.length > 0 ? menuLinks.navbar : undefined}
      />

      {/* Hero Section */}
      <section className="bg-white dark:bg-[#0b0f19] pt-24 pb-32 px-4 overflow-hidden relative border-b border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-teal-500/10 text-indigo-700 dark:text-teal-300 rounded-2xl text-sm font-black uppercase tracking-[0.2em] mb-10 border border-indigo-100 dark:border-teal-500/30 transition-colors">
              <Zap size={16} fill="currentColor" /> Premium Identity
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter mb-10 italic uppercase transition-colors">
              Your World <br />
              <span className="text-indigo-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-teal-400 dark:to-cyan-300 transition-colors">In One Link.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-12 font-bold uppercase tracking-widest transition-colors">
              The professional way to connect your audience to all of your content.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 mb-12">
              <div className="relative w-full sm:w-auto rounded-[2rem] overflow-hidden border-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl dark:shadow-[0_0_20px_rgba(20,184,166,0.1)] transition-colors">
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-sm uppercase tracking-widest transition-colors">s2t.me/</span>
                <input
                  type="text"
                  placeholder="username"
                  className="w-full sm:w-80 pl-28 pr-8 py-6 bg-transparent outline-none font-black text-lg text-slate-900 dark:text-white uppercase tracking-tighter transition-colors"
                />
              </div>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-indigo-600 dark:bg-teal-500 text-white px-12 py-6 rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-teal-400 hover:scale-105 active:scale-95 transition-all shadow-xl dark:shadow-[0_0_30px_rgba(20,184,166,0.3)] flex items-center justify-center gap-4 group"
              >
                Join Free <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-slate-200 dark:border-slate-800 w-full lg:w-fit transition-colors">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?img=${i + 30}`} className="w-12 h-12 rounded-[1.2rem] border-4 border-white dark:border-[#0b0f19] shadow-lg rotate-3 first:rotate-0 transition-colors" alt="user" />
                ))}
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none transition-colors">5,000,000+</p>
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mt-1 transition-colors">Global Creators</p>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="relative h-[350px] sm:h-[450px] lg:h-[600px] w-full flex items-center justify-center scale-[0.6] sm:scale-75 lg:scale-100 origin-center mt-12 lg:mt-0">

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
              <div className="relative z-10 w-24 h-24 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-500/50 shadow-xl dark:shadow-[0_0_30px_rgba(20,184,166,0.3)] flex items-center justify-center transition-colors">
                <div className="absolute inset-0 rounded-full animate-pulse-ring"></div>
                <Search size={32} className="text-teal-500 dark:text-teal-400 transition-colors" />
              </div>

              {/* Data Nodes Container (Rotating Reverse to Radar) */}
              <div className="absolute top-0 left-0 w-full h-full animate-spin-reverse">

                {/* Node 1: Instagram (Ring 2) */}
                <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '0s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-pink-200 dark:border-pink-500/40 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/50 group-hover:border-pink-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                      <FaInstagram size={24} className="text-pink-500 dark:text-pink-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-pink-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">Instagram</span>
                  </div>
                </div>

                {/* Node 2: Facebook (Ring 3) */}
                <div className="absolute top-[75%] left-[15%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '1s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-blue-200 dark:border-blue-500/40 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 group-hover:border-blue-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <FaFacebookF size={22} className="text-blue-500 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-blue-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">Facebook</span>
                  </div>
                </div>

                {/* Node 3: LinkedIn (Ring 4) */}
                <div className="absolute top-[10%] left-[60%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-blue-200 dark:border-blue-400/40 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 group-hover:border-blue-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <FaLinkedinIn size={22} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-blue-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">LinkedIn</span>
                  </div>
                </div>

                {/* Node 4: WhatsApp (Ring 2) */}
                <div className="absolute top-[80%] left-[80%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '0.5s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-green-200 dark:border-green-500/40 group-hover:bg-green-50 dark:group-hover:bg-green-900/50 group-hover:border-green-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                      <FaWhatsapp size={24} className="text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-green-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">WhatsApp</span>
                  </div>
                </div>

                {/* Node 5: YouTube (Ring 3) */}
                <div className="absolute top-[40%] left-[85%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '1.5s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-red-200 dark:border-red-500/40 group-hover:bg-red-50 dark:group-hover:bg-red-900/50 group-hover:border-red-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                      <FaYoutube size={24} className="text-red-500 dark:text-red-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-red-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">YouTube</span>
                  </div>
                </div>

                {/* Node 6: Snapchat (Ring 4) */}
                <div className="absolute top-[90%] left-[20%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '2.5s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-yellow-200 dark:border-yellow-500/40 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-900/50 group-hover:border-yellow-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                      <FaSnapchat size={24} className="text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-yellow-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">Snapchat</span>
                  </div>
                </div>

                {/* Node 7: X (Twitter) (Ring 1) */}
                <div className="absolute top-[35%] left-[65%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '0.8s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-500/40 group-hover:bg-slate-200 dark:group-hover:bg-slate-800/50 group-hover:border-slate-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(148,163,184,0.2)]">
                      <FaXTwitter size={22} className="text-slate-900 dark:text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">X (Twitter)</span>
                  </div>
                </div>

                {/* Node 8: Pinterest (Ring 3) */}
                <div className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '1.2s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-red-200 dark:border-red-500/40 group-hover:bg-red-50 dark:group-hover:bg-red-900/50 group-hover:border-red-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                      <FaPinterest size={22} className="text-red-600 dark:text-red-500" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-red-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">Pinterest</span>
                  </div>
                </div>

                {/* Node 9: Discord (Ring 4) */}
                <div className="absolute top-[50%] left-[90%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '2.2s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-indigo-200 dark:border-indigo-500/40 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/50 group-hover:border-indigo-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      <FaDiscord size={24} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-indigo-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">Discord</span>
                  </div>
                </div>

                {/* Node 10: Telegram (Ring 2) */}
                <div className="absolute top-[65%] left-[35%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '0.3s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-sky-200 dark:border-sky-500/40 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/50 group-hover:border-sky-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(14,165,233,0.2)]">
                      <FaTelegram size={24} className="text-sky-500 dark:text-sky-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-sky-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">Telegram</span>
                  </div>
                </div>

                {/* Node 11: GitHub (Ring 3) */}
                <div className="absolute top-[10%] left-[40%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer animate-float" style={{ animationDelay: '1.8s' }}>
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-300 dark:border-slate-500/40 group-hover:bg-slate-200 dark:group-hover:bg-slate-800/50 group-hover:border-slate-400 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(148,163,184,0.2)]">
                      <FaGithub size={24} className="text-slate-800 dark:text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300/70 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded">GitHub</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      

      {/* Feature Section: The Most Accurate and In-Depth Data */}
      <section className="relative py-24 lg:py-32 bg-slate-50 dark:bg-[#0b0f19] overflow-hidden transition-colors duration-300">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-teal-900/50 dark:via-teal-900/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.03),transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 transition-colors">
              The Most Accurate and <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-400 dark:from-teal-400 dark:to-cyan-300">
                In-Depth Data
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
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
                className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-teal-500/10 hover:border-teal-400/40 hover:-translate-y-2 transition-all duration-500 shadow-md hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_20px_40px_-15px_rgba(20,184,166,0.15)] flex flex-col items-start text-left overflow-hidden"
              >
                {/* Inner Glow Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-10 group-hover:from-teal-500/20 group-hover:to-cyan-500/10 transition-all duration-500 z-0 pointer-events-none"></div>

                {/* Icon Container */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-100 dark:border-teal-500/20 flex items-center justify-center mb-6 shadow-inner group-hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-shadow duration-500">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="relative z-10 text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide mb-4 group-hover:text-teal-600 dark:group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="relative z-10 text-slate-500 dark:text-slate-400 leading-relaxed text-sm transition-colors">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
      {/* Core Ecosystem Section – Designed for Impact */}
      <section className="relative py-24 lg:py-32 bg-slate-50 dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800/50 overflow-hidden transition-colors duration-300">

        {/* Network Style Background */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none transition-opacity">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 dark:bg-teal-900/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 transition-colors">
              Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-400 dark:from-teal-400 dark:to-cyan-300">Ecosystem</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium uppercase tracking-widest transition-colors">
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
                className={`group relative p-8 rounded-2xl bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 hover:border-teal-400/50 dark:hover:border-teal-500/50 hover:-translate-y-2 transition-all duration-500 hover:shadow-xl dark:hover:shadow-[0_15px_40px_-15px_rgba(20,184,166,0.2)] overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-bottom-8`}
                style={{ animationDelay: module.delay, animationFillMode: 'both' }}
              >
                {/* Neon Glow on Hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-teal-500/30 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-all duration-500 relative">
                    {/* Pulse behind icon */}
                    <div className="absolute inset-0 rounded-xl bg-teal-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10">{module.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    {module.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm flex-grow group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  {module.desc}
                </p>

                {/* Bottom decorative line */}
                <div className="mt-6 w-8 h-px bg-slate-300 dark:bg-slate-700 group-hover:bg-teal-500 group-hover:w-16 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* AI Assistant Showcase */}
      {/* <AIAssistantShowcase /> */}

      {/* Add padding to the bottom so footer isn't right below hero if we had more sections */}
      <div className="h-32 border-t border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300"></div>

      {/* Render the new Dark OSINT Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
