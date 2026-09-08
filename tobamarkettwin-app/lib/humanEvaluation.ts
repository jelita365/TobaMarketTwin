import { Decision, HumanEvaluation, HumanEvaluationSummary, ProductConfiguration } from '@/types';
import { clamp, seededRandom } from './rng';
import { configSeed } from './configurations';

const SEGMENTS = [
    'Domestic Tourist',
    'International Tourist',
    'Local Visitor',
    'Gift Buyer',
    'Young Traveler',
    'Sustainability-oriented Traveler',
];
const AGE_GROUPS = ['18-24', '25-34', '35-44', '45-54'];
const TRAVEL_TYPES = ['Leisure', 'Gift Shopping', 'Business', 'Family Trip'];

const SUSTAINABLE_MATERIALS = ['Recycled Kraft Paper', 'Bamboo Fiber'];
const CULTURAL_DESIGNS = ['Batak Gorga', 'Modern Ulos'];

function decisionFromScore(score: number): Decision {
    if (score >= 4.0) return 'BUY';
    if (score < 3.0) return 'REJECT';
    return 'CONSIDER';
}

const COMMENTS: Record<Decision, string[]> = {
    BUY: [
        'Cultural design is attractive.',
        'Feels suitable as a souvenir.',
        'Packaging feels premium and eco-friendly.',
    ],
    CONSIDER: [
        'Price is slightly high.',
        'Design is nice but not sure about the material.',
        'Would consider if price were lower.',
    ],
    REJECT: [
        'Too expensive for everyday purchase.',
        'Packaging does not feel special enough.',
        'Not convinced about the sustainability claim.',
    ],
};

/** Generates ~24 illustrative human respondents evaluating one configuration. */
export function generateHumanEvaluations(
    config: ProductConfiguration,
    count = 24
): HumanEvaluation[] {
    const rng = seededRandom(configSeed(config.id + ':human'));
    const materialBias = SUSTAINABLE_MATERIALS.includes(config.material) ? 0.4 : -0.2;
    const designBias = CULTURAL_DESIGNS.includes(config.design) ? 0.3 : 0;
    const priceBias = config.price >= 55000 ? -0.4 : config.price <= 45000 ? 0.2 : 0;

    const evaluations: HumanEvaluation[] = [];
    for (let i = 1; i <= count; i++) {
        const jitter = () => (rng() - 0.5) * 1.6;
        const base = 3.0 + materialBias + designBias + priceBias;

        const purchaseIntention = clamp(Math.round(base + jitter()), 1, 5);
        const packagingAttractiveness = clamp(Math.round(base + designBias + jitter()), 1, 5);
        const priceAcceptance = clamp(Math.round(3.0 + priceBias + jitter()), 1, 5);
        const culturalAuthenticity = clamp(Math.round(base + designBias * 1.2 + jitter()), 1, 5);
        const perceivedSustainability = clamp(Math.round(base + materialBias * 1.3 + jitter()), 1, 5);

        const overall =
            (purchaseIntention + packagingAttractiveness + priceAcceptance + culturalAuthenticity + perceivedSustainability) /
            5;
        const decision = decisionFromScore(overall);
        const commentPool = COMMENTS[decision];
        const comment = commentPool[Math.floor(rng() * commentPool.length)];

        evaluations.push({
            id: `${config.id}-R${String(i).padStart(3, '0')}`,
            configurationId: config.id,
            respondentId: `R${String(i).padStart(3, '0')}`,
            segment: SEGMENTS[Math.floor(rng() * SEGMENTS.length)],
            ageGroup: AGE_GROUPS[Math.floor(rng() * AGE_GROUPS.length)],
            travelType: TRAVEL_TYPES[Math.floor(rng() * TRAVEL_TYPES.length)],
            purchaseIntention,
            packagingAttractiveness,
            priceAcceptance,
            culturalAuthenticity,
            perceivedSustainability,
            decision,
            comment,
        });
    }
    return evaluations;
}

export function summarizeHumanEvaluations(evaluations: HumanEvaluation[]): HumanEvaluationSummary | undefined {
    if (evaluations.length === 0) return undefined;

    const avg = (key: keyof HumanEvaluation) =>
        evaluations.reduce((sum, e) => sum + (e[key] as number), 0) / evaluations.length;

    const avgPurchaseIntention = avg('purchaseIntention');
    const avgPackagingAttractiveness = avg('packagingAttractiveness');
    const avgPriceAcceptance = avg('priceAcceptance');
    const avgCulturalAuthenticity = avg('culturalAuthenticity');
    const avgPerceivedSustainability = avg('perceivedSustainability');

    const overallAvg =
        (avgPurchaseIntention +
            avgPackagingAttractiveness +
            avgPriceAcceptance +
            avgCulturalAuthenticity +
            avgPerceivedSustainability) /
        5;

    const buyCount = evaluations.filter((e) => e.decision === 'BUY').length;

    return {
        count: evaluations.length,
        avgPurchaseIntention: round1(avgPurchaseIntention),
        avgPackagingAttractiveness: round1(avgPackagingAttractiveness),
        avgPriceAcceptance: round1(avgPriceAcceptance),
        avgCulturalAuthenticity: round1(avgCulturalAuthenticity),
        avgPerceivedSustainability: round1(avgPerceivedSustainability),
        overallAcceptance: Math.round((overallAvg / 5) * 100),
        buyRate: Math.round((buyCount / evaluations.length) * 100),
    };
}

function round1(n: number) {
    return Math.round(n * 10) / 10;
}
