
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastType, useToast } from '../src/context/ToastContext';

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
}

const Toast: React.FC<ToastProps> = ({ id, message, type }) => {
    const { removeToast } = useToast();

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={20} />,
        error: <XCircle className="text-rose-500" size={20} />,
        warning: <AlertCircle className="text-amber-500" size={20} />,
        info: <Info className="text-sky-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-emerald-50 border-emerald-100',
        error: 'bg-rose-50 border-rose-100',
        warning: 'bg-amber-50 border-amber-100',
        info: 'bg-sky-50 border-sky-100',
    };

    return (
        <div
            className={`flex items-center gap-3 p-4 min-w-[320px] max-w-[420px] rounded-xl border shadow-lg backdrop-blur-md animate-in slide-in-from-right-full duration-300 ${bgColors[type]}`}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <div className="flex-grow">
                <p className="text-sm font-medium text-slate-800">{message}</p>
            </div>
            <button
                onClick={() => removeToast(id)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors text-slate-400 hover:text-slate-600"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed z-[9999] top-4 right-4 left-4 md:left-auto flex flex-col gap-3 items-center md:items-end pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast {...toast} />
                </div>
            ))}
        </div>
    );
};
