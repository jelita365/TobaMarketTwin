import { Card, CardHeader } from '@/shared/ui/Card';
import { DemoLabel } from '@/shared/ui/DemoLabel';

const PIPELINE = [
    'UMKM', 'Product Concept Input', 'Configuration Generator', 'Constraint Engine', 'Customer Twin',
    'Virtual Screening', 'Human Validation', 'Calibration Engine', 'Sustainability Screening',
    'MCDM Decision Engine', 'Sensitivity Analysis', 'Priority Concepts', 'Physical Prototype / Market Test',
];

const DATA_STORES = [
    { name: 'Product Data', desc: 'Configuration matrix, base product attributes' },
    { name: 'Persona Data', desc: 'Illustrative Customer Twin segments' },
    { name: 'Evidence Library', desc: 'Literature and official statistics informing the prototype' },
    { name: 'Human Evaluation Data', desc: 'CSV-imported or manually submitted respondent evaluations' },
    { name: 'Calibration Results', desc: 'Computed only when sufficient human data exists' },
];

const MODULES = [
    { path: 'features/configurations', desc: 'Generates the full cartesian product of configuration options' },
    { path: 'features/constraints', desc: 'Filters infeasible configurations before Customer Twin evaluation' },
    { path: 'features/customer-twin', desc: 'CustomerTwinEngine.evaluate() — deterministic mock, swappable for a real LLM' },
    { path: 'features/sustainability', desc: 'Prototype Sustainability Index — attribute-based, not LCA' },
    { path: 'features/human-validation', desc: 'Independent respondent evaluations, CSV import, and summaries' },
    { path: 'features/calibration', desc: 'Cross-configuration Spearman ρ, MAE, decision agreement; gated on sample size' },
    { path: 'features/decision', desc: 'Weighted Sum Model, Decision Trace, sensitivity, and what-if simulation' },
    { path: 'core/store', desc: 'Composition root: persistence adapter + feature use-case orchestration' },
];

export default function ArchitecturePage() {
    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">System Architecture</h1>
                    <p className="text-sm text-charcoal/60 mt-1">Conceptual pipeline and module separation.</p>
                </div>
                <DemoLabel kind="evidence" />
            </div>

            <Card className="mb-6">
                <CardHeader title="Pipeline" />
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    {PIPELINE.map((step, i, arr) => (
                        <span key={step} className="flex items-center gap-2">
                            <span className="rounded-lg bg-sage/50 px-2.5 py-1.5 text-charcoal/70">{step}</span>
                            {i < arr.length - 1 && <span className="text-charcoal/25">→</span>}
                        </span>
                    ))}
                </div>
            </Card>

            <Card className="mb-6">
                <CardHeader title="Data Stores" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DATA_STORES.map((d) => (
                        <div key={d.name} className="rounded-xl border border-black/[0.06] px-3 py-2.5">
                            <p className="text-xs font-semibold text-charcoal">{d.name}</p>
                            <p className="text-[11px] text-charcoal/55 mt-0.5">{d.desc}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="mb-6">
                <CardHeader title="Module Separation" subtitle="Simulation, calibration, decision, and UI stay independent" />
                <div className="space-y-2">
                    {MODULES.map((m) => (
                        <div key={m.path} className="flex items-start gap-3 text-xs">
                            <code className="rounded bg-black/[0.04] px-2 py-1 font-mono text-navy shrink-0">{m.path}</code>
                            <span className="text-charcoal/60 pt-1">{m.desc}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                <CardHeader title="Before vs After" subtitle="Potentially reduces unnecessary early-stage physical testing" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div>
                        <p className="font-semibold text-charcoal/70 mb-2">Before</p>
                        <FlowList steps={['Many concepts', 'Manual selection', 'Physical prototype', 'Customer test']} />
                    </div>
                    <div>
                        <p className="font-semibold text-navy mb-2">TobaMarketTwin</p>
                        <FlowList
                            steps={[
                                '108 configurations',
                                'Constraint filtering',
                                'Virtual screening',
                                'Human validation',
                                'Calibration',
                                'Priority concepts',
                                'Physical prototype / market test',
                            ]}
                            accent
                        />
                    </div>
                </div>
                <p className="text-[10.5px] text-charcoal/45 mt-4">
                    This is a directional claim about workflow shape, not a measured reduction percentage — no empirical
                    evidence yet supports a specific number.
                </p>
            </Card>
        </div>
    );
}

function FlowList({ steps, accent }: { steps: string[]; accent?: boolean }) {
    return (
        <ol className="space-y-1.5">
            {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                    <span className={`h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${accent ? 'bg-teal/15 text-teal' : 'bg-black/5 text-charcoal/50'}`}>
                        {i + 1}
                    </span>
                    <span className="text-charcoal/70">{s}</span>
                </li>
            ))}
        </ol>
    );
}
