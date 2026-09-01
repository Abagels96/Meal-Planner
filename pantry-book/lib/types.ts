export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert';

export type FoodCategory =
  | 'Canned Goods'
  | 'Grains'
  | 'Spices'
  | 'Produce'
  | 'Dairy'
  | 'Proteins'
  | 'Baking'
  | 'Other';

export type CanonicalItem = {
  id: string;
  name: string;
  category: FoodCategory;
};

export type PantryItem = {
  id: string;
  barcode?: string;
  rawTitle: string;
  canonicalId: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  imageUrl?: string;
  addedAt: string;
};

export type RecipeIngredient = {
  canonicalId: string;
  displayName: string;
  amount: number;
  unit: string;
  isPantryStaple: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  mealType: MealType;
  prepTimeMins: number;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  source: 'seed' | 'themealdb';
};

export type RecipeMatch = {
  recipeId: string;
  matchPercentage: number;
  hasAllIngredients: boolean;
  ownedIngredients: string[];
  missingIngredients: RecipeIngredient[];
};

export type MatchedRecipe = Recipe & { match: RecipeMatch };

export type ShoppingListItem = {
  id: string;
  canonicalId: string;
  displayName: string;
  amount: number;
  unit: string;
  sourceRecipeTitle?: string;
  isChecked: boolean;
};
