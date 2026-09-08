'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea,
} from 'recharts';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { rankConfigurations } from '@/lib/recommendation';
import { formatRupiah } from '@/lib/utils';

const NEXT_ACTIONS = ['Build Physical Prototype', 'Run Targeted Customer Test', 'Modify Concept', 'Reject Concept'];

export default function RecommendationPage({ params }: PageProps<'/experiments/[id]/recommendation'>) {
    const { id } = use(params);
    const { getExperiment, getConfigurations, markRecommendationReady, weights } = useStore();
    const experiment = getExperiment(id);
    const [actions, setActions] = useState<Record<string, string>>({});

    if (!experiment) return notFound();

    const configs = getConfigurations(id);
    const evaluated = configs.filter((c) => c.aiEvaluation && c.sustainability);
    const ranked = rankConfigurations(configs, weights);
    const top3 = ranked.slice(0, 3);

    const scatterPoints = evaluated.map((c) => {
        const rec = ranked.find((r) => r.configurationId === c.id);
        return {
            id: c.id,
            x: c.sustainability!.overallScore,
            y: rec ? rec.customerAcceptance / 20 : c.aiEvaluation!.overallAcceptance,
            inZone: rec ? rec.sustainability >= 80 && rec.customerAcceptance >= 80 : false,
        };
    });

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Green Acceptance Sweet Spot & Recommendation</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        Recommendation Score = 40% Customer Acceptance + 30% Sustainability + 20% Calibration Confidence + 10% Price Acceptance
                    </p>
                </div>
                <DemoLabel kind="demo">Prototype decision rule</DemoLabel>
            </div>

            {evaluated.length === 0 ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">No evaluated configurations yet.</p>
                </Card>
            ) : (
                <>
                    <Card className="mb-6">
                        <CardHeader title="Green Acceptance Sweet Spot" subtitle="Target Recommendation Zone — illustrative demo data" />
                        <ResponsiveContainer width="100%" height={420}>
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis
                                    type="number" dataKey="x" name="Sustainability Score" domain={[0, 100]}
                                    tick={{ fill: '#666', fontSize: 11 }}
                                    label={{ value: 'Sustainability Score', position: 'insideBottom', offset: -10, fill: '#666', fontSize: 12 }}
                                />
                                <YAxis
                                    type="number" dataKey="y" name="Calibrated Customer Acceptance" domain={[1, 5]}
                                    tick={{ fill: '#666', fontSize: 11 }}
                                    label={{ value: 'Calibrated Customer Acceptance', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 12 }}
                                />
                                <ZAxis range={[80, 200]} />
                                <ReferenceArea
                                    x1={80} x2={100} y1={4.0} y2={5.0}
                                    fill="rgba(79, 157, 105, 0.15)"
                                    stroke="#4F9D69"
                                    strokeOpacity={0.4}
                                    label={{ value: 'TARGET RECOMMENDATION ZONE', position: 'center', fill: '#1F7A72', fontSize: 10.5, fontWeight: 700 }}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null;
                                        const p = payload[0].payload;
                                        return (
                                            <div className="bg-white shadow-lg rounded-lg border border-black/10 px-3 py-2 text-xs">
                                                <p className="font-bold text-navy">{p.id}</p>
                                                <p>Sustainability: {p.x}</p>
                                                <p>Acceptance: {p.y.toFixed(2)}</p>
                                            </div>
                                        );
                                    }}
                                />
                                <Scatter
                                    data={scatterPoints}
                                    shape={(props: unknown) => {
                                        const { cx, cy, payload } = props as { cx: number; cy: number; payload: { inZone: boolean } };
                                        return (
                                            <circle
                                                cx={cx} cy={cy}
                                                r={payload.inZone ? 8 : 5}
                                                fill={payload.inZone ? '#1F7A72' : 'rgba(23,107,135,0.6)'}
                                                stroke={payload.inZone ? '#D9A441' : 'none'}
                                                strokeWidth={payload.inZone ? 2 : 0}
                                            />
                                        );
                                    }}
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </Card>

                    <h2 className="text-sm font-semibold text-charcoal mb-3">Recommended Concepts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {top3.map((rec) => {
                            const config = configs.find((c) => c.id === rec.configurationId)!;
                            return (
                                <Card key={rec.configurationId}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-extrabold text-navy">#{rec.rank}</span>
                                        <span className="text-xs font-bold text-teal">{rec.score} pts</span>
                                    </div>
                                    <p className="text-sm font-bold text-navy">{config.id}</p>
                                    <p className="text-xs text-charcoal/55 mt-0.5">{config.material} · {config.design} · {formatRupiah(config.price)}</p>

                                    <dl className="grid grid-cols-2 gap-2 text-[11px] mt-3">
                                        <MiniStat label="Sustainability" value={`${rec.sustainability}/100`} />
                                        <MiniStat label="Customer Acceptance" value={`${rec.customerAcceptance}/100`} />
                                        <MiniStat label="Price Acceptance" value={`${rec.priceAcceptance}/100`} />
                                        <MiniStat label="Calibration Confidence" value={`${rec.calibrationConfidence}/100`} />
                                    </dl>

                                    <p className="text-xs text-charcoal/65 mt-3 leading-relaxed">
                                        <span className="font-semibold text-charcoal">Why this concept? </span>{rec.reason}
                                    </p>
                                    <p className="text-xs text-charcoal/50 mt-1.5">
                                        <span className="font-semibold text-charcoal/70">Concern: </span>{rec.concern}
                                    </p>

                                    <div className="mt-4">
                                        <label className="text-[11px] font-semibold text-charcoal/60 mb-1 block">Next Action</label>
                                        <select
                                            value={actions[rec.configurationId] ?? rec.nextAction}
                                            onChange={(e) => setActions((a) => ({ ...a, [rec.configurationId]: e.target.value }))}
                                            className="w-full text-xs rounded-lg border border-black/10 px-2 py-1.5"
                                        >
                                            {NEXT_ACTIONS.map((a) => (
                                                <option key={a} value={a}>{a}</option>
                                            ))}
                                        </select>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    <Card className="mb-6">
                        <CardHeader title="Product Comparison" subtitle="Prototype simulation results" />
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs min-w-[720px]">
                                <thead>
                                    <tr className="text-left text-charcoal/45">
                                        <th className="pb-2 pr-4 font-medium">Concept</th>
                                        <th className="pb-2 pr-4 font-medium">Material</th>
                                        <th className="pb-2 pr-4 font-medium">Design</th>
                                        <th className="pb-2 pr-4 font-medium">Price</th>
                                        <th className="pb-2 pr-4 font-medium">Sustainability</th>
                                        <th className="pb-2 pr-4 font-medium">Acceptance</th>
                                        <th className="pb-2 pr-4 font-medium">Price Acceptance</th>
                                        <th className="pb-2 pr-4 font-medium">Decision</th>
                                        <th className="pb-2 font-medium">Next Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {top3.map((rec) => {
                                        const config = configs.find((c) => c.id === rec.configurationId)!;
                                        return (
                                            <tr key={rec.configurationId} className="border-t border-black/[0.05]">
                                                <td className="py-2 pr-4 font-bold text-navy">{config.id}</td>
                                                <td className="py-2 pr-4">{config.material}</td>
                                                <td className="py-2 pr-4">{config.design}</td>
                                                <td className="py-2 pr-4">{formatRupiah(config.price)}</td>
                                                <td className="py-2 pr-4">{rec.sustainability}/100</td>
                                                <td className="py-2 pr-4">{rec.customerAcceptance}/100</td>
                                                <td className="py-2 pr-4">{rec.priceAcceptance}/100</td>
                                                <td className="py-2 pr-4">{config.aiEvaluation?.decision}</td>
                                                <td className="py-2">{actions[rec.configurationId] ?? rec.nextAction}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <button
                        onClick={() => markRecommendationReady(id)}
                        className="rounded-xl bg-green hover:bg-green/90 text-white font-semibold px-5 py-3 text-sm transition"
                    >
                        Mark Recommendation Ready
                    </button>
                </>
            )}
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg bg-black/[0.03] px-2 py-1.5">
            <p className="text-charcoal/45">{label}</p>
            <p className="font-bold text-navy">{value}</p>
        </div>
    );
}
