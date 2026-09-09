import { ProductConfiguration, Recommendation, RecommendationWeights } from '@/types';
import { computeDecisionResults, buildDecisionTrace, rankByDecisionScore, DEFAULT_WEIGHTS } from './decision';

export { DEFAULT_WEIGHTS };

/**
 * Ranks configurations by the Prototype Balanced Decision Rule and attaches
 * a full Decision Trace to each — thin convenience wrapper around lib/decision
 * for pages that just want a ranked, explainable list.
 */
export function rankConfigurations(
    configs: ProductConfiguration[],
    weights: RecommendationWeights = DEFAULT_WEIGHTS
): Recommendation[] {
    const results = computeDecisionResults(configs, weights, {});
    const ranked = rankByDecisionScore(results);

    return ranked.map((result, i) => {
        const config = configs.find((c) => c.id === result.configurationId)!;
        return { ...buildDecisionTrace(config, result), rank: i + 1 };
    });
}
