'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardHeader } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { useStore } from '@/lib/store';
import { totalCombinations } from '@/lib/configurations';
import { formatRupiah } from '@/lib/utils';

const STEPS = [
    { href: 'configurations', label: 'Configurations', desc: 'Generate & browse configuration combinations' },
    { href: 'customer-twin', label: 'Customer Twin Screening', desc: 'Run the simulated AI screening pass' },
    { href: 'human-validation', label: 'Human Validation', desc: 'Independent real-customer evaluation' },
    { href: 'calibration', label: 'Calibration', desc: 'Compare AI prediction vs human evaluation' },
    { href: 'sustainability', label: 'Sustainability', desc: 'Attribute-based sustainability assessment' },
    { href: 'recommendation', label: 'Recommendation', desc: 'Top concepts and next actions' },
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
                <StatusBadge status={experiment.status} />
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
                    <OptionGroup label="Language" items={experiment.options.languages} />
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
