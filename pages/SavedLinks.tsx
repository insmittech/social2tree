import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Search, FolderPlus, MoreVertical, Trash2, ExternalLink, Folder, ChevronRight, X, Loader2, Link2, Edit2 } from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

interface SavedFolder {
  id: string;
  name: string;
}

interface SavedLink {
  id: string;
  folderId: string | null;
  title: string;
  url: string;
  icon: string | null;
}

const SavedLinks: React.FC = () => {
  const { showToast } = useToast();
  const [folders, setFolders] = useState<SavedFolder[]>([]);
  const [links, setLinks] = useState<SavedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '', folderId: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | 'all'>('all');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [showToast]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [foldersRes, linksRes] = await Promise.all([
        client.get('/folders/list.php'),
        client.get('/saved_links/list.php')
      ]);
      setFolders(foldersRes.data.folders || []);
      setLinks(linksRes.data.links || []);
    } catch (err) {
      console.error('Failed to fetch saved content', err);
      showToast('Failed to load saved links', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setActionLoading(true);
    try {
      const res = await client.post('/folders/create.php', { name: newFolderName });
      setFolders([...folders, res.data.folder]);
      setShowFolderModal(false);
      setNewFolderName('');
      showToast('Folder created successfully', 'success');
    } catch (err) {
      showToast('Failed to create folder', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title.trim() || !newLink.url.trim()) return;

    setActionLoading(true);
    try {
      const res = await client.post('/saved_links/create.php', {
        title: newLink.title,
        url: newLink.url,
        folderId: newLink.folderId || null
      });
      setLinks([res.data.link, ...links]);
      setShowLinkModal(false);
      setNewLink({ title: '', url: '', folderId: '' });
      showToast('Link saved successfully', 'success');
    } catch (err) {
      showToast('Failed to save link', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!confirm('Are you sure? Links inside will remain but become uncategorized.')) return;

    try {
      await client.post('/folders/delete.php', { id });
      setFolders(folders.filter(f => f.id !== id));
      setLinks(links.map(l => l.folderId === id ? { ...l, folderId: null } : l));
      if (selectedFolderId === id) setSelectedFolderId('all');
      showToast('Folder deleted', 'success');
    } catch (err) {
      showToast('Failed to delete folder', 'error');
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await client.post('/saved_links/delete.php', { id });
      setLinks(links.filter(l => l.id !== id));
      showToast('Link removed', 'success');
    } catch (err) {
      showToast('Failed to delete link', 'error');
    }
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolderId === 'all' || link.folderId === selectedFolderId;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto pb-32 lg:pb-8">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-teal-400 font-bold text-[10px] uppercase tracking-widest mb-2">
            <Bookmark size={12} fill="currentColor" /> Personal Library
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white transition-colors">
            Saved Content
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Your curated collection of links and profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFolderModal(true)}
            className="p-3 bg-white dark:bg-[#0b121e] border border-slate-200 dark:border-slate-800/50 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <FolderPlus size={20} />
          </button>
          <button
            onClick={() => setShowLinkModal(true)}
            className="bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-700 dark:hover:bg-teal-400 transition-all flex items-center gap-2 shadow-lg dark:shadow-teal-500/20 active:scale-95"
          >
            <Plus size={18} /> Save Link
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[240px,1fr] gap-8">
        {/* Sidebar / Folders */}
        <aside className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0b121e] border border-slate-200 dark:border-slate-800/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setSelectedFolderId('all')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedFolderId === 'all' ? 'bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
            >
              <div className="flex items-center gap-3">
                <Bookmark size={18} /> All Content
              </div>
              <span className="text-[10px] opacity-60">{links.length}</span>
            </button>

            {folders.map(folder => (
              <div key={folder.id} className="group relative">
                <button
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedFolderId === folder.id ? 'bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Folder size={18} /> {folder.name}
                  </div>
                  <span className="text-[10px] opacity-60">{links.filter(l => l.folderId === folder.id).length}</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </nav>
        </aside>

        {/* Links Content */}
        <main>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-indigo-600 dark:text-teal-400" size={40} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading your library...</p>
            </div>
          ) : filteredLinks.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredLinks.map(link => (
                <div key={link.id} className="bg-white dark:bg-[#0b121e] p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-[#05080f] rounded-2xl flex items-center justify-center text-indigo-600 dark:text-teal-400 transition-colors">
                        <Link2 size={24} />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-1">{link.title}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate mb-6">{link.url}</p>
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 dark:bg-[#05080f] text-slate-600 dark:text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-teal-500 hover:text-white dark:hover:text-slate-950 transition-all group"
                  >
                    Open Link <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0b121e] p-12 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50 text-center flex flex-col items-center justify-center transition-colors">
              <div className="w-20 h-20 bg-slate-50 dark:bg-[#05080f] rounded-3xl flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6 transition-colors">
                <Bookmark size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 transition-colors">
                {searchQuery ? 'No matches found' : 'Your library is empty'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mb-8 transition-colors">
                {searchQuery ? 'Try adjusting your search query' : 'Start building your library by saving links or creating folders.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="text-indigo-600 dark:text-teal-400 font-black text-sm hover:underline transition-colors"
                >
                  Save your first link
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0b121e] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Create Folder</h3>
                <button onClick={() => setShowFolderModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleCreateFolder} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">Folder Name</label>
                  <input
                    autoFocus
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. Work Tools, Social Profiles"
                    className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-100 dark:border-slate-800/50 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-400 outline-none transition-all font-bold dark:text-white"
                  />
                </div>
                <button
                  disabled={actionLoading || !newFolderName.trim()}
                  className="w-full bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 dark:hover:bg-teal-400 transition-all shadow-xl shadow-indigo-100 dark:shadow-teal-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Creating...' : 'Create Folder'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0b121e] w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Save Link</h3>
                <button onClick={() => setShowLinkModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSaveLink} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">Link Title</label>
                  <input
                    autoFocus
                    type="text"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    placeholder="Give it a name..."
                    className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-100 dark:border-slate-800/50 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-400 outline-none transition-all font-bold dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">URL</label>
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-100 dark:border-slate-800/50 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-400 outline-none transition-all font-medium dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">Parent Folder</label>
                  <select
                    value={newLink.folderId}
                    onChange={(e) => setNewLink({ ...newLink, folderId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#05080f] border border-slate-100 dark:border-slate-800/50 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-400 outline-none transition-all font-bold dark:text-white appearance-none"
                  >
                    <option value="">No Folder (Uncategorized)</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  disabled={actionLoading || !newLink.title.trim() || !newLink.url.trim()}
                  className="w-full bg-indigo-600 dark:bg-teal-500 text-white dark:text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 dark:hover:bg-teal-400 transition-all shadow-xl shadow-indigo-100 dark:shadow-teal-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Link'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedLinks;
