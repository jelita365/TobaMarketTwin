import { Card, CardHeader } from '@/shared/ui/Card';
import { DemoLabel } from '@/shared/ui/DemoLabel';
import { EVIDENCE_SOURCES } from '@/features/evidence';

const ARCHITECTURE_STEPS = [
    'UMKM', 'Product Concept Input', 'Configuration Engine', 'Customer Twin', 'Virtual Screening',
    'Shortlist', 'Independent Human Validation', 'Human Calibration', 'Sustainability Assessment',
    'Green Acceptance Sweet Spot', 'Recommendation', 'Physical Prototype / Market Test',
];

export default function EvidencePage() {
    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Evidence</h1>
                    <p className="text-sm text-charcoal/60 mt-1">Literature and official statistics informing this prototype.</p>
                </div>
                <DemoLabel kind="evidence" />
            </div>

            <Card className="mb-6">
                <CardHeader title="System Architecture" subtitle="Conceptual pipeline behind the demo flow" />
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    {ARCHITECTURE_STEPS.map((step, i, arr) => (
                        <span key={step} className="flex items-center gap-2">
                            <span className="rounded-lg bg-sage/50 px-2.5 py-1.5 text-charcoal/70">{step}</span>
                            {i < arr.length - 1 && <span className="text-charcoal/25">→</span>}
                        </span>
                    ))}
                </div>
            </Card>

            <div className="space-y-4">
                {EVIDENCE_SOURCES.map((source) => (
                    <Card key={source.id}>
                        <p className="text-sm font-semibold text-charcoal leading-snug">{source.title}</p>
                        <p className="text-xs text-charcoal/55 mt-1">{source.authors} ({source.year})</p>
                        {source.doi && <p className="text-[11px] text-lakeblue mt-0.5">DOI: {source.doi}</p>}

                        {source.variables.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {source.variables.map((v) => (
                                    <span key={v} className="text-[10px] rounded-full bg-teal/10 text-teal px-2 py-0.5">{v}</span>
                                ))}
                            </div>
                        )}

                        {source.findings.length > 0 && (
                            <dl className="grid sm:grid-cols-2 gap-2 mt-3 text-xs">
                                {source.findings.map((f) => (
                                    <div key={f.label} className="rounded-lg bg-black/[0.03] px-3 py-2">
                                        <dt className="text-charcoal/45 text-[10.5px]">{f.label}</dt>
                                        <dd className="font-semibold text-navy mt-0.5">{f.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        <p className="text-[11px] text-charcoal/50 mt-3 leading-relaxed">{source.note}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
