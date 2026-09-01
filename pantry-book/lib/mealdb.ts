import { isStaple, resolveCanonical } from './canonical';
import type { MealType, Recipe, RecipeIngredient } from './types';

type MealSummary = { idMeal: string; strMeal: string; strMealThumb: string };
type MealDetail = MealSummary & {
  strCategory?: string;
  strInstructions?: string;
  [key: string]: string | undefined;
};

function mealTypeFromCategory(category?: string): MealType {
  const value = (category ?? '').toLowerCase();
  if (value.includes('breakfast')) return 'Breakfast';
  if (value.includes('dessert')) return 'Dessert';
  if (value.includes('starter') || value.includes('side') || value.includes('salad')) return 'Lunch';
  return 'Dinner';
}

function parseIngredients(meal: MealDetail): RecipeIngredient[] {
  const ingredients: RecipeIngredient[] = [];

  for (let index = 1; index <= 20; index += 1) {
    const name = meal[`strIngredient${index}`]?.trim();
    const measure = meal[`strMeasure${index}`]?.trim() ?? '';
    if (!name) continue;

    const canonical = resolveCanonical(name);
    const amountMatch = measure.match(/[\d./]+/);
    ingredients.push({
      canonicalId: canonical.id,
      displayName: name,
      amount: amountMatch ? Number.parseFloat(amountMatch[0]) || 1 : 1,
      unit: measure.replace(/[\d./]+/, '').trim() || 'item',
      isPantryStaple: isStaple(canonical.id),
    });
  }

  return ingredients;
}

function toRecipe(meal: MealDetail): Recipe {
  return {
    id: `themealdb_${meal.idMeal}`,
    title: meal.strMeal,
    mealType: mealTypeFromCategory(meal.strCategory),
    prepTimeMins: 30,
    imageUrl: meal.strMealThumb,
    ingredients: parseIngredients(meal),
    instructions: (meal.strInstructions ?? '')
      .split(/\r?\n/)
      .map((step) => step.trim())
      .filter(Boolean),
    source: 'themealdb',
  };
}

async function lookupMeal(id: string): Promise<Recipe | null> {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  if (!response.ok) return null;
  const data = (await response.json()) as { meals?: MealDetail[] | null };
  const meal = data.meals?.[0];
  return meal ? toRecipe(meal) : null;
}

export async function fetchRecipesForIngredients(names: string[]): Promise<Recipe[]> {
  const unique = [...new Set(names.map((name) => name.split('_').pop() ?? name))]
    .filter((name) => name.length > 2)
    .slice(0, 6);

  const summaries = new Map<string, MealSummary>();

  await Promise.all(
    unique.map(async (name) => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(name)}`
        );
        if (!response.ok) return;
        const data = (await response.json()) as { meals?: MealSummary[] | null };
        for (const meal of data.meals ?? []) {
          summaries.set(meal.idMeal, meal);
        }
      } catch {
        // Keep local seed recipes if TheMealDB is unreachable.
      }
    })
  );

  const ids = [...summaries.keys()].slice(0, 10);
  const recipes = await Promise.all(ids.map(lookupMeal));
  return recipes.filter((recipe): recipe is Recipe => recipe !== null);
}
