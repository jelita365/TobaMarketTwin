'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/shared/ui/Card';
import { useStore } from '@/core/store';
import { Experiment } from '@/shared/domain';

const DEFAULT_OPTIONS = {
    materials: ['Recycled Kraft Paper', 'Bamboo Fiber', 'Laminated Plastic'],
    designs: ['Lake Toba Minimal', 'Batak Gorga', 'Modern Ulos'],
    prices: [45000, 50000, 55000],
    storytelling: ['Short Product Story', 'Cultural Story'],
    languages: ['Indonesian', 'Indonesian + English'],
};

export default function NewExperimentPage() {
    const router = useRouter();
    const { createExperiment } = useStore();

    const [name, setName] = useState('');
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('Food & Beverage');
    const [objective, setObjective] = useState('');

    const totalCombos =
        DEFAULT_OPTIONS.materials.length *
        DEFAULT_OPTIONS.designs.length *
        DEFAULT_OPTIONS.prices.length *
        DEFAULT_OPTIONS.storytelling.length *
        DEFAULT_OPTIONS.languages.length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !productName.trim()) return;

        const id = `exp-${slugify(name)}-${Date.now().toString(36)}`;
        const experiment: Experiment = {
            id,
            name,
            productName,
            category,
            msme: 'Demo UMKM Toba',
            targetSegments: ['Domestic tourists', 'Sustainability-conscious consumers'],
            objective: objective || 'Identify packaging concepts that balance perceived sustainability and customer acceptance.',
            status: 'Draft',
            options: DEFAULT_OPTIONS,
            totalConfigurations: totalCombos,
            shortlistedConfigurations: 0,
            humanResponses: 0,
            createdAt: new Date().toISOString().slice(0, 10),
        };

        createExperiment(experiment);
        router.push(`/experiments/${id}`);
    };

    return (
        <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-navy tracking-tight mb-1">Create Product Experiment</h1>
            <p className="text-sm text-charcoal/60 mb-6">
                Define the product concept. Configuration options default to the demo scenario and can be edited on the next step.
            </p>

            <Card>
                <CardHeader title="Product Concept" subtitle="Basic experiment information" />
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <Field label="Experiment Name">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Packaging Kopi Arabika Toba"
                            className="input"
                            required
                        />
                    </Field>
                    <Field label="Product Name">
                        <input
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Arabika Toba 250g"
                            className="input"
                            required
                        />
                    </Field>
                    <Field label="Product Category">
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                            <option>Food & Beverage</option>
                            <option>Handicraft & Gift</option>
                            <option>Personal Care</option>
                        </select>
                    </Field>
                    <Field label="Experiment Objective">
                        <textarea
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            placeholder="Identify packaging concepts that balance perceived sustainability and customer acceptance."
                            className="input min-h-[80px]"
                        />
                    </Field>

                    <div className="rounded-xl bg-sage/40 border border-navy/10 px-4 py-3 text-xs text-charcoal/70">
                        Default configuration options (material × design × price × storytelling × language) will generate{' '}
                        <span className="font-bold text-navy">{totalCombos} configurations</span>. You can adjust options after creating the experiment.
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold py-3 text-sm transition"
                    >
                        Create Experiment
                    </button>
                </form>
            </Card>

            <style jsx global>{`
                .input {
                    width: 100%;
                    border-radius: 0.75rem;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    padding: 0.625rem 0.875rem;
                    font-size: 0.875rem;
                    outline: none;
                    background: white;
                }
                .input:focus {
                    border-color: #176b87;
                    box-shadow: 0 0 0 2px rgba(23, 107, 135, 0.15);
                }
            `}</style>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-charcoal mb-1.5 block">{label}</span>
            {children}
        </label>
    );
}

function slugify(str: string) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
