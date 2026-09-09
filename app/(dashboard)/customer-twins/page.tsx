import { Card, CardHeader } from '@/components/Card';
import { DemoLabel } from '@/components/DemoLabel';
import { PERSONAS } from '@/data/personas';

export default function CustomerTwinsPage() {
    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy tracking-tight">Customer Twins</h1>
                    <p className="text-sm text-charcoal/60 mt-1">Illustrative customer segments used by the simulated screening engine.</p>
                </div>
                <DemoLabel kind="illustrative">Illustrative Persona</DemoLabel>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {PERSONAS.map((p) => (
                    <Card key={p.id}>
                        <CardHeader title={p.name} subtitle={p.ageRange} />
                        <p className="text-xs text-charcoal/65 leading-relaxed mb-3">{p.travelBehavior}</p>
                        <div className="space-y-3 text-xs">
                            <div>
                                <p className="text-charcoal/45 mb-1">Priorities</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {p.priorities.map((x) => (
                                        <span key={x} className="rounded-full bg-green/10 text-green px-2 py-0.5">{x}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-charcoal/45 mb-1">Concerns</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {p.concerns.map((x) => (
                                        <span key={x} className="rounded-full bg-gold/15 text-[#8a6412] px-2 py-0.5">{x}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-charcoal/45 mb-1">Purchase Behavior</p>
                                <p className="text-charcoal/70">{p.purchaseBehavior}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
