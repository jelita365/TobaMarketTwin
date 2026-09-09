'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { evaluateWhatIf, WhatIfInput, WhatIfResult } from '@/lib/whatif';
import { formatRupiah } from '@/lib/utils';

export default function WhatIfPage({ params }: PageProps<'/experiments/[id]/what-if'>) {
    const { id } = use(params);
    const { getExperiment, weights } = useStore();
    const experiment = getExperiment(id);

    const initial: WhatIfInput | null = experiment
        ? {
              material: experiment.options.materials[0],
              design: experiment.options.designs[0],
              price: experiment.options.prices[0],
              storytelling: experiment.options.storytelling[0],
              language: experiment.options.languages[0],
          }
        : null;

    const [input, setInput] = useState<WhatIfInput | null>(initial);
    const [baseline] = useState<WhatIfResult | null>(initial ? evaluateWhatIf(initial, weights) : null);
    const [current, setCurrent] = useState<WhatIfResult | null>(initial ? evaluateWhatIf(initial, weights) : null);

    if (!experiment || !input) return notFound();

    const handleChange = (patch: Partial<WhatIfInput>) => {
        const next = { ...input, ...patch };
        setInput(next);
        setCurrent(evaluateWhatIf(next, weights));
    };

    const delta = (a: number, b: number) => {
        const diff = b - a;
        if (diff === 0) return null;
        return diff > 0 ? `+${diff}` : `${diff}`;
    };

    return (
        <div className="max-w-5xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">What-If Simulator</h1>
                    <p className="text-sm text-charcoal/60 mt-1">Change configuration attributes and recalculate deterministically.</p>
                </div>
                <DemoLabel kind="demo">Prototype Scenario Simulation</DemoLabel>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader title="Configuration" />
                    <div className="space-y-4 text-xs">
                        <SelectField label="Material" value={input.material} options={experiment.options.materials} onChange={(v) => handleChange({ material: v })} />
                        <SelectField label="Design" value={input.design} options={experiment.options.designs} onChange={(v) => handleChange({ design: v })} />
                        <SelectField
                            label="Price"
                            value={String(input.price)}
                            options={experiment.options.prices.map(String)}
                            onChange={(v) => handleChange({ price: Number(v) })}
                            display={(v) => formatRupiah(Number(v))}
                        />
                        <SelectField label="Storytelling" value={input.storytelling} options={experiment.options.storytelling} onChange={(v) => handleChange({ storytelling: v })} />
                        <SelectField label="Language" value={input.language} options={experiment.options.languages} onChange={(v) => handleChange({ language: v })} />
                    </div>
                </Card>

                <Card>
                    <CardHeader title="Recalculated Result" subtitle="vs. initial baseline" />
                    <div className="space-y-4">
                        <ResultRow label="Customer Acceptance" baseline={baseline!.customerAcceptance} current={current!.customerAcceptance} delta={delta(baseline!.customerAcceptance, current!.customerAcceptance)} />
                        <ResultRow label="Sustainability" baseline={baseline!.sustainability} current={current!.sustainability} delta={delta(baseline!.sustainability, current!.sustainability)} />
                        <ResultRow label="Decision Score" baseline={baseline!.decisionScore} current={current!.decisionScore} delta={delta(baseline!.decisionScore, current!.decisionScore)} accent />
                    </div>
                    <p className="text-[10.5px] text-charcoal/45 mt-4 leading-relaxed">
                        Uses the same deterministic Customer Twin and Sustainability engines as the main pipeline. No human
                        calibration exists for a hypothetical configuration, so acceptance always reflects Customer Twin score alone.
                    </p>
                </Card>
            </div>
        </div>
    );
}

function SelectField({
    label, value, options, onChange, display,
}: {
    label: string; value: string; options: string[]; onChange: (v: string) => void; display?: (v: string) => string;
}) {
    return (
        <label className="block">
            <span className="font-semibold text-charcoal mb-1 block">{label}</span>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-black/10 px-3 py-2">
                {options.map((o) => (
                    <option key={o} value={o}>{display ? display(o) : o}</option>
                ))}
            </select>
        </label>
    );
}

function ResultRow({
    label, baseline, current, delta, accent,
}: {
    label: string; baseline: number; current: number; delta: string | null; accent?: boolean;
}) {
    return (
        <div>
            <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-charcoal/60">{label}</span>
                <span className={`font-bold ${accent ? 'text-teal' : 'text-navy'}`}>
                    {baseline} → {current}
                    {delta && <span className={delta.startsWith('+') ? 'text-green ml-1' : 'text-red-600 ml-1'}>({delta})</span>}
                </span>
            </div>
            <div className="h-2 rounded-full bg-black/[0.06] overflow-hidden">
                <div className={`h-full ${accent ? 'bg-teal' : 'bg-lakeblue'}`} style={{ width: `${current}%` }} />
            </div>
        </div>
    );
}
