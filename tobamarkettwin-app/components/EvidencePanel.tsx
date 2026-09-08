import { EVIDENCE_SOURCES } from '@/data/evidence';

export function EvidencePanel() {
    const source = EVIDENCE_SOURCES[0];
    return (
        <div className="rounded-xl border border-teal/20 bg-teal/[0.04] p-4">
            <p className="text-xs font-semibold text-teal mb-2">Evidence Base — Literature-informed variables</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
                {source.variables.map((v) => (
                    <span key={v} className="text-[10px] rounded-full bg-white border border-teal/25 px-2 py-0.5 text-teal">
                        {v}
                    </span>
                ))}
            </div>
            <p className="text-[11px] text-charcoal/60">
                {source.authors.split(',')[0]} et al. ({source.year}){source.doi ? ` · DOI: ${source.doi}` : ''}
            </p>
            <p className="text-[10.5px] text-charcoal/45 mt-1.5 leading-relaxed" title="PLS-SEM path coefficients reported in the source study; not system prediction accuracy.">
                PLS-SEM path coefficients reported in the source study; not system prediction accuracy.
            </p>
        </div>
    );
}
