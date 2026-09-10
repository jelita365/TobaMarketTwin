'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardHeader } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { totalCombinations } from '@/lib/configurations';
import { formatRupiah } from '@/lib/utils';

const STEPS = [
    { href: 'configurations', label: 'Configurations', desc: 'Generate & browse configuration combinations' },
    { href: 'constraints', label: 'Constraint Engine', desc: 'Filter infeasible configurations before screening' },
    { href: 'customer-twin', label: 'Customer Twin Screening', desc: 'Run the simulated AI screening pass' },
    { href: 'human-validation', label: 'Human Validation', desc: 'Independent real-customer evaluation' },
    { href: 'calibration', label: 'Calibration', desc: 'Compare AI prediction vs human evaluation' },
    { href: 'sustainability', label: 'Sustainability', desc: 'Attribute-based sustainability assessment' },
    { href: 'sensitivity', label: 'Sensitivity Analysis', desc: 'Compare Balanced / Sustainability / Market scenarios' },
    { href: 'what-if', label: 'What-If Simulator', desc: 'Recalculate a hypothetical configuration' },
    { href: 'recommendation', label: 'Recommendation', desc: 'Priority concepts and next actions' },
    { href: 'decision-trace', label: 'Decision Trace', desc: 'Why was this concept shortlisted?' },
];

export default function ExperimentDetailPage({ params }: PageProps<'/experiments/[id]'>) {
    const { id } = use(params);
    const { getExperiment, getConfigurations } = useStore();
    const experiment = getExperiment(id);

    if (!experiment) return notFound();

    const configs = getConfigurations(id);

    return (
        <div className="max-w-5xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">{experiment.name}</h1>
                    <p className="text-sm text-charcoal/60 mt-1">{experiment.objective}</p>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge status={experiment.status} />
                    <DemoLabel kind="demo">Prototype Simulation</DemoLabel>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2">
                    <CardHeader title="Experiment Details" />
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <Detail label="Product" value={experiment.productName} />
                        <Detail label="Category" value={experiment.category} />
                        <Detail label="MSME" value={experiment.msme} />
                        <Detail label="Created" value={experiment.createdAt} />
                        <Detail label="Target Segments" value={experiment.targetSegments.join(', ')} full />
                    </dl>
                </Card>

                <Card>
                    <CardHeader title="Progress" />
                    <div className="space-y-3 text-xs">
                        <Stat label="Configurations" value={configs.length || totalCombinations(experiment.options)} />
                        <Stat label="Shortlisted" value={experiment.shortlistedConfigurations} />
                        <Stat label="Human Responses" value={experiment.humanResponses} />
                        <div className="pt-2 mt-2 border-t border-black/[0.05] space-y-1.5">
                            <StatusLine label="Customer Twin" done={configs.some((c) => c.aiEvaluation)} />
                            <StatusLine label="Human Validation" done={experiment.humanResponses > 0} />
                            <StatusLine label="Calibration" done={configs.filter((c) => c.humanScoreSummary && c.humanScoreSummary.count >= 10).length >= 2} />
                            <StatusLine label="Recommendation" done={experiment.status === 'Recommendation Ready' || experiment.status === 'Completed'} />
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="mb-8">
                <CardHeader title="Configuration Options" subtitle="Used to generate the combination matrix" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <OptionGroup label="Material" items={experiment.options.materials} />
                    <OptionGroup label="Design" items={experiment.options.designs} />
                    <OptionGroup label="Price" items={experiment.options.prices.map(formatRupiah)} />
                    <OptionGroup label="Storytelling" items={experiment.options.storytelling} />
                </div>
            </Card>

            <h2 className="text-sm font-semibold text-charcoal mb-3">Workflow</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STEPS.map((step) => (
                    <Link
                        key={step.href}
                        href={`/experiments/${id}/${step.href}`}
                        className="rounded-xl border border-black/[0.06] bg-white p-4 hover:border-lakeblue/40 hover:bg-lakeblue/[0.03] transition"
                    >
                        <p className="text-sm font-semibold text-charcoal">{step.label}</p>
                        <p className="text-xs text-charcoal/55 mt-1">{step.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function Detail({ label, value, full }: { label: string; value: string; full?: boolean }) {
    return (
        <div className={full ? 'col-span-2' : undefined}>
            <dt className="text-charcoal/50 text-xs">{label}</dt>
            <dd className="font-medium text-charcoal mt-0.5">{value}</dd>
        </div>
    );
}

function StatusLine({ label, done }: { label: string; done: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-charcoal/55">{label}</span>
            <span className={`font-semibold ${done ? 'text-green' : 'text-charcoal/40'}`}>{done ? 'Available' : 'Pending'}</span>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-charcoal/55">{label}</span>
            <span className="font-bold text-navy">{value}</span>
        </div>
    );
}

function OptionGroup({ label, items }: { label: string; items: string[] }) {
    return (
        <div>
            <p className="text-charcoal/50 mb-1.5">{label}</p>
            <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                    <span key={item} className="rounded-full bg-sage/50 px-2 py-1 text-charcoal/75">
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
