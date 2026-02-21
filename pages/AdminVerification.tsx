import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, CheckCircle2, XCircle, Clock, Info, ExternalLink, Mail, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { VerificationRequest } from '../types';

const AdminVerification: React.FC = () => {
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    // Modal state
    const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'details' | null>(null);
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/admin/verification/list.php${statusFilter ? `?status=${statusFilter}` : ''}`);
            setRequests(response.data.requests || []);
        } catch (error) {
            console.error('Failed to fetch verification requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!selectedRequest || !actionType) return;

        setProcessing(true);
        let targetStatus: VerificationRequest['status'] = 'pending';

        if (actionType === 'approve') targetStatus = 'approved';
        if (actionType === 'reject') targetStatus = 'rejected';

        try {
            await axios.post('/api/admin/verification/update.php', {
                id: selectedRequest.id,
                status: targetStatus,
                reason: reason
            });

            // Update local state
            setRequests(requests.map(r => r.id === selectedRequest.id ? { ...r, status: targetStatus, rejectionReason: reason } : r));

            // Reset modal
            setSelectedRequest(null);
            setActionType(null);
            setReason('');
        } catch (error) {
            console.error('Failed to update verification request', error);
            alert('Failed to update request.');
        } finally {
            setProcessing(false);
        }
    };

    const filteredRequests = requests.filter(r =>
        r.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: VerificationRequest['status']) => {
        switch (status) {
            case 'approved':
                return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 w-fit"><CheckCircle2 size={12} /> Approved</span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-1.5 w-fit"><XCircle size={12} /> Rejected</span>;
            default:
                return <span className="px-3 py-1 bg-slate-100 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700/50 flex items-center gap-1.5 w-fit"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-12">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic mb-2">Verification Requests</h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Manage user identity proofs and badges</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by username, name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900/40 border-none rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {['', 'pending', 'approved', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${statusFilter === s
                                ? 'bg-indigo-600 text-white shadow-indigo-100'
                                : 'bg-white dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 shadow-slate-100 hover:bg-slate-50'
                                }`}
                        >
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] shadow-2xl dark:shadow-none shadow-slate-200 border border-slate-50 dark:border-slate-800/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-[#0b0f19]/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">User</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-center">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">No requests found</td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-white font-black text-sm">{req.displayName}</span>
                                                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">@{req.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-xs">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">{req.details}</p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black">{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {getStatusBadge(req.status)}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-2">
                                                {req.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => { setSelectedRequest(req); setActionType('approve'); }}
                                                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedRequest(req); setActionType('reject'); }}
                                                            className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => { setSelectedRequest(req); setActionType('details'); }}
                                                        className="p-2.5 bg-slate-100 text-slate-400 dark:text-slate-500 rounded-xl hover:bg-slate-200 transition-colors text-[10px] font-black uppercase tracking-widest px-4"
                                                    >
                                                        Details
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action Modal */}
            {selectedRequest && actionType && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900/40 rounded-[2.5rem] w-full max-w-lg shadow-2xl dark:shadow-none overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-1">
                                        {actionType === 'approve' ? 'Approve Verification' : actionType === 'reject' ? 'Reject Request' : 'Request Details'}
                                    </h3>
                                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">User: {selectedRequest.username}</p>
                                </div>
                                <button onClick={() => { setSelectedRequest(null); setActionType(null); }} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="bg-slate-50 dark:bg-[#0b0f19] rounded-2xl p-6 mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">User's Submission</span>
                                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">{selectedRequest.details}</p>
                            </div>

                            {actionType === 'reject' && (
                                <div className="mb-6 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Reason / Feedback (Sent to user)</label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Explain why the request was rejected..."
                                        className="w-full h-32 bg-slate-50 dark:bg-[#0b0f19] border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                                        required
                                    />
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setSelectedRequest(null); setActionType(null); }}
                                    className="flex-1 py-4 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAction}
                                    disabled={processing || (actionType === 'reject' && !reason)}
                                    className={`flex-1 py-4 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] disabled:opacity-50 ${actionType === 'approve' ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' :
                                        actionType === 'reject' ? 'bg-rose-600 shadow-rose-100 hover:bg-rose-700' :
                                            'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700'
                                        }`}
                                >
                                    {processing ? 'Processing...' : actionType === 'approve' ? 'Confirm Approval' : 'Send Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVerification;
