'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { ConstraintSettings, Experiment, HumanEvaluation, RecommendationWeights } from '@/shared/domain';
import { generateConfigurations } from '@/features/configurations';
import { screenConfigurations } from '@/features/customer-twin';
import { appendHumanEvaluations, generateHumanEvaluations, summarizeHumanEvaluations } from '@/features/human-validation';
import { DEFAULT_WEIGHTS } from '@/features/decision';
import { DEFAULT_CONSTRAINTS } from '@/features/constraints';
import { MAIN_EXPERIMENT_ID } from '@/features/experiments';
import { buildSeedState } from './seed';
import { loadPersistedState, persistState } from './persistence';
import { StoreState } from './types';

let memoryState: StoreState | null = null;
let serverSnapshot: StoreState | null = null;
const listeners = new Set<() => void>();

function loadState(): StoreState {
    const persisted = loadPersistedState();
    if (!persisted) {
        const seeded = buildSeedState();
        persistState(seeded);
        return seeded;
    }
    return {
        ...persisted,
        weights: persisted.weights ?? DEFAULT_WEIGHTS,
        constraints: persisted.constraints ?? {},
    };
}

function getState(): StoreState {
    if (!memoryState) memoryState = loadState();
    return memoryState;
}

function setState(updater: (prev: StoreState) => StoreState) {
    memoryState = updater(getState());
    persistState(memoryState);
    listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function getServerSnapshot(): StoreState {
    if (!serverSnapshot) serverSnapshot = buildSeedState();
    return serverSnapshot;
}

export function useStore() {
    const state = useSyncExternalStore(subscribe, getState, getServerSnapshot);

    const getExperiment = useCallback((id: string) => state.experiments.find((e) => e.id === id), [state]);

    const getConfigurations = useCallback(
        (experimentId: string) => state.configurations[experimentId] ?? [],
        [state]
    );

    const getConfiguration = useCallback(
        (experimentId: string, configId: string) =>
            (state.configurations[experimentId] ?? []).find((c) => c.id === configId),
        [state]
    );

    const getHumanEvaluations = useCallback(
        (configId: string) => state.humanEvaluations[configId] ?? [],
        [state]
    );

    const getConstraints = useCallback(
        (experimentId: string) => state.constraints[experimentId] ?? DEFAULT_CONSTRAINTS,
        [state]
    );

    const updateConstraints = useCallback((experimentId: string, constraints: ConstraintSettings) => {
        setState((prev) => ({
            ...prev,
            constraints: { ...prev.constraints, [experimentId]: constraints },
        }));
    }, []);

    const createExperiment = useCallback((experiment: Experiment) => {
        setState((prev) => ({
            ...prev,
            experiments: [experiment, ...prev.experiments],
            configurations: { ...prev.configurations, [experiment.id]: [] },
        }));
    }, []);

    const generateExperimentConfigurations = useCallback((experimentId: string) => {
        setState((prev) => {
            const exp = prev.experiments.find((e) => e.id === experimentId);
            if (!exp) return prev;
            const configs = generateConfigurations(experimentId, exp.options);
            return {
                ...prev,
                experiments: prev.experiments.map((e) =>
                    e.id === experimentId
                        ? { ...e, status: 'Configuration Generated', totalConfigurations: configs.length }
                        : e
                ),
                configurations: { ...prev.configurations, [experimentId]: configs },
            };
        });
    }, []);

    const runCustomerTwinScreening = useCallback((experimentId: string) => {
        setState((prev) => {
            const { configurations, shortlistedCount } = screenConfigurations(
                prev.configurations[experimentId] ?? []
            );
            return {
                ...prev,
                experiments: prev.experiments.map((e) =>
                    e.id === experimentId
                        ? { ...e, status: 'Shortlisted', shortlistedConfigurations: shortlistedCount }
                        : e
                ),
                configurations: { ...prev.configurations, [experimentId]: configurations },
            };
        });
    }, []);

    const submitHumanEvaluation = useCallback(
        (experimentId: string, configId: string, evaluation: HumanEvaluation) => {
            setState((prev) => applyHumanEvaluations(prev, experimentId, configId, [evaluation]));
        },
        []
    );

    const importHumanEvaluations = useCallback(
        (experimentId: string, configId: string, rows: HumanEvaluation[]) => {
            setState((prev) => applyHumanEvaluations(prev, experimentId, configId, rows));
        },
        []
    );

    const seedHumanEvaluations = useCallback((experimentId: string, configId: string, count = 24) => {
        setState((prev) => {
            const config = (prev.configurations[experimentId] ?? []).find((c) => c.id === configId);
            if (!config) return prev;
            const evals = generateHumanEvaluations(config, count);
            const summary = summarizeHumanEvaluations(evals);
            const configs = (prev.configurations[experimentId] ?? []).map((c) =>
                c.id === configId ? { ...c, status: 'Validated' as const, humanScoreSummary: summary } : c
            );
            return {
                ...prev,
                configurations: { ...prev.configurations, [experimentId]: configs },
                humanEvaluations: { ...prev.humanEvaluations, [configId]: evals },
            };
        });
    }, []);

    const updateWeights = useCallback((weights: RecommendationWeights) => {
        setState((prev) => ({ ...prev, weights }));
    }, []);

    const markRecommendationReady = useCallback((experimentId: string) => {
        setState((prev) => ({
            ...prev,
            experiments: prev.experiments.map((e) =>
                e.id === experimentId ? { ...e, status: 'Recommendation Ready' } : e
            ),
        }));
    }, []);

    return {
        experiments: state.experiments,
        weights: state.weights,
        getExperiment,
        getConfigurations,
        getConfiguration,
        getHumanEvaluations,
        getConstraints,
        updateConstraints,
        createExperiment,
        generateExperimentConfigurations,
        runCustomerTwinScreening,
        submitHumanEvaluation,
        importHumanEvaluations,
        seedHumanEvaluations,
        markRecommendationReady,
        updateWeights,
    };
}

function applyHumanEvaluations(
    prev: StoreState,
    experimentId: string,
    configId: string,
    incoming: HumanEvaluation[]
): StoreState {
    const existing = prev.humanEvaluations[configId] ?? [];
    const { evaluations, summary } = appendHumanEvaluations(existing, incoming);

    const configs = (prev.configurations[experimentId] ?? []).map((c) =>
        c.id === configId ? { ...c, status: 'Validated' as const, humanScoreSummary: summary } : c
    );

    const totalResponses = Object.values({
        ...prev.humanEvaluations,
        [configId]: evaluations,
    }).reduce((sum, arr) => sum + arr.length, 0);

    return {
        ...prev,
        experiments: prev.experiments.map((e) =>
            e.id === experimentId ? { ...e, status: 'Human Validation', humanResponses: totalResponses } : e
        ),
        configurations: { ...prev.configurations, [experimentId]: configs },
        humanEvaluations: { ...prev.humanEvaluations, [configId]: evaluations },
    };
}

export { MAIN_EXPERIMENT_ID };
