
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import PhonePreview from '../components/PhonePreview';
import { UserProfile, THEMES, ButtonStyle } from '../types';
import { CheckCircle2, Palette, Eye, X } from 'lucide-react';
import client from '../src/api/client';

interface ThemesProps {
  onLogout: () => void;
}

const Themes: React.FC<ThemesProps> = ({ onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get('/auth/me.php');
        if (res.data.user) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleThemeSelect = async (themeId: string) => {
    if (!profile) return;
    const updated = { ...profile, theme: themeId };
    setProfile(updated);
    try {
      await client.post('/profile/update.php', { theme: themeId });
    } catch (err) {
      console.error('Failed to update theme', err);
    }
  };

  const handleButtonStyleSelect = async (style: ButtonStyle) => {
    if (!profile) return;
    const updated = { ...profile, buttonStyle: style };
    setProfile(updated);
    try {
      await client.post('/profile/update.php', { buttonStyle: style });
    } catch (err) {
      console.error('Failed to update button style', err);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isDashboard onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
        <div className="grid lg:grid-cols-[1fr,auto] gap-12 items-start">
          <div className="space-y-8">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Palette size={28} className="text-indigo-600" />
                  Appearance
                </h1>
                <p className="text-slate-500 mt-1">Customize the look and feel of your profile</p>
              </div>
              <button 
                onClick={() => setShowMobilePreview(true)}
                className="lg:hidden bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-indigo-100 text-sm"
              >
                <Eye size={18} /> Preview
              </button>
            </header>

            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-6">Visual Themes</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {Object.values(THEMES).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`relative group rounded-xl p-1 border-2 transition-all overflow-hidden ${
                      profile.theme === theme.id ? 'border-indigo-600' : 'border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className={`h-24 sm:h-32 w-full rounded-lg ${theme.background} flex flex-col items-center justify-center gap-2 p-2 shadow-inner`}>
                       <div className={`w-full h-1.5 sm:h-2 rounded ${theme.buttonClass} opacity-50`}></div>
                       <div className={`w-full h-1.5 sm:h-2 rounded ${theme.buttonClass}`}></div>
                       <div className={`w-full h-1.5 sm:h-2 rounded ${theme.buttonClass} opacity-50`}></div>
                    </div>
                    <div className="p-2 sm:p-3 text-left flex justify-between items-center bg-white">
                      <span className="font-semibold text-[10px] sm:text-sm truncate mr-1">{theme.name}</span>
                      {profile.theme === theme.id && <CheckCircle2 className="text-indigo-600 shrink-0" size={16} />}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-4">Button Style</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                 {[
                   { id: 'rounded-lg', label: 'Standard' },
                   { id: 'rounded-full', label: 'Rounded' },
                   { id: 'rounded-none', label: 'Square' },
                   { id: 'brutal', label: 'Brutal' }
                 ].map((style) => (
                   <button 
                    key={style.id}
                    onClick={() => handleButtonStyleSelect(style.id as ButtonStyle)}
                    className={`h-11 sm:h-12 border-2 text-xs sm:text-sm font-medium transition-all ${
                      style.id === 'brutal' ? (
                        profile.buttonStyle === 'brutal' 
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-none' 
                        : 'bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      ) : (
                        profile.buttonStyle === style.id || (!profile.buttonStyle && style.id === 'rounded-lg')
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-100 hover:border-slate-300'
                      )
                    } ${
                      style.id === 'rounded-full' ? 'rounded-full' : 
                      style.id === 'rounded-none' || style.id === 'brutal' ? 'rounded-none' : 'rounded-lg'
                    }`}
                   >
                     {style.label}
                   </button>
                 ))}
              </div>
            </section>
          </div>

          <div className="hidden lg:block sticky top-24">
            <PhonePreview profile={profile} />
          </div>
        </div>
      </main>

      {/* Mobile Preview Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden animate-in fade-in duration-300">
           <div className="relative animate-in slide-in-from-bottom-10 duration-500">
              <button 
                onClick={() => setShowMobilePreview(false)}
                className="absolute -top-4 -right-4 bg-white text-slate-900 p-2 rounded-full shadow-xl border border-slate-100 z-[70]"
              >
                <X size={24} />
              </button>
              <div className="max-h-[90vh] overflow-y-auto no-scrollbar bg-white rounded-[3rem] p-2 shadow-2xl">
                 <PhonePreview profile={profile} />
              </div>
           </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Themes;
