import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ExternalLink, Lock } from 'lucide-react';
import { Link } from '../types';

interface SortableLinkProps {
    link: Link;
    getSocialIcon: (url: string) => React.ReactNode;
    handleToggleActive: (id: string, active: boolean) => void;
    handleDelete: (id: string) => void;
}

const SortableLink: React.FC<SortableLinkProps> = ({ link, getSocialIcon, handleToggleActive, handleDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 sm:gap-5 group hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
            {/* Subtle background glow on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div
                {...attributes}
                {...listeners}
                className="mt-1.5 text-slate-300 cursor-grab active:cursor-grabbing hover:text-indigo-600 transition-colors p-1 bg-slate-50 rounded-lg group-hover:bg-indigo-50"
            >
                <GripVertical size={20} />
            </div>

            <div className="flex-grow relative z-10">
                <div className="flex justify-between items-start">
                    <div className="space-y-1.5 overflow-hidden">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                {getSocialIcon(link.url)}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-black text-slate-900 text-sm sm:text-base truncate tracking-tight">{link.title}</h4>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] sm:text-xs text-slate-400 font-mono flex items-center gap-1.5 hover:text-indigo-600 truncate transition-colors"
                                >
                                    {link.url} <ExternalLink size={10} className="shrink-0" />
                                </a>
                            </div>
                            {link.password && (
                                <div className="bg-amber-50 p-1.5 rounded-lg text-amber-600 shadow-sm" title="Password Protected">
                                    <Lock size={12} fill="currentColor" className="opacity-20" />
                                </div>
                            )}
                        </div>

                        {(link.scheduledStart || link.scheduledEnd) && (
                            <div className="flex flex-wrap gap-2 mt-2 ml-12">
                                {link.scheduledStart && (
                                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
                                        Starts: {new Date(link.scheduledStart).toLocaleDateString()}
                                    </span>
                                )}
                                {link.scheduledEnd && (
                                    <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full border border-rose-100 uppercase tracking-wider">
                                        Ends: {new Date(link.scheduledEnd).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 ml-4 pt-1">
                        <label className="relative inline-flex items-center cursor-pointer scale-90 sm:scale-100 group/toggle">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={link.active}
                                onChange={(e) => handleToggleActive(link.id, e.target.checked)}
                            />
                            <div className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-emerald-500 shadow-inner group-hover/toggle:ring-4 group-hover/toggle:ring-slate-100 transition-all"></div>
                        </label>
                        <button
                            onClick={() => handleDelete(link.id)}
                            className="bg-slate-50 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all p-2 rounded-xl group-hover:shadow-sm"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortableLink;
