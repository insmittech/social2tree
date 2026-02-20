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
    <div className="min-h-screen bg-slate-50">
      <Navbar isAuthenticated={isAuthenticated} userProfile={userProfile} />

      {/* Hero Section */}
      <section className="bg-white pt-20 pb-24 px-4 overflow-hidden relative border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
              Social Identity Hub
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight mb-8">
              Everything you are, <br />
              <span className="text-indigo-600">in one simple link.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
              Join millions of creators using Social2Tree to curate their best work, sell products, and grow their community in one clean hub.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <div className="relative w-full sm:w-auto rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">s2t.me/</span>
                <input
                  type="text"
                  placeholder="username"
                  className="w-full sm:w-64 pl-20 pr-4 py-4 bg-transparent outline-none font-bold text-sm"
                />
              </div>
              <Link
                to="/register"
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2 group"
              >
                Claim My Link <ArrowRight size={18} />
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="user" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400">Trusted by 5M+ creators worldwide</p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-slate-900 p-4 rounded-xl shadow-xl max-w-[320px] mx-auto border border-slate-800">
              <div className="bg-white rounded-lg overflow-hidden min-h-[480px] p-6 text-center space-y-6">
                <div className="w-20 h-20 rounded-full mx-auto bg-slate-100 flex items-center justify-center">
                  <img src="https://i.pravatar.cc/150?img=33" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-900">Alex Rivera</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Digital Artist</p>
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">My Portfolio</div>
                  <div className="h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">Latest Drop</div>
                  <div className="h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">Join Community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Powering the creator economy</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale items-center">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <TreePine size={24} /> BRAND {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Palette size={24} />,
              title: "Custom Themes",
              desc: "Professional themes designed for clarity and high conversion. Match your brand exactly."
            },
            {
              icon: <BarChart3 size={24} />,
              title: "Pro Analytics",
              desc: "Real-time insights on your audience. See what drives clicks and conversions."
            },
            {
              icon: <QrCode size={24} />,
              title: "QR Integration",
              desc: "Dynamic QR codes for every profile. Perfect for merging physical and digital worlds."
            }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-xl border border-slate-200 hover:border-indigo-100 hover:bg-slate-50 transition-all">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to simplify your presence?
          </h2>
          <p className="text-slate-400 mb-10 max-w-lg mx-auto">Join over 5 million creators who have already simplified their social identity with Social2Tree.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Claim My Link Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <TreePine className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">Social2Tree</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              The professional way to connect your audience to all of your content in one compact link.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 uppercase text-xs mb-6">Explore</h5>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><Link to="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
              <li><Link to="/features" className="hover:text-indigo-600">Features</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 uppercase text-xs mb-6">Legal</h5>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-indigo-600">Privacy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-400">© 2024 Social2Tree Hub. Developed by insmittech.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
