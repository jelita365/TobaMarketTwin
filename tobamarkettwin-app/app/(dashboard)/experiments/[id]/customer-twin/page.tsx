'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { ScoreBar } from '@/components/ScoreBar';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';
import { PERSONAS } from '@/data/personas';

export default function CustomerTwinPage({ params }: PageProps<'/experiments/[id]/customer-twin'>) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { getExperiment, getConfigurations } = useStore();
    const experiment = getExperiment(id);

    if (!experiment) return notFound();

    const configs = getConfigurations(id);
    const screened = configs.filter((c) => c.aiEvaluation);
    const selectedId = searchParams.get('config') ?? screened[0]?.id;
    const config = configs.find((c) => c.id === selectedId);
    const persona = PERSONAS[1]; // Sustainable Traveler as the default demo persona

    return (
        <div className="max-w-6xl">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Customer Twin Screening</h1>
                    <p className="text-sm text-charcoal/60 mt-1">{experiment.name}</p>
                </div>
                <DemoLabel kind="illustrative">Simulated Customer Twin — Demo Data</DemoLabel>
            </div>

            {screened.length === 0 ? (
                <Card className="text-center py-14">
                    <p className="text-sm text-charcoal/60">No screened configurations yet.</p>
                    <p className="text-xs text-charcoal/45 mt-1">Run Customer Twin Screening from the Configurations page first.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 h-fit">
                        <CardHeader title="Customer Twin Profile" subtitle={persona.name} />
                        <DemoLabel kind="illustrative" className="mb-3">Illustrative Persona — Prototype</DemoLabel>
                        <p className="text-xs text-charcoal/65 leading-relaxed mb-3">{persona.description}</p>
                        <p className="text-[10.5px] text-charcoal/45 leading-relaxed mb-3">
                            Illustrative persona — final segments require primary customer research.
                        </p>
                        <dl className="space-y-3 text-xs">
                            <div>
                                <dt className="text-charcoal/45 mb-1">Age</dt>
                                <dd className="font-medium">{persona.ageRange}</dd>
                            </div>
                            <div>
                                <dt className="text-charcoal/45 mb-1">Travel Behavior</dt>
                                <dd className="font-medium">{persona.travelBehavior}</dd>
                            </div>
                            <div>
                                <dt className="text-charcoal/45 mb-1">Priorities</dt>
                                <dd className="flex flex-wrap gap-1 mt-1">
                                    {persona.priorities.map((p) => (
                                        <span key={p} className="rounded-full bg-green/10 text-green px-2 py-0.5">{p}</span>
                                    ))}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-charcoal/45 mb-1">Concerns</dt>
                                <dd className="flex flex-wrap gap-1 mt-1">
                                    {persona.concerns.map((p) => (
                                        <span key={p} className="rounded-full bg-gold/15 text-[#8a6412] px-2 py-0.5">{p}</span>
                                    ))}
                                </dd>
                            </div>
                        </dl>
                    </Card>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader
                                title={`Evaluating ${config?.id}`}
                                subtitle={config ? `${config.material} · ${config.design} · ${formatRupiah(config.price)}` : undefined}
                                action={
                                    <select
                                        value={selectedId}
                                        onChange={(e) => router.push(`/experiments/${id}/customer-twin?config=${e.target.value}`)}
                                        className="text-xs rounded-lg border border-black/10 px-2 py-1.5"
                                    >
                                        {screened.map((c) => (
                                            <option key={c.id} value={c.id}>{c.id}</option>
                                        ))}
                                    </select>
                                }
                            />

                            {config?.aiEvaluation && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                        <ScoreBar label="Purchase Intention" value={config.aiEvaluation.purchaseIntention} />
                                        <ScoreBar label="Packaging Attractiveness" value={config.aiEvaluation.packagingAttractiveness} />
                                        <ScoreBar label="Price Acceptance" value={config.aiEvaluation.priceAcceptance} />
                                        <ScoreBar label="Cultural Authenticity" value={config.aiEvaluation.culturalAuthenticity} />
                                        <ScoreBar label="Perceived Sustainability" value={config.aiEvaluation.perceivedSustainability} />
                                        <ScoreBar label="Customer Acceptance" value={config.aiEvaluation.customerAcceptance} />
                                    </div>
                                    <p className="text-[10.5px] text-charcoal/40 -mt-3 mb-4">
                                        Customer Acceptance = (Purchase Intention + Packaging Attractiveness + Price Acceptance + Cultural Authenticity) / 4. Perceived Sustainability is tracked separately to avoid double-counting against the Sustainability Index.
                                    </p>

                                    <div className="flex items-center gap-2 mb-4">
                                        <DecisionBadge decision={config.aiEvaluation.decision} />
                                        <span className="text-[11px] text-charcoal/50">
                                            Evidence Sufficiency: <span className="font-semibold">{config.aiEvaluation.evidenceSufficiency}</span>
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <p><span className="font-semibold text-charcoal">Reason: </span><span className="text-charcoal/65">{config.aiEvaluation.rationale}</span></p>
                                        <p><span className="font-semibold text-charcoal">Concern: </span><span className="text-charcoal/65">{config.aiEvaluation.concern}</span></p>
                                        <p><span className="font-semibold text-charcoal">Main Uncertainty: </span><span className="text-charcoal/65">{config.aiEvaluation.mainUncertainty}</span></p>
                                    </div>
                                </>
                            )}
                        </Card>

                        {config?.aiEvaluation && (
                            <Card>
                                <CardHeader title="Evidence Layer" subtitle="What this evaluation is and isn't grounded in" />
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mb-4">
                                    <EvidenceTag label="Persona information" />
                                    <EvidenceTag label="Product attributes" />
                                    <EvidenceTag label="Sustainable packaging literature" />
                                    <EvidenceTag label="User-provided product evidence" />
                                </div>
                                <div className="flex items-center justify-between text-xs rounded-lg bg-gold/10 px-3 py-2">
                                    <span className="text-charcoal/60">Evidence Sufficiency</span>
                                    <span className="font-bold text-[#8a6412]">{config.aiEvaluation.evidenceSufficiency}</span>
                                </div>
                                <p className="text-[11px] text-charcoal/50 mt-2">
                                    <span className="font-semibold text-charcoal/70">Main Uncertainty: </span>{config.aiEvaluation.mainUncertainty}
                                </p>
                            </Card>
                        )}

                        <Card>
                            <CardHeader title="Customer Twin Architecture" subtitle="Simplified conceptual pipeline" />
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-charcoal/60">
                                {['Customer Evidence', 'Persona Profile', 'Structured Evaluation Prompt', 'Simulated Customer Twin', 'Configuration Evaluation', 'Score + Rationale', 'Human Calibration'].map((step, i, arr) => (
                                    <span key={step} className="flex items-center gap-2">
                                        <span className="rounded-lg bg-black/[0.04] px-2.5 py-1.5">{step}</span>
                                        {i < arr.length - 1 && <span className="text-charcoal/25">→</span>}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

function EvidenceTag({ label }: { label: string }) {
    return <span className="rounded-lg bg-teal/10 text-teal px-2 py-1.5 text-center">{label}</span>;
}

function DecisionBadge({ decision }: { decision: 'BUY' | 'CONSIDER' | 'REJECT' }) {
    const styles = {
        BUY: 'bg-green/15 text-green',
        CONSIDER: 'bg-gold/15 text-[#8a6412]',
        REJECT: 'bg-red-100 text-red-700',
    };
    return <span className={`text-xs font-bold rounded-full px-3 py-1 ${styles[decision]}`}>{decision}</span>;
}
