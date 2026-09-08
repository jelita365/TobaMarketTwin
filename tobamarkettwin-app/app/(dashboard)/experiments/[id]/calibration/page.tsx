'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { calculateCalibration, MIN_RESPONSES_FOR_CALIBRATION } from '@/lib/calibration';

export default function CalibrationPage({ params }: PageProps<'/experiments/[id]/calibration'>) {
    const { id } = use(params);
    const { getExperiment, getConfigurations, getHumanEvaluations } = useStore();
    const experiment = getExperiment(id);

    if (!experiment) return notFound();

    const configs = getConfigurations(id).filter((c) => c.aiEvaluation && c.humanScoreSummary);

    const points = configs
        .map((c) => {
            const evals = getHumanEvaluations(c.id);
            const result = c.aiEvaluation && calculateCalibration(c.id, c.aiEvaluation, evals);
            if (!result || !c.humanScoreSummary) return null;
            return {
                id: c.id,
                aiScore: c.aiEvaluation!.overallAcceptance,
                humanScore: (c.humanScoreSummary.overallAcceptance / 100) * 5,
                result,
            };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);

    const avgSpearman = average(points.map((p) => p.result.spearmanRho));
    const avgMae = average(points.map((p) => p.result.mae));
    const avgAgreement = average(points.map((p) => p.result.decisionAgreement));
    const avgStability = average(points.map((p) => p.result.stability));

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Human Calibration</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        Compares Customer Twin prediction against real customer evaluation.
                    </p>
                </div>
                <DemoLabel kind="illustrative">Illustrative Calibration Simulation</DemoLabel>
            </div>

            {points.length === 0 ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">Human calibration belum tersedia.</p>
                    <p className="text-xs text-charcoal/45 mt-1">
                        Minimal {MIN_RESPONSES_FOR_CALIBRATION} evaluasi diperlukan per konfigurasi untuk menjalankan simulasi calibration.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <MetricCard label="Spearman ρ" value={avgSpearman.toFixed(2)} interpretation="High rank alignment" />
                        <MetricCard label="MAE" value={avgMae.toFixed(2)} interpretation="Low average error" />
                        <MetricCard label="Decision Agreement" value={`${Math.round(avgAgreement)}%`} interpretation="High decision consistency" />
                        <MetricCard label="Stability" value={avgStability.toFixed(2)} interpretation="Consistent across responses" />
                    </div>

                    <Card className="mb-6">
                        <CardHeader title="AI–Human Alignment" subtitle="Illustrative calibration simulation" />
                        <ResponsiveContainer width="100%" height={380}>
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" />
                                <XAxis
                                    type="number" dataKey="aiScore" name="Customer Twin Score" domain={[1, 5]}
                                    tick={{ fill: '#666', fontSize: 11 }}
                                    label={{ value: 'Customer Twin Score', position: 'insideBottom', offset: -10, fill: '#666', fontSize: 12 }}
                                />
                                <YAxis
                                    type="number" dataKey="humanScore" name="Human Evaluation Score" domain={[1, 5]}
                                    tick={{ fill: '#666', fontSize: 11 }}
                                    label={{ value: 'Human Evaluation Score', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 12 }}
                                />
                                <ReferenceLine segment={[{ x: 1, y: 1 }, { x: 5, y: 5 }]} stroke="#D9A441" strokeDasharray="4 4" />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null;
                                        const p = payload[0].payload;
                                        return (
                                            <div className="bg-white shadow-lg rounded-lg border border-black/10 px-3 py-2 text-xs">
                                                <p className="font-bold text-navy">{p.id}</p>
                                                <p>AI: {p.aiScore.toFixed(1)}</p>
                                                <p>Human: {p.humanScore.toFixed(1)}</p>
                                            </div>
                                        );
                                    }}
                                />
                                <Scatter data={points} fill="#176B87" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card>
                        <CardHeader title="Calibration Metrics" />
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-charcoal/45 text-xs">
                                    <th className="pb-2 font-medium">Metric</th>
                                    <th className="pb-2 font-medium">Value</th>
                                    <th className="pb-2 font-medium">Interpretation</th>
                                </tr>
                            </thead>
                            <tbody className="text-charcoal/75">
                                <Row metric="Spearman ρ" value={avgSpearman.toFixed(2)} interp="High rank alignment" />
                                <Row metric="MAE" value={avgMae.toFixed(2)} interp="Low average error" />
                                <Row metric="Decision Agreement" value={`${Math.round(avgAgreement)}%`} interp="High decision consistency" />
                                <Row metric="Stability" value={avgStability.toFixed(2)} interp="Stable across illustrative responses" />
                            </tbody>
                        </table>
                        <p className="text-xs text-charcoal/50 mt-4 leading-relaxed">
                            These values demonstrate how the system would report calibration after real human validation data are collected.
                        </p>
                    </Card>
                </>
            )}
        </div>
    );
}

function MetricCard({ label, value, interpretation }: { label: string; value: string; interpretation: string }) {
    return (
        <Card className="text-center">
            <p className="text-2xl font-extrabold text-navy">{value}</p>
            <p className="text-xs font-semibold text-charcoal/70 mt-1">{label}</p>
            <p className="text-[10.5px] text-charcoal/45 mt-0.5">{interpretation}</p>
        </Card>
    );
}

function Row({ metric, value, interp }: { metric: string; value: string; interp: string }) {
    return (
        <tr className="border-t border-black/[0.05]">
            <td className="py-2.5 font-medium text-charcoal">{metric}</td>
            <td className="py-2.5 font-bold text-navy">{value}</td>
            <td className="py-2.5 text-charcoal/60">{interp}</td>
        </tr>
    );
}

function average(arr: number[]) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}
