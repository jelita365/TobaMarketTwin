export const SUSTAINABLE_MATERIALS = ['Recycled Kraft Paper', 'Bamboo Fiber'] as const;

export const CULTURAL_DESIGNS = ['Batak Gorga', 'Modern Ulos'] as const;

export const MATERIAL_SUSTAINABILITY_BIAS: Record<string, number> = {
    'Recycled Kraft Paper': 0.9,
    'Bamboo Fiber': 0.8,
    'Conventional Laminated Plastic': -0.9,
};

export function isSustainableMaterial(material: string): boolean {
    return (SUSTAINABLE_MATERIALS as readonly string[]).includes(material);
}

export function isCulturalDesign(design: string): boolean {
    return (CULTURAL_DESIGNS as readonly string[]).includes(design);
}
