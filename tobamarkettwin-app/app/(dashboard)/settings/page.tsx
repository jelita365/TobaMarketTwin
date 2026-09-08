'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { DEFAULT_WEIGHTS } from '@/lib/decision';
import { RecommendationWeights } from '@/types';

export default function SettingsPage() {
    const { weights, updateWeights } = useStore();
    const [local, setLocal] = useState<RecommendationWeights>(weights);

    const acceptancePct = Math.round(local.acceptanceWeight * 100);
    const sustainabilityPct = 100 - acceptancePct;

    const handleChange = (value: number) => {
        setLocal({ acceptanceWeight: value / 100, sustainabilityWeight: (100 - value) / 100 });
    };

    const handleSave = () => updateWeights(local);
    const handleReset = () => {
        setLocal(DEFAULT_WEIGHTS);
        updateWeights(DEFAULT_WEIGHTS);
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-navy tracking-tight mb-1">Settings</h1>
            <p className="text-sm text-charcoal/60 mb-6">Configure the Prototype Balanced Decision Rule used by the recommendation engine.</p>

            <Card>
                <CardHeader
                    title="Decision Rule Weights"
                    subtitle="The weighting can be changed according to MSME priorities and validated research design. Not scientifically optimal weighting."
                    action={<DemoLabel kind="demo">Prototype decision rule</DemoLabel>}
                />

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-charcoal">Customer Acceptance</span>
                        <span className="font-bold text-navy">{acceptancePct}%</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={acceptancePct}
                        onChange={(e) => handleChange(Number(e.target.value))}
                        className="w-full accent-[#176B87]"
                    />
                    <div className="flex items-center justify-between text-xs pt-3">
                        <span className="font-semibold text-charcoal">Sustainability</span>
                        <span className="font-bold text-green">{sustainabilityPct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/[0.06] overflow-hidden">
                        <div className="h-full bg-green" style={{ width: `${sustainabilityPct}%` }} />
                    </div>
                </div>

                <p className="text-[11px] text-charcoal/45 mt-4 leading-relaxed">
                    R_i = acceptanceWeight × CalibratedCustomerAcceptance_i + sustainabilityWeight × Sustainability_i.
                    Default is the Balanced scenario (50/50). See Sensitivity Analysis for how rankings shift under
                    Sustainability Priority (40/60) and Market Priority (60/40).
                </p>

                <div className="flex items-center gap-2 mt-5">
                    <button onClick={handleSave} className="rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold px-4 py-2.5 text-sm transition">
                        Save Weights
                    </button>
                    <button onClick={handleReset} className="rounded-xl border border-black/10 text-charcoal/70 font-semibold px-4 py-2.5 text-sm hover:border-black/20 transition">
                        Reset to Balanced (50/50)
                    </button>
                </div>
            </Card>
        </div>
    );
}
