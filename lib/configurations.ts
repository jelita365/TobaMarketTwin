import { ConfigOption, ProductConfiguration } from '@/types';
import { hashString, seededRandom } from './rng';

const SUSTAINABLE_MATERIALS = ['Recycled Kraft Paper', 'Bamboo Fiber'];
const CULTURAL_DESIGNS = ['Batak Gorga', 'Modern Ulos'];

function tagsFor(cfg: {
    material: string;
    design: string;
    storytelling: string;
}): string[] {
    const tags: string[] = [];
    if (SUSTAINABLE_MATERIALS.includes(cfg.material)) tags.push('Sustainable Material');
    if (CULTURAL_DESIGNS.includes(cfg.design)) tags.push('Cultural Identity');
    if (cfg.storytelling === 'Cultural Story') tags.push('Cultural Story');
    return tags;
}

/** Generates the full cartesian product of configuration options for an experiment. */
export function generateConfigurations(
    experimentId: string,
    options: ConfigOption
): ProductConfiguration[] {
    const result: ProductConfiguration[] = [];
    let index = 0;

    for (const material of options.materials) {
        for (const design of options.designs) {
            for (const price of options.prices) {
                for (const storytelling of options.storytelling) {
                    index += 1;
                    const id = `CFG-${String(index).padStart(3, '0')}`;
                    result.push({
                        id,
                        experimentId,
                        index,
                        material,
                        design,
                        price,
                        storytelling,
                        tags: tagsFor({ material, design, storytelling }),
                        status: 'Generated',
                    });
                }
            }
        }
    }

    return result;
}

export function totalCombinations(options: ConfigOption): number {
    return (
        options.materials.length *
        options.designs.length *
        options.prices.length *
        options.storytelling.length
    );
}

/** A configuration's own seed, stable across runs, derived from its id. */
export function configSeed(configId: string): number {
    return hashString(configId);
}

export function rand01For(configId: string, salt: string): number {
    const rng = seededRandom(configSeed(configId + salt));
    return rng();
}
