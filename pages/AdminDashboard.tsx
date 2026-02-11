
import React from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import MobileNav from '../components/MobileNav';
import { Users, DollarSign, QrCode, CreditCard, ArrowRight, TrendingUp, Activity, ShieldCheck, Star, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  // TODO: Fetch from API
  const stats = {
    totalUsers: 3,
    activeSubscriptions: 2,
    totalRevenue: 64,
    totalQrScans: 1200
  };

  const data = [
    { name: 'Jan', revenue: 450 },
    { name: 'Feb', revenue: 620 },
    { name: 'Mar', revenue: 980 },
    { name: 'Apr', revenue: 1400 },
    { name: 'May', revenue: 2100 },
    { name: 'Jun', revenue: 1850 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isDashboard onLogout={onLogout} />
      
      <div className="max-w-[1600px] mx-auto flex">
        <AdminSidebar />
        
        <main className="flex-grow p-4 sm:p-8 lg:p-12 overflow-hidden pb-32 lg:pb-12">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Platform Overview</h1>
            <p className="text-slate-500 font-medium">Monitoring core metrics</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: <Users size={18} />, color: 'indigo', growth: '+12%' },
              { label: 'Pro Members', value: stats.activeSubscriptions, icon: <Star size={18} />, color: 'amber', growth: '+5%' },
              { label: 'Revenue', value: `$${stats.totalRevenue}`, icon: <DollarSign size={18} />, color: 'emerald', growth: '+28%' },
              { label: 'QR Activity', value: stats.totalQrScans.toLocaleString(), icon: <QrCode size={18} />, color: 'purple', growth: 'Stable' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                    {stat.icon}
                  </div>
                  <span className={`hidden sm:inline-block text-[10px] font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-500`}>
                    {stat.growth}
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 text-slate-900">
                    <TrendingUp size={20} className="text-indigo-600" /> Revenue
                  </h3>
                  <div className="bg-slate-50 p-1 rounded-xl flex gap-1">
                     <button className="px-3 py-1 bg-white text-indigo-600 text-[10px] font-black rounded-lg shadow-sm uppercase tracking-wider">6m</button>
                     <button className="px-3 py-1 text-slate-400 text-[10px] font-black rounded-lg hover:bg-white/50 uppercase tracking-wider">1y</button>
                  </div>
                </div>
                <div className="h-[250px] sm:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                      <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
                <h3 className="text-lg sm:text-xl font-black mb-8 flex items-center gap-2">
                  <Activity size={20} className="text-indigo-500" /> Platform Log
                </h3>
                <div className="space-y-6 sm:space-y-8">
                   {[
                     { user: 'Sarah King', action: 'Upgraded to Pro', time: '2m ago', icon: <Star className="text-amber-500" size={14} /> },
                     { user: 'Node Cluster B', action: 'Scaled up', time: '14m ago', icon: <Zap className="text-emerald-500" size={14} /> },
                     { user: 'Internal API', action: 'Token rotated', time: '3h ago', icon: <ShieldCheck className="text-slate-400" size={14} /> },
                   ].map((item, i) => (
                     <div key={i} className="flex items-start gap-4">
                        <div className="bg-white/10 p-2 rounded-xl shrink-0">{item.icon}</div>
                        <div>
                          <p className="text-xs sm:text-sm font-black text-white">{item.user}</p>
                          <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{item.action}</p>
                          <p className="text-[9px] text-slate-500 mt-1 font-bold tracking-wider">{item.time}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-10 sm:mt-12 py-3 sm:py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                  Full Audit Log
                </button>
             </div>
          </div>
        </main>
      </div>

      <MobileNav isAdmin />
    </div>
  );
};

export default AdminDashboard;
