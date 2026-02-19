
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TreePine, CheckCircle2, ArrowRight, Zap, Palette, BarChart3, QrCode } from 'lucide-react';

interface LandingPageProps {
  isAuthenticated: boolean;
  userProfile: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ isAuthenticated, userProfile }) => {
  return (
    <div className="min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} userProfile={userProfile} />

      {/* Hero Section */}
      <section className="bg-white pt-20 pb-32 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 skew-x-[-15deg] translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} fill="currentColor" /> Reimagined for 2024
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              One Link. One QR.<br />
              <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Digital Identity.</span>
            </h1>
            <p className="mt-8 text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Join millions of creators using Social2Tree to share everything they create, sell, and curate in one clean hub.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="relative w-full sm:w-auto">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">s2t.com/</span>
                <input
                  type="text"
                  placeholder="username"
                  className="w-full sm:w-80 pl-24 pr-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-0 outline-none transition-all shadow-xl shadow-slate-200/50 font-bold text-lg"
                />
              </div>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group active:scale-95"
              >
                Get Started <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-10 opacity-50 font-bold">
              <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-indigo-600" /> No CC Required</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-indigo-600" /> Free Forever</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="relative bg-slate-900 p-2 rounded-[3.5rem] shadow-2xl overflow-hidden border-8 border-slate-950">
              <img
                src="https://picsum.photos/seed/mobilepreview/500/1000"
                alt="Social2Tree Preview"
                className="rounded-[2.8rem] w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col items-center justify-end pb-12">
                <div className="bg-white p-3 rounded-2xl shadow-2xl mb-4">
                  <QrCode size={48} className="text-slate-900" />
                </div>
                <p className="text-white font-bold tracking-widest text-xs uppercase">Scan to visit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Palette size={24} />
            </div>
            <h3 className="text-2xl font-bold">Unmatched Themes</h3>
            <p className="text-slate-400 font-medium">From Neo-Brutalism to high-end Glassmorphism. Express your brand exactly how you want.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-2xl font-bold">Pro Analytics</h3>
            <p className="text-slate-400 font-medium">Track views, clicks, and QR scans in real-time. Know exactly where your audience is coming from.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <QrCode size={24} />
            </div>
            <h3 className="text-2xl font-bold">Physical Connection</h3>
            <p className="text-slate-400 font-medium">Every profile comes with a unique QR code. Print it on stickers, business cards, or storefronts.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <TreePine className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">Social2Tree</span>
          </div>
          <div className="flex gap-10 font-bold text-slate-500 text-sm">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>
          <p className="text-sm font-bold text-slate-400">© 2024 S2T Hub. Made with passion.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
