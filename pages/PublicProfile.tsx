
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfile, THEMES, ButtonStyle } from '../types';
import { Helmet } from 'react-helmet-async';
import client from '../src/api/client';
import { TreePine, Share2 } from 'lucide-react';

const PublicProfile: React.FC = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await client.get(`/public/get_profile.php?username=${username}`);
        setProfile(res.data);
         // View tracking is handled by the backend endpoint
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  const handleLinkClick = async (id: string, url: string) => {
    try {
      // Async track click, don't await/block nav
      client.post('/analytics/track.php', { link_id: id });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Tree not found 🌲</h1>
      <p className="text-slate-500 mb-8">The user @{username} doesn't exist.</p>
      <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors">Claim this username</a>
    </div>
  );

  const theme = THEMES[profile.theme] || THEMES.default;

  const getButtonStyle = (baseClass: string, style?: ButtonStyle) => {
    const filteredBase = baseClass.split(' ').filter(c => !c.startsWith('rounded-')).join(' ');
    switch(style) {
      case 'rounded-full': return `${filteredBase} rounded-full`;
      case 'rounded-none': return `${filteredBase} rounded-none`;
      case 'brutal': return `${filteredBase} rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`;
      case 'rounded-lg':
      default: return `${filteredBase} rounded-lg`;
    }
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
        <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-lg border border-white/20 text-white">
          <Share2 size={20} />
        </button>

        <img 
          src={profile.avatarUrl} 
          alt={profile.displayName} 
          className="w-24 h-24 rounded-full border-4 border-white/30 shadow-xl object-cover mb-4"
        />
        <h1 className={`text-2xl font-bold mb-2 tracking-tight ${theme.textClass}`}>{profile.displayName}</h1>
        <p className={`text-center max-w-[320px] text-sm leading-relaxed opacity-90 ${theme.textClass}`}>{profile.bio}</p>
      </header>

      <main className="w-full max-w-[580px] px-6 space-y-4 pb-20">
        {profile.links.filter(l => l.active).map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick(link.id, link.url)}
            className={`flex items-center justify-center w-full min-h-[56px] px-6 py-4 text-base font-semibold shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] ${getButtonStyle(theme.buttonClass, profile.buttonStyle)}`}
          >
            {link.title}
          </a>
        ))}
      </main>

      <footer className="mt-auto py-10 flex flex-col items-center gap-6">
        <div className="flex gap-4">
           {/* Social shortcuts can be added here */}
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
