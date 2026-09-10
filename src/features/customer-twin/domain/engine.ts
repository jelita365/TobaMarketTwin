import { AIEvaluation, Decision, ProductConfiguration } from '@/shared/domain';

export interface CustomerTwinEngine {
    evaluate(config: ProductConfiguration): AIEvaluation;
}

export function decisionFromAcceptance(customerAcceptance: number): Decision {
    if (customerAcceptance >= 4.0) return 'BUY';
    if (customerAcceptance < 3.0) return 'REJECT';
    return 'CONSIDER';
}

export function buildRationale(config: ProductConfiguration, score: number): string {
    if (score >= 4.0) {
        return `Combination of ${config.design.toLowerCase()} visual identity, ${config.storytelling.toLowerCase()}, and ${config.material.toLowerCase()} provides strong simulated appeal.`;
    }
    if (score >= 3.0) {
        return `Moderate simulated appeal; some attributes (design, material, or price) balance each other out.`;
    }
    return `Simulated appeal is limited, likely due to price level or weaker cultural signal.`;
}

export function buildConcern(config: ProductConfiguration, priceAcceptance: number): string {
    if (priceAcceptance < 3) {
        return 'Price may reduce acceptance among price-sensitive buyers.';
    }
    if (!config.language.includes('+')) {
        return 'Single-language information may limit appeal to international tourists.';
    }
    return 'Material cost may require supplier verification before production.';
}
