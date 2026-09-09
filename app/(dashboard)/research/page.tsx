import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';

const RQS = [
    { id: 'RQ1', text: 'Can evidence-grounded Customer Twins represent preference patterns of Toba tourism consumers?' },
    { id: 'RQ2', text: 'How closely do Customer Twin evaluations align with real customer evaluations?' },
    { id: 'RQ3', text: 'Does human calibration improve Customer Twin alignment?' },
    { id: 'RQ4', text: 'Can calibrated Customer Twins reduce the number of concepts requiring initial physical testing?' },
];

const BASELINES = [
    { id: 'Baseline 1', label: 'Generic LLM' },
    { id: 'Baseline 2', label: 'LLM + Persona' },
    { id: 'Baseline 3', label: 'LLM + Persona + Evidence' },
    { id: 'Baseline 4', label: 'LLM + Persona + Evidence + Human Calibration' },
];

const METRICS = ['Spearman ρ', 'MAE', 'Decision Agreement', 'Stability'];

export default function ResearchPage() {
    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Research Validation Plan</h1>
                    <p className="text-sm text-charcoal/60 mt-1">The empirical study this prototype is designed to enable.</p>
                </div>
                <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/15 text-[#8a6412] px-2.5 py-0.5 text-[11px] font-semibold">
                    Proposed Research — Not Yet Validated
                </span>
            </div>

            <Card className="mb-6">
                <CardHeader title="Research Questions" />
                <div className="space-y-3">
                    {RQS.map((rq) => (
                        <div key={rq.id} className="flex gap-3 text-sm">
                            <span className="font-bold text-teal shrink-0">{rq.id}</span>
                            <span className="text-charcoal/75">{rq.text}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="mb-6">
                <CardHeader title="Experimental Comparison" subtitle="Proposed baselines for a future ablation study" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BASELINES.map((b) => (
                        <div key={b.id} className="rounded-xl border border-black/[0.06] px-3 py-2.5">
                            <p className="text-[10.5px] font-semibold text-charcoal/45">{b.id}</p>
                            <p className="text-xs font-medium text-charcoal mt-0.5">{b.label}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                <CardHeader title="Evaluation Metrics" subtitle="Same metrics used by the Calibration module" />
                <div className="flex flex-wrap gap-2">
                    {METRICS.map((m) => (
                        <span key={m} className="text-xs rounded-full bg-teal/10 text-teal px-3 py-1">{m}</span>
                    ))}
                </div>
                <p className="text-[11px] text-charcoal/45 mt-4 leading-relaxed">
                    No baseline in this comparison has been run yet. This page documents the intended research design;
                    all reported metrics elsewhere in this prototype are illustrative demo data, not results of this study.
                    <DemoLabel kind="demo" className="ml-2">Proposed Research</DemoLabel>
                </p>
            </Card>
        </div>
    );
}
