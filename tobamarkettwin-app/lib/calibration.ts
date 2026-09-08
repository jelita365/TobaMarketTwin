import { AIEvaluation, CalibrationResult, HumanEvaluation } from '@/types';

export const MIN_RESPONSES_FOR_CALIBRATION = 10;

/** Spearman rank correlation between two equal-length numeric arrays. */
function spearman(a: number[], b: number[]): number {
    const n = a.length;
    if (n < 2) return 0;
    const rank = (arr: number[]) => {
        const sorted = arr.map((v, i) => [v, i] as const).sort((x, y) => x[0] - y[0]);
        const ranks = new Array(n).fill(0);
        sorted.forEach(([, originalIndex], sortedPos) => {
            ranks[originalIndex] = sortedPos + 1;
        });
        return ranks;
    };
    const ra = rank(a);
    const rb = rank(b);
    const dSquaredSum = ra.reduce((sum, r, i) => sum + (r - rb[i]) ** 2, 0);
    return 1 - (6 * dSquaredSum) / (n * (n ** 2 - 1));
}

/**
 * Compares Customer Twin prediction against aggregated human evaluation
 * for one configuration. Requires MIN_RESPONSES_FOR_CALIBRATION responses.
 */
export function calculateCalibration(
    configurationId: string,
    aiEvaluation: AIEvaluation,
    humanEvaluations: HumanEvaluation[]
): CalibrationResult | undefined {
    if (humanEvaluations.length < MIN_RESPONSES_FOR_CALIBRATION) return undefined;

    const aiVector = [
        aiEvaluation.purchaseIntention,
        aiEvaluation.packagingAttractiveness,
        aiEvaluation.priceAcceptance,
        aiEvaluation.culturalAuthenticity,
        aiEvaluation.perceivedSustainability,
    ];

    const humanAverages = {
        purchaseIntention: average(humanEvaluations.map((e) => e.purchaseIntention)),
        packagingAttractiveness: average(humanEvaluations.map((e) => e.packagingAttractiveness)),
        priceAcceptance: average(humanEvaluations.map((e) => e.priceAcceptance)),
        culturalAuthenticity: average(humanEvaluations.map((e) => e.culturalAuthenticity)),
        perceivedSustainability: average(humanEvaluations.map((e) => e.perceivedSustainability)),
    };
    const humanVector = [
        humanAverages.purchaseIntention,
        humanAverages.packagingAttractiveness,
        humanAverages.priceAcceptance,
        humanAverages.culturalAuthenticity,
        humanAverages.perceivedSustainability,
    ];

    const rho = spearman(aiVector, humanVector);
    const mae = average(aiVector.map((v, i) => Math.abs(v - humanVector[i])));

    const humanOverallDecisionBuyRate =
        humanEvaluations.filter((e) => e.decision === 'BUY').length / humanEvaluations.length;
    const aiSaysBuy = aiEvaluation.decision === 'BUY' ? 1 : 0;
    const decisionAgreement = Math.round(
        (1 - Math.abs(aiSaysBuy - humanOverallDecisionBuyRate)) * 100
    );

    const stability = Math.max(0, Math.min(1, 1 - mae / 4));

    return {
        configurationId,
        spearmanRho: round2(rho),
        mae: round2(mae),
        decisionAgreement,
        stability: round2(stability),
    };
}

function average(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function round2(n: number) {
    return Math.round(n * 100) / 100;
}
