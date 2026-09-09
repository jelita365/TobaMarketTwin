import {
    DecisionResult,
    DecisionScenario,
    DecisionTrace,
    ProductConfiguration,
    RecommendationWeights,
} from '@/shared/domain';
import { calibratedAcceptance } from '@/features/calibration';

/** "Prototype Balanced Decision Rule" — NOT scientifically optimal weighting. */
export const DEFAULT_WEIGHTS: RecommendationWeights = {
    acceptanceWeight: 0.5,
    sustainabilityWeight: 0.5,
};

export const SCENARIOS: DecisionScenario[] = [
    { id: 'balanced', label: 'Balanced', acceptanceWeight: 0.5, sustainabilityWeight: 0.5 },
    { id: 'sustainability-priority', label: 'Sustainability Priority', acceptanceWeight: 0.4, sustainabilityWeight: 0.6 },
    { id: 'market-priority', label: 'Market Priority', acceptanceWeight: 0.6, sustainabilityWeight: 0.4 },
];

/**
 * Weighted Sum Model.
 * R_i = acceptanceWeight x CalibratedCustomerAcceptance_i
 *     + sustainabilityWeight x Sustainability_i
 */
export function computeDecisionResults(
    configs: ProductConfiguration[],
    weights: RecommendationWeights
): DecisionResult[] {
    return configs
        .filter((c) => c.aiEvaluation && c.sustainability)
        .map((c) => {
            const { value100, usesCalibratedAcceptance } = calibratedAcceptance(c.aiEvaluation!, c.humanScoreSummary);
            const sustainability = c.sustainability!.overallScore;
            const decisionScore = weights.acceptanceWeight * value100 + weights.sustainabilityWeight * sustainability;

            return {
                configurationId: c.id,
                customerAcceptance: value100,
                sustainability,
                decisionScore: Math.round(decisionScore),
                usesCalibratedAcceptance,
            };
        });
}

function nextActionFor(result: DecisionResult): DecisionTrace['nextAction'] {
    if (!result.usesCalibratedAcceptance) {
        return result.decisionScore >= 70 ? 'Human Test' : 'Collect More Evidence';
    }
    return result.decisionScore >= 70 ? 'Physical Prototype' : 'Human Test';
}

function confidenceFor(
    result: DecisionResult,
    evidenceSufficiency: string
): { status: DecisionTrace['confidenceStatus']; reason: string } {
    if (result.usesCalibratedAcceptance && evidenceSufficiency !== 'LOW') {
        return { status: 'High Evidence', reason: 'Customer Twin score is calibrated against real human validation responses.' };
    }
    if (!result.usesCalibratedAcceptance) {
        return {
            status: 'Low Evidence',
            reason: 'Strong product attribute evidence, but no primary customer validation yet.',
        };
    }
    return { status: 'Medium Evidence', reason: 'Calibrated against a limited human validation sample.' };
}

/** Builds an explainable Decision Trace ("Why was this concept shortlisted?"). */
export function buildDecisionTrace(config: ProductConfiguration, result: DecisionResult): DecisionTrace {
    const ai = config.aiEvaluation!;
    const strengths: string[] = [];
    const tradeoffs: string[] = [];

    if (result.sustainability >= 75) strengths.push('strong sustainability attributes');
    if (result.customerAcceptance >= 75) strengths.push('strong customer acceptance');
    if (ai.culturalAuthenticity >= 4) strengths.push('strong cultural authenticity');
    if (ai.packagingAttractiveness >= 4) strengths.push('high packaging attractiveness');
    if (strengths.length === 0) strengths.push('balanced attribute profile');

    if (config.price >= 55000) tradeoffs.push('higher price point');
    if (!result.usesCalibratedAcceptance) tradeoffs.push('limited empirical evidence on willingness-to-pay');
    if (ai.evidenceSufficiency === 'LOW') tradeoffs.push('low evidence sufficiency from Customer Twin screening');
    if (tradeoffs.length === 0) tradeoffs.push('material cost may require supplier verification');

    const { status, reason } = confidenceFor(result, ai.evidenceSufficiency);

    return {
        configurationId: config.id,
        customerAcceptance: result.customerAcceptance,
        sustainability: result.sustainability,
        decisionScore: result.decisionScore,
        evidenceSufficiency: ai.evidenceSufficiency,
        strengths,
        tradeoffs,
        nextAction: nextActionFor(result),
        confidenceStatus: status,
        confidenceReason: reason,
    };
}

export function rankByDecisionScore(results: DecisionResult[]): DecisionResult[] {
    return [...results].sort((a, b) => b.decisionScore - a.decisionScore);
}
