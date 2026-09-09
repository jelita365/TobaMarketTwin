'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { rankConfigurations } from '@/lib/recommendation';
import { formatRupiah } from '@/lib/utils';

const CONFIDENCE_STYLES: Record<string, string> = {
    'High Evidence': 'bg-green/15 text-green',
    'Medium Evidence': 'bg-gold/15 text-[#8a6412]',
    'Low Evidence': 'bg-red-100 text-red-700',
};

export default function DecisionTracePage({ params }: PageProps<'/experiments/[id]/decision-trace'>) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { getExperiment, getConfigurations, weights } = useStore();
    const experiment = getExperiment(id);

    if (!experiment) return notFound();

    const configs = getConfigurations(id);
    const ranked = rankConfigurations(configs, weights);
    const selectedId = searchParams.get('config') ?? ranked[0]?.configurationId;
    const trace = ranked.find((r) => r.configurationId === selectedId);
    const config = configs.find((c) => c.id === selectedId);

    return (
        <div className="max-w-4xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Decision Trace</h1>
                    <p className="text-sm text-charcoal/60 mt-1">Why was this concept shortlisted?</p>
                </div>
                <DemoLabel kind="demo">Prototype simulation results</DemoLabel>
            </div>

            {ranked.length === 0 || !trace || !config ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">No ranked configurations yet.</p>
                </Card>
            ) : (
                <Card>
                    <CardHeader
                        title={`Concept #${trace.rank} — ${config.id}`}
                        subtitle={`${config.material} · ${config.design} · ${formatRupiah(config.price)}`}
                        action={
                            <select
                                value={selectedId}
                                onChange={(e) => router.push(`/experiments/${id}/decision-trace?config=${e.target.value}`)}
                                className="text-xs rounded-lg border border-black/10 px-2 py-1.5"
                            >
                                {ranked.map((r) => (
                                    <option key={r.configurationId} value={r.configurationId}>
                                        #{r.rank} — {r.configurationId}
                                    </option>
                                ))}
                            </select>
                        }
                    />

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <Stat label="Customer Acceptance" value={trace.customerAcceptance} />
                        <Stat label="Sustainability" value={trace.sustainability} />
                        <Stat label="Decision Score" value={trace.decisionScore} accent />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-sm font-semibold text-charcoal mb-2">Main Strengths</p>
                            <ul className="space-y-1 text-xs text-charcoal/70">
                                {trace.strengths.map((s) => <li key={s}>+ {s}</li>)}
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-charcoal mb-2">Main Trade-offs</p>
                            <ul className="space-y-1 text-xs text-charcoal/60">
                                {trace.tradeoffs.map((s) => <li key={s}>− {s}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap mb-4">
                        <span className="text-xs text-charcoal/50">
                            Evidence Sufficiency: <span className="font-semibold text-charcoal">{trace.evidenceSufficiency}</span>
                        </span>
                        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${CONFIDENCE_STYLES[trace.confidenceStatus]}`}>
                            {trace.confidenceStatus}
                        </span>
                    </div>
                    <p className="text-xs text-charcoal/55 mb-6">{trace.confidenceReason}</p>

                    <div className="rounded-xl bg-sage/40 border border-navy/10 px-4 py-3">
                        <p className="text-xs font-semibold text-charcoal">Decision</p>
                        <p className="text-sm font-bold text-navy mt-0.5">&ldquo;Priority for {trace.nextAction}&rdquo;</p>
                        <p className="text-[10.5px] text-charcoal/45 mt-1">
                            Not &ldquo;Best Product&rdquo; or &ldquo;Optimal Product&rdquo; — this is a screening priority, not a final claim.
                        </p>
                    </div>

                    <div className="rounded-lg bg-black/[0.03] px-3 py-2 mt-4 text-[11px] font-mono text-charcoal/60">
                        Decision Rule: R = {Math.round(weights.acceptanceWeight * 100)}% × Acceptance + {Math.round(weights.sustainabilityWeight * 100)}% × Sustainability
                    </div>
                </Card>
            )}
        </div>
    );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
    return (
        <div className="rounded-xl bg-black/[0.03] px-3 py-3 text-center">
            <p className={`text-xl font-extrabold ${accent ? 'text-teal' : 'text-navy'}`}>{value}</p>
            <p className="text-[10.5px] text-charcoal/50 mt-0.5">{label}</p>
        </div>
    );
}
