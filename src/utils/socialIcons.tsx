
import React from 'react';
import {
    Instagram,
    Facebook,
    Youtube,
    Linkedin,
    Twitter,
    Github,
    Globe,
    MessageCircle,
    Mail,
    Smartphone,
    Music,
    Twitch,
    Slack
} from 'lucide-react';

export const getSocialIcon = (url: string, size: number = 20) => {
    const lower = url.toLowerCase();
    if (lower.includes('instagram.com')) return <Instagram size={size} className="text-pink-600" />;
    if (lower.includes('facebook.com') || lower.includes('fb.com')) return <Facebook size={size} className="text-blue-600" />;
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return <Youtube size={size} className="text-red-600" />;
    if (lower.includes('linkedin.com')) return <Linkedin size={size} className="text-blue-700" />;
    if (lower.includes('twitter.com') || lower.includes('x.com')) return <Twitter size={size} className="text-sky-500" />;
    if (lower.includes('github.com')) return <Github size={size} className="text-slate-900" />;
    if (lower.includes('tiktok.com')) return <Music size={size} className="text-slate-900" />;
    if (lower.includes('twitch.tv')) return <Twitch size={size} className="text-purple-600" />;
    if (lower.includes('whatsapp.com') || lower.includes('wa.me')) return <MessageCircle size={size} className="text-emerald-500" />;
    if (lower.includes('mailto:')) return <Mail size={size} className="text-slate-600" />;
    if (lower.includes('tel:')) return <Smartphone size={size} className="text-slate-600" />;
    if (lower.includes('slack.com')) return <Slack size={size} className="text-purple-500" />;
    if (lower.includes('discord.com') || lower.includes('discord.gg')) return <MessageCircle size={size} className="text-indigo-500" />;

    return <Globe size={size} className="text-slate-400" />;
};
