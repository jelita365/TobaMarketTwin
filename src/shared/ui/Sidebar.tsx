'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FlaskConical,
    Package,
    Users,
    ClipboardCheck,
    Sparkles,
    BookOpenCheck,
    Settings,
    Network,
    Microscope,
    PlayCircle,
} from 'lucide-react';
import { Logo } from './Logo';
import { cn } from '@/shared/lib';

const NAV = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/experiments', label: 'Experiments', icon: FlaskConical },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/customer-twins', label: 'Customer Twins', icon: Users },
    { href: '/validation', label: 'Validation', icon: ClipboardCheck },
    { href: '/recommendations', label: 'Recommendations', icon: Sparkles },
    { href: '/evidence', label: 'Evidence', icon: BookOpenCheck },
    { href: '/architecture', label: 'Architecture', icon: Network },
    { href: '/research', label: 'Research Mode', icon: Microscope },
    { href: '/presentation', label: 'Presentation Mode', icon: PlayCircle },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex w-[240px] shrink-0 flex-col bg-navy text-white h-screen sticky top-0">
            <div className="px-5 py-5 border-b border-white/10">
                <Logo />
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname?.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition',
                                active
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <Icon size={16} strokeWidth={2} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-5 py-4 border-t border-white/10">
                <p className="text-[11px] font-semibold text-gold mb-1">Prototype Demo</p>
                <p className="text-[10.5px] text-white/45 leading-snug">
                    All displayed results are illustrative unless marked otherwise.
                </p>
            </div>
        </aside>
    );
}
