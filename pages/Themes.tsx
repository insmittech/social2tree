
import React, { useState, useEffect } from 'react';
import PhonePreview from '../components/PhonePreview';
import { UserProfile, THEMES, ButtonStyle } from '../types';
import { CheckCircle2, Palette, Eye, X, Globe, Plus } from 'lucide-react';
import client from '../src/api/client';
import PageManager from '../components/PageManager';
import { useAuth } from '../src/context/AuthContext';
import { usePageSelector } from '../src/hooks/usePageSelector';


const Themes: React.FC = () => {
  const { user: profile, updateUser } = useAuth();
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { selectedPageId, setSelectedPageId } = usePageSelector();

  // Derived active page
  const activePage = profile?.pages?.find(p => p.id === selectedPageId) || profile?.pages?.[0] || null;

  useEffect(() => {
    if (profile && !selectedPageId && profile.pages?.length > 0) {
      setSelectedPageId(profile.pages[0].id);
    }
  }, [profile, selectedPageId, setSelectedPageId]);

  const handleThemeSelect = async (themeId: string) => {
    if (!profile || !activePage) return;

    const newPages = profile.pages.map(p => p.id === activePage.id ? { ...p, theme: themeId } : p);
    updateUser({ pages: newPages });

    try {
      await client.post('/pages/update.php', { id: activePage.id, theme: themeId });
    } catch (err) {
      console.error('Failed to update theme', err);
    }
  };

  const onPageCreated = (page: any) => {
    if (profile) {
      updateUser({ pages: [...profile.pages, page] });
    }
  };

  const handleButtonStyleSelect = async (style: ButtonStyle) => {
    if (!profile || !activePage) return;

    const newPages = profile.pages.map(p => p.id === activePage.id ? { ...p, buttonStyle: style } : p);
    updateUser({ pages: newPages });

    try {
      await client.post('/pages/update.php', { id: activePage.id, buttonStyle: style });
    } catch (err) {
      console.error('Failed to update button style', err);
    }
  };

  if (!profile || !activePage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
      <div className="grid lg:grid-cols-[1fr,auto] gap-12 items-start">
        <div className="space-y-8">
          <header className="flex flex-col gap-6">
            <PageManager
              pages={profile.pages}
              onPageCreated={onPageCreated}
              className="mb-4"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            </div>
          </header>

          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-6">Visual Themes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {Object.values(THEMES).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`relative group rounded-xl p-1 border-2 transition-all overflow-hidden ${activePage.theme === theme.id ? 'border-indigo-600' : 'border-transparent hover:border-slate-200'
                    }`}
                >
                  <div className={`h-24 sm:h-32 w-full rounded-lg ${theme.background} flex flex-col items-center justify-center gap-2 p-2 shadow-inner`}>
                    <div className={`w-full h-1.5 sm:h-2 rounded ${theme.buttonClass} opacity-50`}></div>
                    <div className={`w-full h-1.5 sm:h-2 rounded ${theme.buttonClass}`}></div>
                    <div className={`w-full h-1.5 sm:h-2 rounded ${theme.buttonClass} opacity-50`}></div>
                  </div>
                  <div className="p-2 sm:p-3 text-left flex justify-between items-center bg-white">
                    <span className="font-semibold text-[10px] sm:text-sm truncate mr-1">{theme.name}</span>
                    {activePage.theme === theme.id && <CheckCircle2 className="text-indigo-600 shrink-0" size={16} />}
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
                  className={`h-11 sm:h-12 border-2 text-xs sm:text-sm font-medium transition-all ${style.id === 'brutal' ? (
                    activePage.buttonStyle === 'brutal'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-none'
                      : 'bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  ) : (
                    activePage.buttonStyle === style.id || (!activePage.buttonStyle && style.id === 'rounded-lg')
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-100 hover:border-slate-300'
                  )
                    } ${style.id === 'rounded-full' ? 'rounded-full' :
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
          <PhonePreview page={activePage} />
        </div>
      </div>
    </div>
  );
};

export default Themes;
