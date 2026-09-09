'use client';

import { Card } from '@/components/Card';
import { useStore } from '@/lib/store';

export default function ProductsPage() {
    const { experiments } = useStore();
    const products = Array.from(new Map(experiments.map((e) => [e.productName, e])).values());

    return (
        <div className="max-w-5xl">
            <h1 className="text-2xl font-bold text-navy tracking-tight mb-1">Products</h1>
            <p className="text-sm text-charcoal/60 mb-6">Base products used across experiments.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                    <Card key={p.productName}>
                        <div className="h-24 rounded-xl bg-gradient-to-b from-[#8B5E3C] to-[#5C3D26] mb-3" />
                        <p className="text-sm font-semibold text-charcoal">{p.productName}</p>
                        <p className="text-xs text-charcoal/55 mt-0.5">{p.category} · {p.msme}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
