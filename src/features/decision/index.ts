export {
    DEFAULT_WEIGHTS,
    SCENARIOS,
    computeDecisionResults,
    buildDecisionTrace,
    rankByDecisionScore,
} from './application/compute-decision';
export { rankConfigurations } from './application/rank-configurations';
export { evaluateWhatIf } from './application/what-if';
export type { WhatIfInput, WhatIfResult } from './application/what-if';
export { runSensitivityAnalysis } from './application/sensitivity';
export type { ScenarioRanking, RankingStability } from './application/sensitivity';
