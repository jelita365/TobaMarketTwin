'use client';

import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useStore } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';
import { Decision, HumanEvaluation } from '@/types';
import { Logo } from '@/components/Logo';

const SCALE_QUESTIONS: { key: keyof Pick<HumanEvaluation, 'purchaseIntention' | 'packagingAttractiveness' | 'priceAcceptance' | 'culturalAuthenticity' | 'perceivedSustainability'>; label: string; lowLabel: string; highLabel: string }[] = [
    { key: 'purchaseIntention', label: 'How likely are you to buy this product?', lowLabel: 'Very unlikely', highLabel: 'Very likely' },
    { key: 'packagingAttractiveness', label: 'How attractive is the packaging?', lowLabel: 'Not attractive', highLabel: 'Very attractive' },
    { key: 'priceAcceptance', label: 'Is the price acceptable?', lowLabel: 'Not acceptable', highLabel: 'Very acceptable' },
    { key: 'culturalAuthenticity', label: 'Does the design feel culturally authentic?', lowLabel: 'Not authentic', highLabel: 'Very authentic' },
    { key: 'perceivedSustainability', label: 'Does the packaging appear environmentally responsible?', lowLabel: 'Not at all', highLabel: 'Very much' },
];

export default function CustomerEvaluationPage({ params }: PageProps<'/customer-evaluation/[experimentId]'>) {
    const { experimentId } = use(params);
    const searchParams = useSearchParams();
    const { getExperiment, getConfigurations, submitHumanEvaluation } = useStore();
    const experiment = getExperiment(experimentId);

    const [scores, setScores] = useState<Record<string, number>>({});
    const [decision, setDecision] = useState<Decision | null>(null);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!experiment) return notFound();

    const configs = getConfigurations(experimentId);
    const configId = searchParams.get('config') ?? configs.find((c) => c.status === 'Shortlisted')?.id;
    const config = configs.find((c) => c.id === configId);

    if (!config) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-offwhite px-6 text-center">
                <p className="text-sm text-charcoal/60">No configuration selected for evaluation.</p>
            </div>
        );
    }

    const allAnswered = SCALE_QUESTIONS.every((q) => scores[q.key] != null) && decision != null;

    const handleSubmit = () => {
        if (!allAnswered || !decision) return;
        const respondentNumber = Math.floor(Math.random() * 900) + 100;
        const evaluation: HumanEvaluation = {
            id: `${config.id}-manual-${Date.now()}`,
            configurationId: config.id,
            respondentId: `R${respondentNumber}`,
            segment: 'Domestic Tourist',
            ageGroup: '25-34',
            travelType: 'Leisure',
            purchaseIntention: scores.purchaseIntention,
            packagingAttractiveness: scores.packagingAttractiveness,
            priceAcceptance: scores.priceAcceptance,
            culturalAuthenticity: scores.culturalAuthenticity,
            perceivedSustainability: scores.perceivedSustainability,
            decision,
            comment: comment || undefined,
        };
        submitHumanEvaluation(experimentId, config.id, evaluation);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-offwhite px-6">
                <div className="max-w-sm text-center">
                    <p className="text-lg font-bold text-navy mb-2">Terima kasih!</p>
                    <p className="text-sm text-charcoal/60">Evaluasi Anda telah tersimpan sebagai bagian dari data validasi ilustratif prototype ini.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-offwhite">
            <header className="bg-navy px-6 py-4">
                <Logo compact />
            </header>

            <div className="max-w-lg mx-auto px-6 py-10">
                <h1 className="text-xl font-bold text-navy mb-1">Product Evaluation</h1>
                <p className="text-sm text-charcoal/60 mb-6">{experiment.productName}</p>

                <div className="rounded-2xl border border-black/[0.06] bg-white p-5 mb-6">
                    <div className="h-28 w-full rounded-xl bg-gradient-to-b from-[#8B5E3C] to-[#5C3D26] mb-4 flex items-center justify-center">
                        <p className="text-white/90 text-xs font-semibold">{config.design}</p>
                    </div>
                    <p className="text-sm font-semibold text-charcoal">{config.material}</p>
                    <p className="text-xs text-charcoal/60 mt-0.5">{config.design} · {formatRupiah(config.price)}</p>
                </div>

                <div className="space-y-6">
                    {SCALE_QUESTIONS.map((q, i) => (
                        <div key={q.key}>
                            <p className="text-sm font-semibold text-charcoal mb-2">{i + 1}. {q.label}</p>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setScores((s) => ({ ...s, [q.key]: n }))}
                                        className={`h-10 w-10 rounded-full text-sm font-semibold border transition ${
                                            scores[q.key] === n
                                                ? 'bg-lakeblue text-white border-lakeblue'
                                                : 'border-black/10 text-charcoal/60 hover:border-lakeblue/40'
                                        }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-charcoal/40 mt-1">
                                <span>{q.lowLabel}</span>
                                <span>{q.highLabel}</span>
                            </div>
                        </div>
                    ))}

                    <div>
                        <p className="text-sm font-semibold text-charcoal mb-2">6. Overall, would you consider buying this product?</p>
                        <div className="flex gap-2">
                            {(['BUY', 'CONSIDER', 'REJECT'] as Decision[]).map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setDecision(d)}
                                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                                        decision === d
                                            ? 'bg-navy text-white border-navy'
                                            : 'border-black/10 text-charcoal/60 hover:border-navy/40'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-charcoal mb-2">What is the main reason for your decision? (optional)</p>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm min-h-[80px] outline-none focus:border-lakeblue"
                            placeholder="Tulis alasan singkat Anda..."
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className="w-full rounded-xl bg-navy hover:bg-navy/90 disabled:opacity-40 text-white font-semibold py-3 text-sm transition"
                    >
                        Submit Evaluation
                    </button>
                </div>
            </div>
        </div>
    );
}
