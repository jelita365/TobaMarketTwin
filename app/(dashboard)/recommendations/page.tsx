'use client';

import Link from 'next/link';
import { Card } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { rankConfigurations } from '@/lib/recommendation';
import { formatRupiah } from '@/lib/utils';

export default function RecommendationsPage() {
    const { experiments, getConfigurations, weights } = useStore();

    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Recommendations</h1>
                    <p className="text-sm text-charcoal/60 mt-1">Top concepts across all experiments.</p>
                </div>
                <DemoLabel kind="demo">Prototype simulation results</DemoLabel>
            </div>

            <div className="space-y-6">
                {experiments.map((exp) => {
                    const configs = getConfigurations(exp.id);
                    const ranked = rankConfigurations(configs, weights).slice(0, 3);
                    if (ranked.length === 0) return null;

                    return (
                        <div key={exp.id}>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold text-charcoal">{exp.name}</h2>
                                <Link href={`/experiments/${exp.id}/recommendation`} className="text-xs font-semibold text-lakeblue hover:underline">
                                    View full analysis →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {ranked.map((rec) => {
                                    const config = configs.find((c) => c.id === rec.configurationId)!;
                                    return (
                                        <Card key={rec.configurationId}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-sm font-extrabold text-navy">#{rec.rank}</span>
                                                <span className="text-xs font-bold text-teal">{rec.decisionScore} pts</span>
                                            </div>
                                            <p className="text-sm font-bold text-navy">{config.id}</p>
                                            <p className="text-xs text-charcoal/55">{config.material} · {formatRupiah(config.price)}</p>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
