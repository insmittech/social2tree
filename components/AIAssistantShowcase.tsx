import React, { useState } from 'react';
import { Smartphone, Monitor, ChevronRight, MessageSquare, Send, CheckCircle, Shield, Globe, Lock, Cpu, Database, Eye, Zap, Sparkles, Copy, Search } from 'lucide-react';

const AIAssistantShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'app' | 'website'>('app');

  return (
    <section className="relative py-32 bg-[#05080f] overflow-hidden transition-colors duration-300 font-sans tracking-tight">
      {/* Deep Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.15),transparent_60%)] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(6,182,212,0.05),transparent_60%)] rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Content */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 text-teal-400 rounded-full text-sm font-bold uppercase tracking-[0.15em] mb-8 border border-teal-500/20">
            <Sparkles size={16} /> AI-Powered Platform
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8">
            Engage Every Visitor with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              AI Intelligence
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Smart assistants trained on your data to guide investigations and decisions.
          </p>

          {/* CTA & Toggle Switch */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button className="relative group overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-10 py-5 rounded-full text-lg font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.5)] flex items-center gap-3">
              <span className="relative z-10">Get Started Free</span>
              <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
            </button>

            {/* Toggle Switch */}
            <div className="flex items-center p-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-800 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
              <button
                onClick={() => setActiveTab('app')}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'app'
                    ? 'text-teal-300 shadow-md'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {activeTab === 'app' && (
                  <div className="absolute inset-0 bg-slate-800 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.2)] border border-teal-500/30"></div>
                )}
                <Smartphone size={16} className="relative z-10" />
                <span className="relative z-10">App</span>
              </button>
              <button
                onClick={() => setActiveTab('website')}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'website'
                    ? 'text-cyan-300 shadow-md'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {activeTab === 'website' && (
                  <div className="absolute inset-0 bg-slate-800 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-cyan-500/30"></div>
                )}
                <Monitor size={16} className="relative z-10" />
                <span className="relative z-10">Website</span>
              </button>
            </div>
          </div>
        </div>

        {/* Device Preview Area */}
        <div className="relative w-full max-w-6xl mx-auto mt-20 perspective-1000">
          
          {/* Main App/Website Container */}
          <div className="relative w-full transition-all duration-700 ease-out preserve-3d">
            
            {/* ---------------- MOBILE APP PREVIEW ---------------- */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out transform origin-bottom ${
                activeTab === 'app'
                  ? 'opacity-100 translate-y-0 scale-100 rotate-x-0 z-20 relative'
                  : 'opacity-0 translate-y-16 scale-95 rotate-x-12 z-0 pointer-events-none absolute'
              }`}
            >
              <div className="relative w-[340px] h-[720px] mx-auto bg-[#0b0f19] rounded-[3rem] border-[8px] border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(20,184,166,0.15)] overflow-hidden flex flex-col group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_80px_rgba(20,184,166,0.25)] transition-shadow duration-500">
                
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-50"></div>
                
                {/* Profile UI Header */}
                <div className="relative h-48 bg-gradient-to-b from-teal-900/40 to-[#0b0f19] flex flex-col items-center justify-end pb-4 pt-10">
                  <div className="div-bg absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.2),transparent)]"></div>
                  <div className="relative w-20 h-20 rounded-full border-2 border-teal-500/50 p-1 mb-3 bg-[#0b0f19] shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                    <img src="https://i.pravatar.cc/150?img=68" alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-teal-500 rounded-full border-2 border-[#0b0f19] flex items-center justify-center">
                      <CheckCircle size={10} className="text-[#0b0f19]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-wide">Alex Security</h3>
                  <p className="text-xs font-semibold text-teal-400 tracking-widest uppercase">Lead Investigator</p>
                </div>

                {/* Social/Data Icons */}
                <div className="flex justify-center gap-4 px-6 mb-6">
                  {[Globe, Lock, Shield, Eye].map((Icon, i) => (
                    <div key={i} className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
                      <Icon size={18} />
                    </div>
                  ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 px-5 overflow-hidden flex flex-col gap-4">
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Clearance Level</span>
                      <span className="text-xs font-black text-teal-400">Omega</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                    </div>
                  </div>
                  
                  <button className="w-full py-3.5 bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-bold rounded-2xl border border-slate-700 transition-colors flex items-center justify-center gap-2">
                    <Copy size={16} className="text-slate-400" /> Copy Public Key
                  </button>
                </div>

                {/* AI Chat Panel (Glassmorphism) */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-slate-900/80 backdrop-blur-xl border-t border-teal-500/20 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transform transition-transform">
                  <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4"></div>
                  
                  <div className="flex flex-col gap-3 mb-4 max-h-[160px] overflow-hidden relative fade-bottom">
                    <div className="self-end bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[11px] p-2.5 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed font-medium">
                      Analyze recent breach patterns?
                    </div>
                    <div className="self-start bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] p-2.5 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed font-medium flex gap-2">
                      <Sparkles size={12} className="text-teal-400 flex-shrink-0 mt-0.5" />
                      <span>Scanning 4,821 nodes... Pattern matched with 94% accuracy. Found 3 critical vulnerabilities in sub-domain configuration.</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input type="text" placeholder="Ask AI Assistant..." className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50" />
                    <button className="w-9 h-9 bg-teal-500 hover:bg-teal-400 rounded-xl flex items-center justify-center text-[#0b0f19] shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-colors">
                      <Send size={14} className="ml-0.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* ---------------- DESKTOP WEBSITE PREVIEW ---------------- */}
            <div
              className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out transform origin-bottom ${
                activeTab === 'website'
                  ? 'opacity-100 translate-y-0 scale-100 rotate-x-0 z-20 relative'
                  : 'opacity-0 translate-y-16 scale-95 rotate-x-12 z-0 pointer-events-none absolute'
              }`}
            >
              <div className="relative w-full max-w-5xl mx-auto rounded-xl border border-slate-800 shadow-[0_40px_80px_-20px_rgba(0,0,0,1),0_0_60px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden bg-[#0b0f19] group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,1),0_0_100px_rgba(6,182,212,0.25)] transition-shadow duration-500">
                
                {/* Browser Chrome */}
                <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500"></div>
                  </div>
                  <div className="mx-auto bg-slate-950/50 border border-slate-800 rounded-md px-32 py-1 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                    <Lock size={10} /> s2t.me/alex-security
                  </div>
                </div>

                {/* Dashboard Layout */}
                <div className="flex flex-1 min-h-[500px]">
                  
                  {/* Left Sidebar Profile */}
                  <div className="w-72 border-r border-slate-800 bg-[#05080f]/50 p-6 flex flex-col items-center">
                    <div className="relative w-28 h-28 rounded-full border-2 border-cyan-500/50 p-1 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                      <img src="https://i.pravatar.cc/150?img=68" alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-cyan-500 rounded-full border-2 border-[#0b0f19] flex items-center justify-center">
                        <CheckCircle size={12} className="text-[#0b0f19]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">Alex Security</h3>
                    <p className="text-sm font-bold text-cyan-400 tracking-wider uppercase mb-6">Lead Investigator</p>
                    
                    <div className="w-full space-y-3">
                       <button className="w-full py-3 bg-cyan-500 text-[#0b0f19] text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2">
                         <MessageSquare size={16} /> Contact Target
                       </button>
                       <button className="w-full py-3 bg-slate-800 text-slate-300 hover:text-white text-sm font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2">
                         <Copy size={16} /> Copy Public Key
                       </button>
                    </div>

                    <div className="mt-8 w-full border-t border-slate-800 pt-6">
                      <div className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer mb-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                          <Globe size={14} />
                        </div>
                        <span className="text-sm font-medium">Dark Web Scans</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer mb-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                          <Database size={14} />
                        </div>
                        <span className="text-sm font-medium">Breach Database</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-8 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.05),transparent_40%)] relative">
                    
                    {/* Embedded AI Assistant Widget */}
                    <div className="absolute right-8 bottom-8 w-[380px] bg-slate-900/60 backdrop-blur-2xl rounded-2xl border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(6,182,212,0.1)] flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse"></div>
                          <span className="text-sm font-bold text-white tracking-widest uppercase">AI Investigator</span>
                        </div>
                        <Sparkles size={16} className="text-cyan-500" />
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col gap-4 min-h-[280px]">
                        <div className="self-start bg-slate-800/80 border border-slate-700 text-slate-300 text-sm p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed flex gap-3">
                          <Cpu size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Hello. I've analyzed the linked profiles. Would you like me to cross-reference IPs or extract the latest comms?</span>
                        </div>

                        {/* Sample Questions */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full cursor-pointer hover:bg-cyan-500/20 transition-colors">Cross-reference IPs</span>
                          <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full cursor-pointer hover:bg-cyan-500/20 transition-colors">Scan recent breaches</span>
                        </div>

                        <div className="mt-auto self-end bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm p-3.5 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                          Identify any shared infrastructure.
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900/80 border-t border-slate-800/80">
                        <div className="flex gap-2 relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input type="text" placeholder="Command..." className="flex-1 bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all" />
                          <button className="w-12 h-12 bg-cyan-500 hover:bg-cyan-400 rounded-xl flex items-center justify-center text-[#0b0f19] shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-colors">
                            <Send size={18} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AIAssistantShowcase;
