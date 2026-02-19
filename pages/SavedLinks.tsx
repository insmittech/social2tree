
import React from 'react';
import { Bookmark, Plus, ExternalLink, Trash2 } from 'lucide-react';

const SavedLinks: React.FC = () => {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Bookmark size={32} className="text-indigo-600" />
                        Saved Links
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your bookmarked and favorite links</p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95">
                    <Plus size={18} /> New Folder
                </button>
            </header>

            <div className="grid gap-6">
                {/* Placeholder for saved links */}
                <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                        <Bookmark size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No saved links yet</h3>
                    <p className="text-slate-500 font-medium max-w-sm mb-8">Start saving your favorite profiles and links to quickly access them later.</p>
                    <button className="text-indigo-600 font-black text-sm hover:underline">Explore profiles</button>
                </div>

                {/* Example card if links existed */}
                {/*
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-indigo-300 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
               <Bookmark size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Digital Marketing Toolkit</h4>
              <p className="text-slate-500 text-sm font-medium">social2tree/marketing-pro</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
               <ExternalLink size={20} />
             </button>
             <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
               <Trash2 size={20} />
             </button>
          </div>
        </div>
        */}
            </div>
        </div>
    );
};

export default SavedLinks;
