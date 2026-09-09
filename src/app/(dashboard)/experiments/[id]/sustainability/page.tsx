'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader } from '@/shared/ui/Card';
import { DemoLabel } from '@/shared/ui/DemoLabel';
import { useStore } from '@/core/store';
import { formatRupiah } from '@/shared/lib';

export default function SustainabilityPage({ params }: PageProps<'/experiments/[id]/sustainability'>) {
    const { id } = use(params);
    const { getExperiment, getConfigurations } = useStore();
    const experiment = getExperiment(id);
    const configs = getConfigurations(id).filter((c) => c.sustainability);
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

    if (!experiment) return notFound();

    const config = configs.find((c) => c.id === selectedId) ?? configs[0];

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Sustainability Assessment</h1>
                    <p className="text-sm text-charcoal/60 mt-1">Prototype Sustainability Index</p>
                </div>
                <DemoLabel kind="illustrative">Attribute-based prototype score; not a full LCA</DemoLabel>
            </div>

            {configs.length === 0 || !config ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">No sustainability assessments yet.</p>
                    <p className="text-xs text-charcoal/45 mt-1">Run Customer Twin Screening first.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader
                            title={`${config.id} — Sustainability Attribute Score`}
                            subtitle={`${config.material} · ${config.design} · ${formatRupiah(config.price)}`}
                            action={
                                <select
                                    value={selectedId}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                    className="text-xs rounded-lg border border-black/10 px-2 py-1.5"
                                >
                                    {configs.map((c) => (
                                        <option key={c.id} value={c.id}>{c.id}</option>
                                    ))}
                                </select>
                            }
                        />
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart
                                data={[
                                    { attr: 'Recyclability', value: config.sustainability!.recyclability },
                                    { attr: 'Reusability', value: config.sustainability!.reusability },
                                    { attr: 'Recycled Content', value: config.sustainability!.recycledContent },
                                    { attr: 'Material Efficiency', value: config.sustainability!.materialEfficiency },
                                    { attr: 'Local Material Potential', value: config.sustainability!.localMaterialPotential },
                                ]}
                                layout="vertical"
                                margin={{ left: 20 }}
                            >
                                <CartesianGrid stroke="#F0F0F0" horizontal={false} />
                                <XAxis type="number" domain={[0, 5]} tick={{ fill: '#666', fontSize: 11 }} />
                                <YAxis type="category" dataKey="attr" width={150} tick={{ fill: '#666', fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4F9D69" radius={[0, 6, 6, 0]} barSize={22} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card>
                        <CardHeader title="Prototype Sustainability Index" />
                        <div className="text-center mb-4">
                            <p className="text-4xl font-extrabold text-green">{config.sustainability!.overallScore}</p>
                            <p className="text-xs text-charcoal/50">/ 100</p>
                        </div>
                        <div className="h-2.5 rounded-full bg-black/[0.06] overflow-hidden mb-4">
                            <div className="h-full rounded-full bg-green" style={{ width: `${config.sustainability!.overallScore}%` }} />
                        </div>
                        <div className="rounded-xl bg-sage/40 border border-green/15 px-3 py-3 text-[11px] text-charcoal/65 leading-relaxed font-mono">
                            Score = average of:<br />
                            Recyclability, Reusability,<br />
                            Recycled Content,<br />
                            Material Efficiency,<br />
                            Local Material Potential<br />
                            <span className="font-bold text-green">→ scaled to 0–100</span>
                        </div>
                        <p className="text-[10.5px] text-charcoal/45 mt-3 leading-relaxed">
                            Attribute-based screening score using default equal weighting; not an internationally standardized environmental metric. Weighting can be adjusted in Settings.
                        </p>
                    </Card>
                </div>
            )}
        </div>
    );
}
