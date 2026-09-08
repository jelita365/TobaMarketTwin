import React, { useMemo, useState } from 'react';

const MATERIALS = ['Kraft Paper', 'Recycled Paper', 'Bioplastic'];
const DESIGNS = ['Minimalis', 'Gorga Tradisional'];
const PRICES = ['Rp35k', 'Rp45k', 'Rp50k'];

function PriceInputs({ prices, onChange }) {
    const update = (idx, value) => {
        const next = [...prices];
        next[idx] = value;
        onChange(next);
    };

    return (
        <div>
            <p className="text-sm font-semibold text-[#333333] mb-2">Price</p>
            <div className="flex flex-wrap gap-2">
                {prices.map((price, idx) => (
                    <input
                        key={idx}
                        type="text"
                        value={price}
                        onChange={(e) => update(idx, e.target.value)}
                        className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lake focus:border-lake"
                    />
                ))}
            </div>
        </div>
    );
}

function CheckboxGroup({ title, options, selected, onToggle, color }) {
    return (
        <div>
            <p className="text-sm font-semibold text-[#333333] mb-2">{title}</p>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                    const isChecked = selected.includes(opt);
                    return (
                        <label
                            key={opt}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition
                                ${isChecked ? 'border-forest bg-forest/5 text-forest font-medium' : 'border-gray-200 text-[#666666] hover:border-gray-300'}`}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => onToggle(opt)}
                                className="rounded text-forest focus:ring-forest"
                            />
                            {opt}
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

export default function Screen1Setup({ goTo }) {
    const [name, setName] = useState('Eksperimen Kopi Toba Batch 1');
    const [materials, setMaterials] = useState([...MATERIALS]);
    const [designs, setDesigns] = useState([...DESIGNS]);
    const [prices, setPrices] = useState([...PRICES]); // 3 editable price slots
    const [loading, setLoading] = useState(false);

    const toggle = (list, setList, val) => {
        setList(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);
    };

    const combinations = useMemo(
        () => materials.length * designs.length * prices.length,
        [materials, designs, prices]
    );

    const handleRun = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            goTo(2);
        }, 2000);
    };

    return (
        <div className="max-w-6xl">
            <h1 className="text-2xl font-bold text-[#333333] mb-1">Product Setup &amp; Expansion</h1>
            <p className="text-sm text-[#666666] mb-6">Konfigurasikan varian produk untuk disimulasikan oleh AI Customer Twin.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: form */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-[#333333] mb-2 block">Experiment Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lake focus:border-lake"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-[#333333] mb-2">Product Image</p>
                        <div className="flex items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 p-4 bg-gray-50">
                            <div className="h-24 w-20 rounded-lg bg-gradient-to-b from-[#8B5E3C] to-[#5C3D26] flex items-center justify-center shadow-inner shrink-0">
                                <div className="h-16 w-14 rounded bg-[#F4A261]/90 flex items-center justify-center text-[10px] font-bold text-[#5C3D26] text-center leading-tight">
                                    Kopi<br />Arabika<br />Toba
                                </div>
                            </div>
                            <div className="text-xs text-[#666666]">
                                <p className="font-medium text-[#333333]">coffee-pouch-placeholder.png</p>
                                <p>Drag &amp; drop or click to replace mockup image</p>
                            </div>
                        </div>
                    </div>

                    <CheckboxGroup title="Material" options={MATERIALS} selected={materials} onToggle={(v) => toggle(materials, setMaterials, v)} />
                    <CheckboxGroup title="Design" options={DESIGNS} selected={designs} onToggle={(v) => toggle(designs, setDesigns, v)} />
                    <PriceInputs prices={prices} onChange={setPrices} />
                </div>

                {/* Right column: status */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-sm font-semibold text-[#333333] mb-3">Live Status</p>
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-forest mb-1">
                            <span>{materials.length}</span>
                            <span className="text-gray-300">&times;</span>
                            <span>{designs.length}</span>
                            <span className="text-gray-300">&times;</span>
                            <span>{prices.length}</span>
                        </div>
                        <p className="text-center text-[#666666] text-xs mb-4">material &times; design &times; price</p>
                        <div className="rounded-xl bg-forest/5 border border-forest/20 py-4 text-center">
                            <p className="text-3xl font-extrabold text-forest">{combinations}</p>
                            <p className="text-xs text-forest/80 font-medium mt-1">Total Combinations</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-sm font-semibold text-[#333333] mb-1">Case Study</p>
                        <p className="text-xs text-[#666666] mb-4">Kopi Arabika Toba (250g)</p>
                        <button
                            onClick={handleRun}
                            disabled={loading || combinations === 0}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-forest hover:bg-forest/90 disabled:opacity-60 text-white font-semibold py-3 text-sm transition"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-lake animate-spin" />
                                    Running Customer Twin...
                                </>
                            ) : (
                                'Run Customer Twin Simulation'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
