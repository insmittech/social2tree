
import React, { useMemo } from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Users, MousePointer2, QrCode, Download, Filter, Globe } from 'lucide-react';

interface AdminAnalyticsProps {
  onLogout: () => void;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ onLogout }) => {
  // TODO: Fetch from API
  const users: any[] = [];

  // Aggregate stats
  const aggregateStats = useMemo(() => {
    return users.reduce((acc, user) => ({
      views: acc.views + user.views,
      scans: acc.scans + user.qrScans,
      clicks: acc.clicks + user.links.reduce((sum, l) => sum + l.clicks, 0)
    }), { views: 0, scans: 0, clicks: 0 });
  }, [users]);

  // Plan distribution for Pie Chart
  const planData = useMemo(() => {
    const counts = users.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Free', value: counts['free'] || 0, color: '#94a3b8' },
      { name: 'Pro', value: counts['pro'] || 0, color: '#f59e0b' },
      { name: 'Business', value: counts['business'] || 0, color: '#8b5cf6' }
    ];
  }, [users]);

  // Simulated growth data
  const growthData = [
    { name: 'Jan', users: 40, views: 2400 },
    { name: 'Feb', users: 80, views: 3600 },
    { name: 'Mar', users: 150, views: 5200 },
    { name: 'Apr', users: 210, views: 7100 },
    { name: 'May', users: 380, views: 9800 },
    { name: 'Jun', users: 450, views: 12000 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isDashboard onLogout={onLogout} />
      
      <div className="max-w-[1600px] mx-auto flex">
        <AdminSidebar />
        
        <main className="flex-grow p-4 sm:p-8 lg:p-12">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Platform Analytics</h1>
              <p className="text-slate-500 font-medium">Real-time aggregate performance across all users</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={18} /> Timeframe
              </button>
              <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                <Download size={18} /> Export Report
              </button>
            </div>
          </header>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Platform Views', value: aggregateStats.views.toLocaleString(), icon: <Globe size={22} />, color: 'indigo' },
              { label: 'Link Engagement', value: aggregateStats.clicks.toLocaleString(), icon: <MousePointer2 size={22} />, color: 'emerald' },
              { label: 'Physical Traffic (QR)', value: aggregateStats.scans.toLocaleString(), icon: <QrCode size={22} />, color: 'purple' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6`}>
                  {stat.icon}
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 mt-2">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Traffic Growth */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black flex items-center gap-2 text-slate-900 mb-8">
                <TrendingUp size={20} className="text-indigo-600" /> Platform Traffic Growth
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorViewsAdmin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorViewsAdmin)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plan Distribution */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black flex items-center gap-2 text-slate-900 mb-8">
                <Users size={20} className="text-indigo-600" /> Plan Distribution
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {planData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                {planData.map((plan) => (
                  <div key={plan.name} className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }}></div>
                      <span className="text-sm font-bold text-slate-600">{plan.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{plan.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-xl font-black flex items-center gap-2 text-slate-900">
                <Activity size={20} className="text-indigo-600" /> Top Performing Accounts
              </h3>
              <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">View All Users</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Username</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Views</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Link Clicks</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.sort((a, b) => b.views - a.views).slice(0, 5).map((user) => {
                    const clicks = user.links.reduce((sum, l) => sum + l.clicks, 0);
                    const convRate = user.views > 0 ? ((clicks / user.views) * 100).toFixed(1) : 0;
                    return (
                      <tr key={user.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                             <img src={user.avatarUrl} className="w-8 h-8 rounded-lg" alt="" />
                             <span className="font-bold text-slate-800 text-sm">@{user.username}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-black text-slate-700">{user.views.toLocaleString()}</td>
                        <td className="px-8 py-5 text-sm font-black text-slate-700">{clicks.toLocaleString()}</td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2">
                             <div className="flex-grow bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[100px]">
                               <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(parseFloat(convRate.toString()), 100)}%` }}></div>
                             </div>
                             <span className="text-xs font-bold text-emerald-600">{convRate}%</span>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;
