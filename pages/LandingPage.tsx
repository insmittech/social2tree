import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TreePine, ArrowRight, Zap, Palette, BarChart3, QrCode } from 'lucide-react';
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

          <div className="relative lg:block hidden group">
            <div className="absolute -inset-20 bg-indigo-600/5 rounded-full blur-[120px] group-hover:bg-indigo-600/10 transition-colors duration-1000"></div>
            <div className="relative bg-slate-950 p-8 rounded-[4.5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] max-w-[360px] mx-auto border-[12px] border-slate-900">
              <div className="bg-white rounded-[3.5rem] overflow-hidden min-h-[540px] p-10 text-center flex flex-col items-center">
                <div className="w-28 h-28 rounded-[2.5rem] bg-slate-50 mb-8 p-1.5 border-4 border-slate-50 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <img src="https://i.pravatar.cc/400?img=33" className="w-full h-full rounded-[2.2rem] object-cover shadow-2xl" alt="preview" />
                </div>
                <div className="mb-10">
                  <h4 className="font-black text-3xl text-slate-900 tracking-tight italic uppercase">Alex Rivera</h4>
                  <div className="h-1 w-12 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="w-full space-y-5">
                  <div className="py-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 text-xs font-black uppercase tracking-[0.2em] text-slate-500 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">View Portfolio</div>
                  <div className="py-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 text-xs font-black uppercase tracking-[0.2em] text-slate-500 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">Latest Art Drop</div>
                  <div className="py-5 bg-slate-900 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl hover:bg-indigo-600 transition-colors cursor-pointer">Join Community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section id="features" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-left mb-24">
            <p className="text-indigo-600 font-black uppercase tracking-[0.4em] text-xs mb-4">Core Ecosystem</p>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic">Designed for Impact.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Palette size={40} strokeWidth={2.5} />,
                title: "Premium Themes",
                desc: "Every pixel is crafted for luxury. Responsive, fast, and infinitely customizable."
              },
              {
                icon: <BarChart3 size={40} strokeWidth={2.5} />,
                title: "Live Insights",
                desc: "Real-time data visualization. Understand your audience at a molecular level."
              },
              {
                icon: <QrCode size={40} strokeWidth={2.5} />,
                title: "Dynamic QR",
                desc: "Bridge physical and digital with high-resolution, trackable QR codes for your brand."
              }
            ].map((f, i) => (
              <div key={i} className="group p-12 rounded-[3.5rem] border-4 border-slate-50 hover:border-indigo-600/10 hover:bg-slate-50/50 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)]">
                <div className="w-20 h-20 bg-slate-900 text-white rounded-[1.8rem] flex items-center justify-center mb-10 group-hover:bg-indigo-600 group-hover:rotate-[10deg] transition-all duration-500 shadow-2xl shadow-indigo-100">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight uppercase italic">{f.title}</h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed uppercase tracking-wider">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extreme CTA Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto bg-slate-950 rounded-[4rem] p-16 md:p-32 text-center text-white relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.2),transparent)]"></div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-9xl font-black mb-12 tracking-tighter uppercase italic leading-[0.8] transition-transform duration-1000 group-hover:scale-[1.02]">
              Start Your <br />
              <span className="text-indigo-500">Legacy.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-16 max-w-xl mx-auto font-bold uppercase tracking-[0.2em] leading-relaxed">Join the elite creators scaling their reach with Social2Tree Hub.</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-4 bg-white text-slate-950 px-16 py-7 rounded-full text-2xl font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-2xl hover:px-20 active:scale-95"
            >
              Get Started <ArrowRight size={32} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      <Footer
        exploreLinks={menuLinks.footer_explore.length > 0 ? menuLinks.footer_explore : undefined}
        legalLinks={menuLinks.footer_legal.length > 0 ? menuLinks.footer_legal : undefined}
      />
    </div>
  );
};

export default LandingPage;
