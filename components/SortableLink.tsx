import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ExternalLink } from 'lucide-react';
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
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3 sm:gap-4 group hover:border-indigo-300 transition-all"
        >
            <div
                {...attributes}
                {...listeners}
                className="mt-1 text-slate-300 cursor-grab active:cursor-grabbing hover:text-indigo-500 transition-colors"
            >
                <GripVertical size={20} />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                            {getSocialIcon(link.url)}
                            <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">{link.title}</h4>
                        </div>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] sm:text-xs text-slate-400 font-mono flex items-center gap-1 hover:text-indigo-500 truncate max-w-[150px] xs:max-w-[250px] sm:max-w-none"
                        >
                            {link.url} <ExternalLink size={10} />
                        </a>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 ml-2">
                        <label className="relative inline-flex items-center cursor-pointer scale-90 sm:scale-100">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={link.active}
                                onChange={(e) => handleToggleActive(link.id, e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                        <button
                            onClick={() => handleDelete(link.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
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
