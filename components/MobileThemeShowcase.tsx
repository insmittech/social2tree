import React, { useRef, useState, useEffect } from 'react';
import { Shield, Eye, Zap, Database, Globe, ChevronLeft, ChevronRight, User, Activity, Search, Crosshair, Map } from 'lucide-react';

const themes = [
  {
    id: 'stealth-mode',
    title: 'Stealth Mode',
    desc: 'Minimal dark interface for focused, distraction-free investigations.',
    icon: <Eye size={18} className="text-zinc-400" />,
    glowColor: 'rgba(161, 161, 170, 0.3)', // Zinc
    borderColor: 'border-zinc-700',
    Content: () => (
      <div className="w-full h-full bg-[#0a0a0a] pt-14 px-4 pb-6 flex flex-col">
        {/* Stealth UI */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">Incognito Base</span>
          </div>
          <User size={16} className="text-zinc-400" />
        </div>
        <div className="w-full bg-[#111] border border-zinc-800 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-2 mb-2">
            <Search size={14} className="text-zinc-500" />
            <span className="text-zinc-600 text-xs font-mono">Input target hash...</span>
          </div>
          <div className="flex justify-between text-zinc-500 text-[10px]">
             <span>Tor</span>
             <span>I2P</span>
             <span>Freenet</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-3 opacity-60">
              <div className="w-1 h-8 bg-zinc-800 rounded-full"></div>
              <div>
                <div className="w-24 h-2 bg-zinc-800 rounded mb-1"></div>
                <div className="w-16 h-1.5 bg-zinc-900 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'analyst-pro',
    title: 'Analyst Pro',
    desc: 'Advanced dashboard with live intelligence feeds and visual data.',
    icon: <Activity size={18} className="text-blue-400" />,
    glowColor: 'rgba(59, 130, 246, 0.3)', // Blue
    borderColor: 'border-blue-500/50',
    Content: () => (
      <div className="w-full h-full bg-[#0f172a] pt-14 px-4 pb-6 flex flex-col">
        {/* Analyst UI */}
        <h4 className="text-white text-lg font-bold mb-4">Intel Overview</h4>
        <div className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 mb-4 flex justify-between items-end h-24">
          {['30%','50%','40%','80%','60%','90%','40%'].map((h, i) => (
             <div key={i} className="w-4 bg-blue-500/50 rounded-t-sm" style={{height: h}}>
               {i === 5 && <div className="w-full h-full bg-blue-400 animate-pulse"></div>}
             </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
            <p className="text-slate-400 text-[10px] uppercase">Signals</p>
            <p className="text-white text-lg font-bold">1.2M</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
            <p className="text-slate-400 text-[10px] uppercase">Alerts</p>
            <p className="text-blue-400 text-lg font-bold">14</p>
          </div>
        </div>
        <div className="flex-1 border border-slate-700/50 rounded-lg overflow-hidden relative">
           <Map size={40} className="text-blue-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-pulse"></div>
        </div>
      </div>
    )
  },
  {
    id: 'rapid-search',
    title: 'Rapid Search',
    desc: 'Optimized layout for lightning-fast OSINT queries and pivot tables.',
    icon: <Zap size={18} className="text-amber-400" />,
    glowColor: 'rgba(245, 158, 11, 0.3)', // Amber
    borderColor: 'border-amber-500/50',
    Content: () => (
      <div className="w-full h-full bg-[#18181b] pt-14 px-4 pb-6 flex flex-col">
        {/* Rapid Search UI */}
        <div className="w-full h-12 bg-zinc-900 border border-amber-500/50 rounded-full flex items-center px-4 mb-6 shadow-[0_0_15px_rgba(245,158,11,0.15)] relative">
           <Zap size={18} className="text-amber-400 mr-2" />
           <span className="text-zinc-400 text-sm">Query entity...</span>
           <div className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-amber-500/20 text-amber-500 text-[10px] rounded font-bold">↵</div>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-hidden">
           <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] whitespace-nowrap">Email</span>
           <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] whitespace-nowrap">Phone</span>
           <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[10px] whitespace-nowrap">Crypto</span>
        </div>
        <div className="flex-1 space-y-2">
           {[1,2,3,4].map(i => (
             <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-zinc-300 text-xs font-mono">+1 (555) 019-283{i}</p>
                  <p className="text-amber-500/70 text-[10px]">High Confidence</p>
                </div>
                <ChevronRight size={14} className="text-zinc-600" />
             </div>
           ))}
        </div>
      </div>
    )
  },
  {
    id: 'deep-dark',
    title: 'Deep Dark',
    desc: 'Tailored for deep web surveillance and forum tracking workflows.',
    icon: <Globe size={18} className="text-teal-400" />,
    glowColor: 'rgba(20, 184, 166, 0.3)', // Teal
    borderColor: 'border-teal-500/50',
    Content: () => (
      <div className="w-full h-full bg-[#05080f] pt-14 px-4 pb-6 flex flex-col">
        {/* Deep Dark UI */}
        <div className="flex items-center justify-between mb-4">
           <h4 className="text-white text-base font-bold">Active Forums</h4>
           <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div><div className="w-1.5 h-1.5 rounded-full bg-teal-500/50"></div><div className="w-1.5 h-1.5 rounded-full bg-teal-500/20"></div></div>
        </div>
        
        <div className="space-y-3 flex-1 overflow-hidden relative">
           <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#05080f] to-transparent z-10"></div>
           {[1,2,3,4].map(i => (
             <div key={i} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
               <div className="flex justify-between items-start mb-2">
                 <p className="text-teal-400 text-xs font-bold leading-tight flex items-center gap-1">
                   <Globe size={10} /> Market {i}A
                 </p>
                 <span className="text-slate-500 text-[8px]">1m ago</span>
               </div>
               <p className="text-slate-300 text-[10px] leading-relaxed">
                 New dump detected matching predefined hash rules. Extracted {i*10}00 lines of structured PII.
               </p>
             </div>
           ))}
        </div>
      </div>
    )
  },
  {
    id: 'command-center',
    title: 'Command Center',
    desc: 'Unified view of all active intelligence streams and agent activity.',
    icon: <Shield size={18} className="text-purple-400" />,
    glowColor: 'rgba(168, 85, 247, 0.3)', // Purple
    borderColor: 'border-purple-500/50',
    Content: () => (
      <div className="w-full h-full bg-[#1e1b4b] pt-14 px-4 pb-6 flex flex-col">
        {/* Command Center UI */}
         <div className="flex justify-between items-center mb-6">
            <h4 className="text-white text-lg font-bold tracking-widest uppercase text-center w-full">G.O.D.S. Eye</h4>
         </div>
         {/* Radar Simulation */}
         <div className="w-24 h-24 rounded-full border border-purple-500/30 mx-auto mb-6 relative flex items-center justify-center">
            <div className="absolute inset-1 rounded-full border border-purple-500/20"></div>
            <div className="w-1 h-full bg-gradient-to-b from-purple-400/50 to-transparent absolute top-0 left-1/2 origin-bottom animate-[spin_4s_linear_infinite]"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)] absolute top-4 left-6"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)] absolute bottom-4 right-6"></div>
         </div>
         <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="bg-indigo-950/50 rounded-lg border border-purple-500/20 p-2 flex flex-col items-center justify-center">
               <Crosshair size={16} className="text-purple-400 mb-1" />
               <span className="text-white text-[10px] uppercase">Lock On</span>
            </div>
            <div className="bg-indigo-950/50 rounded-lg border border-purple-500/20 p-2 flex flex-col items-center justify-center">
               <Database size={16} className="text-pink-400 mb-1" />
               <span className="text-white text-[10px] uppercase">Extract</span>
            </div>
            <div className="col-span-2 bg-purple-900/30 rounded-lg p-2 flex items-center justify-between border border-purple-500/30">
               <span className="text-purple-200 text-xs">System Status</span>
               <span className="text-green-400 text-xs font-bold animate-pulse">NOMINAL</span>
            </div>
         </div>
      </div>
    )
  }
];

const MobileThemeShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll loop logic could go here, but IntersectionObserver is better for snap carousels to determine "active" child
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find the index of the intersecting element
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // Trigger when 60% of the item is visible
      }
    );

    const items = containerRef.current?.querySelectorAll('.snap-item');
    items?.forEach((item) => observer.observe(item));

    return () => {
      items?.forEach((item) => observer.unobserve(item));
    };
  }, []);

  const handleScrollTo = (index: number) => {
    const container = containerRef.current;
    if (container) {
      const items = container.querySelectorAll('.snap-item');
      if (items[index]) {
        items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0b0f19] via-[#05080f] to-[#0b0f19] overflow-hidden border-t border-slate-800/50 border-b">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
          Explore Interface <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Themes</span>
        </h2>
        <p className="text-lg text-slate-400 leading-relaxed font-medium">
          Optimized layouts for intelligence workflows
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative z-10 w-full overflow-hidden flex flex-col items-center">
        
        {/* Scrollable Area */}
        <div 
          ref={containerRef}
          className="w-full flex gap-12 overflow-x-auto snap-x snap-mandatory px-[calc(50vw-150px)] pb-12 pt-8 hide-scrollbar scroll-smooth"
        >
          {themes.map((theme, index) => {
            const isActive = index === activeIndex;
            return (
              <div 
                key={theme.id}
                data-index={index}
                className={`snap-item snap-center shrink-0 group relative transition-all duration-700 ease-in-out cursor-pointer ${
                  isActive ? 'scale-110 z-20' : 'scale-95 opacity-60 hover:opacity-100 z-10'
                }`}
                onClick={() => handleScrollTo(index)}
              >
                {/* Phone Frame */}
                <div 
                  className={`relative w-[300px] h-[620px] rounded-[48px] border-[8px] bg-[#0b0f19] border-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 transition-shadow duration-700
                    ${isActive ? 'ring-white/20' : 'ring-transparent'}`}
                  style={{
                    boxShadow: isActive ? `0 0 50px ${theme.glowColor}` : undefined
                  }}
                >
                  
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-50 flex items-center justify-between px-3">
                     <div className="w-3 h-3 rounded-full bg-zinc-800 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div></div>
                     <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                  </div>

                  {/* Glass Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-40 mix-blend-overlay"></div>

                  {/* UI Content Injection */}
                  <theme.Content />

                </div>

                {/* Text Caption Below */}
                <div 
                  className={`mt-8 text-center transition-all duration-500 transform
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {theme.icon}
                    <h3 className="text-white font-bold text-xl">{theme.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">
                    {theme.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Controls (Optional but good for UX) */}
        <div className="flex items-center justify-center gap-6 mt-4">
           <button 
             onClick={() => handleScrollTo(Math.max(0, activeIndex - 1))}
             disabled={activeIndex === 0}
             className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
           >
              <ChevronLeft size={20} />
           </button>
           <div className="flex gap-2">
             {themes.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => handleScrollTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-6 bg-teal-400' : 'bg-slate-700'}`}
                ></button>
             ))}
           </div>
           <button 
             onClick={() => handleScrollTo(Math.min(themes.length - 1, activeIndex + 1))}
             disabled={activeIndex === themes.length - 1}
             className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
           >
              <ChevronRight size={20} />
           </button>
        </div>

      </div>
    </section>
  );
};

export default MobileThemeShowcase;
