import { ProductConfiguration } from '@/shared/domain';
import { evaluateWithCustomerTwin } from '../infrastructure/mock-engine';
import { assessSustainability } from '@/features/sustainability';

const SHORTLIST_RATIO = 0.11;

export function shortlistByAcceptance(configs: ProductConfiguration[]): ProductConfiguration[] {
    const shortlistCount = Math.max(1, Math.round(configs.length * SHORTLIST_RATIO));
    const shortlistIds = new Set(
        [...configs]
            .sort((a, b) => (b.aiEvaluation?.customerAcceptance ?? 0) - (a.aiEvaluation?.customerAcceptance ?? 0))
            .slice(0, shortlistCount)
            .map((c) => c.id)
    );

    return configs.map((c) => (shortlistIds.has(c.id) ? { ...c, status: 'Shortlisted' as const } : c));
}

export function screenConfigurations(configs: ProductConfiguration[]): {
    configurations: ProductConfiguration[];
    shortlistedCount: number;
} {
    const evaluated = configs.map((c) => ({
        ...c,
        status: 'Screened' as const,
        aiEvaluation: evaluateWithCustomerTwin(c),
        sustainability: assessSustainability(c),
    }));

    const withShortlist = shortlistByAcceptance(evaluated);
    const shortlistedCount = withShortlist.filter((c) => c.status === 'Shortlisted').length;

    return { configurations: withShortlist, shortlistedCount };
}
