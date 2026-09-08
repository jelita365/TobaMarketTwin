interface FunnelStep {
    label: string;
    value: string | number;
}

export function Funnel({ steps }: { steps: FunnelStep[] }) {
    return (
        <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
            {steps.map((step, i) => (
                <div key={step.label} className="flex-1 flex items-center">
                    <div className="flex-1 rounded-xl border border-navy/10 bg-sage/40 px-4 py-4 text-center">
                        <p className="text-xl font-bold text-navy">{step.value}</p>
                        <p className="text-[11px] text-charcoal/60 mt-1 leading-tight">{step.label}</p>
                    </div>
                    {i < steps.length - 1 && (
                        <span className="hidden md:block text-charcoal/25 px-2 text-lg">→</span>
                    )}
                </div>
            ))}
        </div>
    );
}
