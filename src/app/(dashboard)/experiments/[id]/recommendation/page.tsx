'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea,
} from 'recharts';
import { Card, CardHeader } from '@/shared/ui/Card';
import { DemoLabel } from '@/shared/ui/DemoLabel';
import { useStore } from '@/core/store';
import { rankConfigurations } from '@/features/decision';
import { formatRupiah } from '@/shared/lib';

const NEXT_ACTIONS = ['Physical Prototype', 'Human Test', 'Collect More Evidence'];

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
    const anyCalibrated = ranked.some((r) => r.confidenceStatus === 'High Evidence' || r.confidenceStatus === 'Medium Evidence');

    const scatterPoints = evaluated.map((c) => {
        const rec = ranked.find((r) => r.configurationId === c.id);
        return {
            id: c.id,
            x: rec ? rec.sustainability : c.sustainability!.overallScore,
            y: rec ? ((rec.customerAcceptance / 100) * 4) + 1 : c.aiEvaluation!.customerAcceptance,
            inZone: rec ? rec.sustainability >= 80 && rec.customerAcceptance >= 80 : false,
        };
    });

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Green Acceptance Sweet Spot & Recommendation</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        R_i = {Math.round(weights.acceptanceWeight * 100)}% Customer Acceptance + {Math.round(weights.sustainabilityWeight * 100)}% Sustainability
                    </p>
                </div>
                <DemoLabel kind="demo">Prototype Balanced Decision Rule</DemoLabel>
            </div>

            {evaluated.length === 0 ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">No evaluated configurations yet.</p>
                </Card>
            ) : (
                <>
                    <Card className="mb-6">
                        <CardHeader
                            title="Green Acceptance Sweet Spot"
                            subtitle={anyCalibrated ? 'Priority Testing Zone — illustrative demo data' : 'Priority Testing Zone — calibration pending, using Customer Twin Acceptance only'}
                        />
                        {!anyCalibrated && (
                            <p className="text-[11px] text-gold bg-gold/10 rounded-lg px-3 py-2 mb-4 inline-block">
                                Calibration pending — Y-axis currently shows Customer Twin Acceptance, not calibrated human acceptance.
                            </p>
                        )}
                        <ResponsiveContainer width="100%" height={420}>
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis
                                    type="number" dataKey="x" name="Sustainability Score" domain={[0, 100]}
                                    tick={{ fill: '#666', fontSize: 11 }}
                                    label={{ value: 'Sustainability Score', position: 'insideBottom', offset: -10, fill: '#666', fontSize: 12 }}
                                />
                                <YAxis
                                    type="number" dataKey="y" name={anyCalibrated ? 'Calibrated Customer Acceptance' : 'Customer Twin Acceptance'} domain={[1, 5]}
                                    tick={{ fill: '#666', fontSize: 11 }}
                                    label={{ value: anyCalibrated ? 'Calibrated Customer Acceptance' : 'Customer Twin Acceptance', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 12 }}
                                />
                                <ZAxis range={[80, 200]} />
                                <ReferenceArea
                                    x1={80} x2={100} y1={4.0} y2={5.0}
                                    fill="rgba(79, 157, 105, 0.15)"
                                    stroke="#4F9D69"
                                    strokeOpacity={0.4}
                                    label={{ value: 'PRIORITY TESTING ZONE', position: 'center', fill: '#1F7A72', fontSize: 10.5, fontWeight: 700 }}
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
                                                {p.inZone && <p className="text-teal font-semibold mt-1">Candidate for Physical Testing</p>}
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

                    <h2 className="text-sm font-semibold text-charcoal mb-3">Priority Concepts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {top3.map((rec) => {
                            const config = configs.find((c) => c.id === rec.configurationId)!;
                            return (
                                <Card key={rec.configurationId}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-extrabold text-navy">#{rec.rank}</span>
                                        <span className="text-xs font-bold text-teal">{rec.decisionScore} pts</span>
                                    </div>
                                    <p className="text-sm font-bold text-navy">{config.id}</p>
                                    <p className="text-xs text-charcoal/55 mt-0.5">{config.material} · {config.design} · {formatRupiah(config.price)}</p>

                                    <dl className="grid grid-cols-2 gap-2 text-[11px] mt-3">
                                        <MiniStat label="Sustainability" value={`${rec.sustainability}/100`} />
                                        <MiniStat label="Customer Acceptance" value={`${rec.customerAcceptance}/100`} />
                                        <MiniStat label="Evidence Sufficiency" value={rec.evidenceSufficiency} />
                                        <MiniStat label="Confidence" value={rec.confidenceStatus.replace(' Evidence', '')} />
                                    </dl>

                                    <div className="mt-3 text-xs">
                                        <p className="font-semibold text-charcoal">Main Strengths</p>
                                        <ul className="text-charcoal/65 mt-1 space-y-0.5">
                                            {rec.strengths.map((s) => <li key={s}>+ {s}</li>)}
                                        </ul>
                                    </div>
                                    <div className="mt-2 text-xs">
                                        <p className="font-semibold text-charcoal">Main Trade-offs</p>
                                        <ul className="text-charcoal/50 mt-1 space-y-0.5">
                                            {rec.tradeoffs.map((s) => <li key={s}>− {s}</li>)}
                                        </ul>
                                    </div>
                                    <p className="text-[10.5px] text-charcoal/45 mt-2">{rec.confidenceReason}</p>

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
                                                <td className="py-2 pr-4">{config.aiEvaluation?.decision}</td>
                                                <td className="py-2">{actions[rec.configurationId] ?? rec.nextAction}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => markRecommendationReady(id)}
                            className="rounded-xl bg-green hover:bg-green/90 text-white font-semibold px-5 py-3 text-sm transition"
                        >
                            Mark Recommendation Ready
                        </button>
                    </div>

                    <Card className="mt-6">
                        <CardHeader title="Why MCDM?" />
                        <p className="text-xs text-charcoal/65 leading-relaxed">
                            The product concept space contains multiple alternatives evaluated across competing criteria.
                            A transparent multi-criteria decision rule is therefore used for prototype screening.
                        </p>
                        <p className="text-[11px] text-charcoal/50 mt-2">
                            <span className="font-semibold text-charcoal/70">Prototype method: </span>Weighted Sum Model.{' '}
                            <span className="font-semibold text-charcoal/70">Future research: </span>AHP, data-driven weighting, or TOPSIS comparison.
                        </p>
                    </Card>
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
