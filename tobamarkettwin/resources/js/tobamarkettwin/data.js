export const materials = ['Kraft Paper', 'Recycled Paper', 'Bioplastic'];
export const designs = ['Minimalis', 'Gorga Tradisional'];
export const prices = ['Rp35.000', 'Rp45.000', 'Rp50.000'];
export const stories = ['ID Only', 'Bilingual'];

const baseVariants = [
    {
        id: 'V1', material: 'Kraft Paper', design: 'Minimalis', price: 'Rp35.000', story: 'ID Only',
        sustainabilityScore: 65,
        aiScores: { purchase: 4.0, priceAcc: 4.5, packaging: 3.5, culture: 2.0, eco: 3.5 },
        aiAcceptance: 3.5, humanAcceptance: 3.4,
    },
    {
        id: 'V2', material: 'Recycled Paper', design: 'Gorga Tradisional', price: 'Rp45.000', story: 'Bilingual',
        sustainabilityScore: 88,
        aiScores: { purchase: 4.2, priceAcc: 3.8, packaging: 4.6, culture: 4.8, eco: 4.5 },
        aiAcceptance: 4.38, humanAcceptance: 4.25,
    },
    {
        id: 'V3', material: 'Bioplastic', design: 'Gorga Tradisional', price: 'Rp50.000', story: 'Bilingual',
        sustainabilityScore: 92,
        aiScores: { purchase: 3.5, priceAcc: 2.5, packaging: 4.0, culture: 4.5, eco: 4.8 },
        aiAcceptance: 3.86, humanAcceptance: 3.6,
    },
];

// Deterministic pseudo-random generator so the scatter plot is stable across renders.
function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

function generateExtraVariants() {
    const rand = seededRandom(42);
    const extra = [];
    for (let i = 4; i <= 12; i++) {
        const material = materials[Math.floor(rand() * materials.length)];
        const design = designs[Math.floor(rand() * designs.length)];
        const price = prices[Math.floor(rand() * prices.length)];
        const story = stories[Math.floor(rand() * stories.length)];
        const sustainabilityScore = Math.round(40 + rand() * 55);
        const humanAcceptance = Number((2.0 + rand() * 2.8).toFixed(2));
        const aiAcceptance = Number(Math.min(5, Math.max(1, humanAcceptance + (rand() - 0.5) * 0.4)).toFixed(2));
        const aiScores = {
            purchase: Number((2 + rand() * 3).toFixed(1)),
            priceAcc: Number((2 + rand() * 3).toFixed(1)),
            packaging: Number((2 + rand() * 3).toFixed(1)),
            culture: Number((2 + rand() * 3).toFixed(1)),
            eco: Number((2 + rand() * 3).toFixed(1)),
        };
        extra.push({
            id: `V${i}`, material, design, price, story,
            sustainabilityScore, aiScores, aiAcceptance, humanAcceptance,
        });
    }
    return extra;
}

export const dummyVariants = [...baseVariants, ...generateExtraVariants()];

export function isInSweetSpot(v) {
    return v.sustainabilityScore >= 80 && v.sustainabilityScore <= 100
        && v.humanAcceptance >= 4.0 && v.humanAcceptance <= 5.0;
}

export const topShortlist = [...dummyVariants]
    .sort((a, b) => (b.sustainabilityScore + b.humanAcceptance * 20) - (a.sustainabilityScore + a.humanAcceptance * 20))
    .slice(0, 3);
