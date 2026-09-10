import { ProductConfiguration, RecommendationWeights } from '@/shared/domain';
import { evaluateWithCustomerTwin } from '@/features/customer-twin';
import { assessSustainability } from '@/features/sustainability';
import { calibratedAcceptance } from '@/features/calibration';

export interface WhatIfInput {
    material: string;
    design: string;
    price: number;
    storytelling: string;
    language: string;
}

export interface WhatIfResult {
    customerAcceptance: number;
    sustainability: number;
    decisionScore: number;
}

/**
 * Prototype Scenario Simulation — recomputes Customer Twin + Sustainability
 * + decision score for a hypothetical configuration. No human calibration
 * is available, so acceptance always uses the Customer Twin score alone.
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
        language: input.language,
        tags: [],
        status: 'Generated',
    };

    const aiEvaluation = evaluateWithCustomerTwin(pseudoConfig);
    const sustainability = assessSustainability(pseudoConfig);
    const { value100 } = calibratedAcceptance(aiEvaluation, undefined);

    const decisionScore =
        weights.acceptanceWeight * value100 + weights.sustainabilityWeight * sustainability.overallScore;

    return {
        customerAcceptance: value100,
        sustainability: sustainability.overallScore,
        decisionScore: Math.round(decisionScore),
    };
}

function hashInput(input: WhatIfInput): string {
    return [input.material, input.design, input.price, input.storytelling, input.language].join('|');
}
