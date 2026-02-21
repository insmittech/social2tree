import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    DndContext, DragOverlay, closestCenter, PointerSensor,
    useSensor, useSensors, DragStartEvent, DragEndEvent, useDroppable, useDraggable
} from '@dnd-kit/core';
import {
    SortableContext, verticalListSortingStrategy,
    useSortable, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Link as LinkIcon, Type, Share2, Map, Mail, Image, Calendar,
    Undo2, Redo2, Globe, Upload, Eye, EyeOff, ZoomIn, ZoomOut,
    Settings, BarChart2, Palette, Trash2, Copy,
    GripVertical, X, Plus, Check, ArrowLeft, Smartphone, Monitor,
    Bold, Italic, AlignLeft, AlignCenter, AlignRight, LayoutTemplate, Save, Loader2
} from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

// ─── Types ───────────────────────────────────────────────────────────────────

type BlockType = 'link' | 'text' | 'social_icons' | 'map' | 'newsletter' | 'image';

interface BaseBlock { id: string; type: BlockType; visible?: boolean; }

interface LinkBlock extends BaseBlock { type: 'link'; data: { label: string; url: string; bg: string; textColor: string; radius: string; }; }
interface TextBlock extends BaseBlock { type: 'text'; data: { content: string; align: 'left' | 'center' | 'right'; size: string; bold: boolean; italic: boolean; color: string; }; }
interface SocialBlock extends BaseBlock { type: 'social_icons'; data: { icons: { platform: string; url: string }[]; style: 'circle' | 'square' | 'pill'; size: 'sm' | 'md' | 'lg'; }; }
interface MapBlock extends BaseBlock { type: 'map'; data: { address: string; height: string; }; }
interface NewsletterBlock extends BaseBlock { type: 'newsletter'; data: { title: string; placeholder: string; buttonText: string; bg: string; }; }
interface ImageBlock extends BaseBlock { type: 'image'; data: { src: string; alt: string; radius: string; }; }

type Block = LinkBlock | TextBlock | SocialBlock | MapBlock | NewsletterBlock | ImageBlock;

interface PageConfig {
    colors: { background: string; text: string; accent: string; cardBg: string; };
    fonts: { family: string; weight: string; };
    blocks: Block[];
    profile: { avatar: string; name: string; bio: string; };
}

// ─── Themes ──────────────────────────────────────────────────────────────────

const THEMES = [
    { id: 'minimal', label: 'Minimal', preview: ['#ffffff', '#0f172a', '#6366f1', '#f8fafc'], fonts: { family: 'Inter', weight: '500' } },
    { id: 'dark', label: 'Dark', preview: ['#0f172a', '#f8fafc', '#818cf8', '#1e293b'], fonts: { family: 'Inter', weight: '600' } },
    { id: 'ocean', label: 'Ocean', preview: ['#0369a1', '#f0f9ff', '#38bdf8', '#0c4a6e'], fonts: { family: 'Poppins', weight: '500' } },
    { id: 'sunset', label: 'Sunset', preview: ['#fef3c7', '#7c2d12', '#f97316', '#fff7ed'], fonts: { family: 'Outfit', weight: '600' } },
    { id: 'forest', label: 'Forest', preview: ['#f0fdf4', '#14532d', '#22c55e', '#dcfce7'], fonts: { family: 'Nunito', weight: '500' } },
    { id: 'midnight', label: 'Midnight', preview: ['#1e1b4b', '#e0e7ff', '#a78bfa', '#2e1065'], fonts: { family: 'Roboto', weight: '400' } },
];

const FONT_FAMILIES = ['Inter', 'Poppins', 'Outfit', 'Nunito', 'Roboto', 'Playfair Display', 'Space Grotesk'];
const FONT_WEIGHTS = ['300', '400', '500', '600', '700', '800', '900'];

// ─── Default Config ───────────────────────────────────────────────────────────

const defaultConfig: PageConfig = {
    colors: { background: '#ffffff', text: '#0f172a', accent: '#6366f1', cardBg: '#f8fafc' },
    fonts: { family: 'Inter', weight: '500' },
    profile: { avatar: '', name: 'Your Name', bio: 'Your bio goes here' },
    blocks: [
        { id: 'b1', type: 'link', data: { label: 'My Portfolio', url: '#', bg: '#6366f1', textColor: '#ffffff', radius: '1rem' } },
        { id: 'b2', type: 'text', data: { content: 'Welcome to my Social Tree! Click any link to explore.', align: 'center', size: '14px', bold: false, italic: false, color: '#475569' } },
        { id: 'b3', type: 'social_icons', data: { icons: [{ platform: 'twitter', url: '#' }, { platform: 'instagram', url: '#' }, { platform: 'github', url: '#' }], style: 'circle', size: 'md' } },
    ],
};

// ─── Block Library definitions ────────────────────────────────────────────────

const BLOCK_LIBRARY: { type: BlockType; label: string; icon: React.ReactNode; color: string; defaultData: any }[] = [
    { type: 'link', label: 'Link Button', icon: <LinkIcon size={20} />, color: 'bg-indigo-100 text-indigo-600', defaultData: { label: 'New Link', url: '#', bg: '#6366f1', textColor: '#ffffff', radius: '1rem' } },
    { type: 'text', label: 'Text', icon: <Type size={20} />, color: 'bg-violet-100 text-violet-600', defaultData: { content: 'Add your text here', align: 'center', size: '14px', bold: false, italic: false, color: '#475569' } },
    { type: 'social_icons', label: 'Social', icon: <Share2 size={20} />, color: 'bg-sky-100 text-sky-600', defaultData: { icons: [{ platform: 'twitter', url: '#' }], style: 'circle', size: 'md' } },
    { type: 'image', label: 'Image', icon: <Image size={20} />, color: 'bg-pink-100 text-pink-600', defaultData: { src: '', alt: 'Image', radius: '1rem' } },
    { type: 'map', label: 'Map', icon: <Map size={20} />, color: 'bg-emerald-100 text-emerald-600', defaultData: { address: 'New York, USA', height: '180px' } },
    { type: 'newsletter', label: 'Newsletter', icon: <Mail size={20} />, color: 'bg-amber-100 text-amber-600', defaultData: { title: 'Stay in touch', placeholder: 'your@email.com', buttonText: 'Subscribe', bg: '#f1f5f9' } },
];

// ─── Templates ───────────────────────────────────────────────────────────────

const TEMPLATES: { id: string; label: string; emoji: string; desc: string; config: Partial<PageConfig> }[] = [
    {
        id: 'creator', label: 'Creator', emoji: '🎨', desc: 'For influencers & content creators',
        config: {
            colors: { background: '#0f172a', text: '#f8fafc', accent: '#818cf8', cardBg: '#1e293b' },
            fonts: { family: 'Inter', weight: '600' },
            blocks: [
                { id: 't1', type: 'text', visible: true, data: { content: '✨ Content Creator & Artist', align: 'center', size: '18px', bold: true, italic: false, color: '#818cf8' } },
                { id: 't2', type: 'link', visible: true, data: { label: '🎬 Watch My Latest Video', url: '#', bg: '#6366f1', textColor: '#fff', radius: '2rem' } },
                { id: 't3', type: 'link', visible: true, data: { label: '📸 Instagram Feed', url: '#', bg: '#e1306c', textColor: '#fff', radius: '2rem' } },
                { id: 't4', type: 'social_icons', visible: true, data: { icons: [{ platform: 'instagram', url: '#' }, { platform: 'youtube', url: '#' }, { platform: 'tiktok', url: '#' }], style: 'circle', size: 'md' } },
                { id: 't5', type: 'newsletter', visible: true, data: { title: 'Join my newsletter', placeholder: 'your@email.com', buttonText: 'Subscribe', bg: '#1e293b' } },
            ] as Block[],
        },
    },
    {
        id: 'business', label: 'Business', emoji: '💼', desc: 'For professionals & companies',
        config: {
            colors: { background: '#ffffff', text: '#0f172a', accent: '#0ea5e9', cardBg: '#f0f9ff' },
            fonts: { family: 'Poppins', weight: '500' },
            blocks: [
                { id: 'b1', type: 'text', visible: true, data: { content: 'Professional Services', align: 'center', size: '20px', bold: true, italic: false, color: '#0ea5e9' } },
                { id: 'b2', type: 'link', visible: true, data: { label: '📅 Book a Meeting', url: '#', bg: '#0ea5e9', textColor: '#fff', radius: '0.5rem' } },
                { id: 'b3', type: 'link', visible: true, data: { label: '📄 Download Portfolio', url: '#', bg: '#0f172a', textColor: '#fff', radius: '0.5rem' } },
                { id: 'b4', type: 'map', visible: true, data: { address: 'New York, USA', height: '160px' } },
                { id: 'b5', type: 'social_icons', visible: true, data: { icons: [{ platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }], style: 'square', size: 'md' } },
            ] as Block[],
        },
    },
    {
        id: 'portfolio', label: 'Portfolio', emoji: '🖼️', desc: 'For designers & developers',
        config: {
            colors: { background: '#f0fdf4', text: '#14532d', accent: '#22c55e', cardBg: '#dcfce7' },
            fonts: { family: 'Space Grotesk', weight: '600' },
            blocks: [
                { id: 'p1', type: 'text', visible: true, data: { content: 'Designer & Developer', align: 'center', size: '18px', bold: true, italic: false, color: '#15803d' } },
                { id: 'p2', type: 'link', visible: true, data: { label: '🌐 My Portfolio Site', url: '#', bg: '#22c55e', textColor: '#fff', radius: '1rem' } },
                { id: 'p3', type: 'link', visible: true, data: { label: '💻 GitHub Projects', url: '#', bg: '#1e293b', textColor: '#fff', radius: '1rem' } },
                { id: 'p4', type: 'social_icons', visible: true, data: { icons: [{ platform: 'github', url: '#' }, { platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }], style: 'pill', size: 'md' } },
            ] as Block[],
        },
    },
];

const SOCIAL_COLORS: Record<string, string> = {
    twitter: '#1DA1F2', instagram: '#E1306C', github: '#333',
    youtube: '#FF0000', linkedin: '#0077B5', facebook: '#1877F2',
    tiktok: '#000', discord: '#5865F2', twitch: '#9146FF',
};
const SOCIAL_LABELS = ['twitter', 'instagram', 'github', 'youtube', 'linkedin', 'facebook', 'tiktok', 'discord', 'twitch'];

// ─── Block Renderers (for preview) ───────────────────────────────────────────

const LinkBlockPreview: React.FC<{ data: LinkBlock['data']; accent: string }> = ({ data, accent }) => (
    <a href={data.url} onClick={e => e.preventDefault()} style={{ background: data.bg || accent, color: data.textColor, borderRadius: data.radius }}
        className="block w-full py-3.5 text-center text-sm font-bold shadow-sm dark:shadow-none hover:opacity-90 transition-opacity">
        {data.label}
    </a>
);

const TextBlockPreview: React.FC<{ data: TextBlock['data'] }> = ({ data }) => (
    <p style={{ textAlign: data.align, fontSize: data.size, fontWeight: data.bold ? 700 : 400, fontStyle: data.italic ? 'italic' : 'normal', color: data.color }}
        className="leading-relaxed">
        {data.content}
    </p>
);

const SocialBlockPreview: React.FC<{ data: SocialBlock['data']; accent: string }> = ({ data, accent }) => {
    const sizeMap = { sm: 32, md: 40, lg: 52 };
    const sz = sizeMap[data.size];
    const radiusMap = { circle: '50%', square: '10px', pill: '8px' };
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {data.icons.map((ic, i) => (
                <a key={i} href={ic.url} onClick={e => e.preventDefault()}
                    style={{ width: sz, height: sz, borderRadius: radiusMap[data.style], background: SOCIAL_COLORS[ic.platform] || accent }}
                    className="flex items-center justify-center text-white text-xs font-black">
                    {ic.platform.slice(0, 2).toUpperCase()}
                </a>
            ))}
        </div>
    );
};

const MapBlockPreview: React.FC<{ data: MapBlock['data'] }> = ({ data }) => (
    <div style={{ height: data.height }} className="rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center relative">
        <iframe
            title="map"
            className="w-full h-full border-0"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(data.address)}&output=embed&z=12`}
            loading="lazy"
        />
    </div>
);

const NewsletterBlockPreview: React.FC<{ data: NewsletterBlock['data']; accent: string }> = ({ data, accent }) => (
    <div className="rounded-2xl p-4" style={{ background: data.bg }}>
        <p className="text-xs font-black text-center mb-3 uppercase tracking-widest">{data.title}</p>
        <div className="flex gap-2">
            <input placeholder={data.placeholder} className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 outline-none bg-white dark:bg-slate-900/40" />
            <button style={{ background: accent }} className="px-4 py-2 rounded-xl text-white text-xs font-bold">{data.buttonText}</button>
        </div>
    </div>
);

const ImageBlockPreview: React.FC<{ data: ImageBlock['data'] }> = ({ data }) => (
    data.src
        ? <img src={data.src} alt={data.alt} style={{ borderRadius: data.radius }} className="w-full object-cover" />
        : <div style={{ borderRadius: data.radius }} className="w-full h-32 bg-slate-100 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-bold"><Image size={24} /></div>
);

const BlockRenderer: React.FC<{ block: Block; config: PageConfig }> = ({ block, config }) => {
    switch (block.type) {
        case 'link': return <LinkBlockPreview data={block.data} accent={config.colors.accent} />;
        case 'text': return <TextBlockPreview data={block.data} />;
        case 'social_icons': return <SocialBlockPreview data={block.data} accent={config.colors.accent} />;
        case 'map': return <MapBlockPreview data={block.data} />;
        case 'newsletter': return <NewsletterBlockPreview data={block.data} accent={config.colors.accent} />;
        case 'image': return <ImageBlockPreview data={block.data} />;
        default: return null;
    }
};

// ─── Block Settings Panels ────────────────────────────────────────────────────

const LinkSettings: React.FC<{ data: LinkBlock['data']; onChange: (d: any) => void }> = ({ data, onChange }) => (
    <div className="space-y-4">
        <label className="block"><span className="settings-label">Button Label</span>
            <input value={data.label} onChange={e => onChange({ ...data, label: e.target.value })} className="settings-input" /></label>
        <label className="block"><span className="settings-label">URL</span>
            <input value={data.url} onChange={e => onChange({ ...data, url: e.target.value })} placeholder="https://" className="settings-input" /></label>
        <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="settings-label">Background</span>
                <input type="color" value={data.bg} onChange={e => onChange({ ...data, bg: e.target.value })} className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700/50 cursor-pointer" /></label>
            <label className="block"><span className="settings-label">Text Color</span>
                <input type="color" value={data.textColor} onChange={e => onChange({ ...data, textColor: e.target.value })} className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700/50 cursor-pointer" /></label>
        </div>
        <label className="block"><span className="settings-label">Border Radius</span>
            <select value={data.radius} onChange={e => onChange({ ...data, radius: e.target.value })} className="settings-input">
                <option value="0">Square</option><option value="0.5rem">Small</option>
                <option value="1rem">Medium</option><option value="2rem">Full Round</option>
            </select></label>
    </div>
);

const TextSettings: React.FC<{ data: TextBlock['data']; onChange: (d: any) => void }> = ({ data, onChange }) => (
    <div className="space-y-4">
        <label className="block"><span className="settings-label">Content</span>
            <textarea value={data.content} onChange={e => onChange({ ...data, content: e.target.value })} rows={4} className="settings-input resize-none" /></label>
        <div className="flex gap-2">
            {(['left', 'center', 'right'] as const).map(a => (
                <button key={a} onClick={() => onChange({ ...data, align: a })}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${data.align === a ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}>
                    {a === 'left' ? <AlignLeft size={14} className="mx-auto" /> : a === 'center' ? <AlignCenter size={14} className="mx-auto" /> : <AlignRight size={14} className="mx-auto" />}
                </button>
            ))}
        </div>
        <div className="flex gap-2">
            <button onClick={() => onChange({ ...data, bold: !data.bold })} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${data.bold ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:text-slate-400'}`}><Bold size={14} className="mx-auto" /></button>
            <button onClick={() => onChange({ ...data, italic: !data.italic })} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${data.italic ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:text-slate-400'}`}><Italic size={14} className="mx-auto" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="settings-label">Font Size</span>
                <select value={data.size} onChange={e => onChange({ ...data, size: e.target.value })} className="settings-input">
                    {['11px', '12px', '13px', '14px', '16px', '18px', '22px', '28px'].map(s => <option key={s}>{s}</option>)}
                </select></label>
            <label className="block"><span className="settings-label">Color</span>
                <input type="color" value={data.color} onChange={e => onChange({ ...data, color: e.target.value })} className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700/50 cursor-pointer" /></label>
        </div>
    </div>
);

const SocialSettings: React.FC<{ data: SocialBlock['data']; onChange: (d: any) => void }> = ({ data, onChange }) => (
    <div className="space-y-4">
        <div className="space-y-2">
            {data.icons.map((ic, i) => (
                <div key={i} className="flex gap-2 items-center">
                    <select value={ic.platform} onChange={e => { const icons = [...data.icons]; icons[i] = { ...ic, platform: e.target.value }; onChange({ ...data, icons }); }} className="flex-1 settings-input py-2">
                        {SOCIAL_LABELS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input value={ic.url} onChange={e => { const icons = [...data.icons]; icons[i] = { ...ic, url: e.target.value }; onChange({ ...data, icons }); }} placeholder="URL" className="flex-1 settings-input py-2" />
                    <button onClick={() => { const icons = data.icons.filter((_, j) => j !== i); onChange({ ...data, icons }); }} className="p-2 text-rose-400 hover:text-rose-600"><X size={14} /></button>
                </div>
            ))}
            <button onClick={() => onChange({ ...data, icons: [...data.icons, { platform: 'twitter', url: '#' }] })} className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl text-xs font-black text-slate-400 dark:text-slate-500 hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-1">
                <Plus size={12} /> Add Icon
            </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="settings-label">Style</span>
                <select value={data.style} onChange={e => onChange({ ...data, style: e.target.value as any })} className="settings-input">
                    <option value="circle">Circle</option><option value="square">Square</option><option value="pill">Pill</option>
                </select></label>
            <label className="block"><span className="settings-label">Size</span>
                <select value={data.size} onChange={e => onChange({ ...data, size: e.target.value as any })} className="settings-input">
                    <option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option>
                </select></label>
        </div>
    </div>
);

const MapSettings: React.FC<{ data: MapBlock['data']; onChange: (d: any) => void }> = ({ data, onChange }) => (
    <div className="space-y-4">
        <label className="block"><span className="settings-label">Address / Location</span>
            <input value={data.address} onChange={e => onChange({ ...data, address: e.target.value })} placeholder="New York, USA" className="settings-input" /></label>
        <label className="block"><span className="settings-label">Height</span>
            <select value={data.height} onChange={e => onChange({ ...data, height: e.target.value })} className="settings-input">
                <option value="140px">Small</option><option value="180px">Medium</option><option value="240px">Large</option>
            </select></label>
    </div>
);

const NewsletterSettings: React.FC<{ data: NewsletterBlock['data']; onChange: (d: any) => void }> = ({ data, onChange }) => (
    <div className="space-y-4">
        <label className="block"><span className="settings-label">Heading</span>
            <input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} className="settings-input" /></label>
        <label className="block"><span className="settings-label">Placeholder</span>
            <input value={data.placeholder} onChange={e => onChange({ ...data, placeholder: e.target.value })} className="settings-input" /></label>
        <label className="block"><span className="settings-label">Button Text</span>
            <input value={data.buttonText} onChange={e => onChange({ ...data, buttonText: e.target.value })} className="settings-input" /></label>
        <label className="block"><span className="settings-label">Background</span>
            <input type="color" value={data.bg} onChange={e => onChange({ ...data, bg: e.target.value })} className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700/50 cursor-pointer" /></label>
    </div>
);

const ImageSettings: React.FC<{ data: ImageBlock['data']; onChange: (d: any) => void }> = ({ data, onChange }) => (
    <div className="space-y-4">
        <label className="block"><span className="settings-label">Image URL</span>
            <input value={data.src} onChange={e => onChange({ ...data, src: e.target.value })} placeholder="https://..." className="settings-input" /></label>
        <label className="block"><span className="settings-label">Alt Text</span>
            <input value={data.alt} onChange={e => onChange({ ...data, alt: e.target.value })} className="settings-input" /></label>
        <label className="block"><span className="settings-label">Border Radius</span>
            <select value={data.radius} onChange={e => onChange({ ...data, radius: e.target.value })} className="settings-input">
                <option value="0">None</option><option value="0.5rem">Small</option><option value="1rem">Medium</option><option value="2rem">Large</option>
            </select></label>
    </div>
);

// ─── Sortable Block in Canvas ─────────────────────────────────────────────────

const SortableBlock: React.FC<{
    block: Block; config: PageConfig;
    isActive: boolean; onSelect: () => void; onDelete: () => void;
    onDuplicate: () => void; onToggleVisible: () => void;
}> = ({ block, config, isActive, onSelect, onDelete, onDuplicate, onToggleVisible }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
    const isHidden = block.visible === false;
    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
            onClick={onSelect}
            className={`relative group cursor-pointer transition-all duration-150 ${isActive ? 'ring-2 ring-indigo-500 ring-offset-2 rounded-2xl' : ''} ${isHidden ? 'opacity-40' : ''}`}>
            {/* Left — grip */}
            <div className={`absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
                <button {...attributes} {...listeners} className="p-1 text-slate-400 dark:text-slate-500 cursor-grab active:cursor-grabbing hover:text-slate-600"><GripVertical size={14} /></button>
            </div>
            {/* Right — actions */}
            <div className={`absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}>
                <button onClick={e => { e.stopPropagation(); onToggleVisible(); }} title={isHidden ? 'Show' : 'Hide'}
                    className={`p-1 rounded-lg transition-colors ${isHidden ? 'text-amber-400 hover:text-amber-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                    {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button onClick={e => { e.stopPropagation(); onDuplicate(); }} title="Duplicate"
                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-indigo-500 rounded-lg transition-colors">
                    <Copy size={13} />
                </button>
                <button onClick={e => { e.stopPropagation(); onDelete(); }} title="Delete"
                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-500 rounded-lg transition-colors">
                    <Trash2 size={13} />
                </button>
            </div>
            {/* Hidden badge */}
            {isHidden && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <span className="bg-amber-400 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Hidden</span>
                </div>
            )}
            <BlockRenderer block={block} config={config} />
        </div>
    );
};

// ─── Drop Zone (canvas) ───────────────────────────────────────────────────────

const CanvasDropZone: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop' });
    return (
        <div ref={setNodeRef} className={`min-h-16 rounded-2xl transition-all duration-200 ${isOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-300' : ''}`}>
            {children}
            {isOver && <div className="py-4 text-center text-indigo-400 text-xs font-black uppercase tracking-widest animate-pulse">Drop here</div>}
        </div>
    );
};

// ─── Draggable Library Item ───────────────────────────────────────────────────

const LibraryItem: React.FC<{ type: BlockType; label: string; icon: React.ReactNode; color: string }> = ({ type, label, icon, color }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `library:${type}`, data: { fromLibrary: true, type } });
    return (
        <div ref={setNodeRef} {...attributes} {...listeners}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-grab active:cursor-grabbing transition-all select-none
                ${isDragging ? 'opacity-40 scale-95' : 'border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/40 hover:border-indigo-200 hover:shadow-md hover:scale-105'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</span>
        </div>
    );
};

const PageBuilder: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: profile, updateUser, refreshProfile } = useAuth();
    const { showToast } = useToast();

    const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);
    const [history, setHistory] = useState<PageConfig[]>([defaultConfig]);
    const [historyIdx, setHistoryIdx] = useState(0);
    const config = history[historyIdx];

    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [rightTab, setRightTab] = useState<'design' | 'analytics' | 'settings'>('design');
    const [zoom, setZoom] = useState(100);
    const [dragOverlay, setDragOverlay] = useState<BlockType | null>(null);
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [showTemplates, setShowTemplates] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [mobileView, setMobileView] = useState<'library' | 'canvas' | 'settings'>('canvas');
    const [deletedLinkIds, setDeletedLinkIds] = useState<string[]>([]);

    // ── Load real data from profile ──────────────────────────────────────────
    useEffect(() => {
        if (!profile || !id) return;
        const tree = profile.pages.find(p => p.id === id);
        if (!tree) return;

        const initialConfig: PageConfig = {
            colors: { background: tree.theme === 'dark' ? '#0f172a' : '#ffffff', text: tree.theme === 'dark' ? '#f8fafc' : '#0f172a', accent: '#6366f1', cardBg: '#f8fafc' },
            fonts: { family: 'Inter', weight: '500' },
            profile: {
                avatar: tree.avatarUrl || '',
                name: tree.displayName || '',
                bio: tree.bio || '',
            },
            blocks: (tree.links || []).map((l: any) => ({
                id: l.id,
                type: 'link',
                visible: l.active,
                data: {
                    label: l.title,
                    url: l.url,
                    bg: '#6366f1',
                    textColor: '#ffffff',
                    radius: '1rem'
                }
            })) as Block[]
        };

        setHistory([initialConfig]);
        setHistoryIdx(0);
    }, [id, profile]);

    const activeBlock = config.blocks.find(b => b.id === activeBlockId) || null;

    // ── Real Saving to Backend ─────────────────────────────────────────────
    const handleSave = async (silent = false) => {
        if (!id) return;
        if (!silent) setIsSaving(true);
        else setAutoSaveStatus('saving');

        try {
            // 1. Handle Deletions
            if (deletedLinkIds.length > 0) {
                // Only delete if the ID is NOT in the current config (handles undo)
                const currentIds = new Set(config.blocks.map(b => b.id));
                for (const delId of deletedLinkIds) {
                    if (!currentIds.has(delId)) {
                        await client.post('/links/delete.php', { id: delId });
                    }
                }
                setDeletedLinkIds([]);
            }

            // 2. Update Page details (displayName, bio)
            await client.post('/pages/update.php', {
                id,
                displayName: config.profile.name,
                bio: config.profile.bio,
                theme: config.colors.background === '#0f172a' ? 'dark' : 'default'
            });

            // 3. Handle Creations and Updates
            const updatedBlocks = [...config.blocks];
            const linkBlocks = updatedBlocks.filter(b => b.type === 'link') as LinkBlock[];

            for (let i = 0; i < linkBlocks.length; i++) {
                const block = linkBlocks[i];
                if (block.id.startsWith('b')) {
                    // Create new link
                    const res = await client.post('/links/create.php', {
                        pageId: id,
                        title: block.data.label,
                        url: block.data.url,
                        type: 'social'
                    });
                    if (res.data?.link?.id) {
                        // Replace temp ID with real ID in the local block array
                        const blockIdx = updatedBlocks.findIndex(b => b.id === block.id);
                        if (blockIdx !== -1) {
                            updatedBlocks[blockIdx] = { ...block, id: res.data.link.id };
                        }
                    }
                } else {
                    // Update existing link
                    await client.post('/links/update.php', {
                        id: block.id,
                        title: block.data.label,
                        url: block.data.url,
                        active: block.visible !== false
                    });
                }
            }

            // 4. Handle Reordering
            const finalIds = updatedBlocks.filter(b => b.type === 'link').map(b => b.id);
            if (finalIds.length > 0) {
                await client.post('/links/reorder.php', { ids: finalIds });
            }

            // 5. Update local state with new IDs to prevent duplicate creates
            pushHistory({ ...config, blocks: updatedBlocks });

            await refreshProfile();

            if (!silent) {
                setSaved(true);
                showToast('Page published successfully!', 'success');
                setTimeout(() => setSaved(false), 2500);
            } else {
                setAutoSaveStatus('saved');
                setTimeout(() => setAutoSaveStatus('idle'), 3000);
            }
        } catch (err) {
            console.error('Save error:', err);
            if (!silent) showToast('Failed to save changes.', 'error');
        } finally {
            if (!silent) setIsSaving(false);
        }
    };

    // ── Auto-save logic ────────────────────────────────────────────────────
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isAutoSaveEnabled || historyIdx === 0) return;

        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

        autoSaveTimerRef.current = setTimeout(() => {
            handleSave(true);
        }, 3000); // Save after 3s of inactivity

        return () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        };
    }, [config, isAutoSaveEnabled]);

    // ── History helpers ─────────────────────────────────────────────────────
    const pushHistory = useCallback((newConfig: PageConfig) => {
        setHistory(prev => {
            const trimmed = prev.slice(0, historyIdx + 1);
            return [...trimmed, newConfig];
        });
        setHistoryIdx(i => i + 1);
    }, [historyIdx]);

    // Note: Removed draft restoration from localStorage to ensure we always load fresh tree data
    // Auto-save logic is now handled by the isAutoSaveEnabled state and backend API

    const undo = () => historyIdx > 0 && setHistoryIdx(i => i - 1);
    const redo = () => historyIdx < history.length - 1 && setHistoryIdx(i => i + 1);

    const updateConfig = (partial: Partial<PageConfig>) => pushHistory({ ...config, ...partial });
    const updateBlock = (id: string, data: any) => {
        pushHistory({ ...config, blocks: config.blocks.map(b => b.id === id ? { ...b, data } : b) });
    };
    const deleteBlock = (id: string) => {
        const block = config.blocks.find(b => b.id === id);
        if (block && !id.startsWith('b')) {
            setDeletedLinkIds(prev => [...prev, id]);
        }
        pushHistory({ ...config, blocks: config.blocks.filter(b => b.id !== id) });
        if (activeBlockId === id) setActiveBlockId(null);
    };
    const duplicateBlock = (id: string) => {
        const idx = config.blocks.findIndex(b => b.id === id);
        if (idx === -1) return;
        const clone = { ...config.blocks[idx], id: `b${Date.now()}` };
        const newBlocks = [...config.blocks.slice(0, idx + 1), clone, ...config.blocks.slice(idx + 1)];
        pushHistory({ ...config, blocks: newBlocks });
        setActiveBlockId(clone.id);
    };
    const toggleBlockVisible = (id: string) => {
        pushHistory({ ...config, blocks: config.blocks.map(b => b.id === id ? { ...b, visible: b.visible === false ? true : false } : b) });
    };
    const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
        pushHistory({ ...config, ...tpl.config, profile: { ...config.profile } });
        setShowTemplates(false);
    };
    const addBlock = (type: BlockType) => {
        const lib = BLOCK_LIBRARY.find(l => l.type === type)!;
        const nb: Block = { id: `b${Date.now()}`, type, data: { ...lib.defaultData } } as Block;
        pushHistory({ ...config, blocks: [...config.blocks, nb] });
        setActiveBlockId(nb.id);
    };

    // ── DnD ─────────────────────────────────────────────────────────────────
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleDragStart = (e: DragStartEvent) => {
        if (e.active.data.current?.fromLibrary) setDragOverlay(e.active.data.current.type);
    };

    const handleDragEnd = (e: DragEndEvent) => {
        setDragOverlay(null);
        const { active, over } = e;
        if (!over) return;

        if (active.data.current?.fromLibrary) {
            // Drop from library → add at end or before 'over' block
            addBlock(active.data.current.type as BlockType);
        } else {
            // Reorder within canvas
            const oldIdx = config.blocks.findIndex(b => b.id === active.id);
            const newIdx = config.blocks.findIndex(b => b.id === over.id);
            if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
                pushHistory({ ...config, blocks: arrayMove(config.blocks, oldIdx, newIdx) });
            }
        }
    };

    // ── Keyboard shortcuts ──────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey)) {
                if (e.key === 'z') {
                    e.preventDefault();
                    e.shiftKey ? redo() : undo();
                } else if (e.key === 's') {
                    e.preventDefault();
                    handleSave();
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [historyIdx, history.length, config, id]); // Added config and id to dependencies to ensure handleSave has latest context

    const handlePublish = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    // ── Right panel settings ─────────────────────────────────────────────────
    const renderBlockSettings = () => {
        if (!activeBlock) return (
            <div className="flex flex-col items-center justify-center h-40 text-slate-300 text-center p-4">
                <Settings size={32} className="mb-3" />
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">No block selected</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">Click a block in the canvas to edit it</p>
            </div>
        );
        const upd = (d: any) => updateBlock(activeBlock.id, d);
        switch (activeBlock.type) {
            case 'link': return <LinkSettings data={activeBlock.data} onChange={upd} />;
            case 'text': return <TextSettings data={activeBlock.data} onChange={upd} />;
            case 'social_icons': return <SocialSettings data={activeBlock.data} onChange={upd} />;
            case 'map': return <MapSettings data={activeBlock.data} onChange={upd} />;
            case 'newsletter': return <NewsletterSettings data={activeBlock.data} onChange={upd} />;
            case 'image': return <ImageSettings data={activeBlock.data} onChange={upd} />;
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0b0f19] font-sans">
            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard/trees')}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 transition-colors bg-slate-50 dark:bg-[#0b0f19] rounded-xl lg:hidden">
                            <ArrowLeft size={18} />
                        </button>
                        <button onClick={() => navigate('/dashboard/trees')}
                            className="hidden lg:flex items-center gap-2 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 transition-colors bg-slate-50 dark:bg-[#0b0f19] rounded-xl">
                            <ArrowLeft size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Back</span>
                        </button>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold ml-4">
                        {previewMode === 'mobile' ? <Smartphone size={14} /> : <Monitor size={14} />} Page Builder
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
                    {/* Auto-save indicator */}
                    {autoSaveStatus !== 'idle' && (
                        <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg transition-all
                            ${autoSaveStatus === 'saving' ? 'text-amber-500 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
                            <Save size={10} /> {autoSaveStatus === 'saving' ? 'Saving…' : 'Auto-saved'}
                        </span>
                    )}
                    <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 text-xs font-black hover:bg-slate-50 transition-all">
                        <Globe size={14} /> <span className="hidden lg:inline">Connect Domain</span>
                    </button>
                    <button onClick={() => handleSave()} disabled={isSaving}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 text-xs font-black hover:bg-slate-50 transition-all disabled:opacity-50`}>
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save
                    </button>
                    <button onClick={() => handleSave()} disabled={isSaving}
                        className={`flex-shrink-0 flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all shadow-sm dark:shadow-none ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'} disabled:opacity-50`}>
                        {isSaving ? <><Loader2 size={14} className="animate-spin" /> Publishing...</> : saved ? <><Check size={14} /> Published!</> : <><Upload size={14} /> Publish</>}
                    </button>
                </div>
            </header>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex flex-1 overflow-hidden relative">

                    {/* ── LEFT SIDEBAR (Library) ── */}
                    <aside className={`fixed inset-0 z-30 lg:relative lg:inset-auto lg:flex w-full lg:w-52 flex-shrink-0 bg-white dark:bg-slate-900/40 border-r border-slate-100 dark:border-slate-800/50 flex flex-col overflow-hidden transition-transform duration-300 ${mobileView === 'library' ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                        <div className="lg:hidden flex justify-between items-center p-4 border-b">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Add Elements</h2>
                            <button onClick={() => setMobileView('canvas')} className="p-2 text-slate-400 dark:text-slate-500"><X size={20} /></button>
                        </div>
                        {/* Tab switcher: Blocks | Templates */}
                        <div className="flex border-b border-slate-100 dark:border-slate-800/50 flex-shrink-0 lg:mt-0">
                            <button onClick={() => setShowTemplates(false)}
                                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-1
                                    ${!showTemplates ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                                <Plus size={11} /> Blocks
                            </button>
                            <button onClick={() => setShowTemplates(true)}
                                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-1
                                    ${showTemplates ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                                <LayoutTemplate size={11} /> Templates
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3">
                            {!showTemplates ? (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        {BLOCK_LIBRARY.map(item => (
                                            <LibraryItem key={item.type} type={item.type} label={item.label} icon={item.icon} color={item.color} />
                                        ))}
                                    </div>
                                    <div className="mt-4 p-3 bg-indigo-50 rounded-2xl">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5">💡 Tip</p>
                                        <p className="text-[10px] text-indigo-500 font-medium leading-relaxed">Drag blocks in or click to add at bottom.</p>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    {TEMPLATES.map(tpl => (
                                        <button key={tpl.id} onClick={() => applyTemplate(tpl)}
                                            className="w-full text-left p-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800/50 hover:border-indigo-300 hover:shadow-md transition-all bg-white dark:bg-slate-900/40 group">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl">{tpl.emoji}</span>
                                                <span className="text-xs font-black text-slate-700 dark:text-slate-200 group-hover:text-indigo-600">{tpl.label}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">{tpl.desc}</p>
                                        </button>
                                    ))}
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium pt-2">Profile info is preserved</p>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* ── CANVAS (Preview) ── */}
                    <main className={`flex-1 flex flex-col items-center overflow-auto bg-slate-100 relative transition-all duration-300 ${mobileView === 'canvas' ? 'block' : 'hidden lg:block'}`} onClick={() => setActiveBlockId(null)}>
                        {/* Toolbar: device toggle + zoom */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-slate-900/40 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800/50 px-3 py-1.5 z-10">
                            <button onClick={() => setPreviewMode('mobile')} title="Mobile"
                                className={`p-1.5 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}`}>
                                <Smartphone size={14} />
                            </button>
                            <button onClick={() => setPreviewMode('desktop')} title="Desktop"
                                className={`p-1.5 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700'}`}>
                                <Monitor size={14} />
                            </button>
                            <div className="w-px h-4 bg-slate-200 mx-1" />
                            <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 rounded-lg transition-colors"><ZoomOut size={14} /></button>
                            <span className="text-xs font-black text-slate-600 dark:text-slate-300 w-10 text-center">{zoom}%</span>
                            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 rounded-lg transition-colors"><ZoomIn size={14} /></button>
                        </div>

                        <div className="pt-16 pb-10 flex flex-col items-center">
                            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                                className="transition-transform duration-200">
                                {previewMode === 'mobile' ? (
                                    /* ── Phone frame ── */
                                    <div className="w-full max-w-[390px] px-4">
                                        <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl dark:shadow-none shadow-slate-500/40">
                                            <div className="flex justify-center mb-3"><div className="w-28 h-5 bg-slate-800 rounded-full" /></div>
                                            <div style={{ background: config.colors.background, fontFamily: config.fonts.family, color: config.colors.text, minHeight: 600 }}
                                                className="rounded-[2.3rem] overflow-hidden" onClick={e => e.stopPropagation()}>
                                                <div className="flex flex-col items-center pt-8 pb-4 px-5">
                                                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden mb-3 bg-slate-200 flex items-center justify-center">
                                                        {config.profile.avatar ? <img src={config.profile.avatar} alt="av" className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-slate-400 dark:text-slate-500">{config.profile.name[0]}</span>}
                                                    </div>
                                                    <p className="font-black text-lg">{config.profile.name}</p>
                                                    <p className="text-xs opacity-60 mt-1 text-center">{config.profile.bio}</p>
                                                </div>
                                                <div className="px-5 pb-8">
                                                    <CanvasDropZone>
                                                        <SortableContext items={config.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                                            <div className="space-y-3">
                                                                {config.blocks.map(block => (
                                                                    <SortableBlock key={block.id} block={block} config={config}
                                                                        isActive={activeBlockId === block.id}
                                                                        onSelect={() => setActiveBlockId(block.id)}
                                                                        onDelete={() => deleteBlock(block.id)}
                                                                        onDuplicate={() => duplicateBlock(block.id)}
                                                                        onToggleVisible={() => toggleBlockVisible(block.id)}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </SortableContext>
                                                    </CanvasDropZone>
                                                    {config.blocks.length === 0 && <div className="py-16 text-center text-slate-300"><Plus size={32} className="mx-auto mb-3 opacity-50" /><p className="text-xs font-black uppercase tracking-widest">Drop blocks here</p></div>}
                                                </div>
                                            </div>
                                            <div className="flex justify-center mt-3"><div className="w-24 h-1 bg-slate-700 rounded-full" /></div>
                                        </div>
                                    </div>
                                ) : (
                                    /* ── Desktop frame ── */
                                    <div className="w-[820px]">
                                        <div className="bg-slate-800 rounded-t-2xl px-4 py-2 flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-rose-400" /><span className="w-3 h-3 rounded-full bg-amber-400" /><span className="w-3 h-3 rounded-full bg-emerald-400" />
                                            <div className="flex-1 mx-4 bg-slate-700 rounded-lg px-3 py-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono">social2tree.com/you</div>
                                        </div>
                                        <div style={{ background: config.colors.background, fontFamily: config.fonts.family, color: config.colors.text, minHeight: 500 }}
                                            className="border-x-4 border-b-4 border-slate-800 rounded-b-2xl overflow-hidden shadow-2xl dark:shadow-none" onClick={e => e.stopPropagation()}>
                                            <div className="max-w-xl mx-auto px-6 py-10">
                                                <div className="flex flex-col items-center mb-6">
                                                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden mb-3 bg-slate-200 flex items-center justify-center">
                                                        {config.profile.avatar ? <img src={config.profile.avatar} alt="av" className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-slate-400 dark:text-slate-500">{config.profile.name[0]}</span>}
                                                    </div>
                                                    <p className="font-black text-lg">{config.profile.name}</p>
                                                    <p className="text-xs opacity-60 mt-1 text-center">{config.profile.bio}</p>
                                                </div>
                                                <CanvasDropZone>
                                                    <SortableContext items={config.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                                        <div className="space-y-3">
                                                            {config.blocks.map(block => (
                                                                <SortableBlock key={block.id} block={block} config={config}
                                                                    isActive={activeBlockId === block.id}
                                                                    onSelect={() => setActiveBlockId(block.id)}
                                                                    onDelete={() => deleteBlock(block.id)}
                                                                    onDuplicate={() => duplicateBlock(block.id)}
                                                                    onToggleVisible={() => toggleBlockVisible(block.id)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </SortableContext>
                                                </CanvasDropZone>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                    {/* ── RIGHT SIDEBAR (Settings/Analytics) ── */}
                    <aside className={`fixed inset-0 z-30 lg:relative lg:inset-auto lg:flex w-full lg:w-80 flex-shrink-0 bg-white dark:bg-slate-900/40 lg:border-l border-slate-100 dark:border-slate-800/50 flex flex-col overflow-hidden transition-transform duration-300 ${mobileView === 'settings' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                        <div className="lg:hidden flex justify-between items-center p-4 border-b">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Settings</h2>
                            <button onClick={() => setMobileView('canvas')} className="p-2 text-slate-400 dark:text-slate-500"><X size={20} /></button>
                        </div>
                        {/* Tabs */}
                        <div className="flex border-b border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                            {([['design', 'Design', <Palette size={13} />], ['analytics', 'Analytics', <BarChart2 size={13} />], ['settings', 'Settings', <Settings size={13} />]] as const).map(([id, label, icon]) => (
                                <button key={id} onClick={() => setRightTab(id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2
                                            ${rightTab === id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                                    {icon}{label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {rightTab === 'design' && (
                                <div className="p-4 space-y-6">
                                    {/* Block Settings */}
                                    {activeBlock && (
                                        <section>
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                                                    {BLOCK_LIBRARY.find(b => b.type === activeBlock.type)?.label} Settings
                                                </p>
                                                <button onClick={() => setActiveBlockId(null)} className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 rounded-lg"><X size={12} /></button>
                                            </div>
                                            {renderBlockSettings()}
                                            <div className="h-px bg-slate-100 mt-6" />
                                        </section>
                                    )}

                                    {/* Theme Selector */}
                                    <section>
                                        <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3">Theme</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {THEMES.map(t => {
                                                const isCurrent = config.colors.background === t.preview[0] && config.colors.text === t.preview[1];
                                                return (
                                                    <button key={t.id} onClick={() => updateConfig({ colors: { background: t.preview[0], text: t.preview[1], accent: t.preview[2], cardBg: t.preview[3] }, fonts: t.fonts })}
                                                        className={`group relative rounded-2xl p-2.5 border-2 transition-all ${isCurrent ? 'border-indigo-500 shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 'border-slate-100 dark:border-slate-800/50 hover:border-slate-300'}`}>
                                                        <div className="flex gap-1 mb-1.5 justify-center">
                                                            {t.preview.slice(0, 3).map((c, i) => (
                                                                <div key={i} className="w-4 h-4 rounded-full border border-white/60 shadow-sm dark:shadow-none" style={{ background: c }} />
                                                            ))}
                                                        </div>
                                                        <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">{t.label}</p>
                                                        {isCurrent && <div className="absolute top-1 right-1 w-3 h-3 bg-indigo-600 rounded-full flex items-center justify-center"><Check size={8} className="text-white" /></div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </section>

                                    {/* Colors */}
                                    <section>
                                        <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3">Colors</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {([['background', 'Background'], ['text', 'Text'], ['accent', 'Accent'], ['cardBg', 'Card BG']] as const).map(([key, label]) => (
                                                <label key={key} className="block">
                                                    <span className="settings-label">{label}</span>
                                                    <input type="color" value={(config.colors as any)[key]}
                                                        onChange={e => updateConfig({ colors: { ...config.colors, [key]: e.target.value } })}
                                                        className="h-8 w-full rounded-xl border border-slate-200 dark:border-slate-700/50 cursor-pointer" />
                                                </label>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Typography */}
                                    <section>
                                        <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3">Typography</p>
                                        <div className="space-y-3">
                                            <label className="block">
                                                <span className="settings-label">Font Family</span>
                                                <select value={config.fonts.family} onChange={e => updateConfig({ fonts: { ...config.fonts, family: e.target.value } })} className="settings-input">
                                                    {FONT_FAMILIES.map(f => <option key={f}>{f}</option>)}
                                                </select>
                                            </label>
                                            <label className="block">
                                                <span className="settings-label">Font Weight</span>
                                                <select value={config.fonts.weight} onChange={e => updateConfig({ fonts: { ...config.fonts, weight: e.target.value } })} className="settings-input">
                                                    {FONT_WEIGHTS.map(w => <option key={w} value={w}>{w === '300' ? '300 Light' : w === '400' ? '400 Regular' : w === '500' ? '500 Medium' : w === '600' ? '600 SemiBold' : w === '700' ? '700 Bold' : w === '800' ? '800 ExtraBold' : '900 Black'}</option>)}
                                                </select>
                                            </label>
                                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-100 dark:border-slate-800/50">
                                                <p style={{ fontFamily: config.fonts.family, fontWeight: config.fonts.weight, color: config.colors.text }} className="text-sm text-center">
                                                    The quick brown fox
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Profile */}
                                    <section>
                                        <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3">Profile</p>
                                        <div className="space-y-3">
                                            <label className="block"><span className="settings-label">Display Name</span>
                                                <input value={config.profile.name} onChange={e => updateConfig({ profile: { ...config.profile, name: e.target.value } })} className="settings-input" /></label>
                                            <label className="block"><span className="settings-label">Bio</span>
                                                <textarea value={config.profile.bio} onChange={e => updateConfig({ profile: { ...config.profile, bio: e.target.value } })} rows={2} className="settings-input resize-none" /></label>
                                            <label className="block"><span className="settings-label">Avatar URL</span>
                                                <input value={config.profile.avatar} onChange={e => updateConfig({ profile: { ...config.profile, avatar: e.target.value } })} placeholder="https://..." className="settings-input" /></label>
                                        </div>
                                    </section>

                                    {/* No block msg when nothing selected */}
                                    {!activeBlock && <div className="text-center p-4 text-slate-400 dark:text-slate-500 text-xs font-medium">Click any block in the canvas to edit it</div>}
                                </div>
                            )}

                            {rightTab === 'analytics' && (
                                <div className="p-4 space-y-4">
                                    <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2">Page Analytics</p>
                                    {[
                                        { label: 'Total Views', value: '—', icon: <Eye size={16} />, color: 'bg-indigo-50 text-indigo-600' },
                                        { label: 'Clicks', value: '—', icon: <LinkIcon size={16} />, color: 'bg-violet-50 text-violet-600' },
                                        { label: 'CTR', value: '—', icon: <BarChart2 size={16} />, color: 'bg-emerald-50 text-emerald-600' },
                                    ].map(s => (
                                        <div key={s.label} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#0b0f19] rounded-2xl">
                                            <div className={`p-2 rounded-xl ${s.color}`}>{s.icon}</div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{s.value}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{s.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-4 bg-indigo-50 rounded-2xl text-center">
                                        <p className="text-xs text-indigo-600 font-bold">Publish your page to start tracking analytics</p>
                                    </div>
                                </div>
                            )}

                            {rightTab === 'settings' && (
                                <div className="p-4 space-y-5">
                                    <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-2">Page Settings</p>
                                    <label className="block"><span className="settings-label">Page Slug</span>
                                        <input placeholder="your-username" className="settings-input" /></label>
                                    <label className="block"><span className="settings-label">SEO Title</span>
                                        <input value={config.profile.name} onChange={e => updateConfig({ profile: { ...config.profile, name: e.target.value } })} className="settings-input" /></label>
                                    <label className="block"><span className="settings-label">Meta Description</span>
                                        <textarea value={config.profile.bio} onChange={e => updateConfig({ profile: { ...config.profile, bio: e.target.value } })} rows={3} className="settings-input resize-none" /></label>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-2xl cursor-pointer group hover:bg-indigo-100 transition-all">
                                            <div className="flex items-center gap-2">
                                                <Save size={14} className="text-indigo-600" />
                                                <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Auto Save Changes</span>
                                            </div>
                                            <div onClick={(e) => { e.preventDefault(); setIsAutoSaveEnabled(!isAutoSaveEnabled); }}
                                                className={`w-10 h-6 rounded-full relative transition-all duration-300 ${isAutoSaveEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                                <div className={`w-4 h-4 bg-white dark:bg-slate-900/40 rounded-full absolute top-1 transition-all duration-300 ${isAutoSaveEnabled ? 'left-5' : 'left-1'} shadow-sm dark:shadow-none`} />
                                            </div>
                                        </label>

                                        <div className="h-px bg-slate-100 my-4" />

                                        {[['Hide from search engines', 'noindex'], ['Enable link animations', 'animations'], ['Show view count', 'viewcount']].map(([label, key]) => (
                                            <label key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0b0f19] rounded-2xl cursor-pointer">
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</span>
                                                <div className="w-8 h-4 bg-slate-200 rounded-full relative"><div className="w-3 h-3 bg-white dark:bg-slate-900/40 rounded-full absolute top-0.5 left-0.5 shadow-sm dark:shadow-none" /></div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* Mobile Tab Bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/50 p-2 flex justify-around items-center z-40 pb-safe">
                    <button onClick={() => setMobileView('library')}
                        className={`flex flex-col items-center gap-1 p-2 transition-all ${mobileView === 'library' ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
                        <Plus size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Library</span>
                    </button>
                    <button onClick={() => setMobileView('canvas')}
                        className={`flex flex-col items-center gap-1 p-2 transition-all ${mobileView === 'canvas' ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
                        <Eye size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Preview</span>
                    </button>
                    <button onClick={() => setMobileView('settings')}
                        className={`flex flex-col items-center gap-1 p-2 transition-all ${mobileView === 'settings' || activeBlockId ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
                        <Settings size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{activeBlockId ? 'Edit' : 'Settings'}</span>
                    </button>
                </div>

                {/* DnD overlay ghost */}
                <DragOverlay>
                    {dragOverlay && (
                        <div className="bg-white dark:bg-slate-900/40 rounded-2xl border-2 border-indigo-400 shadow-2xl dark:shadow-none p-3 w-40 opacity-90">
                            <div className="flex items-center gap-2">
                                {BLOCK_LIBRARY.find(b => b.type === dragOverlay)?.icon}
                                <span className="text-xs font-black text-slate-600 dark:text-slate-300">{BLOCK_LIBRARY.find(b => b.type === dragOverlay)?.label}</span>
                            </div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default PageBuilder;
