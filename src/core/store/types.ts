import {
    ConstraintSettings,
    Experiment,
    HumanEvaluation,
    ProductConfiguration,
    RecommendationWeights,
} from '@/shared/domain';

export interface StoreState {
    experiments: Experiment[];
    configurations: Record<string, ProductConfiguration[]>;
    humanEvaluations: Record<string, HumanEvaluation[]>;
    weights: RecommendationWeights;
    constraints: Record<string, ConstraintSettings>;
}
