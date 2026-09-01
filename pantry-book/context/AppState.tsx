import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { resolveCanonical } from '@/lib/canonical';
import { rankRecipes } from '@/lib/matching';
import { fetchRecipesForIngredients } from '@/lib/mealdb';
import { DEMO_PANTRY, SEED_RECIPES } from '@/lib/seed';
import { loadPantry, loadShoppingList, savePantry, saveShoppingList } from '@/lib/storage';
import type { FoodCategory, MatchedRecipe, MealType, PantryItem, Recipe, ShoppingListItem } from '@/lib/types';

type AppStateValue = {
  ready: boolean;
  pantry: PantryItem[];
  shoppingList: ShoppingListItem[];
  recipes: Recipe[];
  matchedRecipes: MatchedRecipe[];
  mealFilter: MealType | 'All';
  setMealFilter: (value: MealType | 'All') => void;
  addPantryItem: (item: PantryItem) => void;
  addManualItem: (name: string, category?: FoodCategory) => PantryItem;
  removePantryItem: (id: string) => void;
  adjustQuantity: (id: string, delta: number) => void;
  fillDemoPantry: () => void;
  clearPantry: () => void;
  addMissingToList: (recipe: MatchedRecipe) => number;
  toggleListItem: (id: string) => void;
  removeListItem: (id: string) => void;
  refreshRecipes: () => Promise<void>;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [remoteRecipes, setRemoteRecipes] = useState<Recipe[]>([]);
  const [mealFilter, setMealFilter] = useState<MealType | 'All'>('All');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [storedPantry, storedList] = await Promise.all([loadPantry(), loadShoppingList()]);
      if (cancelled) return;
      setPantry(storedPantry);
      setShoppingList(storedList);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (ready) savePantry(pantry).catch(() => undefined);
  }, [pantry, ready]);

  useEffect(() => {
    if (ready) saveShoppingList(shoppingList).catch(() => undefined);
  }, [shoppingList, ready]);

  const recipes = useMemo(() => {
    const seen = new Set<string>();
    const merged: Recipe[] = [];
    for (const recipe of [...SEED_RECIPES, ...remoteRecipes]) {
      const key = recipe.title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(recipe);
    }
    return merged;
  }, [remoteRecipes]);

  const matchedRecipes = useMemo(() => {
    const ranked = rankRecipes(recipes, pantry);
    if (mealFilter === 'All') return ranked;
    return ranked.filter((recipe) => recipe.mealType === mealFilter);
  }, [recipes, pantry, mealFilter]);

  const addPantryItem = useCallback((item: PantryItem) => {
    setPantry((current) => {
      const existing = current.find(
        (entry) =>
          entry.canonicalId === item.canonicalId ||
          (item.barcode && entry.barcode === item.barcode)
      );
      if (existing) {
        return current.map((entry) =>
          entry.id === existing.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }
      return [item, ...current];
    });
  }, []);

  const addManualItem = useCallback((name: string, category?: FoodCategory) => {
    const canonical = resolveCanonical(name);
    const item: PantryItem = {
      id: `pantry_manual_${Date.now()}`,
      rawTitle: name,
      canonicalId: canonical.id,
      category: category ?? canonical.category,
      quantity: 1,
      unit: 'item',
      addedAt: new Date().toISOString(),
    };
    addPantryItem(item);
    return item;
  }, [addPantryItem]);

  const removePantryItem = useCallback((id: string) => {
    setPantry((current) => current.filter((item) => item.id !== id));
  }, []);

  const adjustQuantity = useCallback((id: string, delta: number) => {
    setPantry((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const fillDemoPantry = useCallback(() => {
    setPantry(DEMO_PANTRY);
  }, []);

  const clearPantry = useCallback(() => {
    setPantry([]);
  }, []);

  const addMissingToList = useCallback((recipe: MatchedRecipe) => {
    let added = 0;
    setShoppingList((current) => {
      const next = [...current];
      for (const ingredient of recipe.match.missingIngredients) {
        const already = next.some((item) => item.canonicalId === ingredient.canonicalId && !item.isChecked);
        if (already) continue;
        next.push({
          id: `shop_${ingredient.canonicalId}_${Date.now()}_${added}`,
          canonicalId: ingredient.canonicalId,
          displayName: ingredient.displayName,
          amount: ingredient.amount,
          unit: ingredient.unit,
          sourceRecipeTitle: recipe.title,
          isChecked: false,
        });
        added += 1;
      }
      return next;
    });
    return recipe.match.missingIngredients.length;
  }, []);

  const toggleListItem = useCallback((id: string) => {
    setShoppingList((current) =>
      current.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item))
    );
  }, []);

  const removeListItem = useCallback((id: string) => {
    setShoppingList((current) => current.filter((item) => item.id !== id));
  }, []);

  const refreshRecipes = useCallback(async () => {
    const names = pantry.map((item) => item.canonicalId.replace(/^ing_/, '').replace(/_/g, ' '));
    if (names.length === 0) {
      setRemoteRecipes([]);
      return;
    }
    const fetched = await fetchRecipesForIngredients(names);
    setRemoteRecipes(fetched);
  }, [pantry]);

  useEffect(() => {
    if (!ready) return;
    refreshRecipes().catch(() => undefined);
  }, [ready, pantry.length, refreshRecipes]);

  const value = useMemo(
    () => ({
      ready,
      pantry,
      shoppingList,
      recipes,
      matchedRecipes,
      mealFilter,
      setMealFilter,
      addPantryItem,
      addManualItem,
      removePantryItem,
      adjustQuantity,
      fillDemoPantry,
      clearPantry,
      addMissingToList,
      toggleListItem,
      removeListItem,
      refreshRecipes,
    }),
    [
      ready,
      pantry,
      shoppingList,
      recipes,
      matchedRecipes,
      mealFilter,
      addPantryItem,
      addManualItem,
      removePantryItem,
      adjustQuantity,
      fillDemoPantry,
      clearPantry,
      addMissingToList,
      toggleListItem,
      removeListItem,
      refreshRecipes,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return value;
}
