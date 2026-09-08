import React from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceArea, Cell,
} from 'recharts';
import { dummyVariants, isInSweetSpot, topShortlist } from '../data.js';

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="bg-white shadow-lg rounded-lg border border-gray-200 px-3 py-2 text-xs space-y-0.5">
                <p className="font-bold text-[#333333]">{d.id} &mdash; {d.material}</p>
                <p className="text-[#666666]">{d.design} &middot; {d.price}</p>
                <p>Sustainability: <span className="font-semibold text-forest">{d.sustainabilityScore}</span></p>
                <p>Acceptance: <span className="font-semibold text-lake">{d.humanAcceptance.toFixed(2)}</span></p>
            </div>
        );
    }
    return null;
}

export default function Screen3SweetSpot({ goTo }) {
    const points = dummyVariants.map((v) => ({
        ...v,
        x: v.sustainabilityScore,
        y: v.humanAcceptance,
        inZone: isInSweetSpot(v),
    }));

    return (
        <div className="max-w-7xl">
            <h1 className="text-2xl font-bold text-[#333333] mb-1">Green Acceptance Sweet Spot</h1>
            <p className="text-sm text-[#666666] mb-6">Memetakan seluruh varian berdasarkan skor keberlanjutan vs penerimaan pelanggan.</p>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-200 p-6">
                    <ResponsiveContainer width="100%" height={480}>
                        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                            <CartesianGrid stroke="#F0F0F0" />
                            <XAxis
                                type="number" dataKey="x" name="Sustainability Score"
                                domain={[0, 100]} tick={{ fill: '#666666', fontSize: 11 }}
                                label={{ value: 'Sustainability Score', position: 'insideBottom', offset: -10, fill: '#666666', fontSize: 12 }}
                            />
                            <YAxis
                                type="number" dataKey="y" name="Customer Acceptance"
                                domain={[1, 5]} tick={{ fill: '#666666', fontSize: 11 }}
                                label={{ value: 'Customer Acceptance', angle: -90, position: 'insideLeft', fill: '#666666', fontSize: 12 }}
                            />
                            <ZAxis range={[80, 220]} />
                            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                            <ReferenceArea
                                x1={80} x2={100} y1={4.0} y2={5.0}
                                fill="rgba(27, 58, 92, 0.15)"
                                stroke="#1B3A5C"
                                strokeOpacity={0.4}
                                label={{
                                    value: 'GREEN ACCEPTANCE SWEET SPOT',
                                    position: 'center',
                                    fill: '#1B3A5C',
                                    fontSize: 11,
                                    fontWeight: 700,
                                }}
                            />

                            <Scatter data={points} shape={(props) => <Dot {...props} />} />
                        </ScatterChart>
                    </ResponsiveContainer>

                    <div className="flex items-center gap-6 mt-2 text-xs text-[#666666]">
                        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-forest" /> In Sweet Spot</span>
                        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-lake/70" /> Other Variants</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">
                    <p className="text-sm font-semibold text-[#333333] mb-4">Top 3 Shortlist</p>
                    <div className="space-y-3">
                        {topShortlist.map((v) => (
                            <div key={v.id} className="rounded-xl border border-gray-200 p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-sm text-[#333333]">{v.id}</span>
                                    <span className="text-[10px] font-semibold text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                                        {v.sustainabilityScore} pts
                                    </span>
                                </div>
                                <p className="text-xs text-[#666666]">{v.material} &middot; {v.design}</p>
                                <p className="text-xs text-[#666666]">{v.price}</p>
                                <div className="flex justify-between mt-2 text-xs">
                                    <span className="text-lake font-medium">AI: {v.aiAcceptance.toFixed(2)}</span>
                                    <span className="text-forest font-medium">Human: {v.humanAcceptance.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => goTo(4)}
                        className="w-full mt-4 rounded-xl bg-gorga hover:bg-gorga/90 text-white font-semibold py-2.5 text-sm transition"
                    >
                        Send to Real Customers for Validation
                    </button>
                </div>
            </div>
        </div>
    );
}

function Dot({ cx, cy, payload }) {
    const inZone = payload.inZone;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={inZone ? 8 : 5}
            fill={inZone ? '#1B3A5C' : 'rgba(61, 139, 153, 0.7)'}
            stroke={inZone ? '#C97B4A' : 'none'}
            strokeWidth={inZone ? 2 : 0}
            style={inZone ? { filter: 'drop-shadow(0 0 6px rgba(27,58,92,0.6))' } : undefined}
        />
    );
}
