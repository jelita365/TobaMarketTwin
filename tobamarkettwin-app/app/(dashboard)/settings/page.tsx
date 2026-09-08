'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { useStore } from '@/lib/store';
import { RecommendationWeights } from '@/types';

const LABELS: Record<keyof RecommendationWeights, string> = {
    customerAcceptance: 'Customer Acceptance',
    sustainability: 'Sustainability',
    calibrationConfidence: 'Calibration Confidence',
    priceAcceptance: 'Price Acceptance',
};

export default function SettingsPage() {
    const { weights, updateWeights } = useStore();
    const [local, setLocal] = useState(weights);

    const total = Object.values(local).reduce((a, b) => a + b, 0);

    const handleChange = (key: keyof RecommendationWeights, value: number) => {
        setLocal((prev) => ({ ...prev, [key]: value / 100 }));
    };

    const handleSave = () => updateWeights(local);
    const handleReset = () => {
        const defaults: RecommendationWeights = {
            customerAcceptance: 0.4,
            sustainability: 0.3,
            calibrationConfidence: 0.2,
            priceAcceptance: 0.1,
        };
        setLocal(defaults);
        updateWeights(defaults);
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-navy tracking-tight mb-1">Settings</h1>
            <p className="text-sm text-charcoal/60 mb-6">Configure the prototype decision rule used by the Recommendation engine.</p>

            <Card>
                <CardHeader
                    title="Recommendation Weights"
                    subtitle="The weighting can be changed according to MSME priorities and validated research design."
                    action={<DemoLabel kind="demo">Prototype decision rule</DemoLabel>}
                />

                <div className="space-y-5">
                    {(Object.keys(LABELS) as (keyof RecommendationWeights)[]).map((key) => (
                        <div key={key}>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="font-semibold text-charcoal">{LABELS[key]}</span>
                                <span className="font-bold text-navy">{Math.round(local[key] * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={Math.round(local[key] * 100)}
                                onChange={(e) => handleChange(key, Number(e.target.value))}
                                className="w-full accent-[#176B87]"
                            />
                        </div>
                    ))}
                </div>

                <div className={`mt-4 text-xs rounded-lg px-3 py-2 ${Math.round(total * 100) === 100 ? 'bg-green/10 text-green' : 'bg-gold/15 text-[#8a6412]'}`}>
                    Total: {Math.round(total * 100)}% {Math.round(total * 100) !== 100 && '(should sum to 100%)'}
                </div>

                <div className="flex items-center gap-2 mt-5">
                    <button onClick={handleSave} className="rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold px-4 py-2.5 text-sm transition">
                        Save Weights
                    </button>
                    <button onClick={handleReset} className="rounded-xl border border-black/10 text-charcoal/70 font-semibold px-4 py-2.5 text-sm hover:border-black/20 transition">
                        Reset to Default
                    </button>
                </div>
            </Card>
        </div>
    );
}
