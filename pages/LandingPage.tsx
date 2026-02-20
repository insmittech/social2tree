
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TreePine, CheckCircle2, ArrowRight, Zap, Palette, BarChart3, QrCode, Plus } from 'lucide-react';

interface LandingPageProps {
  isAuthenticated: boolean;
  userProfile: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ isAuthenticated, userProfile }) => {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar isAuthenticated={isAuthenticated} userProfile={userProfile} />

      {/* Hero Section */}
      <section className="bg-white pt-24 pb-32 px-4 overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 skew-x-[-15deg] translate-x-1/4"></div>
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-indigo-200/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-purple-200/20 rounded-full blur-[120px] -z-10 animate-pulse duration-5000"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-left duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Reimagined Social Identity
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8 italic">
              Everything you<br />
              <span className="text-indigo-600 not-italic">are,</span> in one link.
            </h1>
            <p className="text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-bold mb-12">
              Join 5M+ creators using Social2Tree to curate their best work, sell products, and grow their community in one beautiful hub.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <div className="relative w-full sm:w-auto overflow-hidden rounded-2xl group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg pointer-events-none group-focus-within:text-indigo-600 transition-colors">s2t.me/</span>
                <input
                  type="text"
                  placeholder="username"
                  className="w-full sm:w-80 pl-24 pr-6 py-5 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-black text-lg placeholder:text-slate-200"
                />
              </div>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-slate-900 text-white px-12 py-5 rounded-2xl text-lg font-black hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 group active:scale-95"
              >
                Claim My Link <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt="user" />
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-[10px] text-white font-black">+5k</div>
              </div>
              <p className="text-sm font-bold text-slate-400">Trusted by world-class creators</p>
            </div>
          </div>

          <div className="relative lg:scale-110">
            {/* Dynamic Floating Elements */}
            <div className="absolute top-1/4 -left-12 bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-bounce duration-[3000ms] z-20 hidden md:flex border border-slate-100">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">New Click</p>
                <p className="text-slate-900 font-black">+124 Today</p>
              </div>
            </div>

            <div className="absolute bottom-1/4 -right-8 bg-white p-5 rounded-3xl shadow-2xl z-20 hidden md:block border border-slate-100 rotate-6 animate-pulse">
              <QrCode size={40} className="text-slate-900" />
            </div>

            <div className="relative bg-slate-950 p-3 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden border-[12px] border-slate-900 mx-auto max-w-[340px]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-900 rounded-b-3xl z-30"></div>
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
                alt="Social2Tree Preview"
                className="rounded-[3rem] w-full opacity-90 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col items-center justify-end pb-16 px-8 text-center">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] w-full">
                  <div className="w-16 h-16 rounded-full border-4 border-white/20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                  <h4 className="text-white font-black text-xl mb-1 mt-2">Alex Rivera</h4>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6 italic">Designer / Creator</p>
                  <div className="space-y-3">
                    <div className="h-10 bg-white/10 rounded-xl border border-white/5"></div>
                    <div className="h-10 bg-white/10 rounded-xl border border-white/5"></div>
                    <div className="h-10 bg-indigo-600 rounded-xl transition-all"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Marquee */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className="flex items-center gap-20 whitespace-nowrap animate-marquee opacity-20 grayscale filter group hover:grayscale-0 transition-all duration-500">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center gap-3 text-2xl font-black text-slate-900 italic">
                <TreePine size={32} /> CREATOR HUB {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-12 relative z-10">
          {[
            {
              icon: <Palette size={28} />,
              title: "Unmatched Themes",
              desc: "From Neo-Brutalism to high-end Glassmorphism. Express your brand exactly how you want.",
              color: "bg-indigo-600",
              light: "bg-indigo-50"
            },
            {
              icon: <BarChart3 size={28} />,
              title: "Pro Analytics",
              desc: "Track views, clicks, and QR scans in real-time. Know exactly where your audience is coming from.",
              color: "bg-emerald-600",
              light: "bg-emerald-50"
            },
            {
              icon: <QrCode size={28} />,
              title: "Digital Business Card",
              desc: "Every profile comes with a unique QR code. Print it on stickers, business cards, or storefronts.",
              color: "bg-rose-600",
              light: "bg-rose-50"
            }
          ].map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:border-white transition-all hover:shadow-2xl hover:shadow-indigo-500/5 group">
              <div className={`w-16 h-16 ${f.light} ${f.color.replace('bg-', 'text-')} rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 font-bold leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Frequently asked questions</h2>
          <p className="text-slate-500 font-bold mt-4">Everything you need to know about Social2Tree.</p>
        </div>
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {[
            { q: "Is Social2Tree really free?", a: "Yes! You can claim your unique URL and build a complete page with multiple links for free, forever." },
            { q: "Can I use my own custom domain?", a: "Absolutely. Our Pro plan allows you to link your custom domain (e.g., links.mybrand.com) seamlessly." },
            { q: "How many trees can I create?", a: "With one account, you can manage multiple Bio Trees for different brands or projects." }
          ].map((faq, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all cursor-pointer">
              <h4 className="text-lg font-black text-slate-900 flex justify-between items-center italic">
                {faq.q}
                <Plus size={20} className="text-indigo-600 group-hover:rotate-90 transition-all" />
              </h4>
              <p className="mt-4 text-slate-500 font-bold leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6">Launch in seconds.</h2>
            <p className="text-slate-400 font-bold text-xl">Three steps to a more powerful digital presence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Claim Hub", desc: "Secure your unique s2t.me/brand URL." },
              { step: "02", title: "Add Content", desc: "Add links, social icons, and your logo." },
              { step: "03", title: "Share Global", desc: "Paste your link on Instagram, TikTok, and more." }
            ].map((s, i) => (
              <div key={i} className="relative group">
                <div className="text-8xl font-black text-white/5 absolute -top-12 -left-4 group-hover:text-indigo-500/20 transition-colors">{s.step}</div>
                <div className="relative">
                  <h3 className="text-3xl font-black mb-4 italic">{s.title}</h3>
                  <p className="text-slate-400 font-bold leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic">Why we're <span className="text-indigo-600">better.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100">
              <h4 className="text-xl font-black mb-10 uppercase tracking-widest text-slate-400">Traditional Links</h4>
              <ul className="space-y-8 font-bold text-slate-400">
                <li className="flex items-center gap-4">Basic, dated appearance</li>
                <li className="flex items-center gap-4">Limited analytics</li>
                <li className="flex items-center gap-4">No custom domains</li>
                <li className="flex items-center gap-4">Static, boring layouts</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-200 border-4 border-indigo-600">
              <h4 className="text-xl font-black mb-10 uppercase tracking-widest text-indigo-400">Social2Tree Hub</h4>
              <ul className="space-y-8 font-bold text-white">
                <li className="flex items-center gap-4"><CheckCircle2 className="text-indigo-500" /> High-End Glassmorphism</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="text-indigo-500" /> Real-time Pro Stats</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="text-indigo-500" /> Full Custom Domain Support</li>
                <li className="flex items-center gap-4"><CheckCircle2 className="text-indigo-500" /> Dynamic, Interactive Themes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-indigo-600 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <h2 className="text-4xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter relative z-10 italic">
            Ready to claim your<br />digital corner?
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-white text-indigo-600 px-12 py-6 rounded-[2rem] text-xl font-black hover:bg-slate-50 transition-all shadow-2xl active:scale-95 relative z-10"
          >
            Get Started for Free <ArrowRight size={24} />
          </Link>
          <p className="mt-10 text-indigo-100 font-black uppercase tracking-widest text-xs opacity-60">Join 5,000,000+ happy users</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-slate-900 p-2 rounded-xl">
                <TreePine className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">Social2Tree</span>
            </div>
            <p className="text-slate-500 font-bold max-w-sm leading-relaxed mb-8">
              The simplest way to connect your audience to all of your content in one compact link.
            </p>
          </div>
          <div>
            <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Explore</h5>
            <ul className="space-y-4 font-bold text-slate-500 text-sm">
              <li><Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
              <li><Link to="/features" className="hover:text-indigo-600 transition-colors">Features</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Analytics</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Support</h5>
            <ul className="space-y-4 font-bold text-slate-500 text-sm">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Status</a></li>
              <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Partnerships</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-black text-slate-400">© 2024 Social2Tree Hub. Design credits: insmittech.</p>
          <div className="flex gap-10 font-black text-slate-400 text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
