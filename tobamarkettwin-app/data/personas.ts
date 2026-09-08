import { CustomerPersona } from '@/types';

export const PERSONAS: CustomerPersona[] = [
    {
        id: 'persona-cultural-explorer',
        name: 'Cultural Explorer',
        description:
            'Illustrative Persona — Prototype persona derived from literature-informed and illustrative customer characteristics.',
        ageRange: '25-40',
        travelBehavior: 'Interested in local culture and authentic products.',
        priorities: ['Authenticity', 'Local identity', 'Storytelling'],
        concerns: ['Greenwashing', 'Generic mass-market design'],
        purchaseBehavior: 'Willing to pay a premium for culturally distinctive packaging.',
        preferredCharacteristics: ['Batak Gorga motifs', 'Bilingual storytelling', 'Cultural narrative'],
    },
    {
        id: 'persona-sustainable-traveler',
        name: 'Sustainable Traveler',
        description:
            'Illustrative Persona — Prototype persona derived from literature-informed and illustrative customer characteristics.',
        ageRange: '25-40',
        travelBehavior: 'Seeks environmentally responsible products while traveling.',
        priorities: ['Environmental responsibility', 'Reusability', 'Minimal packaging'],
        concerns: ['Greenwashing', 'Excessive packaging', 'High price'],
        purchaseBehavior: 'Compares recyclability and material sourcing before purchase.',
        preferredCharacteristics: ['Recycled Kraft Paper', 'Bamboo Fiber', 'Minimal design'],
    },
    {
        id: 'persona-gift-buyer',
        name: 'Gift Buyer',
        description:
            'Illustrative Persona — Prototype persona derived from literature-informed and illustrative customer characteristics.',
        ageRange: '30-50',
        travelBehavior: 'Shops for souvenirs and gifts representative of the destination.',
        priorities: ['Appearance', 'Packaging', 'Price', 'Gift suitability'],
        concerns: ['Packaging feels cheap', 'Not recognizable as a souvenir'],
        purchaseBehavior: 'Prioritizes visual appeal and gift-worthiness over price sensitivity.',
        preferredCharacteristics: ['Attractive box design', 'Cultural motifs', 'Clear product story'],
    },
    {
        id: 'persona-practical-tourist',
        name: 'Practical Tourist',
        description:
            'Illustrative Persona — Prototype persona derived from literature-informed and illustrative customer characteristics.',
        ageRange: '20-45',
        travelBehavior: 'Focused on convenience and value during short visits.',
        priorities: ['Price', 'Convenience', 'Product usefulness'],
        concerns: ['High price', 'Overly elaborate packaging'],
        purchaseBehavior: 'Chooses the most straightforward, reasonably priced option available.',
        preferredCharacteristics: ['Lower price tier', 'Simple minimal design', 'Clear product information'],
    },
];
