'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/shared/ui/Card';
import { DemoLabel } from '@/shared/ui/DemoLabel';
import { useStore } from '@/core/store';
import { totalCombinations } from '@/features/configurations';
import { formatRupiah } from '@/shared/lib';

export default function ConfigurationsPage({ params }: PageProps<'/experiments/[id]/configurations'>) {
    const { id } = use(params);
    const { getExperiment, getConfigurations, generateExperimentConfigurations, runCustomerTwinScreening } = useStore();
    const experiment = getExperiment(id);
    const [running, setRunning] = useState(false);

    if (!experiment) return notFound();

    const configs = getConfigurations(id);
    const expectedTotal = totalCombinations(experiment.options);

    const handleGenerate = () => generateExperimentConfigurations(id);

    const handleRunScreening = () => {
        setRunning(true);
        setTimeout(() => {
            runCustomerTwinScreening(id);
            setRunning(false);
        }, 1400);
    };

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Product Configurations</h1>
                    <p className="text-sm text-charcoal/60 mt-1">
                        Material × Design × Price × Storytelling × Language, generated programmatically.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {configs.length === 0 ? (
                        <button onClick={handleGenerate} className="btn-primary">
                            Generate {expectedTotal} Configurations
                        </button>
                    ) : (
                        <button onClick={handleRunScreening} disabled={running} className="btn-primary">
                            {running ? 'Running Customer Twin…' : 'Run Customer Twin Screening'}
                        </button>
                    )}
                </div>
            </div>

            {configs.length === 0 ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">No configurations yet.</p>
                    <p className="text-xs text-charcoal/45 mt-1">
                        Click &ldquo;Generate {expectedTotal} Configurations&rdquo; to build the combination matrix.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="flex items-center gap-2 mb-4">
                        <DemoLabel kind="illustrative">Simulated Customer Twin</DemoLabel>
                        <span className="text-xs text-charcoal/50">
                            {configs.length} configurations · {configs.filter((c) => c.status === 'Shortlisted').length} shortlisted
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {configs.map((c) => (
                            <Link
                                key={c.id}
                                href={`/experiments/${id}/customer-twin?config=${c.id}`}
                                className="rounded-xl border border-black/[0.06] bg-white p-4 hover:border-lakeblue/40 transition"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-bold text-navy">{c.id}</p>
                                    {c.status === 'Shortlisted' && (
                                        <span className="text-[10px] font-semibold text-[#8a6412] bg-gold/15 rounded-full px-2 py-0.5">
                                            Shortlisted
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-charcoal/65">{c.material}</p>
                                <p className="text-xs text-charcoal/65">{c.design} · {formatRupiah(c.price)}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {c.tags.map((tag) => (
                                        <span key={tag} className="text-[10px] rounded-full bg-sage/50 px-2 py-0.5 text-charcoal/70">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                {c.aiEvaluation && (
                                    <div className="mt-3 pt-3 border-t border-black/[0.05] flex items-center justify-between text-xs">
                                        <span className="text-charcoal/50">Customer Acceptance</span>
                                        <span className="font-bold text-teal">{c.aiEvaluation.customerAcceptance.toFixed(1)} / 5</span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </>
            )}

            <style jsx global>{`
                .btn-primary {
                    background: #0f2a44;
                    color: white;
                    font-weight: 600;
                    font-size: 0.875rem;
                    padding: 0.65rem 1.1rem;
                    border-radius: 0.75rem;
                    transition: background 0.15s;
                }
                .btn-primary:hover {
                    background: rgba(15, 42, 68, 0.9);
                }
                .btn-primary:disabled {
                    opacity: 0.6;
                }
            `}</style>
        </div>
    );
}
