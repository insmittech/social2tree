
export type PlanType = 'free' | 'pro' | 'business';
export type UserRole = 'user' | 'admin';
export type ButtonStyle = 'rounded-lg' | 'rounded-full' | 'rounded-none' | 'brutal';

export interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
  clicks: number;
  type?: 'social' | 'payment' | 'custom' | 'social_icon';
  scheduledStart?: string | null;
  scheduledEnd?: string | null;
  password?: string | null;
}

export interface UserTheme {
  id: string;
  name: string;
  background: string;
  buttonClass: string;
  textClass: string;
  cardClass?: string;
}

export interface LinkPage {
  id: string;
  slug: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: string;
  buttonStyle: ButtonStyle;
  customDomain?: string | null;
  links: Link[];
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  displayName: string;
  bio?: string;
  avatarUrl: string;
  role: UserRole;
  plan: PlanType;
  status: 'active' | 'suspended';
  createdAt: string;
  pages: LinkPage[];
  views: number;
  roles: string[];
  permissions: string[];
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalQrScans: number;
}

export const THEMES: Record<string, UserTheme> = {
  default: {
    id: 'default',
    name: 'Snowy White',
    background: 'bg-white',
    buttonClass: 'bg-slate-900 text-white hover:bg-slate-800',
    textClass: 'text-slate-900',
    cardClass: 'bg-slate-50 border-slate-100'
  },
  dark: {
    id: 'dark',
    name: 'Midnight',
    background: 'bg-slate-950',
    buttonClass: 'bg-white text-slate-950 hover:bg-slate-100',
    textClass: 'text-white',
    cardClass: 'bg-slate-900 border-slate-800'
  },
  purple: {
    id: 'purple',
    name: 'Grape Juice',
    background: 'bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-900',
    buttonClass: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 shadow-xl',
    textClass: 'text-white'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    background: 'bg-gradient-to-tr from-orange-400 via-rose-500 to-purple-600',
    buttonClass: 'bg-white text-rose-600 hover:shadow-2xl transition-all font-bold',
    textClass: 'text-white'
  },
  brutalist: {
    id: 'brutalist',
    name: 'Neo-Brutalism',
    background: 'bg-yellow-400',
    buttonClass: 'bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black',
    textClass: 'text-black font-black'
  },
  nature: {
    id: 'nature',
    name: 'Emerald Garden',
    background: 'bg-emerald-900',
    buttonClass: 'bg-emerald-400 text-emerald-950 font-bold hover:bg-emerald-300 shadow-lg shadow-emerald-950/20',
    textClass: 'text-emerald-50'
  }
};
