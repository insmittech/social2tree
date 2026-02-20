import React, { useState } from 'react';
import { ShieldCheck, Info, Clock, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import axios from 'axios';
import { UserProfile } from '../types';

interface RequestVerificationProps {
    user: UserProfile;
}

const RequestVerification: React.FC<RequestVerificationProps> = ({ user }) => {
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const canApplyInstantly = user.plan === 'pro' || user.plan === 'vip' || user.plan === 'business';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/verification/request.php', { details });
            if (response.status === 201) {
                setSubmitted(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request.');
        } finally {
            setLoading(false);
        }
    };

    if (user.isVerified) {
        return (
            <div className="max-w-2xl mx-auto p-8">
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-slate-100">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShieldCheck className="text-indigo-600 w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-4 text-slate-900">You are Verified!</h1>
                    <p className="text-slate-500 font-medium mb-8">Your account has been officially verified. The blue checkmark is now visible on your public bio-link pages.</p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100">
                        <CheckCircle2 size={18} /> Verified Account
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="mb-12">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 italic mb-2">Verification</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Request your professional checkmark</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Info Column */}
                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-200">
                        <ShieldCheck className="w-12 h-12 mb-6" />
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-4 leading-tight">Why get verified?</h2>
                        <ul className="space-y-4">
                            {[
                                "Enhanced trust with your audience",
                                "Official recognition of your profile",
                                "Protection against impersonation",
                                "Premium aesthetic for your bio-link"
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-indigo-50">
                                    <div className="mt-1 bg-white/20 p-1 rounded-md"><CheckCircle2 size={14} /></div>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                            <Info size={16} className="text-indigo-600" /> Plan Benefits
                        </h3>

                        <div className={`p-6 rounded-2xl border-2 mb-4 transition-all ${canApplyInstantly ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 grayscale opacity-70'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Pro & VIP Plans</span>
                                {canApplyInstantly && <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Active</span>}
                            </div>
                            <p className="text-slate-900 font-black text-lg">Instant Verification</p>
                            <p className="text-slate-500 text-xs font-medium">Verified checkmark is granted automatically upon upgrade.</p>
                        </div>

                        <div className={`p-6 rounded-2xl border-2 transition-all ${!canApplyInstantly ? 'border-amber-400 bg-amber-50/30' : 'border-slate-100'}`}>
                            <span className="text-xs font-black uppercase tracking-widest text-amber-600 mb-2 block">Free Plan</span>
                            <p className="text-slate-900 font-black text-lg">Manual Review</p>
                            <p className="text-slate-500 text-xs font-medium">Standard submission required. Review takes 3-5 business days.</p>
                        </div>
                    </div>
                </div>

                {/* Submit Column */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl self-start">
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Clock className="text-emerald-600 w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">Request Pending</h3>
                            <p className="text-slate-500 text-sm font-medium mb-8">We've received your request! Our team will review your profile shortly.</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                            >
                                Go Back
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Verification Details</label>
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Tell us why you should be verified (e.g., social media handles, website, professional background...)"
                                    className="w-full h-48 bg-slate-50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-3 text-xs font-black uppercase">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Submit Request <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {!canApplyInstantly && (
                                <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest bg-slate-50 py-3 rounded-xl px-4 border border-slate-100">
                                    Tip: Pro users get verified <span className="text-indigo-600">Instantly</span> without review.
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestVerification;
