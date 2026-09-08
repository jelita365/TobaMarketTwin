import React from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip,
} from 'recharts';
import { dummyVariants } from '../data.js';

const v2 = dummyVariants.find((v) => v.id === 'V2');

const radarData = [
    { metric: 'Purchase Intent', value: v2.aiScores.purchase },
    { metric: 'Price Acceptance', value: v2.aiScores.priceAcc },
    { metric: 'Packaging Appeal', value: v2.aiScores.packaging },
    { metric: 'Cultural Fit', value: v2.aiScores.culture },
    { metric: 'Eco Perception', value: v2.aiScores.eco },
];

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-lg rounded-lg border border-gray-200 px-3 py-2 text-xs">
                <p className="font-semibold text-[#333333]">{payload[0].payload.metric}</p>
                <p className="text-lake font-bold">{payload[0].value.toFixed(1)} / 5.0</p>
            </div>
        );
    }
    return null;
}

export default function Screen2Simulation() {
    return (
        <div className="max-w-6xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333]">
                    Evaluating Variant V2: Recycled Paper + Gorga + Rp45k
                </h1>
                <p className="text-sm text-[#666666] mt-1">
                    Target Persona: <span className="font-semibold text-gorga">Eco-Cultural Traveler</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Center Visual: Radar chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                    <p className="text-sm font-semibold text-[#333333] mb-4">AI Customer Twin &mdash; Score Breakdown</p>
                    <ResponsiveContainer width="100%" height={380}>
                        <RadarChart data={radarData} outerRadius="75%">
                            <PolarGrid stroke="#E5E7EB" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: '#666666', fontSize: 12 }} />
                            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#999', fontSize: 10 }} />
                            <Radar
                                name="V2"
                                dataKey="value"
                                stroke="#C97B4A"
                                strokeWidth={2}
                                fill="#3D8B99"
                                fillOpacity={0.45}
                            />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-5 gap-2 mt-4">
                        {radarData.map((d) => (
                            <div key={d.metric} className="text-center rounded-lg bg-gray-50 py-2">
                                <p className="text-lake font-bold text-sm">{d.value.toFixed(1)}</p>
                                <p className="text-[10px] text-[#666666] leading-tight mt-1">{d.metric}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Side panel: Sustainability engine */}
                <div className="space-y-6">
                    <div className="rounded-2xl p-6 border border-white/40 bg-white/60 backdrop-blur-md shadow-lg">
                        <p className="text-sm font-semibold text-[#333333] mb-3">Sustainability Engine</p>
                        <div className="rounded-xl bg-forest/5 border border-forest/10 p-4 text-xs font-mono text-[#333333] leading-relaxed">
                            Sustainability Score =<br />
                            (Recycled Content &times; 0.4) +<br />
                            (Local Material &times; 0.3) +<br />
                            (Carbon Footprint &times; 0.3)<br />
                            <span className="text-forest font-bold">= 88 / 100</span>
                        </div>

                        <div className="mt-5">
                            <div className="flex justify-between text-xs text-[#666666] mb-1">
                                <span>Sustainability Score</span>
                                <span className="font-semibold text-forest">88%</span>
                            </div>
                            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                                <div className="h-full rounded-full bg-forest transition-all" style={{ width: '88%' }} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-sm font-semibold text-[#333333] mb-3">Variant Summary</p>
                        <dl className="space-y-2 text-xs">
                            <div className="flex justify-between"><dt className="text-[#666666]">Material</dt><dd className="font-medium">{v2.material}</dd></div>
                            <div className="flex justify-between"><dt className="text-[#666666]">Design</dt><dd className="font-medium">{v2.design}</dd></div>
                            <div className="flex justify-between"><dt className="text-[#666666]">Price</dt><dd className="font-medium">{v2.price}</dd></div>
                            <div className="flex justify-between"><dt className="text-[#666666]">Story</dt><dd className="font-medium">{v2.story}</dd></div>
                            <div className="flex justify-between pt-2 border-t border-gray-100">
                                <dt className="text-[#666666]">AI Acceptance</dt>
                                <dd className="font-bold text-lake">{v2.aiAcceptance.toFixed(2)} / 5.0</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
