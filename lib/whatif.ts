import { ProductConfiguration, RecommendationWeights } from '@/types';
import { evaluateWithCustomerTwin } from './aiTwin';
import { assessSustainability } from './sustainability';
import { calibratedAcceptance } from './calibration';

export interface WhatIfInput {
    material: string;
    design: string;
    price: number;
    storytelling: string;
}

export interface WhatIfResult {
    customerAcceptance: number; // 0-100
    sustainability: number; // 0-100
    decisionScore: number; // 0-100
}

/**
 * "Prototype Scenario Simulation" — recomputes Customer Twin + Sustainability
 * + decision score for a hypothetical configuration using the same
 * deterministic engines as the main pipeline. No human calibration is
 * available for a hypothetical configuration, so acceptance always uses the
 * Customer Twin score alone.
 */
export function evaluateWhatIf(input: WhatIfInput, weights: RecommendationWeights): WhatIfResult {
    const pseudoConfig: ProductConfiguration = {
        id: `WHATIF-${hashInput(input)}`,
        experimentId: 'whatif',
        index: 0,
        material: input.material,
        design: input.design,
        price: input.price,
        storytelling: input.storytelling,
        tags: [],
        status: 'Generated',
    };

    const aiEvaluation = evaluateWithCustomerTwin(pseudoConfig);
    const sustainability = assessSustainability(pseudoConfig);
    const { value100 } = calibratedAcceptance(aiEvaluation, undefined);

    const decisionScore = weights.acceptanceWeight * value100 + weights.sustainabilityWeight * sustainability.overallScore;

    return {
        customerAcceptance: value100,
        sustainability: sustainability.overallScore,
        decisionScore: Math.round(decisionScore),
    };
}

function hashInput(input: WhatIfInput): string {
    return [input.material, input.design, input.price, input.storytelling].join('|');
}
