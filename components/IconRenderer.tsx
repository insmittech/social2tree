import React from 'react';
import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconRendererProps extends LucideProps {
    iconName: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ iconName, ...props }) => {
    // Map common names to Lucide icon names if they differ
    const iconMap: Record<string, string> = {
        'Dashboard': 'LayoutDashboard',
        'Stats': 'BarChart2',
        'Trees': 'Layout',
        'Analytics': 'Activity',
        'Profile': 'User',
        'Settings': 'Settings',
        'Verify': 'ShieldCheck',
        'Plans': 'CreditCard',
        'Saved': 'Bookmark',
        'Home': 'Home',
        'Globe': 'Globe',
        'Legal': 'ShieldCheck',
        'Explore': 'Link',
        'Logout': 'LogOut',
        'Menu': 'Menu',
        'Users': 'Users',
        'Shield': 'Shield',
        'Key': 'Key',
        'Help': 'HelpCircle',
        'Search': 'Search',
        'Plus': 'Plus',
        'Save': 'Save',
        'Trash': 'Trash2',
        'External': 'ExternalLink',
    };

    const name = iconMap[iconName] || iconName;
    const LucideIcon = (Icons as any)[name];

    if (!LucideIcon) {
        // Fallback icon if not found
        return <Icons.HelpCircle {...props} />;
    }

    return <LucideIcon {...props} />;
};

export default IconRenderer;

export const availableIcons = [
    'LayoutDashboard', 'BarChart2', 'Layout', 'Activity', 'User', 'Settings',
    'ShieldCheck', 'CreditCard', 'Bookmark', 'Home', 'Globe', 'Link',
    'LogOut', 'Menu', 'Users', 'Shield', 'Key', 'HelpCircle', 'Search',
    'Plus', 'Save', 'Trash2', 'ExternalLink', 'Briefcase', 'MessageSquare',
    'Bell', 'Calendar', 'Camera', 'Mail', 'Map', 'Star', 'Heart'
];
