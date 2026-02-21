import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../src/context/AuthContext';
import { Search, Calendar, ChevronRight, User } from 'lucide-react';

const FEATURED_POST = {
    title: "The Evolution of Digital Footprinting in 2026",
    excerpt: "Discover how advanced AI algorithms and automated extraction are changing the landscape of open-source intelligence gathering and analysis.",
    category: "OSINT Strategy",
    author: "Emma Reynolds",
    date: "Oct 24, 2026",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
};

const BLOG_POSTS = [
    {
        id: 1,
        title: "Automating Dark Web Intelligence Extraction",
        excerpt: "Learn how to build resilient pipelines for scraping and structuring threat data hidden deep within Tor networks.",
        category: "Threat Intelligence",
        author: "Marcus Chen",
        date: "Oct 18, 2026",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Mapping Blockchain Transactions using Heuristics",
        excerpt: "A deep dive into visualizing complex crypto flows and identifying anonymous entities through pattern recognition.",
        category: "Crypto Analysis",
        author: "Dr. Sarah Lin",
        date: "Oct 12, 2026",
        imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f4fc8bc?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Social Graph Analysis for Disinformation Tracking",
        excerpt: "Techniques for mapping bot networks and identifying coordinated inauthentic behavior across social platforms.",
        category: "Social Media",
        author: "Alex Vasquez",
        date: "Oct 05, 2026",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "The Role of LLMs in Structured Data Parsing",
        excerpt: "How large language models are replacing traditional regex approaches for unstructured data entity extraction.",
        category: "AI & ML",
        author: "Emma Reynolds",
        date: "Sep 28, 2026",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Securing OSINT Infrastructure against Burner IPs",
        excerpt: "Best practices for maintaining operational security when conducting mass scalable reconnaissance operations.",
        category: "Infrastructure",
        author: "Marcus Chen",
        date: "Sep 15, 2026",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Legal Frameworks for Open Source Data Gathering",
        excerpt: "Navigating GDPR, CCPA, and global privacy regulations while conducting legitimate intelligence research.",
        category: "Compliance",
        author: "David Wright",
        date: "Sep 02, 2026",
        imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80"
    }
];

const Blog: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-300 font-sans selection:bg-teal-500/30 transition-colors duration-300">
            <Navbar isAuthenticated={isAuthenticated} userProfile={user} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-teal-900/10 blur-[100px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 transition-colors">Insights & Resources</h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 transition-colors">
                        Dive into the latest research, intelligence gathering techniques, and OSINT platform updates.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="bg-white dark:bg-slate-900/50 block w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm dark:shadow-inner backdrop-blur-xl"
                            placeholder="Search articles, guides, and reports..."
                        />
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="px-4 pb-16 max-w-7xl mx-auto z-20 relative">
                <div className="relative rounded-3xl overflow-hidden group border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-teal-500 transition-colors">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 bg-slate-50 dark:bg-transparent">
                        <img 
                            src={FEATURED_POST.imageUrl} 
                            alt="Featured" 
                            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0b0f19] via-slate-50/80 dark:via-[#0b0f19]/80 to-transparent transition-colors duration-300"></div>
                    </div>
                    
                    <div className="relative p-8 md:p-12 lg:p-16 flex flex-col justify-end min-h-[500px]">
                        <div className="inline-flex w-fit items-center px-3 py-1 mb-6 border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md transition-colors">
                            Featured • {FEATURED_POST.category}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 max-w-4xl hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                            {FEATURED_POST.title}
                        </h2>
                        <p className="text-slate-700 dark:text-slate-300 text-lg max-w-3xl mb-8 leading-relaxed transition-colors">
                            {FEATURED_POST.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors">
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-teal-500" />
                                    <span>{FEATURED_POST.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-teal-500" />
                                    <span>{FEATURED_POST.date}</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-slate-900 dark:text-white font-bold tracking-wide hover:text-teal-600 dark:hover:text-teal-400 transition-colors group/btn">
                                Read Article 
                                <span className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 group-hover/btn:bg-teal-500/10 dark:group-hover/btn:bg-teal-500/20 transition-colors">
                                    <ChevronRight size={16} />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Bar */}
            <section className="px-4 pb-10 max-w-7xl mx-auto border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between transition-colors">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {['All Topics', 'OSINT Strategy', 'Threat Intelligence', 'AI & ML', 'Crypto Analysis'].map((topic, i) => (
                        <button 
                            key={i} 
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all ${i === 0 ? 'bg-teal-500 text-white' : 'bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-teal-400/50 dark:hover:border-teal-500/50 shadow-sm dark:shadow-none'}`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
                <div className="text-slate-500 text-sm font-medium">
                    Showing 6 articles
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <article key={post.id} className="group bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-teal-400/50 dark:hover:border-teal-500/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_30px_rgba(20,184,166,0.05)] transition-all duration-300 flex flex-col h-full backdrop-blur-xl">
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img 
                                    src={post.imageUrl} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent transition-colors duration-300"></div>
                                <div className="absolute top-4 left-4">
                                     <span className="px-3 py-1 bg-slate-50/90 dark:bg-[#0b0f19]/80 border border-teal-500/30 text-teal-600 dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-colors">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Content Container */}
                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors cursor-pointer">
                                    {post.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1 transition-colors">
                                    {post.excerpt}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
                                     <div className="text-xs text-slate-500 font-medium">
                                        {post.date}
                                    </div>
                                    <button className="flex items-center gap-1 text-teal-600 dark:text-teal-500 text-sm font-bold hover:text-teal-500 dark:hover:text-cyan-400 transition-colors">
                                        Read <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                
                {/* Pagination */}
                <div className="pt-20 pb-10 flex justify-center">
                    <button className="px-8 py-3 rounded-xl border border-teal-500/30 text-teal-400 font-bold hover:bg-teal-500/10 transition-colors">
                        Load More Articles
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
