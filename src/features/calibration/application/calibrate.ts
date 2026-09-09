import {
    AIEvaluation,
    CalibrationResult,
    Decision,
    HumanEvaluation,
    HumanEvaluationSummary,
    MIN_RESPONSES_FOR_CALIBRATION,
} from '@/shared/domain';
import { average, round2 } from '@/shared/lib';

export { MIN_RESPONSES_FOR_CALIBRATION };

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

function decisionToBuyProbability(decision: Decision): number {
    if (decision === 'BUY') return 1;
    if (decision === 'CONSIDER') return 0.5;
    return 0;
}

function humanAcceptance(h: HumanEvaluation): number {
    return (h.purchaseIntention + h.packagingAttractiveness + h.priceAcceptance + h.culturalAuthenticity) / 4;
}

/**
 * Cross-configuration calibration: Spearman ρ, MAE, and decision agreement.
 * Returns [] when the sample-size bar is not met — never fabricates values.
 */
export function calculateCalibration(
    entries: { configurationId: string; aiEvaluation: AIEvaluation; humanEvaluations: HumanEvaluation[] }[]
): CalibrationResult[] {
    const eligible = entries.filter((e) => e.humanEvaluations.length >= MIN_RESPONSES_FOR_CALIBRATION);
    if (eligible.length < 2) return [];

    const aiScores = eligible.map((e) => e.aiEvaluation.customerAcceptance);
    const humanScores = eligible.map((e) => average(e.humanEvaluations.map((h) => humanAcceptance(h))));
    const rho = spearman(aiScores, humanScores);

    return eligible.map((e, i) => {
        const humanAvg = humanScores[i];
        const mae = Math.abs(aiScores[i] - humanAvg);

        const humanBuyRate = e.humanEvaluations.filter((h) => h.decision === 'BUY').length / e.humanEvaluations.length;
        const aiBuyProbability = decisionToBuyProbability(e.aiEvaluation.decision);
        const decisionAgreement = Math.round((1 - Math.abs(aiBuyProbability - humanBuyRate)) * 100);

        const stability = Math.max(0, Math.min(1, 1 - mae / 4));

        return {
            configurationId: e.configurationId,
            spearmanRho: round2(rho),
            mae: round2(mae),
            decisionAgreement,
            stability: round2(stability),
            respondentCount: e.humanEvaluations.length,
        };
    });
}

/** Blends Customer Twin acceptance with real human acceptance once calibration data exists. */
export function calibratedAcceptance(
    aiEvaluation: AIEvaluation,
    humanSummary: HumanEvaluationSummary | undefined
): { value100: number; usesCalibratedAcceptance: boolean } {
    const aiAcceptance100 = ((aiEvaluation.customerAcceptance - 1) / 4) * 100;
    if (!humanSummary || humanSummary.count < MIN_RESPONSES_FOR_CALIBRATION) {
        return { value100: Math.round(aiAcceptance100), usesCalibratedAcceptance: false };
    }
    return { value100: Math.round(humanSummary.customerAcceptance), usesCalibratedAcceptance: true };
}
