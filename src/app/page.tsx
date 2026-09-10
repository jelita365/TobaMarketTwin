import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/shared/ui/Logo';

export default function LandingPage() {
    return (
        <div className="min-h-screen wave-motif">
            <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="bg-navy rounded-xl px-3 py-2">
                    <Logo compact />
                </div>
                <Link
                    href="/dashboard"
                    className="text-sm font-medium text-navy hover:text-lakeblue transition"
                >
                    Open Demo →
                </Link>
            </header>

            <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
                <p className="text-xs font-semibold tracking-widest text-lakeblue uppercase mb-4">
                    Prototype for STEM Innovation Competition
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight tracking-tight">
                    From 108 product possibilities<br />to a focused shortlist.
                </h1>
                <p className="mt-6 text-base text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
                    TobaMarketTwin helps Toba MSMEs screen sustainable product and packaging concepts
                    with AI-assisted Customer Twins, then ground decisions with real customer validation.
                </p>
                <p className="mt-4 text-sm font-semibold text-teal">
                    AI menyaring. Manusia memvalidasi. UMKM memutuskan.
                </p>

                <div className="mt-10 flex items-center justify-center gap-3">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-xl bg-navy text-white px-6 py-3 text-sm font-semibold hover:bg-navy/90 transition"
                    >
                        Open Demo <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/experiments"
                        className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-6 py-3 text-sm font-semibold text-navy hover:border-navy/30 transition"
                    >
                        How It Works
                    </Link>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-6 pb-20">
                <div className="rounded-2xl border border-navy/10 bg-white p-8">
                    <div className="flex flex-wrap items-center justify-center gap-3 text-center text-xs font-semibold text-charcoal/60">
                        <Step label="108 Concepts" />
                        <Arrow />
                        <Step label="AI Screening" accent="teal" />
                        <Arrow />
                        <Step label="12 Shortlisted" accent="gold" />
                        <Arrow />
                        <Step label="Human Validation" accent="lakeblue" />
                        <Arrow />
                        <Step label="Green Acceptance Sweet Spot" accent="green" />
                        <Arrow />
                        <Step label="3 Recommended" accent="navy" />
                    </div>
                </div>
            </section>
        </div>
    );
}

function Step({ label, accent }: { label: string; accent?: 'teal' | 'gold' | 'lakeblue' | 'green' | 'navy' }) {
    const colors: Record<string, string> = {
        teal: 'bg-teal/10 text-teal',
        gold: 'bg-gold/15 text-[#8a6412]',
        lakeblue: 'bg-lakeblue/10 text-lakeblue',
        green: 'bg-green/15 text-green',
        navy: 'bg-navy/10 text-navy',
    };
    return (
        <div className={`rounded-lg px-3.5 py-2.5 ${accent ? colors[accent] : 'bg-black/5 text-charcoal/70'}`}>
            {label}
        </div>
    );
}

function Arrow() {
    return <span className="text-charcoal/25">→</span>;
}
