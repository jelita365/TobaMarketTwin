'use client';

import Link from 'next/link';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { StatusBadge } from '@/components/StatusBadge';
import { Funnel } from '@/components/Funnel';
import { useStore } from '@/lib/store';

const KPIS = [
    { label: 'Active Experiments', value: 3 },
    { label: 'Concepts Screened', value: 108 },
    { label: 'Shortlisted Concepts', value: 6 },
    { label: 'Human Validation', value: 24 },
];

export default function DashboardPage() {
    const { experiments } = useStore();

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">TobaMarketTwin</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        AI-assisted product concept screening for sustainable Toba MSMEs
                    </p>
                </div>
                <DemoLabel kind="demo" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {KPIS.map((kpi) => (
                    <Card key={kpi.label} className="text-center">
                        <p className="text-3xl font-extrabold text-navy">{kpi.value}</p>
                        <p className="text-xs text-charcoal/60 mt-1">{kpi.label}</p>
                    </Card>
                ))}
            </div>

            <Card className="mb-8">
                <CardHeader
                    title="Active Experiments"
                    subtitle="Product concept experiments currently in progress"
                />
                <div className="space-y-3">
                    {experiments.map((exp) => (
                        <Link
                            key={exp.id}
                            href={`/experiments/${exp.id}`}
                            className="flex items-center justify-between gap-4 rounded-xl border border-black/[0.06] px-4 py-3 hover:border-lakeblue/40 hover:bg-lakeblue/[0.03] transition"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-charcoal truncate">{exp.name}</p>
                                <p className="text-xs text-charcoal/50 mt-0.5">{exp.productName}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <StatusBadge status={exp.status} />
                                <div className="w-28 h-1.5 rounded-full bg-black/5 overflow-hidden hidden sm:block">
                                    <div
                                        className="h-full bg-teal rounded-full"
                                        style={{ width: `${progressForStatus(exp.status)}%` }}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Card>

            <Card>
                <CardHeader
                    title="Decision Pipeline"
                    subtitle="Uji lebih banyak konsep secara virtual sebelum memilih konsep yang layak divalidasi di dunia nyata."
                    action={<DemoLabel kind="demo" />}
                />
                <Funnel
                    steps={[
                        { label: 'Concepts', value: 108 },
                        { label: 'AI Screening', value: '→' },
                        { label: 'Shortlisted', value: 12 },
                        { label: 'Human Evaluations', value: 24 },
                        { label: 'Human Calibration', value: '→' },
                        { label: 'Green Acceptance Sweet Spot', value: '→' },
                        { label: 'Recommended', value: 3 },
                    ]}
                />
            </Card>
        </div>
    );
}

function progressForStatus(status: string): number {
    const order = [
        'Draft',
        'Configuration Generated',
        'AI Screening',
        'Shortlisted',
        'Human Validation',
        'Calibrated',
        'Recommendation Ready',
        'Completed',
    ];
    const idx = order.indexOf(status);
    return Math.round(((idx + 1) / order.length) * 100);
}
