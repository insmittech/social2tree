
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
        <section className="space-y-10">
            <div className="flex items-center gap-3">
                <Palette size={24} className="text-indigo-600" />
                <h2 className="text-xl font-black text-slate-900">Custom Appearance</h2>
            </div>

            <section className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-900">Visual Themes</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">Select a color palette that matches your brand identity</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.values(THEMES).map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => handleThemeSelect(theme.id)}
                            className={`relative group rounded-[2rem] p-1.5 border-4 transition-all overflow-hidden ${page.theme === theme.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-50 hover:border-slate-200'
                                }`}
                        >
                            <div className={`h-32 w-full rounded-[1.5rem] ${theme.background} flex flex-col items-center justify-center gap-2 p-4 shadow-inner`}>
                                <div className={`w-full h-2 rounded-full ${theme.buttonClass} opacity-30`}></div>
                                <div className={`w-full h-2 rounded-full ${theme.buttonClass}`}></div>
                                <div className={`w-full h-2 rounded-full ${theme.buttonClass} opacity-30`}></div>
                            </div>
                            <div className="p-4 text-left flex justify-between items-center bg-white">
                                <span className="font-black text-xs uppercase tracking-widest text-slate-700">{theme.name}</span>
                                {page.theme === theme.id && <CheckCircle2 className="text-indigo-600" size={18} />}
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-900">Button Styles</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">Change the shape and feel of your link buttons</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { id: 'rounded-lg', label: 'Classic' },
                        { id: 'rounded-full', label: 'Soft Pill' },
                        { id: 'rounded-none', label: 'Modern Square' },
                        { id: 'brutal', label: 'Brutalism' }
                    ].map((style) => (
                        <button
                            key={style.id}
                            onClick={() => handleButtonStyleSelect(style.id as ButtonStyle)}
                            className={`h-14 border-2 text-xs font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center ${style.id === 'brutal' ? (
                                    page.buttonStyle === 'brutal'
                                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-none'
                                        : 'bg-white text-slate-900 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                                ) : (
                                    page.buttonStyle === style.id || (!page.buttonStyle && style.id === 'rounded-lg')
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-100 hover:border-slate-300 text-slate-500'
                                )
                                } ${style.id === 'rounded-full' ? 'rounded-full' :
                                    style.id === 'rounded-none' || style.id === 'brutal' ? 'rounded-none' : 'rounded-2xl'
                                }`}
                        >
                            {style.label}
                        </button>
                    ))}
                </div>
            </section>
        </section>
    );
};

export default TreeThemes;
