import { ProductConfiguration, Recommendation, RecommendationWeights } from '@/shared/domain';
import { buildDecisionTrace, computeDecisionResults, DEFAULT_WEIGHTS, rankByDecisionScore } from './compute-decision';

export function rankConfigurations(
    configs: ProductConfiguration[],
    weights: RecommendationWeights = DEFAULT_WEIGHTS
): Recommendation[] {
    const results = computeDecisionResults(configs, weights);
    const ranked = rankByDecisionScore(results);

    return ranked.map((result, i) => {
        const config = configs.find((c) => c.id === result.configurationId)!;
        return { ...buildDecisionTrace(config, result), rank: i + 1 };
    });
}
