import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none'
                            : 'bg-white dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 py-8">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
                {renderPageNumbers()}
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default Pagination;
