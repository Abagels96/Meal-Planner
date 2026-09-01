import { ingredientImage } from './canonical';
import type { PantryItem, Recipe } from './types';

function pantry(
  canonicalId: string,
  rawTitle: string,
  category: PantryItem['category'],
  imageName: string
): PantryItem {
  return {
    id: `demo_${canonicalId}`,
    rawTitle,
    canonicalId,
    category,
    quantity: 1,
    unit: 'item',
    imageUrl: ingredientImage(imageName),
    addedAt: new Date().toISOString(),
  };
}

export const DEMO_PANTRY: PantryItem[] = [
  pantry('ing_tomato_paste', 'Tomato Paste', 'Canned Goods', 'Tomato Puree'),
  pantry('ing_diced_tomatoes', 'Diced Tomatoes', 'Canned Goods', 'Chopped Tomatoes'),
  pantry('ing_black_beans', 'Black Beans', 'Canned Goods', 'Black Beans'),
  pantry('ing_spaghetti', 'Spaghetti', 'Grains', 'Spaghetti'),
  pantry('ing_rice', 'Long Grain Rice', 'Grains', 'Rice'),
  pantry('ing_oats', 'Rolled Oats', 'Grains', 'Oats'),
  pantry('ing_flour', 'All-Purpose Flour', 'Baking', 'Flour'),
  pantry('ing_sugar', 'Granulated Sugar', 'Baking', 'Sugar'),
  pantry('ing_garlic', 'Garlic', 'Produce', 'Garlic'),
  pantry('ing_onion', 'Yellow Onion', 'Produce', 'Onion'),
  pantry('ing_banana', 'Bananas', 'Produce', 'Banana'),
  pantry('ing_eggs', 'Eggs', 'Dairy', 'Egg'),
  pantry('ing_milk', 'Milk', 'Dairy', 'Milk'),
  pantry('ing_butter', 'Butter', 'Dairy', 'Butter'),
  pantry('ing_chicken', 'Chicken', 'Proteins', 'Chicken'),
  pantry('ing_cumin', 'Ground Cumin', 'Spices', 'Cumin'),
];

export const SEED_RECIPES: Recipe[] = [
  {
    id: 'rec_spaghetti_marinara',
    title: 'Quick Spaghetti Marinara',
    mealType: 'Dinner',
    prepTimeMins: 20,
    imageUrl: 'https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg',
    source: 'seed',
    ingredients: [
      { canonicalId: 'ing_spaghetti', displayName: 'Spaghetti', amount: 12, unit: 'oz', isPantryStaple: false },
      { canonicalId: 'ing_tomato_paste', displayName: 'Tomato paste', amount: 2, unit: 'tbsp', isPantryStaple: false },
      { canonicalId: 'ing_diced_tomatoes', displayName: 'Diced tomatoes', amount: 1, unit: 'can', isPantryStaple: false },
      { canonicalId: 'ing_garlic', displayName: 'Garlic', amount: 2, unit: 'cloves', isPantryStaple: false },
      { canonicalId: 'ing_onion', displayName: 'Onion', amount: 0.5, unit: 'item', isPantryStaple: false },
      { canonicalId: 'ing_olive_oil', displayName: 'Olive oil', amount: 1, unit: 'tbsp', isPantryStaple: true },
      { canonicalId: 'ing_salt', displayName: 'Salt', amount: 1, unit: 'tsp', isPantryStaple: true },
    ],
    instructions: [
      'Boil spaghetti in salted water until al dente.',
      'Soften onion and garlic in olive oil.',
      'Stir in tomato paste and diced tomatoes. Simmer 10 minutes.',
      'Toss pasta with sauce and serve warm.',
    ],
  },
  {
    id: 'rec_overnight_oats',
    title: 'Cinnamon Banana Oats',
    mealType: 'Breakfast',
    prepTimeMins: 10,
    imageUrl: 'https://www.themealdb.com/images/media/meals/1550441882.jpg',
    source: 'seed',
    ingredients: [
      { canonicalId: 'ing_oats', displayName: 'Rolled oats', amount: 1, unit: 'cup', isPantryStaple: false },
      { canonicalId: 'ing_milk', displayName: 'Milk', amount: 1, unit: 'cup', isPantryStaple: false },
      { canonicalId: 'ing_banana', displayName: 'Banana', amount: 1, unit: 'item', isPantryStaple: false },
      { canonicalId: 'ing_cinnamon', displayName: 'Cinnamon', amount: 0.5, unit: 'tsp', isPantryStaple: false },
      { canonicalId: 'ing_honey', displayName: 'Honey', amount: 1, unit: 'tbsp', isPantryStaple: false },
    ],
    instructions: [
      'Stir oats, milk, and cinnamon together.',
      'Slice banana over the top and drizzle with honey.',
      'Chill 20 minutes or overnight.',
    ],
  },
  {
    id: 'rec_black_bean_tacos',
    title: 'Black Bean Skillet Tacos',
    mealType: 'Lunch',
    prepTimeMins: 18,
    imageUrl: 'https://www.themealdb.com/images/media/meals/qtuwxu1468233098.jpg',
    source: 'seed',
    ingredients: [
      { canonicalId: 'ing_black_beans', displayName: 'Black beans', amount: 1, unit: 'can', isPantryStaple: false },
      { canonicalId: 'ing_onion', displayName: 'Onion', amount: 0.5, unit: 'item', isPantryStaple: false },
      { canonicalId: 'ing_cumin', displayName: 'Cumin', amount: 1, unit: 'tsp', isPantryStaple: false },
      { canonicalId: 'ing_tortilla', displayName: 'Tortillas', amount: 4, unit: 'item', isPantryStaple: false },
      { canonicalId: 'ing_cheese', displayName: 'Cheese', amount: 0.5, unit: 'cup', isPantryStaple: false },
    ],
    instructions: [
      'Warm beans with onion and cumin.',
      'Spoon into tortillas and finish with cheese.',
    ],
  },
  {
    id: 'rec_veggie_omelette',
    title: 'Garden Skillet Omelette',
    mealType: 'Breakfast',
    prepTimeMins: 12,
    imageUrl: 'https://www.themealdb.com/images/media/meals/ytpstt1511387478.jpg',
    source: 'seed',
    ingredients: [
      { canonicalId: 'ing_eggs', displayName: 'Eggs', amount: 3, unit: 'item', isPantryStaple: false },
      { canonicalId: 'ing_milk', displayName: 'Milk', amount: 2, unit: 'tbsp', isPantryStaple: false },
      { canonicalId: 'ing_spinach', displayName: 'Spinach', amount: 1, unit: 'cup', isPantryStaple: false },
      { canonicalId: 'ing_cheese', displayName: 'Cheese', amount: 0.25, unit: 'cup', isPantryStaple: false },
      { canonicalId: 'ing_butter', displayName: 'Butter', amount: 1, unit: 'tbsp', isPantryStaple: false },
    ],
    instructions: [
      'Beat eggs with milk.',
      'Melt butter, add spinach, then pour in eggs.',
      'Fold in cheese and cook until just set.',
    ],
  },
  {
    id: 'rec_chicken_rice',
    title: 'Garlic Chicken and Rice',
    mealType: 'Dinner',
    prepTimeMins: 35,
    imageUrl: 'https://www.themealdb.com/images/media/meals/1529444830.jpg',
    source: 'seed',
    ingredients: [
      { canonicalId: 'ing_chicken', displayName: 'Chicken', amount: 1, unit: 'lb', isPantryStaple: false },
      { canonicalId: 'ing_rice', displayName: 'Rice', amount: 1, unit: 'cup', isPantryStaple: false },
      { canonicalId: 'ing_garlic', displayName: 'Garlic', amount: 3, unit: 'cloves', isPantryStaple: false },
      { canonicalId: 'ing_onion', displayName: 'Onion', amount: 1, unit: 'item', isPantryStaple: false },
      { canonicalId: 'ing_broth', displayName: 'Broth', amount: 2, unit: 'cups', isPantryStaple: false },
    ],
    instructions: [
      'Brown chicken with onion and garlic.',
      'Add rice and broth. Cover and simmer until tender.',
    ],
  },
  {
    id: 'rec_banana_bread',
    title: 'Skillet Banana Bread',
    mealType: 'Dessert',
    prepTimeMins: 50,
    imageUrl: 'https://www.themealdb.com/images/media/meals/yypwwq1511304979.jpg',
    source: 'seed',
    ingredients: [
      { canonicalId: 'ing_banana', displayName: 'Ripe bananas', amount: 3, unit: 'item', isPantryStaple: false },
      { canonicalId: 'ing_flour', displayName: 'Flour', amount: 1.5, unit: 'cups', isPantryStaple: false },
      { canonicalId: 'ing_sugar', displayName: 'Sugar', amount: 0.5, unit: 'cup', isPantryStaple: false },
      { canonicalId: 'ing_eggs', displayName: 'Egg', amount: 1, unit: 'item', isPantryStaple: false },
      { canonicalId: 'ing_butter', displayName: 'Butter', amount: 4, unit: 'tbsp', isPantryStaple: false },
    ],
    instructions: [
      'Mash bananas and stir in melted butter, sugar, and egg.',
      'Fold in flour and bake at 350°F until a toothpick comes out clean.',
    ],
  },
];
