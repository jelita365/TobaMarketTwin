'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardHeader } from '@/shared/ui/Card';
import { DemoLabel } from '@/shared/ui/DemoLabel';
import { useStore } from '@/core/store';
import { applyConstraints } from '@/features/constraints';
import { formatRupiah } from '@/shared/lib';

export default function ConstraintsPage({ params }: PageProps<'/experiments/[id]/constraints'>) {
    const { id } = use(params);
    const { getExperiment, getConfigurations, getConstraints, updateConstraints } = useStore();
    const experiment = getExperiment(id);
    const savedConstraints = getConstraints(id);
    const [local, setLocal] = useState(savedConstraints);

    if (!experiment) return notFound();

    const configs = getConfigurations(id);
    const feasible = applyConstraints(configs, local);

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Constraint Engine</h1>
                    <p className="text-sm text-charcoal/60 mt-1">Filters infeasible configurations before Customer Twin evaluation.</p>
                </div>
                <DemoLabel kind="demo">Prototype Simulation</DemoLabel>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader title="Constraints" />
                    <div className="space-y-4 text-xs">
                        <label className="block">
                            <span className="font-semibold text-charcoal mb-1 block">Maximum acceptable price</span>
                            <input
                                type="number"
                                value={local.maxPrice ?? ''}
                                onChange={(e) => setLocal((s) => ({ ...s, maxPrice: e.target.value ? Number(e.target.value) : null }))}
                                placeholder="No limit"
                                className="w-full rounded-lg border border-black/10 px-3 py-2"
                            />
                        </label>
                        <label className="block">
                            <span className="font-semibold text-charcoal mb-1 block">Minimum sustainability (0-100)</span>
                            <input
                                type="number"
                                value={local.minSustainability ?? ''}
                                onChange={(e) => setLocal((s) => ({ ...s, minSustainability: e.target.value ? Number(e.target.value) : null }))}
                                placeholder="No minimum"
                                className="w-full rounded-lg border border-black/10 px-3 py-2"
                            />
                        </label>
                        <div>
                            <span className="font-semibold text-charcoal mb-1.5 block">Preferred material</span>
                            <div className="flex flex-wrap gap-1.5">
                                {experiment.options.materials.map((m) => {
                                    const active = local.preferredMaterials.includes(m);
                                    return (
                                        <button
                                            key={m}
                                            onClick={() =>
                                                setLocal((s) => ({
                                                    ...s,
                                                    preferredMaterials: active
                                                        ? s.preferredMaterials.filter((x) => x !== m)
                                                        : [...s.preferredMaterials, m],
                                                }))
                                            }
                                            className={`rounded-full px-2.5 py-1 border transition ${active ? 'bg-navy text-white border-navy' : 'border-black/10 text-charcoal/60'}`}
                                        >
                                            {m}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={local.requireCulturalStory}
                                onChange={(e) => setLocal((s) => ({ ...s, requireCulturalStory: e.target.checked }))}
                            />
                            <span className="font-semibold text-charcoal">Require Cultural Story</span>
                        </label>
                    </div>

                    <button
                        onClick={() => updateConstraints(id, local)}
                        className="w-full mt-5 rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold py-2.5 text-sm transition"
                    >
                        Save Constraints
                    </button>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader title="Constraint Filtering" subtitle="Deterministic filter — not real market data" />
                    <div className="flex items-center justify-center gap-3 text-center text-sm mb-6">
                        <FunnelStep label="Total" value={configs.length} />
                        <span className="text-charcoal/25">→</span>
                        <FunnelStep label="Constraint Filtering" value="↓" muted />
                        <span className="text-charcoal/25">→</span>
                        <FunnelStep label="Feasible" value={feasible.length} accent />
                    </div>

                    {configs.length === 0 ? (
                        <p className="text-xs text-charcoal/45 text-center py-8">Generate configurations first.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                            {feasible.slice(0, 30).map((c) => (
                                <div key={c.id} className="rounded-lg border border-black/[0.06] px-3 py-2 text-xs">
                                    <p className="font-bold text-navy">{c.id}</p>
                                    <p className="text-charcoal/55">{c.material} · {c.design} · {formatRupiah(c.price)}</p>
                                </div>
                            ))}
                            {feasible.length > 30 && (
                                <p className="text-[11px] text-charcoal/40 col-span-2 text-center pt-2">
                                    +{feasible.length - 30} more feasible configurations
                                </p>
                            )}
                            {feasible.length === 0 && (
                                <p className="text-xs text-charcoal/45 col-span-2 text-center py-8">
                                    No configuration meets these constraints — insufficient information to proceed.
                                </p>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

function FunnelStep({ label, value, accent, muted }: { label: string; value: number | string; accent?: boolean; muted?: boolean }) {
    return (
        <div className={`rounded-xl px-4 py-3 ${accent ? 'bg-green/10' : muted ? '' : 'bg-sage/40'}`}>
            <p className={`text-xl font-bold ${accent ? 'text-green' : 'text-navy'}`}>{value}</p>
            <p className="text-[11px] text-charcoal/55 mt-0.5">{label}</p>
        </div>
    );
}
