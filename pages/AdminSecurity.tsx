
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import MobileNav from '../components/MobileNav';
import { Shield, ShieldAlert, Lock, Fingerprint, Eye, History, UserMinus, Globe, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AdminSecurityProps {
  onLogout: () => void;
}

const AdminSecurity: React.FC<AdminSecurityProps> = ({ onLogout }) => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionLimit, setSessionLimit] = useState(30);

  const auditLogs = [
    { id: 1, event: 'Admin Login', user: 'johndoe (Admin)', ip: '192.168.1.1', time: '5 mins ago', status: 'success' },
    { id: 2, event: 'Plan Upgrade', user: 'janedoe', ip: '45.12.98.22', time: '12 mins ago', status: 'success' },
    { id: 3, event: 'Failed Login Attempt', user: 'unknown', ip: '103.44.11.2', time: '45 mins ago', status: 'warning' },
    { id: 4, event: 'User Suspended', user: 'admin_bot', ip: 'system', time: '2 hours ago', status: 'danger' },
    { id: 5, event: 'API Key Rotated', user: 'johndoe (Admin)', ip: '192.168.1.1', time: '5 hours ago', status: 'success' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isDashboard onLogout={onLogout} />

      <div className="max-w-[1600px] mx-auto flex">
        <AdminSidebar />

        <main className="flex-grow p-4 sm:p-8 lg:p-12 overflow-hidden pb-32 lg:pb-12">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-900">Security & Compliance</h1>
            <p className="text-slate-500 font-medium">Manage platform access, audit logs, and global security policies</p>
          </header>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Security Status Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield size={120} />
              </div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={24} /> System Status
              </h3>
              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global Firewall</p>
                  <p className="text-2xl font-black text-emerald-400">ACTIVE</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Threat Level</p>
                  <p className="text-2xl font-black text-white">LOW</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <button className="flex items-center gap-2 text-indigo-400 text-sm font-black hover:text-indigo-300 transition-colors">
                    Run Security Audit <Fingerprint size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Policy Toggles */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                <Lock className="text-indigo-600" size={24} /> Access Policies
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-900">Enforce Admin 2FA</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">High Security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={mfaEnabled}
                        onChange={(e) => setMfaEnabled(e.target.checked)}
                      />
                      <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-900">Login Attempt Limit</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Brute force protection</p>
                    </div>
                    <select className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-black outline-none focus:ring-2 focus:ring-indigo-100">
                      <option>3 Attempts</option>
                      <option>5 Attempts</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Session Timeout (Minutes)</label>
                    <input
                      type="number"
                      value={sessionLimit}
                      onChange={(e) => setSessionLimit(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                    <ShieldAlert className="text-indigo-600 shrink-0" size={18} />
                    <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase tracking-wider">
                      Changing these settings will notify all administrators via email immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-2 text-slate-900">
                <History size={20} className="text-indigo-600" /> Platform Audit Log
              </h3>
              <div className="flex gap-2">
                <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-all">Clear Logs</button>
                <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">Export CSV</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Event</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User / Actor</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">IP Address</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="font-black text-slate-800 text-sm">{log.event}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-indigo-600">{log.user}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{log.ip}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-500 font-medium">{log.time}</span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${log.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                            log.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <MobileNav isAdmin />
    </div>
  );
};

export default AdminSecurity;
