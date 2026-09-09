import { HumanEvaluation, ProductConfiguration } from '@/shared/domain';
import { generateConfigurations } from '@/features/configurations';
import { evaluateWithCustomerTwin } from '@/features/customer-twin';
import { assessSustainability } from '@/features/sustainability';
import { generateHumanEvaluations, summarizeHumanEvaluations } from '@/features/human-validation';
import { DEFAULT_WEIGHTS } from '@/features/decision';
import { SEED_EXPERIMENTS } from '@/features/experiments';
import { StoreState } from './types';

export function buildSeedState(): StoreState {
    const configurations: Record<string, ProductConfiguration[]> = {};
    const humanEvaluations: Record<string, HumanEvaluation[]> = {};

    for (const exp of SEED_EXPERIMENTS) {
        let configs = generateConfigurations(exp.id, exp.options);

        if (exp.status !== 'Draft' && exp.status !== 'Configuration Generated') {
            configs = configs.map((c) => ({
                ...c,
                status: 'Screened',
                aiEvaluation: evaluateWithCustomerTwin(c),
                sustainability: assessSustainability(c),
            }));
        }

        if (exp.humanResponses > 0) {
            const shortlisted = [...configs]
                .sort((a, b) => (b.aiEvaluation?.customerAcceptance ?? 0) - (a.aiEvaluation?.customerAcceptance ?? 0))
                .slice(0, exp.shortlistedConfigurations || 12);

            for (const cfg of shortlisted) {
                const evals = generateHumanEvaluations(cfg, 24);
                humanEvaluations[cfg.id] = evals;
                const summary = summarizeHumanEvaluations(evals);
                const idx = configs.findIndex((c) => c.id === cfg.id);
                if (idx >= 0) {
                    configs[idx] = { ...configs[idx], status: 'Validated', humanScoreSummary: summary };
                }
            }
        }

        configurations[exp.id] = configs;
    }

    return {
        experiments: SEED_EXPERIMENTS,
        configurations,
        humanEvaluations,
        weights: DEFAULT_WEIGHTS,
        constraints: {},
    };
}
