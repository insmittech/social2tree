import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Twitter, Linkedin, Youtube, ChevronRight } from 'lucide-react';

interface FooterProps {
    exploreLinks?: any;
    legalLinks?: any;
}

const Footer: React.FC<FooterProps> = () => {
    
    // Column 1: Products
    const productsLinks = [
        { label: 'Crimewall', to: '/products/crimewall' },
        { label: 'API', to: '/products/api' },
        { label: 'Professional Services', to: '/services' },
        { label: 'Professional', to: '/pricing' },
        { label: 'Private Platform', to: '/enterprise' },
    ];

    // Column 2: Resources
    const resourcesLinks = [
        { label: 'FAQ', to: '/faq' },
        { label: 'Blog', to: '/blog' },
        { label: 'Newsroom', to: '/news' },
        { label: 'Glossary', to: '/glossary' },
        { label: 'OSINT Resources', to: '/resources' },
        { label: 'Jobs', to: '/careers' },
    ];

    // Column 3: Company
    const companyLinks = [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Partnership', to: '/partners' },
    ];

    return (
        <footer className="bg-[#05080f] border-t border-teal-900/30 pt-24 pb-12 overflow-hidden relative selection:bg-teal-500/30">
            
            {/* Subtle Glowing Background Accents */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.03),transparent_70%)] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
                
                {/* Main 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20 lg:pr-64">
                    
                    {/* Col 1: Products */}
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-[0.2em] uppercase mb-8">Products</h4>
                        <ul className="space-y-4">
                            {productsLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.to} className="text-slate-400 text-[15px] font-medium hover:text-teal-400 transition-colors duration-300 flex items-center gap-1 group">
                                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-teal-500" />
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 2: Resources */}
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-[0.2em] uppercase mb-8">Resources</h4>
                        <ul className="space-y-4">
                            {resourcesLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.to} className="text-slate-400 text-[15px] font-medium hover:text-teal-400 transition-colors duration-300 flex items-center gap-1 group">
                                         <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-teal-500" />
                                         <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Company */}
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-[0.2em] uppercase mb-8">Company</h4>
                        <ul className="space-y-4">
                            {companyLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.to} className="text-slate-400 text-[15px] font-medium hover:text-teal-400 transition-colors duration-300 flex items-center gap-1 group">
                                         <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-teal-500" />
                                         <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Contacts Info */}
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-[0.2em] uppercase mb-8">Contacts</h4>
                        <ul className="space-y-6">
                            <li>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PR</p>
                                <a href="mailto:pr@sociallinks.io" className="text-teal-400 hover:text-teal-300 text-[15px] font-medium transition-colors border-b border-teal-400/30 hover:border-teal-300 pb-0.5">pr@sociallinks.io</a>
                            </li>
                            <li>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Partnership</p>
                                <a href="mailto:partners@sociallinks.io" className="text-teal-400 hover:text-teal-300 text-[15px] font-medium transition-colors border-b border-teal-400/30 hover:border-teal-300 pb-0.5">partners@sociallinks.io</a>
                            </li>
                            <li>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">General Sales</p>
                                <a href="mailto:sales@sociallinks.io" className="text-teal-400 hover:text-teal-300 text-[15px] font-medium transition-colors border-b border-teal-400/30 hover:border-teal-300 pb-0.5">sales@sociallinks.io</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom CTA / Branding Area overlaying right edge on desktop */}
                <div className="lg:absolute lg:top-24 lg:right-6 lg:w-48 flex flex-col items-start lg:items-end md:items-center mt-12 lg:mt-0 pt-12 border-t border-slate-800 lg:border-t-0 lg:pt-0">
                    
                    {/* CTA Button */}
                    <Link 
                        to="/contact" 
                        className="w-full lg:w-auto relative group overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-bold tracking-widest uppercase hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all duration-300 text-center flex items-center justify-center gap-2 mb-10 lg:mb-12 cursor-pointer"
                    >
                        <span className="relative z-10 flex items-center gap-2">Contact <Activity size={18} /></span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        <a href="https://twitter.com/sociallinks" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 group">
                            <Twitter size={20} fill="currentColor" className="group-hover:text-teal-600 transition-colors" />
                        </a>
                        <a href="https://linkedin.com/company/sociallinks" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 group">
                            <Linkedin size={20} fill="currentColor" className="group-hover:text-cyan-600 transition-colors" />
                        </a>
                        <a href="https://youtube.com/sociallinks" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 group">
                            <Youtube size={20} fill="currentColor" className="group-hover:text-red-600 transition-colors" />
                        </a>
                    </div>
                </div>

                {/* Bottom Legal / Logo Row */}
                <div className="mt-16 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
                     <div className="flex items-center gap-2">
                        <div className="bg-teal-500/20 p-1.5 rounded-lg border border-teal-500/30">
                            <Shield className="text-teal-400 w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-widest">Social<span className="text-teal-400">2Tree</span></span>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-semibold tracking-wider uppercase text-slate-500">
                        <Link to="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
                    </div>

                    <p className="text-xs font-medium text-slate-600">
                        © {new Date().getFullYear()} SocialLinks, Inc. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
