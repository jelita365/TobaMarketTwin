'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/Card';
import { useStore } from '@/lib/store';
import { MAIN_EXPERIMENT_ID } from '@/lib/store';

function buildSteps(id: string) {
    return [
        { label: 'Start with 108 configurations', href: `/experiments/${id}/configurations`, note: 'Generated programmatically, not hard-coded.' },
        { label: 'Apply constraints', href: `/experiments/${id}/constraints`, note: 'Max price, min sustainability, preferred material, cultural story requirement.' },
        { label: 'Show reduced feasible space', href: `/experiments/${id}/constraints`, note: '108 → feasible subset.' },
        { label: 'Run Customer Twin', href: `/experiments/${id}/configurations`, note: 'Click "Run Customer Twin Screening".' },
        { label: 'Show virtual screening', href: `/experiments/${id}/customer-twin`, note: 'Persona, scores, decision, evidence sufficiency.' },
        { label: 'Select candidate concepts', href: `/experiments/${id}/customer-twin`, note: 'Shortlisted configurations from screening.' },
        { label: 'Explain human validation is required', href: `/experiments/${id}/human-validation`, note: 'AI is a screening mechanism, not a source of truth.' },
        { label: 'Open Human Validation page', href: `/experiments/${id}/human-validation`, note: 'Real respondents evaluate blind to AI scores.' },
        { label: 'Show "no empirical dataset loaded" if absent', href: `/experiments/${id}/human-validation`, note: 'Never fabricate — show the honest empty state.' },
        { label: 'Open Calibration', href: `/experiments/${id}/calibration`, note: 'Compare Customer Twin vs human evaluation.' },
        { label: 'Show "Pending" if no data', href: `/experiments/${id}/calibration`, note: 'Metrics only appear once ≥10 respondents per configuration exist.' },
        { label: 'Open Sustainability', href: `/experiments/${id}/sustainability`, note: 'Attribute-based screening, not LCA.' },
        { label: 'Open Sensitivity Analysis', href: `/experiments/${id}/sensitivity`, note: 'Balanced / Sustainability Priority / Market Priority.' },
        { label: 'Compare three weighting scenarios', href: `/experiments/${id}/sensitivity`, note: 'Report ranking stability.' },
        { label: 'Open Green Acceptance Sweet Spot', href: `/experiments/${id}/recommendation`, note: 'Priority Testing Zone, not "global optimum".' },
        { label: 'Select candidate for physical testing', href: `/experiments/${id}/recommendation`, note: 'Top priority concepts with Next Action.' },
        { label: 'Open Decision Trace', href: `/experiments/${id}/decision-trace`, note: 'Why was this concept shortlisted?' },
        { label: 'Explain why the concept was selected', href: `/experiments/${id}/decision-trace`, note: 'Strengths, trade-offs, confidence, decision rule.' },
    ];
}

export default function PresentationPage() {
    const { experiments } = useStore();
    const mainExperiment = experiments.find((e) => e.id === MAIN_EXPERIMENT_ID) ?? experiments[0];
    const steps = mainExperiment ? buildSteps(mainExperiment.id) : [];
    const [current, setCurrent] = useState(0);

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-navy tracking-tight mb-1">Presentation Mode</h1>
            <p className="text-sm text-charcoal/60 mb-6">Demo sequence for jury walkthrough — {mainExperiment?.name}.</p>

            <Card className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-charcoal/50">Step {current + 1} of {steps.length}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                            disabled={current === 0}
                            className="text-xs font-semibold rounded-lg border border-black/10 px-3 py-1.5 disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
                            disabled={current === steps.length - 1}
                            className="text-xs font-semibold rounded-lg bg-navy text-white px-3 py-1.5 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {steps[current] && (
                    <>
                        <CardHeader title={steps[current].label} subtitle={steps[current].note} />
                        <Link
                            href={steps[current].href}
                            className="inline-flex items-center gap-2 rounded-xl bg-teal/10 text-teal font-semibold px-4 py-2.5 text-sm hover:bg-teal/15 transition"
                        >
                            Open this step →
                        </Link>
                    </>
                )}
            </Card>

            <div className="space-y-1.5 mb-6">
                {steps.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition ${
                            i === current ? 'bg-navy/5 border border-navy/15' : 'hover:bg-black/[0.02]'
                        }`}
                    >
                        <span className={`h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= current ? 'bg-teal/15 text-teal' : 'bg-black/5 text-charcoal/40'}`}>
                            {i + 1}
                        </span>
                        <span className={i === current ? 'font-semibold text-navy' : 'text-charcoal/60'}>{s.label}</span>
                    </button>
                ))}
            </div>

            <div className="rounded-2xl bg-navy text-white p-6 text-center">
                <p className="text-lg font-bold">AI menyaring.</p>
                <p className="text-lg font-bold">Manusia memvalidasi.</p>
                <p className="text-lg font-bold">UMKM memutuskan.</p>
            </div>
        </div>
    );
}
