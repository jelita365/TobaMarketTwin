import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from 'recharts';
import { topShortlist } from '../data.js';

const chartData = topShortlist.map((v) => ({
    name: v.id,
    'AI Prediction': v.aiAcceptance,
    'Real Human Score': v.humanAcceptance,
}));

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-lg rounded-lg border border-gray-200 px-3 py-2 text-xs space-y-0.5">
                <p className="font-bold text-[#333333] mb-1">{label}</p>
                {payload.map((p) => (
                    <p key={p.dataKey} style={{ color: p.color }}>{p.dataKey}: <span className="font-semibold">{p.value.toFixed(2)}</span></p>
                ))}
            </div>
        );
    }
    return null;
}

export default function Screen4Calibration() {
    return (
        <div className="max-w-6xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#333333]">Human Calibration &amp; Ground Truth</h1>
                    <p className="text-sm text-[#666666] mt-1">Membandingkan prediksi AI Customer Twin dengan hasil uji pelanggan nyata.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-forest/10 text-forest px-4 py-2 text-xs font-bold">
                    <span className="h-2 w-2 rounded-full bg-forest" />
                    System Calibrated &mdash; Confidence Level: 92%
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                    <p className="text-sm font-semibold text-[#333333] mb-4">AI Prediction vs Real Human Score</p>
                    <ResponsiveContainer width="100%" height={380}>
                        <BarChart data={chartData} barGap={8}>
                            <CartesianGrid stroke="#F0F0F0" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#666666', fontSize: 12 }} />
                            <YAxis domain={[0, 5]} tick={{ fill: '#666666', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="AI Prediction" fill="#3D8B99" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Real Human Score" fill="#1B3A5C" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-sm font-semibold text-[#333333] mb-3">Data Metrics</p>
                        <div className="rounded-xl bg-lake/5 border border-lake/20 p-4 text-center mb-3">
                            <p className="text-3xl font-extrabold text-lake">0.15</p>
                            <p className="text-xs text-[#666666] font-medium mt-1">Mean Absolute Error (MAE)</p>
                        </div>
                        <div className="rounded-xl bg-forest/5 border border-forest/20 p-4 text-center">
                            <p className="text-3xl font-extrabold text-forest">92%</p>
                            <p className="text-xs text-[#666666] font-medium mt-1">Prediction Accuracy</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-sm font-semibold text-[#333333] mb-2">Conclusion</p>
                        <p className="text-xs text-[#666666] leading-relaxed">
                            Simulation matches real customer behavior with <span className="font-semibold text-forest">92% accuracy</span>.
                            The algorithm is calibrated. Safe to proceed with production for <span className="font-semibold text-gorga">V2</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
