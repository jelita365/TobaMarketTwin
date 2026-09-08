import { ProductConfiguration, Recommendation, RecommendationWeights } from '@/types';

export const DEFAULT_WEIGHTS: RecommendationWeights = {
    customerAcceptance: 0.4,
    sustainability: 0.3,
    calibrationConfidence: 0.2,
    priceAcceptance: 0.1,
};

/**
 * Transparent, weighted ranking — "Prototype decision rule". Weights are
 * configurable in Settings rather than hidden inside the AI score.
 */
export function rankConfigurations(
    configs: ProductConfiguration[],
    weights: RecommendationWeights = DEFAULT_WEIGHTS
): Recommendation[] {
    const scored = configs
        .filter((c) => c.aiEvaluation && c.sustainability)
        .map((c) => {
            const customerAcceptance = (c.humanScoreSummary?.overallAcceptance ?? c.aiEvaluation!.overallAcceptance * 20);
            const sustainability = c.sustainability!.overallScore;
            const priceAcceptance = (c.humanScoreSummary?.avgPriceAcceptance ?? c.aiEvaluation!.priceAcceptance) * 20;
            const calibrationConfidence = c.humanScoreSummary ? 80 : 50; // demo proxy when no calibration object attached

            const score =
                weights.customerAcceptance * customerAcceptance +
                weights.sustainability * sustainability +
                weights.calibrationConfidence * calibrationConfidence +
                weights.priceAcceptance * priceAcceptance;

            return {
                configurationId: c.id,
                score: Math.round(score),
                sustainability: Math.round(sustainability),
                customerAcceptance: Math.round(customerAcceptance),
                priceAcceptance: Math.round(priceAcceptance),
                calibrationConfidence: Math.round(calibrationConfidence),
                reason: buildReason(c, sustainability, customerAcceptance),
                concern: c.aiEvaluation!.concern,
                nextAction: score >= 75 ? 'Build Physical Prototype' : 'Run Targeted Customer Test',
            };
        })
        .sort((a, b) => b.score - a.score);

    return scored.map((s, i) => ({ ...s, rank: i + 1 }));
}

function buildReason(c: ProductConfiguration, sustainability: number, acceptance: number): string {
    const parts: string[] = [];
    if (sustainability >= 75) parts.push('high sustainability attribute score');
    if (acceptance >= 75) parts.push('strong customer acceptance');
    if (c.tags.includes('Cultural Identity') || c.tags.includes('Cultural Story')) {
        parts.push('strong cultural authenticity');
    }
    if (parts.length === 0) parts.push('balanced attribute profile');
    return `Strong balance driven by ${parts.join(', ')}.`;
}
