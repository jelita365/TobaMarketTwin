export function Logo({ compact = false }: { compact?: boolean }) {
    return (
        <div className="flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                <path d="M2 20c3-4 6-4 9 0s6 4 9 0 6-4 8 0" stroke="#176B87" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M9 16 15 5l6 11z" fill="#0F2A44" opacity="0.9" />
                <circle cx="15" cy="14" r="1.6" fill="#D9A441" />
            </svg>
            {!compact && (
                <div className="leading-tight">
                    <p className="font-bold text-[15px] text-white tracking-tight">TobaMarketTwin</p>
                    <p className="text-[10px] text-white/50">Prototype Demo</p>
                </div>
            )}
        </div>
    );
}
