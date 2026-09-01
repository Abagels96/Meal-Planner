import { resolveCanonical } from './canonical';
import type { FoodCategory, PantryItem } from './types';

type OffProduct = {
  product_name?: string;
  product_name_en?: string;
  image_url?: string;
  image_front_url?: string;
  categories_tags?: string[];
  quantity?: string;
};

const CATEGORY_MAP: { tag: string; category: FoodCategory }[] = [
  { tag: 'canned', category: 'Canned Goods' },
  { tag: 'pasta', category: 'Grains' },
  { tag: 'cereal', category: 'Grains' },
  { tag: 'rice', category: 'Grains' },
  { tag: 'spice', category: 'Spices' },
  { tag: 'herb', category: 'Spices' },
  { tag: 'fruit', category: 'Produce' },
  { tag: 'vegetable', category: 'Produce' },
  { tag: 'dair', category: 'Dairy' },
  { tag: 'cheese', category: 'Dairy' },
  { tag: 'egg', category: 'Dairy' },
  { tag: 'meat', category: 'Proteins' },
  { tag: 'seafood', category: 'Proteins' },
  { tag: 'fish', category: 'Proteins' },
  { tag: 'poultry', category: 'Proteins' },
  { tag: 'flour', category: 'Baking' },
  { tag: 'sugar', category: 'Baking' },
  { tag: 'baking', category: 'Baking' },
];

function categoryFromTags(tags: string[] = []): FoodCategory | null {
  const joined = tags.join(' ').toLowerCase();
  const hit = CATEGORY_MAP.find(({ tag }) => joined.includes(tag));
  return hit?.category ?? null;
}

export async function lookupBarcode(barcode: string): Promise<PantryItem> {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
    {
      headers: {
        'User-Agent': 'PantryBook/1.0 (meal-planner; educational)',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Could not reach Open Food Facts.');
  }

  const data = (await response.json()) as { status?: number; product?: OffProduct };
  if (data.status !== 1 || !data.product) {
    throw new Error('That barcode is not in the food database yet.');
  }

  const rawTitle = data.product.product_name_en || data.product.product_name || `Item ${barcode}`;
  const canonical = resolveCanonical(rawTitle);
  const category = categoryFromTags(data.product.categories_tags) ?? canonical.category;

  return {
    id: `pantry_${barcode}_${Date.now()}`,
    barcode,
    rawTitle,
    canonicalId: canonical.id,
    category,
    quantity: 1,
    unit: 'item',
    imageUrl: data.product.image_front_url || data.product.image_url,
    addedAt: new Date().toISOString(),
  };
}
