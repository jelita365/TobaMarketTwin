'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { calculateCalibration } from '@/lib/calibration';
import { MIN_RESPONSES_FOR_CALIBRATION } from '@/types';

export default function CalibrationPage({ params }: PageProps<'/experiments/[id]/calibration'>) {
    const { id } = use(params);
    const { getExperiment, getConfigurations, getHumanEvaluations } = useStore();
    const experiment = getExperiment(id);

    if (!experiment) return notFound();

    const configs = getConfigurations(id).filter((c) => c.aiEvaluation);
    const entries = configs.map((c) => ({
        configurationId: c.id,
        aiEvaluation: c.aiEvaluation!,
        humanEvaluations: getHumanEvaluations(id, c.id),
    }));

    const results = calculateCalibration(entries);
    const eligibleCount = entries.filter((e) => e.humanEvaluations.length >= MIN_RESPONSES_FOR_CALIBRATION).length;

    const points = results.map((r) => {
        const config = configs.find((c) => c.id === r.configurationId)!;
        const humanAvg =
            config.humanScoreSummary != null ? ((config.humanScoreSummary.customerAcceptance / 100) * 4) + 1 : null;
        return {
            id: r.configurationId,
            aiScore: config.aiEvaluation!.customerAcceptance,
            humanScore: humanAvg,
            result: r,
        };
    }).filter((p) => p.humanScore != null) as { id: string; aiScore: number; humanScore: number; result: (typeof results)[number] }[];

    const avgSpearman = average(results.map((r) => r.spearmanRho));
    const avgMae = average(results.map((r) => r.mae));
    const avgAgreement = average(results.map((r) => r.decisionAgreement));
    const avgStability = average(results.map((r) => r.stability));

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Human Calibration</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        Compares Customer Twin prediction against real customer evaluation.
                    </p>
                </div>
                {results.length > 0 ? (
                    <DemoLabel kind="illustrative">Illustrative Calibration Simulation</DemoLabel>
                ) : (
                    <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/15 text-[#8a6412] px-2.5 py-0.5 text-[11px] font-medium">
                        PENDING
                    </span>
                )}
            </div>

            {results.length === 0 ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">Human calibration belum tersedia.</p>
                    <p className="text-xs text-charcoal/45 mt-2 max-w-md mx-auto leading-relaxed">
                        Minimal {MIN_RESPONSES_FOR_CALIBRATION} evaluasi per konfigurasi dan minimal 2 konfigurasi dengan data manusia
                        diperlukan untuk menjalankan kalkulasi kalibrasi. Saat ini {eligibleCount} konfigurasi memenuhi ambang batas.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <MetricCard label="Spearman ρ" value={avgSpearman.toFixed(2)} interpretation="Rank alignment across configurations" />
                        <MetricCard label="MAE" value={avgMae.toFixed(2)} interpretation="Average absolute score difference" />
                        <MetricCard label="Decision Agreement" value={`${Math.round(avgAgreement)}%`} interpretation="BUY/CONSIDER/REJECT agreement" />
                        <MetricCard label="Stability" value={avgStability.toFixed(2)} interpretation="1 − normalized MAE" />
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
                                                <p className="text-charcoal/50 mt-1">n = {p.result.respondentCount}</p>
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
                                <Row metric="Spearman ρ" value={avgSpearman.toFixed(2)} interp="Rank alignment across configurations" />
                                <Row metric="MAE" value={avgMae.toFixed(2)} interp="Average absolute score difference (1-5 scale)" />
                                <Row metric="Decision Agreement" value={`${Math.round(avgAgreement)}%`} interp="BUY/CONSIDER/REJECT agreement" />
                                <Row metric="Stability" value={avgStability.toFixed(2)} interp="1 − normalized MAE across illustrative responses" />
                            </tbody>
                        </table>
                        <p className="text-xs text-charcoal/50 mt-4 leading-relaxed">
                            These values demonstrate how the system would report calibration after real human validation data are collected.
                            Computed from {results.length} configuration(s) with ≥{MIN_RESPONSES_FOR_CALIBRATION} respondents each.
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
