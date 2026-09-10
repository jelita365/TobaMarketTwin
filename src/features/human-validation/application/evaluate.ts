import { Decision, HumanEvaluation, HumanEvaluationSummary, ProductConfiguration } from '@/shared/domain';
import { isCulturalDesign, isSustainableMaterial } from '@/shared/domain/product-attributes';
import { clamp, round1, seededRandom } from '@/shared/lib';
import { configSeed } from '@/features/configurations';
import { decisionFromAcceptance } from '@/features/customer-twin';

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

/** Generates illustrative human respondents evaluating one configuration. */
export function generateHumanEvaluations(
    config: ProductConfiguration,
    count = 24
): HumanEvaluation[] {
    const rng = seededRandom(configSeed(config.id + ':human'));
    const materialBias = isSustainableMaterial(config.material) ? 0.4 : -0.2;
    const designBias = isCulturalDesign(config.design) ? 0.3 : 0;
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

        const acceptance = (purchaseIntention + packagingAttractiveness + priceAcceptance + culturalAuthenticity) / 4;
        const decision = decisionFromAcceptance(acceptance);
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

    const acceptanceAvg =
        (avgPurchaseIntention + avgPackagingAttractiveness + avgPriceAcceptance + avgCulturalAuthenticity) / 4;

    const buyCount = evaluations.filter((e) => e.decision === 'BUY').length;

    return {
        count: evaluations.length,
        avgPurchaseIntention: round1(avgPurchaseIntention),
        avgPackagingAttractiveness: round1(avgPackagingAttractiveness),
        avgPriceAcceptance: round1(avgPriceAcceptance),
        avgCulturalAuthenticity: round1(avgCulturalAuthenticity),
        avgPerceivedSustainability: round1(avgPerceivedSustainability),
        customerAcceptance: Math.round(((acceptanceAvg - 1) / 4) * 100),
        buyRate: Math.round((buyCount / evaluations.length) * 100),
    };
}

export function appendHumanEvaluations(
    existing: HumanEvaluation[],
    incoming: HumanEvaluation[]
): { evaluations: HumanEvaluation[]; summary: HumanEvaluationSummary | undefined } {
    const evaluations = [...existing, ...incoming];
    return { evaluations, summary: summarizeHumanEvaluations(evaluations) };
}
