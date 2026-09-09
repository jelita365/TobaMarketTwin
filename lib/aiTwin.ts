import { AIEvaluation, Decision, ProductConfiguration } from '@/types';
import { clamp, seededRandom } from './rng';
import { configSeed } from './configurations';

const SUSTAINABLE_MATERIALS = ['Recycled Kraft Paper', 'Bamboo Fiber'];
const CULTURAL_DESIGNS = ['Batak Gorga', 'Modern Ulos'];

/**
 * CustomerTwinEngine — deterministic mock scoring ("Simulated Customer Twin").
 * Not a live LLM call. The `evaluate` shape below is the abstraction boundary:
 * a real multimodal LLM-backed engine can later implement the same signature
 * without touching callers.
 */
export interface CustomerTwinEngine {
    evaluate(config: ProductConfiguration): AIEvaluation;
}

export const mockCustomerTwinEngine: CustomerTwinEngine = {
    evaluate: evaluateWithCustomerTwin,
};

export function evaluateWithCustomerTwin(config: ProductConfiguration): AIEvaluation {
    const rng = seededRandom(configSeed(config.id + ':ai'));
    const jitter = () => (rng() - 0.5) * 0.6;

    let base = 3.0;
    if (SUSTAINABLE_MATERIALS.includes(config.material)) base += 0.5;
    if (CULTURAL_DESIGNS.includes(config.design)) base += 0.4;
    if (config.language.includes('+')) base += 0.2;
    if (config.price >= 55000) base -= 0.3;
    else if (config.price <= 45000) base += 0.1;
    if (config.storytelling === 'Cultural Story') base += 0.2;

    const purchaseIntention = clamp(base + jitter(), 1, 5);
    const packagingAttractiveness = clamp(
        base + (CULTURAL_DESIGNS.includes(config.design) ? 0.3 : 0) + jitter(),
        1,
        5
    );
    const priceAcceptance = clamp(3.2 - (config.price - 45000) / 25000 + jitter(), 1, 5);
    const culturalAuthenticity = clamp(
        base + (config.design === 'Batak Gorga' ? 0.4 : 0) + (config.storytelling === 'Cultural Story' ? 0.3 : 0) + jitter(),
        1,
        5
    );
    // Perceived Sustainability is an independent perception signal, NOT
    // reused inside customerAcceptance or the Sustainability Index — see
    // types/index.ts AIEvaluation doc comment.
    const perceivedSustainability = clamp(
        base + (SUSTAINABLE_MATERIALS.includes(config.material) ? 0.5 : -0.4) + jitter(),
        1,
        5
    );

    // Prototype Customer Acceptance Score: PI + PA + PriceAcc + CulturalAuth / 4.
    const customerAcceptance = clamp(
        (purchaseIntention + packagingAttractiveness + priceAcceptance + culturalAuthenticity) / 4,
        1,
        5
    );

    let decision: Decision = 'CONSIDER';
    if (customerAcceptance >= 4.0) decision = 'BUY';
    else if (customerAcceptance < 3.0) decision = 'REJECT';

    const rationale = buildRationale(config, customerAcceptance);
    const concern = buildConcern(config, priceAcceptance);
    const evidenceSufficiency = customerAcceptance >= 4 || customerAcceptance < 2.5 ? 'MEDIUM' : 'LOW';

    return {
        purchaseIntention: round1(purchaseIntention),
        packagingAttractiveness: round1(packagingAttractiveness),
        priceAcceptance: round1(priceAcceptance),
        culturalAuthenticity: round1(culturalAuthenticity),
        perceivedSustainability: round1(perceivedSustainability),
        customerAcceptance: round1(customerAcceptance),
        decision,
        rationale,
        concern,
        evidenceSufficiency,
        mainUncertainty: 'Actual willingness-to-pay has not yet been empirically measured.',
    };
}

function buildRationale(config: ProductConfiguration, score: number): string {
    if (score >= 4.0) {
        return `Combination of ${config.design.toLowerCase()} visual identity, ${config.storytelling.toLowerCase()}, and ${config.material.toLowerCase()} provides strong simulated appeal.`;
    }
    if (score >= 3.0) {
        return `Moderate simulated appeal; some attributes (design, material, or price) balance each other out.`;
    }
    return `Simulated appeal is limited, likely due to price level or weaker cultural signal.`;
}

function buildConcern(config: ProductConfiguration, priceAcceptance: number): string {
    if (priceAcceptance < 3) {
        return 'Price may reduce acceptance among price-sensitive buyers.';
    }
    if (!config.language.includes('+')) {
        return 'Single-language information may limit appeal to international tourists.';
    }
    return 'Material cost may require supplier verification before production.';
}

function round1(n: number) {
    return Math.round(n * 10) / 10;
}
