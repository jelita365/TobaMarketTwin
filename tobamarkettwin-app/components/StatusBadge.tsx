import { ExperimentStatus } from '@/types';
import { cn } from '@/lib/utils';

const STYLES: Record<ExperimentStatus, string> = {
    Draft: 'bg-black/5 text-charcoal/60',
    'Configuration Generated': 'bg-lakeblue/10 text-lakeblue',
    'AI Screening': 'bg-teal/10 text-teal',
    Shortlisted: 'bg-gold/15 text-[#8a6412]',
    'Human Validation': 'bg-lakeblue/10 text-lakeblue',
    Calibrated: 'bg-teal/10 text-teal',
    'Recommendation Ready': 'bg-green/15 text-green',
    Completed: 'bg-navy/10 text-navy',
};

export function StatusBadge({ status, className }: { status: ExperimentStatus; className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
                STYLES[status],
                className
            )}
        >
            {status}
        </span>
    );
}
