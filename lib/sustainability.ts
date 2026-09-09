import { ProductConfiguration, SustainabilityAssessment } from '@/types';
import { seededRandom, clamp } from './rng';
import { configSeed } from './configurations';

const SUSTAINABLE_MATERIALS: Record<string, number> = {
    'Recycled Kraft Paper': 0.9,
    'Bamboo Fiber': 0.8,
    'Conventional Laminated Plastic': -0.9,
};

/**
 * Prototype Sustainability Index — attribute-based, NOT a full Life Cycle
 * Assessment. Deterministic per configuration so results are stable across
 * reloads. Independent from Customer Twin's perceivedSustainability signal
 * to avoid double-counting the same construct in the decision model.
 *
 * S_i = (Recyclability + Reusability + RecycledContent + MaterialEfficiency
 *        + LocalMaterialPotential) / 5
 * S_100 = ((S_i - 1) / 4) x 100
 */
export function assessSustainability(config: ProductConfiguration): SustainabilityAssessment {
    const rng = seededRandom(configSeed(config.id + ':sustain'));
    const materialBias = SUSTAINABLE_MATERIALS[config.material] ?? 0;
    const jitter = () => (rng() - 0.5) * 0.8;

    const recyclability = clamp(3.2 + materialBias + jitter(), 1, 5);
    const reusability = clamp(3.0 + materialBias * 0.7 + jitter(), 1, 5);
    const recycledContent = clamp(2.8 + materialBias * 1.1 + jitter(), 1, 5);
    const materialEfficiency = clamp(3.0 + materialBias * 0.5 + jitter(), 1, 5);
    const localMaterialPotential = clamp(
        2.8 + (config.material === 'Bamboo Fiber' ? 0.8 : 0) + jitter(),
        1,
        5
    );

    const S_i =
        (recyclability + reusability + recycledContent + materialEfficiency + localMaterialPotential) / 5;
    const overallScore = Math.round(((S_i - 1) / 4) * 100);

    return {
        recyclability: round1(recyclability),
        reusability: round1(reusability),
        recycledContent: round1(recycledContent),
        materialEfficiency: round1(materialEfficiency),
        localMaterialPotential: round1(localMaterialPotential),
        overallScore,
    };
}

function round1(n: number) {
    return Math.round(n * 10) / 10;
}
