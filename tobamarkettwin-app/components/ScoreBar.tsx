export function ScoreBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div>
            <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-charcoal/60">{label}</span>
                <span className="font-semibold text-navy">{value.toFixed(1)} / {max}</span>
            </div>
            <div className="h-2 rounded-full bg-black/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-lakeblue" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}
