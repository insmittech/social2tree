
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { THEMES, ButtonStyle, Link, PlanType, UserRole } from '../types';

interface PublicProfileData {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: string;
  buttonStyle: ButtonStyle;
  plan: PlanType;
  role: UserRole;
  isVerified: boolean;
  links: Link[];
}
import { Helmet } from 'react-helmet-async';
import client from '../src/api/client';
import { TreePine, Share2, Lock, X, ShieldCheck } from 'lucide-react';
import { getSocialIcon } from '../src/utils/socialIcons';

const PublicProfile: React.FC = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{ isOpen: boolean; linkId: string; url: string; correctPassword?: string | null } | null>(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get(`/public/get_profile.php?username=${username}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  // Track Page View
  useEffect(() => {
    if (profile?.id) {
      try {
        client.post('/analytics/track.php', { page_id: profile.id });
      } catch (e) {
        console.error("Failed to track page view", e);
      }
    }
  }, [profile?.id]);

  const handleLinkClick = async (id: string, url: string, password?: string | null) => {
    if (password) {
      setPasswordModal({ isOpen: true, linkId: id, url, correctPassword: password });
      setEnteredPassword('');
      setPasswordError(false);
      return;
    }

    try {
      client.post('/analytics/track.php', { link_id: id });
    } catch (e) {
      console.error(e);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePasswordSubmit = () => {
    if (passwordModal && enteredPassword === passwordModal.correctPassword) {
      const { linkId, url } = passwordModal;
      try {
        client.post('/analytics/track.php', { link_id: linkId });
      } catch (e) {
        console.error(e);
      }
      window.open(url, '_blank', 'noopener,noreferrer');
      setPasswordModal(null);
    } else {
      setPasswordError(true);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Tree not found 🌲</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">The user @{username} doesn't exist.</p>
      <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors">Claim this username</a>
    </div>
  );

  const theme = THEMES[profile.theme] || THEMES.default;

  const getButtonStyle = (baseClass: string, style?: ButtonStyle) => {
    const filteredBase = baseClass.split(' ').filter(c => !c.startsWith('rounded-')).join(' ');
    switch (style) {
      case 'rounded-full': return `${filteredBase} rounded-full`;
      case 'rounded-none': return `${filteredBase} rounded-none`;
      case 'brutal': return `${filteredBase} rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`;
      case 'rounded-lg':
      default: return `${filteredBase} rounded-lg`;
    }
  };

  const isLinkActive = (link: any) => {
    if (!link.active) return false;
    const now = new Date();
    if (link.scheduledStart && new Date(link.scheduledStart) > now) return false;
    if (link.scheduledEnd && new Date(link.scheduledEnd) < now) return false;
    return true;
  };

  return (
    <div className={`min-h-screen flex flex-col items-center ${theme.background} transition-colors duration-500`}>
      <Helmet>
        <title>{profile.displayName} | Social2Tree</title>
        <meta name="description" content={profile.bio || `Check out ${profile.displayName}'s links on Social2Tree.`} />
        <meta property="og:title" content={`${profile.displayName} - Social2Tree`} />
        <meta property="og:description" content={profile.bio} />
        <meta property="og:image" content={profile.avatarUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <header className="w-full max-w-[580px] pt-16 pb-8 px-6 flex flex-col items-center">
        <button className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-slate-900/40/10 hover:bg-white/20 transition-all backdrop-blur-lg border border-white/20 text-white">
          <Share2 size={20} />
        </button>

        <img
          src={profile.avatarUrl}
          alt={profile.displayName}
          className="w-24 h-24 rounded-full border-4 border-white/30 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] object-cover mb-4"
        />
        <div className="flex items-center gap-2 mb-2">
          <h1 className={`text-2xl font-bold tracking-tight ${theme.textClass}`}>{profile.displayName}</h1>
          {profile.isVerified && <ShieldCheck className="text-blue-500 fill-blue-500/10" size={24} />}
        </div>
        <p className={`text-center max-w-[320px] text-sm leading-relaxed opacity-90 ${theme.textClass}`}>{profile.bio}</p>
      </header>

      <main className="w-full max-w-[580px] px-6 space-y-4 pb-12">
        {profile.links.filter(l => isLinkActive(l) && l.type !== 'social_icon').map(link => (
          <button
            key={link.id}
            onClick={() => handleLinkClick(link.id, link.url, link.password)}
            className={`flex items-center justify-between w-full min-h-[56px] px-6 py-4 text-base font-semibold shadow-sm dark:shadow-none transition-all transform hover:scale-[1.02] active:scale-[0.98] ${getButtonStyle(theme.buttonClass, profile.buttonStyle)}`}
          >
            <span className="flex-grow text-center">{link.title}</span>
            {link.password && <Lock size={16} className="opacity-60" />}
          </button>
        ))}
      </main>

      {/* Password Modal */}
      {passwordModal?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900/40 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl dark:shadow-none space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
            <button
              onClick={() => setPasswordModal(null)}
              className="absolute top-4 right-6 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">Password Protected</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Please enter the password to access this link.</p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter link password"
                  autoFocus
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className={`w-full bg-slate-50 dark:bg-[#0b0f19] border ${passwordError ? 'border-red-300 ring-red-100' : 'border-slate-200 dark:border-slate-700/50 focus:ring-amber-100'} rounded-2xl px-5 py-4 focus:ring-4 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 text-center tracking-[0.3em]`}
                />
                {passwordError && (
                  <p className="text-red-500 text-[10px] font-bold uppercase text-center mt-2 tracking-widest">Incorrect password</p>
                )}
              </div>
              <button
                onClick={handlePasswordSubmit}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95"
              >
                Access Link
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto py-10 flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-6 px-6">
          {profile.links.filter(l => isLinkActive(l) && l.type === 'social_icon').map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id, link.url)}
              className="hover:scale-110 transition-transform active:scale-90"
            >
              {getSocialIcon(link.url, 28)}
            </a>
          ))}
        </div>
        <a
          href="#/"
          className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity ${theme.textClass}`}
        >
          <TreePine size={14} /> Social2Tree
        </a>
      </footer>
    </div>
  );
};

export default PublicProfile;
