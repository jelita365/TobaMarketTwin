import { AIEvaluation, ProductConfiguration } from '@/shared/domain';
import { isCulturalDesign, isSustainableMaterial } from '@/shared/domain/product-attributes';
import { clamp, round1, seededRandom } from '@/shared/lib';
import { configSeed } from '@/features/configurations';
import { buildConcern, buildRationale, decisionFromAcceptance, type CustomerTwinEngine } from '../domain/engine';

/**
 * CustomerTwinEngine — deterministic mock scoring ("Simulated Customer Twin").
 * Not a live LLM call. The evaluate() signature is the port: a real
 * multimodal LLM-backed engine can later implement the same contract.
 */
export function evaluateWithCustomerTwin(config: ProductConfiguration): AIEvaluation {
    const rng = seededRandom(configSeed(config.id + ':ai'));
    const jitter = () => (rng() - 0.5) * 0.6;

    let base = 3.0;
    if (isSustainableMaterial(config.material)) base += 0.5;
    if (isCulturalDesign(config.design)) base += 0.4;
    if (config.language.includes('+')) base += 0.2;
    if (config.price >= 55000) base -= 0.3;
    else if (config.price <= 45000) base += 0.1;
    if (config.storytelling === 'Cultural Story') base += 0.2;

    const purchaseIntention = clamp(base + jitter(), 1, 5);
    const packagingAttractiveness = clamp(
        base + (isCulturalDesign(config.design) ? 0.3 : 0) + jitter(),
        1,
        5
    );
    const priceAcceptance = clamp(3.2 - (config.price - 45000) / 25000 + jitter(), 1, 5);
    const culturalAuthenticity = clamp(
        base +
            (config.design === 'Batak Gorga' ? 0.4 : 0) +
            (config.storytelling === 'Cultural Story' ? 0.3 : 0) +
            jitter(),
        1,
        5
    );
    const perceivedSustainability = clamp(
        base + (isSustainableMaterial(config.material) ? 0.5 : -0.4) + jitter(),
        1,
        5
    );

    const customerAcceptance = clamp(
        (purchaseIntention + packagingAttractiveness + priceAcceptance + culturalAuthenticity) / 4,
        1,
        5
    );

    return {
        purchaseIntention: round1(purchaseIntention),
        packagingAttractiveness: round1(packagingAttractiveness),
        priceAcceptance: round1(priceAcceptance),
        culturalAuthenticity: round1(culturalAuthenticity),
        perceivedSustainability: round1(perceivedSustainability),
        customerAcceptance: round1(customerAcceptance),
        decision: decisionFromAcceptance(customerAcceptance),
        rationale: buildRationale(config, customerAcceptance),
        concern: buildConcern(config, priceAcceptance),
        evidenceSufficiency: customerAcceptance >= 4 || customerAcceptance < 2.5 ? 'MEDIUM' : 'LOW',
        mainUncertainty: 'Actual willingness-to-pay has not yet been empirically measured.',
    };
}

export const mockCustomerTwinEngine: CustomerTwinEngine = {
    evaluate: evaluateWithCustomerTwin,
};
