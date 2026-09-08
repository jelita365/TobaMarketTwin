'use client';

import { useCallback, useEffect, useState } from 'react';
import { Experiment, HumanEvaluation, ProductConfiguration, RecommendationWeights } from '@/types';
import { SEED_EXPERIMENTS, MAIN_EXPERIMENT_ID } from '@/data/seed';
import { generateConfigurations } from './configurations';
import { evaluateWithCustomerTwin } from './aiTwin';
import { assessSustainability } from './sustainability';
import { generateHumanEvaluations, summarizeHumanEvaluations } from './humanEvaluation';
import { DEFAULT_WEIGHTS } from './recommendation';

const STORAGE_KEY = 'tobamarkettwin.v1';

interface StoreState {
    experiments: Experiment[];
    configurations: Record<string, ProductConfiguration[]>; // experimentId -> configs
    humanEvaluations: Record<string, HumanEvaluation[]>; // configurationId -> evaluations
    weights: RecommendationWeights;
}

function buildSeedState(): StoreState {
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

        // Seed human validation + shortlist for experiments that have progressed far enough.
        if (exp.humanResponses > 0) {
            const shortlisted = [...configs]
                .sort((a, b) => (b.aiEvaluation?.overallAcceptance ?? 0) - (a.aiEvaluation?.overallAcceptance ?? 0))
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

    return { experiments: SEED_EXPERIMENTS, configurations, humanEvaluations, weights: DEFAULT_WEIGHTS };
}

function loadState(): StoreState {
    if (typeof window === 'undefined') return buildSeedState();
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            const seeded = buildSeedState();
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
            return seeded;
        }
        const parsed = JSON.parse(raw) as StoreState;
        return { ...parsed, weights: parsed.weights ?? DEFAULT_WEIGHTS };
    } catch {
        return buildSeedState();
    }
}

function saveState(state: StoreState) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let memoryState: StoreState | null = null;
const listeners = new Set<() => void>();

function getState(): StoreState {
    if (!memoryState) memoryState = loadState();
    return memoryState;
}

function setState(updater: (prev: StoreState) => StoreState) {
    memoryState = updater(getState());
    saveState(memoryState);
    listeners.forEach((l) => l());
}

export function useStore() {
    const [, setTick] = useState(0);

    useEffect(() => {
        const listener = () => setTick((t) => t + 1);
        listeners.add(listener);
        // Ensure client-loaded state (with seed data) triggers a render on mount.
        setTick((t) => t + 1);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    const state = getState();

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
            const configs = prev.configurations[experimentId] ?? [];
            const evaluated = configs.map((c) => ({
                ...c,
                status: 'Screened' as const,
                aiEvaluation: evaluateWithCustomerTwin(c),
                sustainability: assessSustainability(c),
            }));

            const shortlistCount = Math.max(1, Math.round(evaluated.length * 0.11));
            const shortlistIds = new Set(
                [...evaluated]
                    .sort((a, b) => (b.aiEvaluation?.overallAcceptance ?? 0) - (a.aiEvaluation?.overallAcceptance ?? 0))
                    .slice(0, shortlistCount)
                    .map((c) => c.id)
            );
            const withShortlist = evaluated.map((c) =>
                shortlistIds.has(c.id) ? { ...c, status: 'Shortlisted' as const } : c
            );

            return {
                ...prev,
                experiments: prev.experiments.map((e) =>
                    e.id === experimentId
                        ? { ...e, status: 'Shortlisted', shortlistedConfigurations: shortlistIds.size }
                        : e
                ),
                configurations: { ...prev.configurations, [experimentId]: withShortlist },
            };
        });
    }, []);

    const submitHumanEvaluation = useCallback(
        (experimentId: string, configId: string, evaluation: HumanEvaluation) => {
            setState((prev) => {
                const existing = prev.humanEvaluations[configId] ?? [];
                const updatedEvals = [...existing, evaluation];
                const summary = summarizeHumanEvaluations(updatedEvals);

                const configs = (prev.configurations[experimentId] ?? []).map((c) =>
                    c.id === configId ? { ...c, status: 'Validated' as const, humanScoreSummary: summary } : c
                );

                const totalResponses = Object.values({
                    ...prev.humanEvaluations,
                    [configId]: updatedEvals,
                }).reduce((sum, arr) => sum + arr.length, 0);

                return {
                    ...prev,
                    experiments: prev.experiments.map((e) =>
                        e.id === experimentId
                            ? { ...e, status: 'Human Validation', humanResponses: totalResponses }
                            : e
                    ),
                    configurations: { ...prev.configurations, [experimentId]: configs },
                    humanEvaluations: { ...prev.humanEvaluations, [configId]: updatedEvals },
                };
            });
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
        createExperiment,
        generateExperimentConfigurations,
        runCustomerTwinScreening,
        submitHumanEvaluation,
        seedHumanEvaluations,
        markRecommendationReady,
        updateWeights,
    };
}

export { MAIN_EXPERIMENT_ID };
