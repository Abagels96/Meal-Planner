import type { CanonicalItem, FoodCategory } from './types';

export const CANONICAL_ITEMS: CanonicalItem[] = [
  { id: 'ing_tomato_paste', name: 'tomato paste', category: 'Canned Goods' },
  { id: 'ing_diced_tomatoes', name: 'diced tomatoes', category: 'Canned Goods' },
  { id: 'ing_tomato_sauce', name: 'tomato sauce', category: 'Canned Goods' },
  { id: 'ing_black_beans', name: 'black beans', category: 'Canned Goods' },
  { id: 'ing_chickpeas', name: 'chickpeas', category: 'Canned Goods' },
  { id: 'ing_tuna', name: 'tuna', category: 'Canned Goods' },
  { id: 'ing_broth', name: 'broth', category: 'Canned Goods' },
  { id: 'ing_coconut_milk', name: 'coconut milk', category: 'Canned Goods' },
  { id: 'ing_spaghetti', name: 'spaghetti', category: 'Grains' },
  { id: 'ing_pasta', name: 'pasta', category: 'Grains' },
  { id: 'ing_rice', name: 'rice', category: 'Grains' },
  { id: 'ing_oats', name: 'oats', category: 'Grains' },
  { id: 'ing_bread', name: 'bread', category: 'Grains' },
  { id: 'ing_tortilla', name: 'tortilla', category: 'Grains' },
  { id: 'ing_flour', name: 'flour', category: 'Baking' },
  { id: 'ing_sugar', name: 'sugar', category: 'Baking' },
  { id: 'ing_baking_powder', name: 'baking powder', category: 'Baking' },
  { id: 'ing_salt', name: 'salt', category: 'Spices' },
  { id: 'ing_pepper', name: 'black pepper', category: 'Spices' },
  { id: 'ing_cumin', name: 'cumin', category: 'Spices' },
  { id: 'ing_paprika', name: 'paprika', category: 'Spices' },
  { id: 'ing_cinnamon', name: 'cinnamon', category: 'Spices' },
  { id: 'ing_garlic', name: 'garlic', category: 'Produce' },
  { id: 'ing_onion', name: 'onion', category: 'Produce' },
  { id: 'ing_bell_pepper', name: 'bell pepper', category: 'Produce' },
  { id: 'ing_tomato', name: 'tomato', category: 'Produce' },
  { id: 'ing_banana', name: 'banana', category: 'Produce' },
  { id: 'ing_lemon', name: 'lemon', category: 'Produce' },
  { id: 'ing_lime', name: 'lime', category: 'Produce' },
  { id: 'ing_spinach', name: 'spinach', category: 'Produce' },
  { id: 'ing_potato', name: 'potato', category: 'Produce' },
  { id: 'ing_carrot', name: 'carrot', category: 'Produce' },
  { id: 'ing_avocado', name: 'avocado', category: 'Produce' },
  { id: 'ing_cilantro', name: 'cilantro', category: 'Produce' },
  { id: 'ing_eggs', name: 'eggs', category: 'Dairy' },
  { id: 'ing_milk', name: 'milk', category: 'Dairy' },
  { id: 'ing_butter', name: 'butter', category: 'Dairy' },
  { id: 'ing_cheese', name: 'cheese', category: 'Dairy' },
  { id: 'ing_yogurt', name: 'yogurt', category: 'Dairy' },
  { id: 'ing_chicken', name: 'chicken', category: 'Proteins' },
  { id: 'ing_beef', name: 'beef', category: 'Proteins' },
  { id: 'ing_olive_oil', name: 'olive oil', category: 'Other' },
  { id: 'ing_soy_sauce', name: 'soy sauce', category: 'Other' },
  { id: 'ing_honey', name: 'honey', category: 'Other' },
];

const STAPLES = new Set(['ing_salt', 'ing_pepper', 'ing_olive_oil', 'ing_water']);

const BRAND_WORDS = [
  'heinz', 'hunt', 'hunts', 'del monte', 'campbell', 'prego', 'barilla',
  'kraft', 'nestle', 'great value', 'kirkland', 'organic', 'original',
  'classic', 'homestyle', 'select', 'premium',
];

const ALIASES: Record<string, string> = {
  'tomato paste': 'ing_tomato_paste',
  'tomatoes diced': 'ing_diced_tomatoes',
  'diced tomato': 'ing_diced_tomatoes',
  'crushed tomato': 'ing_diced_tomatoes',
  'canned tomato': 'ing_diced_tomatoes',
  'tomato sauce': 'ing_tomato_sauce',
  'marinara': 'ing_tomato_sauce',
  'black bean': 'ing_black_beans',
  'garbanzo': 'ing_chickpeas',
  'chick pea': 'ing_chickpeas',
  'spaghetti': 'ing_spaghetti',
  'linguine': 'ing_pasta',
  'penne': 'ing_pasta',
  'fettuccine': 'ing_pasta',
  'macaroni': 'ing_pasta',
  'pasta': 'ing_pasta',
  'white rice': 'ing_rice',
  'brown rice': 'ing_rice',
  'jasmine rice': 'ing_rice',
  'rolled oat': 'ing_oats',
  'oatmeal': 'ing_oats',
  'old fashioned oat': 'ing_oats',
  'all purpose flour': 'ing_flour',
  'flour': 'ing_flour',
  'granulated sugar': 'ing_sugar',
  'black pepper': 'ing_pepper',
  'ground pepper': 'ing_pepper',
  'chicken broth': 'ing_broth',
  'chicken stock': 'ing_broth',
  'vegetable broth': 'ing_broth',
  'bell pepper': 'ing_bell_pepper',
  'red pepper': 'ing_bell_pepper',
  'green pepper': 'ing_bell_pepper',
  'tortilla': 'ing_tortilla',
  'egg': 'ing_eggs',
  'whole milk': 'ing_milk',
  'cheddar': 'ing_cheese',
  'mozzarella': 'ing_cheese',
  'parmesan': 'ing_cheese',
  'chicken breast': 'ing_chicken',
  'chicken thigh': 'ing_chicken',
  'ground beef': 'ing_beef',
  'soy sauce': 'ing_soy_sauce',
  'olive oil': 'ing_olive_oil',
};

export const SHELF_ORDER: FoodCategory[] = [
  'Canned Goods',
  'Grains',
  'Spices',
  'Produce',
  'Dairy',
  'Proteins',
  'Baking',
  'Other',
];

export function isStaple(canonicalId: string): boolean {
  return STAPLES.has(canonicalId);
}

export function toCanonicalId(name: string): string {
  return `ing_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
}

export function cleanProductName(raw: string): string {
  let text = raw.toLowerCase();
  text = text.replace(/\b\d+(\.\d+)?\s?(oz|ounce|lb|lbs|g|kg|ml|l|ct|count|pack)\b/g, '');
  text = text.replace(/\b\d+\b/g, '');
  for (const brand of BRAND_WORDS) {
    text = text.replace(new RegExp(`\\b${brand}\\b`, 'g'), '');
  }
  return text.replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function resolveCanonical(rawTitle: string): CanonicalItem {
  const cleaned = cleanProductName(rawTitle);

  for (const [alias, id] of Object.entries(ALIASES)) {
    if (cleaned.includes(alias)) {
      const item = CANONICAL_ITEMS.find((entry) => entry.id === id);
      if (item) return item;
    }
  }

  const exact = CANONICAL_ITEMS.find((entry) => cleaned.includes(entry.name));
  if (exact) return exact;

  const words = cleaned.split(' ').filter((word) => word.length > 3);
  const fuzzy = CANONICAL_ITEMS.find((entry) =>
    words.some((word) => entry.name.includes(word) || word.includes(entry.name.split(' ')[0]))
  );
  if (fuzzy) return fuzzy;

  return {
    id: toCanonicalId(cleaned || rawTitle),
    name: cleaned || rawTitle.toLowerCase(),
    category: 'Other',
  };
}

export function ingredientImage(name: string): string {
  const slug = name.replace(/\s+/g, '%20');
  return `https://www.themealdb.com/images/ingredients/${slug}.png`;
}
