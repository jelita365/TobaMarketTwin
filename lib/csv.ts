import { Decision, HumanEvaluation } from '@/types';

export const CSV_COLUMNS = [
    'respondent_id',
    'segment',
    'age_group',
    'travel_type',
    'purchase_intention',
    'packaging_attractiveness',
    'price_acceptance',
    'cultural_authenticity',
    'perceived_sustainability',
    'decision',
    'comment',
] as const;

/** Parses a primary-data CSV upload into HumanEvaluation rows for one configuration. */
export function parseHumanEvaluationCsv(csvText: string, configurationId: string): HumanEvaluation[] {
    const lines = csvText.trim().split(/\r?\n/);
    const rows: HumanEvaluation[] = [];

    for (const line of lines) {
        if (!line.trim()) continue;
        const cells = splitCsvLine(line);
        if (cells[0]?.toLowerCase() === 'respondent_id') continue; // skip header

        const [
            respondentId, segment, ageGroup, travelType,
            purchaseIntention, packagingAttractiveness, priceAcceptance,
            culturalAuthenticity, perceivedSustainability, decision, comment,
        ] = cells;

        if (!respondentId) continue;

        rows.push({
            id: `${configurationId}-${respondentId}`,
            configurationId,
            respondentId,
            segment: segment ?? 'Unknown',
            ageGroup: ageGroup ?? 'Unknown',
            travelType: travelType ?? 'Unknown',
            purchaseIntention: Number(purchaseIntention) || 0,
            packagingAttractiveness: Number(packagingAttractiveness) || 0,
            priceAcceptance: Number(priceAcceptance) || 0,
            culturalAuthenticity: Number(culturalAuthenticity) || 0,
            perceivedSustainability: Number(perceivedSustainability) || 0,
            decision: (decision?.toUpperCase() as Decision) ?? 'CONSIDER',
            comment: comment || undefined,
        });
    }

    return rows;
}

function splitCsvLine(line: string): string[] {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            cells.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    cells.push(current.trim());
    return cells;
}
