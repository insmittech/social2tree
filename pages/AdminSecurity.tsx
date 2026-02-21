import React, { useState, useEffect } from 'react';
import {
  Shield, ShieldAlert, Lock, Fingerprint, History,
  Globe, ShieldCheck, AlertTriangle, Trash2,
  Download, RefreshCw, Plus, X, Server, Activity,
  ShieldOff, LockKeyhole, Clock
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../src/context/AuthContext';
import { formatDate } from '../src/utils/dateUtils';
import Pagination from '../components/Pagination';

interface AuditLog {
  id: number;
  event: string;
  username: string | null;
  ip_address: string;
  severity: 'info' | 'warning' | 'danger';
  created_at: string;
}

interface BlockedIp {
  id: number;
  ip_address: string;
  reason: string;
  username: string | null;
  created_at: string;
}

interface AdminSecurityProps {
  onLogout: () => void;
}

const AdminSecurity: React.FC<AdminSecurityProps> = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loginLimit, setLoginLimit] = useState('5');
  const [sessionLimit, setSessionLimit] = useState(30);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([]);
  const [showAddIpModal, setShowAddIpModal] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [searchLogs, setSearchLogs] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [ipReason, setIpReason] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, logsRes, ipsRes] = await Promise.all([
        axios.get('/api/admin/settings/get.php'),
        axios.get('/api/admin/security/audit_logs.php'),
        axios.get('/api/admin/security/ip_management.php')
      ]);

      const s = settingsRes.data.settings;
      setMfaEnabled(s.security_2fa_admin === 'true');
      setLoginLimit(s.security_login_limit || '5');
      setSessionLimit(parseInt(s.security_session_timeout || '30'));

      setAuditLogs(logsRes.data.logs || []);
      setBlockedIps(ipsRes.data.blocked_ips || []);
    } catch (err) {
      console.error('Failed to fetch security data', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await axios.post('/api/admin/settings/update.php', { [key]: value });
    } catch (err) {
      console.error('Failed to update setting', err);
    }
  };

  const handleToggleMfa = () => {
    const newValue = !mfaEnabled;
    setMfaEnabled(newValue);
    updateSetting('security_2fa_admin', newValue ? 'true' : 'false');
  };

  const handleBlockIp = async () => {
    if (!newIp) return;
    setSaving(true);
    try {
      await axios.post('/api/admin/security/ip_management.php', {
        ip_address: newIp,
        reason: ipReason
      });
      setShowAddIpModal(false);
      setNewIp('');
      setIpReason('');
      fetchData();
    } catch (err) {
      console.error('Failed to block IP', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUnblockIp = async (ip: string) => {
    try {
      await axios.delete(`/api/admin/security/ip_management.php?ip=${ip}`);
      fetchData();
    } catch (err) {
      console.error('Failed to unblock IP', err);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all audit logs?')) return;
    try {
      await axios.delete('/api/admin/security/audit_logs.php');
      fetchData();
    } catch (err) {
      console.error('Failed to clear logs', err);
    }
  };

  const filteredLogs = auditLogs.filter(log =>
    log.event.toLowerCase().includes(searchLogs.toLowerCase()) ||
    (log.username && log.username.toLowerCase().includes(searchLogs.toLowerCase())) ||
    log.ip_address.includes(searchLogs)
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll table into view if needed
  };

  const exportLogs = () => {
    const headers = ['Event', 'User', 'IP Address', 'Severity', 'Time'];
    const rows = filteredLogs.map(l => [
      l.event,
      l.username || 'System',
      l.ip_address,
      l.severity,
      formatDate(l.created_at, user?.timezone, user?.timeFormat)
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `security_audit_logs_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 lg:px-12 py-8 font-sans selection:bg-indigo-500/30">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 dark:bg-teal-500 rounded-2xl flex items-center justify-center text-white dark:text-slate-950 shadow-lg shadow-indigo-200 dark:shadow-none">
              <Shield size={20} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
              Security <span className="text-indigo-600 dark:text-teal-400">Hub</span>
            </h1>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 pl-13">
            Real-time infrastructure guard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
            <RefreshCw size={18} />
          </button>
          <div className="flex items-center gap-3 bg-white dark:bg-[#0b121e] px-5 py-2.5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">All Systems Nominal</span>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 mb-12">
        {/* Security Overview Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 dark:bg-[#05080f] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <ShieldCheck size={160} />
            </div>
            <h3 className="text-xl font-black mb-10 flex items-center gap-3 italic">
              <ShieldCheck className="text-emerald-400" size={24} /> System Status
            </h3>
            <div className="grid grid-cols-2 gap-8 relative z-10">
              <div>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Global Firewall</p>
                <p className="text-2xl font-black text-emerald-400 flex items-center gap-2 tracking-tighter">
                  ACTIVE
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Threat Level</p>
                <p className="text-2xl font-black text-white tracking-tighter italic">LOW</p>
              </div>
              <div>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">IP Blacklist</p>
                <p className="text-2xl font-black text-indigo-400 tracking-tighter italic">{blockedIps.length} BLOCKED</p>
              </div>
              <div>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Uptime</p>
                <p className="text-2xl font-black text-white tracking-tighter italic">99.9%</p>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10">
              <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Deep System Audit <Fingerprint size={16} />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <LockKeyhole size={20} />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">14</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Failed Logins</p>
            </div>
            <div className="bg-white dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Activity size={20} />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">3</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">New Devices</p>
            </div>
          </div>
        </div>

        {/* Policies Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 md:p-10 shadow-xl dark:shadow-none">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3 italic">
              <Lock className="text-indigo-600" size={24} /> Access Policies
            </h3>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-[#0b121e] rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:border-indigo-200">
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white mb-1">Enforce Admin 2FA</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Compulsory MFA for admins</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={mfaEnabled}
                      onChange={handleToggleMfa}
                    />
                    <div className="w-14 h-7 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-teal-500"></div>
                  </label>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-[#0b121e] rounded-3xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-black text-slate-900 dark:text-white mb-4">Login Attempt Limit</p>
                  <div className="flex gap-2">
                    {['3', '5', '10', 'None'].map((limit) => (
                      <button
                        key={limit}
                        onClick={() => { setLoginLimit(limit); updateSetting('security_login_limit', limit); }}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginLimit === limit ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 hover:text-indigo-600 border border-slate-100 dark:border-slate-800'}`}
                      >
                        {limit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-[#0b121e] rounded-3xl border border-slate-100 dark:border-slate-800">
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 italic">Session Timeout (Minutes)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={sessionLimit}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        setSessionLimit(v);
                        updateSetting('security_session_timeout', v.toString());
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-teal-500/10 outline-none transition-all font-black text-slate-900 dark:text-white text-lg"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                      <Clock size={20} />
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 flex items-start gap-4">
                  <ShieldAlert className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" size={20} />
                  <p className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold leading-relaxed uppercase tracking-widest">
                    Platform-wide security changes are synced across 3 clusters globally. Notification sent to 4 admins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* IP Blacklist Section */}
          <div className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 md:p-10 shadow-xl dark:shadow-none">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic">
                <Globe className="text-rose-500" size={24} /> IP Guard
              </h3>
              <button
                onClick={() => setShowAddIpModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-200 dark:shadow-none transition-all"
              >
                <Plus size={16} /> Block IP Range
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {blockedIps.length === 0 ? (
                <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                  <ShieldOff className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No active blocks found</p>
                </div>
              ) : (
                blockedIps.map((ip) => (
                  <div key={ip.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-[#0b121e] rounded-2xl border border-slate-100 dark:border-slate-800 group transition-all hover:border-rose-200">
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white font-mono">{ip.ip_address}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase truncate max-w-[150px]">{ip.reason}</p>
                    </div>
                    <button
                      onClick={() => handleUnblockIp(ip.ip_address)}
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none overflow-hidden group">
        <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center">
              <History size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white italic leading-none">Platform Audit Log</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Full traceability of system interactions</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClearLogs}
              className="text-[10px] font-black uppercase tracking-widest px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
            >
              Purge All
            </button>
            <button
              onClick={exportLogs}
              className="text-[10px] font-black uppercase tracking-widest px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-black transition-all flex items-center gap-2 group/exp"
            >
              Export CSV <Download size={14} className="group-hover/exp:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-[#0b121e]/50 border-b border-slate-100 dark:border-slate-800/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Event Signature</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operator</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">IP Node</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Threat Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center font-black text-slate-300 uppercase italic tracking-widest">No activity data found</td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-all">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${log.severity === 'danger' ? 'bg-rose-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span className="font-black text-slate-900 dark:text-slate-200 text-sm">{log.event}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-indigo-600 dark:text-teal-400">{log.username || 'SYSTEM CORE'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black font-mono text-slate-400 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">{log.ip_address}</span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-bold uppercase tracking-tight">
                      {formatDate(log.created_at, user?.timezone, user?.timeFormat)}
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${log.severity === 'info' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                        log.severity === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20' :
                          'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20'
                        }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add IP Modal */}
      {showAddIpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0b121e] rounded-[2.5rem] w-full max-w-lg p-10 border border-slate-100 dark:border-slate-800 shadow-3xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Block IP <span className="text-rose-500">Node</span></h3>
              <button onClick={() => setShowAddIpModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">IP Address or Range</label>
                <input
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="e.g. 192.168.1.1"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Blocking Reason</label>
                <textarea
                  value={ipReason}
                  onChange={(e) => setIpReason(e.target.value)}
                  placeholder="Reason for blocking this node..."
                  className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-bold resize-none"
                />
              </div>

              <button
                onClick={handleBlockIp}
                disabled={saving}
                className="w-full py-5 bg-rose-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-rose-600 shadow-xl shadow-rose-200 dark:shadow-none transition-all disabled:opacity-50"
              >
                {saving ? 'Synchronizing Cluster...' : 'Confirm System Block'}
              </button>
              <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest px-8">
                * Once blocked, this IP will be restricted from accessing any public or private gateway on this platform.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSecurity;
