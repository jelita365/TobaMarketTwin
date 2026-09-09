import { ConstraintSettings, ProductConfiguration } from '@/types';

export const DEFAULT_CONSTRAINTS: ConstraintSettings = {
    maxPrice: null,
    minSustainability: null,
    preferredMaterials: [],
    requireCulturalStory: false,
};

/**
 * Constraint Engine — filters the full configuration space down to a
 * feasible subset BEFORE Customer Twin evaluation. This is a deterministic
 * rule filter ("Prototype Simulation"), not a market-derived feasibility
 * model.
 *
 * Sustainability filtering requires each configuration to already carry a
 * `sustainability` assessment; configurations without one are treated as
 * unknown and pass the sustainability check (fail-open) rather than being
 * silently dropped before screening has ever run.
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
