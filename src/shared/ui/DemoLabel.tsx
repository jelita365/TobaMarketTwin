import { cn } from '@/shared/lib';

type Kind = 'demo' | 'illustrative' | 'evidence' | 'primary' | 'simulated';

const STYLES: Record<Kind, string> = {
    demo: 'bg-gold/15 text-[#8a6412] border-gold/30',
    illustrative: 'bg-lakeblue/10 text-lakeblue border-lakeblue/25',
    evidence: 'bg-teal/10 text-teal border-teal/25',
    primary: 'bg-green/10 text-green border-green/25',
    simulated: 'bg-navy/10 text-navy border-navy/25',
};

const DEFAULT_LABEL: Record<Kind, string> = {
    demo: 'DEMO DATA',
    illustrative: 'Illustrative Simulation',
    evidence: 'EVIDENCE',
    primary: 'PRIMARY DATA',
    simulated: 'SIMULATED',
};

/** Data provenance badge — EVIDENCE / PRIMARY DATA / DEMO DATA / SIMULATED never mixed silently. */
export function DemoLabel({ kind = 'demo', children, className }: { kind?: Kind; children?: string; className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide',
                STYLES[kind],
                className
            )}
        >
            {children ?? DEFAULT_LABEL[kind]}
        </span>
    );
}
