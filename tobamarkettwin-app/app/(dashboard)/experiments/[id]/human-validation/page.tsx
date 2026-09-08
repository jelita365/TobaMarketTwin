'use client';

import { use, useRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';
import { parseHumanEvaluationCsv } from '@/lib/csv';

export default function HumanValidationPage({ params }: PageProps<'/experiments/[id]/human-validation'>) {
    const { id } = use(params);
    const { getExperiment, getConfigurations, getHumanEvaluations, seedHumanEvaluations, importHumanEvaluations } = useStore();
    const experiment = getExperiment(id);
    const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

    if (!experiment) return notFound();

    const configs = getConfigurations(id);
    const shortlisted = configs.filter((c) => c.status === 'Shortlisted' || c.status === 'Validated');

    const handleCsvUpload = (configId: string, file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = String(reader.result ?? '');
            const rows = parseHumanEvaluationCsv(text, configId);
            if (rows.length > 0) importHumanEvaluations(id, configId, rows);
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Human Validation</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        Independent real-customer evaluation, collected without exposure to Customer Twin scores.
                    </p>
                </div>
                <DemoLabel kind="illustrative">Illustrative Human Validation Data</DemoLabel>
            </div>

            {shortlisted.length === 0 ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">No shortlisted configurations yet.</p>
                    <p className="text-xs text-charcoal/45 mt-1">Run Customer Twin Screening first to produce a shortlist.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {shortlisted.map((c) => {
                        const evals = getHumanEvaluations(c.id);
                        return (
                            <Card key={c.id}>
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-sm font-bold text-navy">{c.id}</p>
                                        <p className="text-xs text-charcoal/60 mt-0.5">
                                            {c.material} · {c.design} · {formatRupiah(c.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {c.humanScoreSummary ? (
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-lakeblue">{c.humanScoreSummary.customerAcceptance}/100</p>
                                                <p className="text-[11px] text-charcoal/50">{c.humanScoreSummary.count} respondents · {c.humanScoreSummary.buyRate}% BUY</p>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-charcoal/45">Waiting for human validation</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                    <Link
                                        href={`/customer-evaluation/${id}?config=${c.id}`}
                                        className="text-xs font-semibold rounded-lg border border-lakeblue/30 text-lakeblue px-3 py-1.5 hover:bg-lakeblue/5 transition"
                                    >
                                        Open Customer Evaluation Form
                                    </Link>
                                    <button
                                        onClick={() => fileInputs.current[c.id]?.click()}
                                        className="text-xs font-semibold rounded-lg border border-navy/20 text-navy px-3 py-1.5 hover:bg-navy/5 transition"
                                    >
                                        Upload CSV
                                    </button>
                                    <input
                                        ref={(el) => { fileInputs.current[c.id] = el; }}
                                        type="file"
                                        accept=".csv,text/csv"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleCsvUpload(c.id, file);
                                            e.target.value = '';
                                        }}
                                    />
                                    {!c.humanScoreSummary && (
                                        <button
                                            onClick={() => seedHumanEvaluations(id, c.id, 24)}
                                            className="text-xs font-semibold rounded-lg bg-navy text-white px-3 py-1.5 hover:bg-navy/90 transition"
                                        >
                                            Simulate 24 Illustrative Respondents
                                        </button>
                                    )}
                                </div>

                                {!c.humanScoreSummary && (
                                    <p className="text-[11px] text-charcoal/45 mt-3">
                                        Human validation dataset belum tersedia. Upload a primary-data CSV or simulate illustrative respondents to preview the workflow.
                                    </p>
                                )}

                                {evals.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-black/[0.05] overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="text-charcoal/45 text-left">
                                                    <th className="pb-2 pr-4 font-medium">Respondent</th>
                                                    <th className="pb-2 pr-4 font-medium">Segment</th>
                                                    <th className="pb-2 pr-4 font-medium">Purchase</th>
                                                    <th className="pb-2 pr-4 font-medium">Decision</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {evals.slice(0, 5).map((e) => (
                                                    <tr key={e.id} className="border-t border-black/[0.04]">
                                                        <td className="py-1.5 pr-4">{e.respondentId}</td>
                                                        <td className="py-1.5 pr-4 text-charcoal/60">{e.segment}</td>
                                                        <td className="py-1.5 pr-4">{e.purchaseIntention}/5</td>
                                                        <td className="py-1.5 pr-4">
                                                            <DecisionPill decision={e.decision} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {evals.length > 5 && (
                                            <p className="text-[11px] text-charcoal/40 mt-2">+{evals.length - 5} more respondents</p>
                                        )}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function DecisionPill({ decision }: { decision: 'BUY' | 'CONSIDER' | 'REJECT' }) {
    const styles = {
        BUY: 'bg-green/15 text-green',
        CONSIDER: 'bg-gold/15 text-[#8a6412]',
        REJECT: 'bg-red-100 text-red-700',
    };
    return <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${styles[decision]}`}>{decision}</span>;
}
