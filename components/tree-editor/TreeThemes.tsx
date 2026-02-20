
import React from 'react';
import { THEMES, ButtonStyle } from '../../types';
import { CheckCircle2, Palette } from 'lucide-react';
import client from '../../src/api/client';
import { useToast } from '../../src/context/ToastContext';

interface TreeThemesProps {
    page: any;
    onUpdate: (updatedPage: any) => void;
}

const TreeThemes: React.FC<TreeThemesProps> = ({ page, onUpdate }) => {
    const { showToast } = useToast();

    const handleThemeSelect = async (themeId: string) => {
        onUpdate({ theme: themeId });
        try {
            await client.post('/pages/update.php', { id: page.id, theme: themeId });
            showToast('Theme updated!', 'success');
        } catch (err) {
            console.error('Failed to update theme', err);
            showToast('Failed to save theme', 'error');
        }
    };

    const handleButtonStyleSelect = async (style: ButtonStyle) => {
        onUpdate({ buttonStyle: style });
        try {
            await client.post('/pages/update.php', { id: page.id, buttonStyle: style });
            showToast('Button style updated!', 'success');
        } catch (err) {
            console.error('Failed to update button style', err);
            showToast('Failed to save button style', 'error');
        }
    };

    return (
        <section className="space-y-12">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                    <Palette size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Custom Appearance</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Design your tree personality</p>
                </div>
            </div>

            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>

                <div className="mb-10 relative z-10">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Visual Themes</h3>
                    <p className="text-slate-400 text-sm font-bold mt-1">Select a premium color palette for your page</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                    {Object.values(THEMES).map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => handleThemeSelect(theme.id)}
                            className={`relative group rounded-[2.5rem] p-2 border-2 transition-all hover:scale-[1.02] active:scale-95 duration-300 ${page.theme === theme.id
                                ? 'border-indigo-600 bg-white shadow-2xl shadow-indigo-100/50'
                                : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white hover:shadow-xl'
                                }`}
                        >
                            <div className={`h-40 w-full rounded-[2rem] ${theme.background} flex flex-col items-center justify-center gap-3 p-6 shadow-inner relative overflow-hidden`}>
                                {/* Tiny mockup elements */}
                                <div className={`w-full h-2.5 rounded-full ${theme.buttonClass} opacity-20`}></div>
                                <div className={`w-full h-2.5 rounded-full ${theme.buttonClass} shadow-lg shadow-black/5`}></div>
                                <div className={`w-full h-2.5 rounded-full ${theme.buttonClass} opacity-20`}></div>

                                {page.theme === theme.id && (
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-indigo-600 text-white p-1.5 rounded-full shadow-lg ring-4 ring-white/20">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 text-center">
                                <span className={`font-black text-xs uppercase tracking-[0.2em] transition-colors ${page.theme === theme.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                                    {theme.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="mb-10">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Button Styles</h3>
                    <p className="text-slate-400 text-sm font-bold mt-1">Refine the geometry of your link buttons</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { id: 'rounded-lg', label: 'Classic' },
                        { id: 'rounded-full', label: 'Soft Pill' },
                        { id: 'rounded-none', label: 'Modern Square' },
                        { id: 'brutal', label: 'Brutalism' }
                    ].map((style) => (
                        <button
                            key={style.id}
                            onClick={() => handleButtonStyleSelect(style.id as ButtonStyle)}
                            className={`h-16 border-2 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center relative active:scale-95 duration-300 group ${style.id === 'brutal' ? (
                                page.buttonStyle === 'brutal'
                                    ? 'bg-slate-950 text-white border-slate-950 shadow-none'
                                    : 'bg-white text-slate-900 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'
                            ) : (
                                page.buttonStyle === style.id || (!page.buttonStyle && style.id === 'rounded-lg')
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100/50'
                                    : 'border-slate-100 hover:border-indigo-200 text-slate-400 hover:text-indigo-600 group-hover:bg-slate-50'
                            )
                                } ${style.id === 'rounded-full' ? 'rounded-full' :
                                    style.id === 'rounded-none' || style.id === 'brutal' ? 'rounded-none' : 'rounded-2xl'
                                }`}
                        >
                            {style.label}
                            {(page.buttonStyle === style.id || (!page.buttonStyle && style.id === 'rounded-lg')) && style.id !== 'brutal' && (
                                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></span>
                            )}
                        </button>
                    ))}
                </div>
            </section>
        </section>
    );
};

export default TreeThemes;
