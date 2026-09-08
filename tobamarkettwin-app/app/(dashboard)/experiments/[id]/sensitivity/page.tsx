'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { runSensitivityAnalysis } from '@/lib/sensitivity';
import { formatRupiah } from '@/lib/utils';

const STABILITY_STYLES: Record<string, string> = {
    Stable: 'bg-green/15 text-green',
    Moderate: 'bg-gold/15 text-[#8a6412]',
    Sensitive: 'bg-red-100 text-red-700',
};

export default function SensitivityPage({ params }: PageProps<'/experiments/[id]/sensitivity'>) {
    const { id } = use(params);
    const { getExperiment, getConfigurations } = useStore();
    const experiment = getExperiment(id);

    if (!experiment) return notFound();

    const configs = getConfigurations(id);
    const evaluated = configs.filter((c) => c.aiEvaluation && c.sustainability);
    const { scenarios, stability, topConceptByScenario } = runSensitivityAnalysis(configs);

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Sensitivity Analysis</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        Compares the Weighted Sum Model under three weighting scenarios.
                    </p>
                </div>
                <DemoLabel kind="illustrative">Illustrative Sensitivity Simulation</DemoLabel>
            </div>

            {evaluated.length === 0 ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">No evaluated configurations yet.</p>
                </Card>
            ) : (
                <>
                    <Card className="mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <p className="text-sm font-semibold text-charcoal">Ranking Stability</p>
                                <p className="text-xs text-charcoal/50 mt-0.5">
                                    Does not imply empirical robustness — this only shows how the deterministic decision rule
                                    responds to different prototype weight choices.
                                </p>
                            </div>
                            <span className={`text-sm font-bold rounded-full px-4 py-1.5 ${STABILITY_STYLES[stability]}`}>
                                {stability}
                            </span>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {scenarios.map((s) => (
                            <Card key={s.scenarioId}>
                                <CardHeader title={s.label} subtitle="Top concept" />
                                <p className="text-lg font-extrabold text-navy">{topConceptByScenario[s.scenarioId] ?? '—'}</p>
                                {topConceptByScenario[s.scenarioId] && (
                                    <p className="text-xs text-charcoal/50 mt-1">
                                        {s.top10[0].decisionScore} pts
                                    </p>
                                )}
                            </Card>
                        ))}
                    </div>

                    {scenarios.map((s) => (
                        <Card key={s.scenarioId} className="mb-4">
                            <CardHeader title={`${s.label} — Top 10`} />
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="text-left text-charcoal/45">
                                            <th className="pb-2 pr-4 font-medium">#</th>
                                            <th className="pb-2 pr-4 font-medium">Concept</th>
                                            <th className="pb-2 pr-4 font-medium">Material · Design · Price</th>
                                            <th className="pb-2 pr-4 font-medium">Sustainability</th>
                                            <th className="pb-2 pr-4 font-medium">Acceptance</th>
                                            <th className="pb-2 font-medium">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {s.top10.map((r, i) => {
                                            const config = configs.find((c) => c.id === r.configurationId)!;
                                            return (
                                                <tr key={r.configurationId} className="border-t border-black/[0.05]">
                                                    <td className="py-1.5 pr-4">{i + 1}</td>
                                                    <td className="py-1.5 pr-4 font-bold text-navy">{r.configurationId}</td>
                                                    <td className="py-1.5 pr-4 text-charcoal/60">
                                                        {config.material} · {config.design} · {formatRupiah(config.price)}
                                                    </td>
                                                    <td className="py-1.5 pr-4">{r.sustainability}</td>
                                                    <td className="py-1.5 pr-4">{r.customerAcceptance}</td>
                                                    <td className="py-1.5 font-bold text-teal">{r.decisionScore}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    ))}
                </>
            )}
        </div>
    );
}
