'use client';

import Link from 'next/link';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { StatusBadge } from '@/components/StatusBadge';
import { Funnel } from '@/components/Funnel';
import { useStore } from '@/lib/store';
import { applyConstraints } from '@/lib/constraints';
import { MIN_RESPONSES_FOR_CALIBRATION } from '@/types';

export default function DashboardPage() {
    const { experiments, getConfigurations, getConstraints, getHumanEvaluations } = useStore();

    // Aggregate across ALL experiments, not just one — the dashboard represents the whole
    // portfolio, while per-experiment detail (e.g. the 108-config breakdown) lives on each
    // experiment's own page.
    const allRows = experiments.flatMap((exp) => getConfigurations(exp.id).map((config) => ({ exp, config })));
    const allConfigs = allRows.map((r) => r.config);
    const feasibleByExperiment = experiments.map((exp) => {
        const configs = getConfigurations(exp.id);
        const constraints = getConstraints(exp.id);
        return applyConstraints(configs, constraints);
    });
    const feasibleCount = feasibleByExperiment.reduce((sum, f) => sum + f.length, 0);
    const shortlisted = allConfigs.filter((c) => c.status === 'Shortlisted' || c.status === 'Validated');
    const humanResponseCount = allRows.reduce((sum, { exp, config }) => sum + getHumanEvaluations(exp.id, config.id).length, 0);
    const calibrationEligible = allRows.filter(({ exp, config }) => getHumanEvaluations(exp.id, config.id).length >= MIN_RESPONSES_FOR_CALIBRATION).length;
    const calibrationStatus = calibrationEligible >= 2 ? 'Available' : 'Pending';
    const priorityConcepts = allConfigs.filter((c) => c.aiEvaluation && c.sustainability).length > 0 ? Math.min(3, shortlisted.length) : 0;

    const totalConfigurations = allConfigs.length || experiments.reduce((sum, e) => sum + e.totalConfigurations, 0);

    const kpis = [
        { label: 'Configurations', value: totalConfigurations },
        { label: 'Feasible (Constraints)', value: feasibleCount },
        { label: 'Human Validation', value: humanResponseCount > 0 ? `${humanResponseCount} Responses` : 'Not Available' },
        { label: 'Calibration', value: calibrationStatus },
        { label: 'Priority Concepts', value: priorityConcepts },
    ];

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">TobaMarketTwin</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        AI-assisted product concept screening for sustainable Toba MSMEs
                    </p>
                    <p className="text-xs font-semibold text-teal mt-2">
                        AI menyaring. Manusia memvalidasi. UMKM memutuskan.
                    </p>
                </div>
                <DemoLabel kind="demo" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {kpis.map((kpi) => (
                    <Card key={kpi.label} className="text-center">
                        <p className="text-2xl font-extrabold text-navy">{kpi.value}</p>
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
                    subtitle="Uji lebih banyak konsep secara virtual sebelum memilih konsep yang layak divalidasi di dunia nyata, di seluruh eksperimen aktif."
                    action={<DemoLabel kind="demo" />}
                />
                <Funnel
                    steps={[
                        { label: 'Concepts', value: totalConfigurations },
                        { label: 'Constraint Filter', value: feasibleCount },
                        { label: 'Customer Twin', value: '→' },
                        { label: 'Human Validation', value: humanResponseCount },
                        { label: 'Calibration', value: calibrationStatus },
                        { label: 'Sustainability', value: '→' },
                        { label: 'Decision', value: priorityConcepts },
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
