import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PantryItem, ShoppingListItem } from './types';

const PANTRY_KEY = 'pantry-book/pantry';
const LIST_KEY = 'pantry-book/shopping';

export async function loadPantry(): Promise<PantryItem[]> {
  const raw = await AsyncStorage.getItem(PANTRY_KEY);
  return raw ? (JSON.parse(raw) as PantryItem[]) : [];
}

export async function savePantry(items: PantryItem[]): Promise<void> {
  await AsyncStorage.setItem(PANTRY_KEY, JSON.stringify(items));
}

export async function loadShoppingList(): Promise<ShoppingListItem[]> {
  const raw = await AsyncStorage.getItem(LIST_KEY);
  return raw ? (JSON.parse(raw) as ShoppingListItem[]) : [];
}

export async function saveShoppingList(items: ShoppingListItem[]): Promise<void> {
  await AsyncStorage.setItem(LIST_KEY, JSON.stringify(items));
}
