
import React from 'react';
import { QrCode, Share2, Download, Copy, Instagram, Twitter, Facebook, Linkedin, MessageCircle, Sparkles } from 'lucide-react';
import { useToast } from '../../src/context/ToastContext';

interface TreeSharingProps {
    page: any;
    onUpdate: (updatedPage: any) => void;
}

const TreeSharing: React.FC<TreeSharingProps> = ({ page, onUpdate }) => {
    const { showToast } = useToast();
    const profileUrl = `${window.location.origin}/${page.slug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(profileUrl);
        showToast('Profile URL copied to clipboard!', 'success');
    };

    const sharePlatforms = [
        { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={24} />, color: 'bg-[#25D366]', url: `https://wa.me/?text=Check out my bio tree: ${profileUrl}` },
        { id: 'twitter', label: 'X (Twitter)', icon: <Twitter size={24} />, color: 'bg-black', url: `https://twitter.com/intent/tweet?text=Check out my bio tree: ${profileUrl}` },
        { id: 'facebook', label: 'Facebook', icon: <Facebook size={24} />, color: 'bg-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${profileUrl}` },
        { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={24} />, color: 'bg-[#0A66C2]', url: `https://www.linkedin.com/sharing/share-offsite/?url=${profileUrl}` },
    ];

    return (
        <section className="space-y-12">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                    <QrCode size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Share Your Tree</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Spread your influence everywhere</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-[400px,1fr] gap-10">
                {/* QR Code Section - Premium Card */}
                <section className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                    <div className="mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">QR Code</h3>
                        <p className="text-slate-400 text-sm font-bold mt-1">Scan for instant access</p>
                    </div>

                    <div className="relative group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute -inset-4 bg-slate-50 rounded-[3rem] -z-10 shadow-inner"></div>
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-50">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(profileUrl)}`}
                                alt="QR Code"
                                className="w-48 h-48"
                            />
                        </div>
                    </div>

                    <button className="w-full mt-10 bg-slate-950 text-white py-4.5 rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
                        <Download size={20} /> Download Kit
                    </button>
                </section>

                {/* Direct Link Section */}
                <section className="space-y-10">
                    <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Direct Link</h3>
                        <div className="flex bg-slate-50 border border-slate-200 rounded-[2rem] p-2 pl-8 items-center gap-4 group-focus-within:ring-4 ring-indigo-500/10 transition-all">
                            <span className="text-slate-500 font-mono text-sm truncate flex-grow font-bold">
                                {profileUrl}
                            </span>
                            <button
                                onClick={handleCopy}
                                className="bg-indigo-600 text-white h-14 w-14 flex items-center justify-center rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-90"
                                title="Copy Link"
                            >
                                <Copy size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Share to Social</h3>
                        <div className="grid grid-cols-4 gap-6">
                            {sharePlatforms.map(platform => (
                                <a
                                    key={platform.id}
                                    href={platform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${platform.color} text-white h-16 rounded-[2rem] flex items-center justify-center shadow-lg hover:scale-110 hover:-translate-y-2 active:scale-90 transition-all duration-300`}
                                    title={`Share on ${platform.label}`}
                                >
                                    {platform.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-100 text-white text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <Sparkles className="mx-auto mb-6 text-indigo-200 animate-bounce" size={40} />
                        <h4 className="text-xl font-black mb-3 tracking-tight">Pro Tip: Drive Traffic</h4>
                        <p className="text-indigo-100 text-sm font-bold leading-relaxed max-w-sm mx-auto">
                            Add this URL to your Instagram Bio, Twitter Profile, and Email Signature for 24/7 engagement.
                        </p>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default TreeSharing;
