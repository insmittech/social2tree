import React from 'react';
import { Bookmark, Plus } from 'lucide-react';

const SavedLinks: React.FC = () => {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto pb-32 lg:pb-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
            <Bookmark size={32} className="text-indigo-600 dark:text-teal-400" />
            Saved Links
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Manage your bookmarked and favorite links</p>
        </div>
        <button className="bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 dark:hover:bg-teal-400 transition-all flex items-center gap-2 shadow-lg dark:shadow-teal-500/20 shadow-indigo-100 active:scale-95">
          <Plus size={18} /> New Folder
        </button>
      </header>

      <div className="grid gap-6">
        {/* Placeholder for saved links */}
        <div className="bg-white dark:bg-[#0b121e] p-8 sm:p-12 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50 text-center flex flex-col items-center justify-center transition-colors">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 dark:bg-[#05080f] rounded-3xl flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6 transition-colors">
            <Bookmark size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 transition-colors">No saved links yet</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mb-8 transition-colors">Start saving your favorite profiles and links to quickly access them later.</p>
          <button className="text-indigo-600 dark:text-teal-400 font-black text-sm hover:underline transition-colors">Explore profiles</button>
        </div>
      </div>
    </div>
  );
};

export default SavedLinks;
