import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../src/api/client';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../src/context/ToastContext';
import {
  BarChart2, ShieldCheck, CreditCard, Layout,
  ExternalLink, ArrowRight, TrendingUp, Eye,
  MousePointerClick, Zap, CheckCircle2, Clock,
  XCircle, AlertCircle, Copy, Check, Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user: profile } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState<string>('none');
  const [verificationLoading, setVerificationLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [planName, setPlanName] = useState<string>('');

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const res = await client.get('/verification/status.php');
        setVerificationStatus(res.data.status || 'none');
      } catch {
        setVerificationStatus('none');
      } finally {
        setVerificationLoading(false);
      }
    };
    fetchVerification();
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await client.get('/public/plans.php');
        const plans: any[] = res.data.plans || [];
        const current = plans.find(p => p.name.toLowerCase() === (profile?.plan || 'free').toLowerCase());
        setPlanName(current?.name || profile?.plan || 'Free');
      } catch {
        setPlanName(profile?.plan || 'Free');
      }
    };
    if (profile) fetchPlan();
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const activePage = profile?.pages?.[0] || null;
  const totalLinks = profile?.pages?.reduce((acc: number, p: any) => acc + (p.links?.length || 0), 0) || 0;
  const totalViews = profile?.views || 0;
  const totalClicks = profile?.pages?.reduce((acc: number, p: any) =>
    acc + (p.links?.reduce((a: number, l: any) => a + (l.clicks || 0), 0) || 0), 0) || 0;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';
  const publicUrl = activePage ? `${window.location.origin}/${activePage.slug}` : '';
  const isFreePlan = (profile?.plan || 'free') === 'free';

  const handleCopy = async () => {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verificationBadge = () => {
    switch (verificationStatus) {
      case 'approved':
        return { icon: <CheckCircle2 size={16} className="text-emerald-500" />, label: 'Verified', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' };
      case 'pending':
        return { icon: <Clock size={16} className="text-amber-500" />, label: 'Pending Review', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' };
      case 'rejected':
        return { icon: <XCircle size={16} className="text-rose-500" />, label: 'Rejected', color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20' };
      default:
        return { icon: <AlertCircle size={16} className="text-slate-400" />, label: 'Not Submitted', color: 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800' };
    }
  };

  const vBadge = verificationBadge();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-24 lg:pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">
            Welcome back, <span className="text-indigo-600 dark:text-teal-400 transition-colors">{profile?.displayName?.split(' ')[0] || 'User'}</span> 👋
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-[11px] sm:text-sm mt-1 uppercase tracking-wider transition-colors">Activity Overview</p>
        </div>
        {activePage && (
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 dark:bg-teal-600 text-white rounded-2xl text-xs font-black hover:bg-indigo-700 dark:hover:bg-teal-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none whitespace-nowrap sm:w-auto"
          >
            <ExternalLink size={14} /> View Live Page
          </a>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Views', value: totalViews.toLocaleString(), icon: <Eye size={18} />, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10', trend: '+12%' },
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: <MousePointerClick size={18} />, color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10', trend: '+8%' },
          { label: 'Click Rate', value: `${ctr}%`, icon: <TrendingUp size={18} />, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10', trend: null },
          { label: 'Bio Trees', value: (profile?.pages?.length || 0).toString(), icon: <Layout size={18} />, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10', trend: null },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-[#0b121e] rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-4 sm:p-5 shadow-sm dark:shadow-none hover:shadow-md transition-all duration-300">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-colors bg-opacity-10 dark:bg-opacity-20 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none transition-colors">{stat.value}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-1.5">
              <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              {stat.trend && (
                <span className="w-fit text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{stat.trend}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Plan Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <CreditCard size={22} />
            </div>
            {!isFreePlan && (
              <span className="flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                <Star size={10} /> Pro
              </span>
            )}
          </div>
          <p className="text-white/60 text-xs font-black uppercase tracking-widest">Current Plan</p>
          <h2 className="text-3xl font-black capitalize mt-1 mb-2">{planName || 'Free'}</h2>
          <p className="text-white/60 text-sm font-medium mb-6 flex-1">
            {isFreePlan
              ? 'Upgrade to unlock unlimited links, analytics, and premium themes.'
              : 'You re on a premium plan. Enjoy all features.'}
          </p>
          <button
            onClick={() => navigate('/dashboard/plan')}
            className="w-full py-3 bg-white text-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
          >
            {isFreePlan ? 'Upgrade Plan' : 'Manage Plan'} <ArrowRight size={14} />
          </button>
        </div>

        {/* Verification Card */}
        <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-6 shadow-sm dark:shadow-none flex flex-col transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-slate-50 p-3 rounded-2xl text-slate-600">
              <ShieldCheck size={22} />
            </div>
            <span className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border ${vBadge.color}`}>
              {vBadge.icon} {vBadge.label}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 transition-colors">Verification</h3>
          <p className="text-slate-400 font-medium text-sm flex-1 leading-relaxed">
            {verificationLoading
              ? 'Checking status...'
              : verificationStatus === 'approved'
                ? 'Your account is verified. Your badge is displayed on your public profile.'
                : verificationStatus === 'pending'
                  ? 'Your request is under review. Well notify you once processed.'
                  : verificationStatus === 'rejected'
                    ? 'Your last request was rejected. You can resubmit with updated information.'
                    : 'Get verified to build trust and stand out with a checkmark badge.'}
          </p>
          <button
            onClick={() => navigate('/dashboard/verification')}
            className="mt-5 w-full py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {verificationStatus === 'approved' ? 'View Status' : verificationStatus === 'none' ? 'Apply Now' : 'Check Status'}
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Analytics Card */}
        <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-6 shadow-sm dark:shadow-none flex flex-col transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-violet-50 p-3 rounded-2xl text-violet-600">
              <BarChart2 size={22} />
            </div>
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest">
              Last 30 days
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-5 transition-colors">Analytics</h3>
          <div className="space-y-4 flex-1">
            {[
              { label: 'Profile Views', value: totalViews, max: Math.max(totalViews, 1), color: 'bg-indigo-500' },
              { label: 'Link Clicks', value: totalClicks, max: Math.max(totalViews, 1), color: 'bg-violet-500' },
            ].map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  <span>{bar.label}</span>
                  <span className="text-slate-900 dark:text-white transition-colors">{bar.value.toLocaleString()}</span>
                </div>
                <div className="h-2.5 bg-slate-50 dark:bg-[#05080f] rounded-full overflow-hidden border border-slate-100 dark:border-slate-800/50">
                  <div
                    className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${Math.min((bar.value / bar.max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800/50 text-sm mt-2 transition-colors">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">CTR</span>
              <span className="text-slate-900 dark:text-white font-black transition-colors">{ctr}%</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/analytics')}
            className="mt-6 w-full py-3.5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            Full Analytics <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Public Link */}
        {activePage && (
          <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-6 shadow-sm dark:shadow-none transition-all duration-300">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 transition-colors">Your Public Link</h3>
            <p className="text-xs text-slate-400 font-bold mb-4">Share this link anywhere to direct people to your Bio-Tree.</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 dark:bg-[#05080f]/50 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-800/50 transition-colors">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400 truncate flex-1 transition-colors">{publicUrl}</span>
              <button
                onClick={handleCopy}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'} active:scale-95`}
              >
                {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 p-6 shadow-sm dark:shadow-none transition-all duration-300">
          <h3 className="text-base font-black text-slate-900 dark:text-white mb-4 transition-colors">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Manage Trees', icon: <Layout size={18} />, to: '/dashboard/trees', color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20' },
              { label: 'Analytics', icon: <BarChart2 size={18} />, to: '/dashboard/analytics', color: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20' },
              { label: 'Saved Links', icon: <Zap size={18} />, to: '/dashboard/saved', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20' },
              { label: 'Account', icon: <CheckCircle2 size={18} />, to: '/dashboard/profile', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.to)}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-[13px] font-black transition-all ${action.color} border border-transparent dark:border-white/5 active:scale-95`}
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
