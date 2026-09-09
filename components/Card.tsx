import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn('rounded-2xl border border-black/[0.06] bg-white p-6', className)}>
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 mb-4">
            <div>
                <h3 className="text-sm font-semibold text-charcoal">{title}</h3>
                {subtitle && <p className="text-xs text-charcoal/55 mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}
