export type ExperimentStatus =
    | 'Draft'
    | 'Configuration Generated'
    | 'AI Screening'
    | 'Shortlisted'
    | 'Human Validation'
    | 'Calibrated'
    | 'Recommendation Ready'
    | 'Completed';

export type Decision = 'BUY' | 'CONSIDER' | 'REJECT';
export type EvidenceSufficiency = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ConfigOption {
    materials: string[];
    designs: string[];
    prices: number[];
    storytelling: string[];
    languages: string[];
}

export interface Experiment {
    id: string;
    name: string;
    productName: string;
    category: string;
    msme: string;
    targetSegments: string[];
    objective: string;
    status: ExperimentStatus;
    options: ConfigOption;
    totalConfigurations: number;
    shortlistedConfigurations: number;
    humanResponses: number;
    createdAt: string;
}

/**
 * Output of CustomerTwinEngine.evaluate(). Perceived Sustainability is kept
 * as an independent perception signal — it is NOT folded into
 * `customerAcceptance` and is NOT reused inside the Sustainability Index,
 * to avoid double-counting the same construct in the decision model.
 */
export interface AIEvaluation {
    purchaseIntention: number;
    packagingAttractiveness: number;
    priceAcceptance: number;
    culturalAuthenticity: number;
    perceivedSustainability: number;
    customerAcceptance: number;
    decision: Decision;
    rationale: string;
    concern: string;
    evidenceSufficiency: EvidenceSufficiency;
    mainUncertainty: string;
}

export interface SustainabilityAssessment {
    recyclability: number;
    reusability: number;
    recycledContent: number;
    materialEfficiency: number;
    localMaterialPotential: number;
    overallScore: number;
}

export interface ProductConfiguration {
    id: string;
    experimentId: string;
    index: number;
    material: string;
    design: string;
    price: number;
    storytelling: string;
    language: string;
    tags: string[];
    status: 'Generated' | 'Screened' | 'Shortlisted' | 'Validated' | 'Recommended' | 'Rejected';
    aiEvaluation?: AIEvaluation;
    sustainability?: SustainabilityAssessment;
    humanScoreSummary?: HumanEvaluationSummary;
}

export interface HumanEvaluation {
    id: string;
    configurationId: string;
    respondentId: string;
    segment: string;
    ageGroup: string;
    travelType: string;
    purchaseIntention: number;
    packagingAttractiveness: number;
    priceAcceptance: number;
    culturalAuthenticity: number;
    perceivedSustainability: number;
    decision: Decision;
    comment?: string;
}

export interface HumanEvaluationSummary {
    count: number;
    avgPurchaseIntention: number;
    avgPackagingAttractiveness: number;
    avgPriceAcceptance: number;
    avgCulturalAuthenticity: number;
    avgPerceivedSustainability: number;
    customerAcceptance: number;
    buyRate: number;
}

export const MIN_RESPONSES_FOR_CALIBRATION = 10;

export type CalibrationStatus = 'PENDING' | 'AVAILABLE';

export interface CalibrationResult {
    configurationId: string;
    spearmanRho: number;
    mae: number;
    decisionAgreement: number;
    stability: number;
    respondentCount: number;
}

export interface ConstraintSettings {
    maxPrice: number | null;
    minSustainability: number | null;
    preferredMaterials: string[];
    requireCulturalStory: boolean;
}

export interface DecisionScenario {
    id: 'balanced' | 'sustainability-priority' | 'market-priority';
    label: string;
    acceptanceWeight: number;
    sustainabilityWeight: number;
}

export interface DecisionResult {
    configurationId: string;
    customerAcceptance: number;
    sustainability: number;
    decisionScore: number;
    usesCalibratedAcceptance: boolean;
}

export interface DecisionTrace {
    configurationId: string;
    customerAcceptance: number;
    sustainability: number;
    decisionScore: number;
    evidenceSufficiency: EvidenceSufficiency;
    strengths: string[];
    tradeoffs: string[];
    nextAction: 'Physical Prototype' | 'Human Test' | 'Collect More Evidence';
    confidenceStatus: 'High Evidence' | 'Medium Evidence' | 'Low Evidence';
    confidenceReason: string;
}

export interface CustomerPersona {
    id: string;
    name: string;
    description: string;
    ageRange: string;
    travelBehavior: string;
    priorities: string[];
    concerns: string[];
    purchaseBehavior: string;
    preferredCharacteristics: string[];
}

/** Prototype Balanced Decision Rule weights — NOT empirically validated. */
export interface RecommendationWeights {
    acceptanceWeight: number;
    sustainabilityWeight: number;
}

export interface Recommendation extends DecisionTrace {
    rank: number;
}

export interface EvidenceSource {
    id: string;
    title: string;
    authors: string;
    year: number;
    doi?: string;
    variables: string[];
    findings: { label: string; value: string }[];
    note: string;
}
