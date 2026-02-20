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
            className={`bg-white p-4 rounded-lg border transition-colors ${isDragging ? 'border-indigo-500 shadow-sm' : 'border-slate-200'}`}
        >
            <div className="flex items-center gap-4">
                <div
                    {...attributes}
                    {...listeners}
                    className="text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500 p-1"
                >
                    <GripVertical size={20} />
                </div>

                <div className="flex-grow flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-600 shrink-0">
                        {getSocialIcon(link.url)}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{link.title}</h4>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{link.url}</p>
                    </div>
                    {link.password && (
                        <Lock size={12} className="text-amber-500 shrink-0" />
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer scale-90">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={link.active}
                            onChange={(e) => handleToggleActive(link.id, e.target.checked)}
                        />
                        <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <button
                        onClick={() => handleDelete(link.id)}
                        className="text-slate-300 hover:text-red-500 p-1.5 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {(link.scheduledStart || link.scheduledEnd) && (
                <div className="flex flex-wrap gap-2 mt-3 ml-12">
                    {link.scheduledStart && (
                        <span className="text-[9px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-wider">
                            Starts: {new Date(link.scheduledStart).toLocaleDateString()}
                        </span>
                    )}
                    {link.scheduledEnd && (
                        <span className="text-[9px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-wider">
                            Ends: {new Date(link.scheduledEnd).toLocaleDateString()}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default SortableLink;
