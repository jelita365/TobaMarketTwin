import { DecisionResult, ProductConfiguration } from '@/shared/domain';
import { computeDecisionResults, rankByDecisionScore, SCENARIOS } from './compute-decision';

export interface ScenarioRanking {
    scenarioId: string;
    label: string;
    top10: DecisionResult[];
}

export type RankingStability = 'Stable' | 'Moderate' | 'Sensitive';

/**
 * Illustrative Sensitivity Simulation — runs the Weighted Sum Model under
 * three weighting scenarios and reports whether the top concept changes.
 */
export function runSensitivityAnalysis(configs: ProductConfiguration[]): {
    scenarios: ScenarioRanking[];
    stability: RankingStability;
    topConceptByScenario: Record<string, string | undefined>;
} {
    const scenarios: ScenarioRanking[] = SCENARIOS.map((scenario) => {
        const results = computeDecisionResults(configs, scenario);
        const ranked = rankByDecisionScore(results).slice(0, 10);
        return { scenarioId: scenario.id, label: scenario.label, top10: ranked };
    });

    const topConceptByScenario: Record<string, string | undefined> = {};
    for (const s of scenarios) {
        topConceptByScenario[s.scenarioId] = s.top10[0]?.configurationId;
    }

    const uniqueTops = new Set(Object.values(topConceptByScenario).filter(Boolean));
    let stability: RankingStability = 'Stable';
    if (uniqueTops.size === 2) stability = 'Moderate';
    else if (uniqueTops.size >= 3) stability = 'Sensitive';

    return { scenarios, stability, topConceptByScenario };
}
