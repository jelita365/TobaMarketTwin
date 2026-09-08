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

export interface AIEvaluation {
    purchaseIntention: number;
    packagingAttractiveness: number;
    priceAcceptance: number;
    culturalAuthenticity: number;
    perceivedSustainability: number;
    overallAcceptance: number;
    decision: Decision;
    rationale: string;
    concern: string;
    evidenceSufficiency: EvidenceSufficiency;
}

export interface SustainabilityAssessment {
    recyclability: number;
    reusability: number;
    recycledContent: number;
    materialEfficiency: number;
    localMaterialPotential: number;
    overallScore: number; // 0-100
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
    overallAcceptance: number; // 0-100
    buyRate: number; // %
}

export interface CalibrationResult {
    configurationId: string;
    spearmanRho: number;
    mae: number;
    decisionAgreement: number; // %
    stability: number;
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

export interface RecommendationWeights {
    customerAcceptance: number;
    sustainability: number;
    calibrationConfidence: number;
    priceAcceptance: number;
}

export interface Recommendation {
    rank: number;
    configurationId: string;
    score: number;
    sustainability: number;
    customerAcceptance: number;
    priceAcceptance: number;
    calibrationConfidence: number;
    reason: string;
    concern: string;
    nextAction: string;
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
