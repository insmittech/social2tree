
import React from 'react';
import { QrCode, Share2, Download, Copy, Instagram, Twitter, Facebook, Linkedin, MessageCircle, Sparkles } from 'lucide-react';
import { useToast } from '../../src/context/ToastContext';

interface TreeSharingProps {
    page: any;
}

const TreeSharing: React.FC<TreeSharingProps> = ({ page }) => {
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
        <section className="space-y-10">
            <div className="flex items-center gap-3">
                <QrCode size={24} className="text-indigo-600" />
                <h2 className="text-xl font-black text-slate-900">Share Your Tree</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* QR Code Section */}
                <section className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="mb-6">
                        <h3 className="text-lg font-black text-slate-900">QR Code</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">Scan to view your digital business card</p>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2rem] border-4 border-white shadow-inner mb-8">
                        <div className="bg-white p-4 rounded-3xl shadow-xl">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`}
                                alt="QR Code"
                                className="w-48 h-48"
                            />
                        </div>
                    </div>

                    <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                        <Download size={18} /> Download High-Res QR
                    </button>
                </section>

                {/* Direct Link Section */}
                <section className="space-y-8">
                    <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-900 mb-6">Direct Link</h3>
                        <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-2 pl-6 items-center gap-4">
                            <span className="text-slate-500 font-mono text-xs truncate flex-grow">
                                {profileUrl}
                            </span>
                            <button
                                onClick={handleCopy}
                                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-90"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h3 className="text-lg font-black text-slate-900 mb-6">Share to Social</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {sharePlatforms.map(platform => (
                                <a
                                    key={platform.id}
                                    href={platform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${platform.color} text-white p-4 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all`}
                                    title={`Share on ${platform.label}`}
                                >
                                    {platform.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white text-center">
                        <Sparkles className="mx-auto mb-4" size={32} />
                        <h4 className="text-lg font-black mb-2">Drive More Traffic</h4>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                            Add your tree URL to your Instagram Bio, Twitter Profile, and Email Signature for maximum reach.
                        </p>
                    </div>
                </section>
            </div>
        </section>
    );
};

export default TreeSharing;
