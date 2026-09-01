import { isStaple } from './canonical';
import type { MatchedRecipe, PantryItem, Recipe, RecipeIngredient, RecipeMatch } from './types';

function idsOverlap(left: string, right: string): boolean {
  if (left === right) return true;
  const a = left.replace(/^ing_/, '');
  const b = right.replace(/^ing_/, '');
  if (a.length < 4 || b.length < 4) return false;
  return a.includes(b) || b.includes(a);
}

export function pantryHas(canonicalId: string, owned: string[]): boolean {
  return owned.some((id) => idsOverlap(id, canonicalId));
}

export function matchRecipe(recipe: Recipe, pantryCanonicalIds: string[]): RecipeMatch {
  const required = recipe.ingredients.filter((ingredient) => !isStaple(ingredient.canonicalId));
  const pool = required.length > 0 ? required : recipe.ingredients;

  const ownedIngredients: string[] = [];
  const missingIngredients: RecipeIngredient[] = [];

  for (const ingredient of pool) {
    if (pantryHas(ingredient.canonicalId, pantryCanonicalIds)) {
      ownedIngredients.push(ingredient.canonicalId);
    } else {
      missingIngredients.push(ingredient);
    }
  }

  const matchPercentage = pool.length === 0 ? 0 : (ownedIngredients.length / pool.length) * 100;

  return {
    recipeId: recipe.id,
    matchPercentage,
    hasAllIngredients: missingIngredients.length === 0 && pool.length > 0,
    ownedIngredients,
    missingIngredients,
  };
}

export function rankRecipes(recipes: Recipe[], pantry: PantryItem[]): MatchedRecipe[] {
  const owned = [...new Set(pantry.map((item) => item.canonicalId))];

  return recipes
    .map((recipe) => ({ ...recipe, match: matchRecipe(recipe, owned) }))
    .sort((a, b) => {
      if (b.match.matchPercentage !== a.match.matchPercentage) {
        return b.match.matchPercentage - a.match.matchPercentage;
      }
      return a.title.localeCompare(b.title);
    });
}
