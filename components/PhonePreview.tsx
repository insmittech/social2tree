
import React from 'react';
import { LinkPage, THEMES, ButtonStyle } from '../types';
import { Share2, TreePine } from 'lucide-react';
import { getSocialIcon } from '../src/utils/socialIcons';

interface PhonePreviewProps {
  page: LinkPage;
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ page }) => {
  const theme = THEMES[page.theme] || THEMES.default;

  const getButtonStyle = (baseClass: string, style?: ButtonStyle) => {
    const filteredBase = baseClass.split(' ').filter(c => !c.startsWith('rounded-')).join(' ');

    switch (style) {
      case 'rounded-full': return `${filteredBase} rounded-full`;
      case 'rounded-none': return `${filteredBase} rounded-none`;
      case 'brutal': return `${filteredBase} rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`;
      case 'rounded-lg':
      default: return `${filteredBase} rounded-lg`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[600px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-10"></div>

        {/* Content Container */}
        <div className={`w-full h-full overflow-y-auto no-scrollbar ${theme.background} p-6 flex flex-col items-center pt-12`}>
          <img
            src={page.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(page.displayName || 'User')}&background=1e293b&color=fff`}
            alt={page.displayName}
            className="w-20 h-20 rounded-full border-2 border-white/50 mb-3 object-cover shadow-sm"
          />
          <h2 className={`text-lg font-bold mb-1 ${theme.textClass}`}>{page.displayName}</h2>
          <p className={`text-xs text-center opacity-80 mb-6 ${theme.textClass}`}>{page.bio}</p>

          <div className="w-full space-y-3 mb-6">
            {(page.links || []).filter(l => !!l.active && l.type !== 'social_icon').map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center py-3 px-4 text-sm font-medium transition-all transform active:scale-95 ${getButtonStyle(theme.buttonClass, page.buttonStyle)}`}
              >
                {link.title}
              </a>
            ))}
          </div>

          <div className="w-full flex flex-wrap justify-center gap-4 mb-8">
            {(page.links || []).filter(l => !!l.active && l.type === 'social_icon').map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform active:scale-90"
              >
                {getSocialIcon(link.url, 22)}
              </a>
            ))}
          </div>

          <div className="mt-auto pb-4">
            <div className={`flex items-center gap-1 text-[10px] opacity-40 font-bold uppercase tracking-widest ${theme.textClass}`}>
              <TreePine size={12} /> Social2Tree
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-slate-500 text-sm font-medium flex items-center gap-2">
        <Share2 size={14} /> Preview of your page
      </p>
    </div>
  );
};

export default PhonePreview;
