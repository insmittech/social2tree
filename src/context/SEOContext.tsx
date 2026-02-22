
import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface SEOData {
    title: string;
    description: string;
    keywords: string;
    og_image: string;
    is_indexed: boolean;
    canonical_url: string;
    structured_data?: any;
}

interface SEOContextType {
    seo: SEOData | null;
    loading: boolean;
    refreshSEO: (slug: string) => Promise<void>;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

export const SEOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [seo, setSeo] = useState<SEOData | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const refreshSEO = async (slug: string) => {
        setLoading(true);
        try {
            const resp = await client.get(`/public/get_seo.php?slug=${slug}`);
            setSeo(resp.data);
        } catch (error) {
            console.error('Failed to fetch SEO details:', error);
            // Fallback SEO
            setSeo({
                title: "Social2Tree | Everything you are in one link",
                description: "Social2Tree - The ultimate bio link tool for creators.",
                keywords: "bio link, social link, creators, portfolio",
                og_image: "https://social2tree.com/og-default.png",
                is_indexed: true,
                canonical_url: "https://social2tree.com/"
            });
        } finally {
            setLoading(false);
        }
    };

    // Automatically update SEO based on route
    useEffect(() => {
        const path = location.pathname;
        let slug = 'home';

        if (path === '/') {
            slug = 'home';
        } else if (path.startsWith('/dashboard')) {
            slug = 'dashboard';
        } else if (path.startsWith('/login')) {
            slug = 'login';
        } else if (path.startsWith('/register')) {
            slug = 'register';
        } else {
            // For public profiles or other pages, the slug is the first part of the path
            slug = path.split('/')[1] || 'home';
        }

        refreshSEO(slug);
    }, [location.pathname]);

    return (
        <SEOContext.Provider value={{ seo, loading, refreshSEO }}>
            {seo && (
                <Helmet>
                    <title>{seo.title}</title>
                    <meta name="description" content={seo.description} />
                    <meta name="keywords" content={seo.keywords} />
                    {seo.is_indexed === false && <meta name="robots" content="noindex, nofollow" />}
                    <link rel="canonical" href={seo.canonical_url} />

                    {/* Social */}
                    <meta property="og:title" content={seo.title} />
                    <meta property="og:description" content={seo.description} />
                    <meta property="og:image" content={seo.og_image} />
                    <meta property="og:url" content={seo.canonical_url} />

                    <meta name="twitter:title" content={seo.title} />
                    <meta name="twitter:description" content={seo.description} />
                    <meta name="twitter:image" content={seo.og_image} />

                    {seo.structured_data && (
                        <script type="application/ld+json">
                            {JSON.stringify(seo.structured_data)}
                        </script>
                    )}
                </Helmet>
            )}
            {children}
        </SEOContext.Provider>
    );
};

export const useSEO = () => {
    const context = useContext(SEOContext);
    if (context === undefined) {
        throw new Error('useSEO must be used within an SEOProvider');
    }
    return context;
};
