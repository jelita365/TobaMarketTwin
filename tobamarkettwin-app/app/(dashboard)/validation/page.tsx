'use client';

import Link from 'next/link';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { CSV_COLUMNS } from '@/lib/csv';
import { useStore } from '@/lib/store';

export default function ValidationPage() {
    const { experiments, getConfigurations, getHumanEvaluations } = useStore();

    const rows = experiments.flatMap((exp) =>
        getConfigurations(exp.id)
            .filter((c) => c.humanScoreSummary)
            .map((c) => ({ exp, config: c, evals: getHumanEvaluations(c.id) }))
    );

    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Validation</h1>
                    <p className="text-sm text-charcoal/60 mt-1">Human validation status across all experiments.</p>
                </div>
                <DemoLabel kind="illustrative">Illustrative Human Validation Data</DemoLabel>
            </div>

            <Card className="mb-6">
                <CardHeader title="Primary Data Source (CSV)" subtitle="Expected column structure for real respondent uploads" />
                <div className="overflow-x-auto">
                    <code className="text-[11px] text-charcoal/60 whitespace-nowrap block">
                        {CSV_COLUMNS.join(',')}
                    </code>
                </div>
                <p className="text-[11px] text-charcoal/45 mt-3">
                    CSV upload is supported per-configuration from the Human Validation step inside an experiment.
                    Rows shown elsewhere in this prototype are illustrative demo data only.
                </p>
            </Card>

            <div className="space-y-3">
                {rows.map(({ exp, config }) => (
                    <Link key={config.id} href={`/experiments/${exp.id}/human-validation`}>
                        <Card className="hover:border-lakeblue/40 transition">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <p className="text-sm font-semibold text-charcoal">{config.id} — {exp.name}</p>
                                    <p className="text-xs text-charcoal/55 mt-0.5">{config.material} · {config.design}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-lakeblue">{config.humanScoreSummary?.overallAcceptance}/100</p>
                                    <p className="text-[11px] text-charcoal/45">{config.humanScoreSummary?.count} respondents</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
                {rows.length === 0 && (
                    <Card className="text-center py-14">
                        <p className="text-sm text-charcoal/60">No human validation data yet.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
