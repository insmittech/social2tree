import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine } from 'lucide-react';

interface FooterLink {
    label: string;
    to: string;
}

interface FooterProps {
    exploreLinks?: FooterLink[];
    legalLinks?: FooterLink[];
}

const Footer: React.FC<FooterProps> = ({ exploreLinks, legalLinks }) => {
    const defaultExploreLinks = [
        { label: 'Pricing', to: '/pricing' },
        { label: 'Features', to: '/features' },
        { label: 'Contact', to: '/contact' },
    ];

    const defaultLegalLinks = [
        { label: 'Privacy', to: '/privacy' },
        { label: 'Terms', to: '/terms' },
    ];

    const explore = exploreLinks || defaultExploreLinks;
    const legal = legalLinks || defaultLegalLinks;

    return (
        <footer className="bg-white border-t border-slate-100 py-16 px-4">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <TreePine className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">Social2Tree</span>
                    </div>
                    <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                        The professional way to connect your audience to all of your content in one compact link.
                    </p>
                </div>
                <div>
                    <h5 className="font-bold text-slate-900 uppercase text-xs mb-6">Explore</h5>
                    <ul className="space-y-4 text-slate-500 text-sm">
                        {explore.map((link, i) => (
                            <li key={i}>
                                <Link to={link.to} className="hover:text-indigo-600 transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-slate-900 uppercase text-xs mb-6">Legal</h5>
                    <ul className="space-y-4 text-slate-500 text-sm">
                        {legal.map((link, i) => (
                            <li key={i}>
                                <Link to={link.to} className="hover:text-indigo-600 transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs font-bold text-slate-400">© {new Date().getFullYear()} Social2Tree Hub. Developed by insmittech.</p>
            </div>
        </footer>
    );
};

export default Footer;
