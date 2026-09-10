'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { useStore } from '@/core/store';

export default function ExperimentsPage() {
    const { experiments } = useStore();

    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Experiments</h1>
                    <p className="text-sm text-charcoal/60 mt-1">All product concept experiments for this MSME.</p>
                </div>
                <Link
                    href="/experiments/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-navy text-white px-4 py-2.5 text-sm font-semibold hover:bg-navy/90 transition"
                >
                    <Plus size={16} /> New Experiment
                </Link>
            </div>

            <div className="space-y-3">
                {experiments.map((exp) => (
                    <Link key={exp.id} href={`/experiments/${exp.id}`}>
                        <Card className="hover:border-lakeblue/40 transition">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-charcoal">{exp.name}</p>
                                    <p className="text-xs text-charcoal/50 mt-1">
                                        {exp.productName} · {exp.category} · {exp.msme}
                                    </p>
                                </div>
                                <StatusBadge status={exp.status} />
                            </div>
                            <div className="flex items-center gap-6 mt-4 text-xs text-charcoal/55">
                                <span>{exp.totalConfigurations} configurations</span>
                                <span>{exp.shortlistedConfigurations} shortlisted</span>
                                <span>{exp.humanResponses} human evaluations</span>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
