import { ConstraintSettings, ProductConfiguration } from '@/shared/domain';

export const DEFAULT_CONSTRAINTS: ConstraintSettings = {
    maxPrice: null,
    minSustainability: null,
    preferredMaterials: [],
    requireCulturalStory: false,
};

/**
 * Constraint Engine — filters the full configuration space down to a
 * feasible subset BEFORE Customer Twin evaluation. Deterministic rule
 * filter, not a market-derived feasibility model.
 *
 * Configurations without a sustainability assessment fail-open on the
 * sustainability check rather than being dropped before screening.
 */
export function applyConstraints(
    configs: ProductConfiguration[],
    constraints: ConstraintSettings
): ProductConfiguration[] {
    return configs.filter((c) => {
        if (constraints.maxPrice != null && c.price > constraints.maxPrice) return false;
        if (
            constraints.minSustainability != null &&
            c.sustainability &&
            c.sustainability.overallScore < constraints.minSustainability
        ) {
            return false;
        }
        if (constraints.preferredMaterials.length > 0 && !constraints.preferredMaterials.includes(c.material)) {
            return false;
        }
        if (constraints.requireCulturalStory && c.storytelling !== 'Cultural Story') return false;
        return true;
    });
}
