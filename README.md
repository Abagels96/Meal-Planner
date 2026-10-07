# Pantry Book

A $0-cost virtual pantry and recipe book. Scan the barcodes on your cans and boxes, watch them land on wooden shelves sorted by food type, then flip through a leather-bound recipe book that ranks meals by how much of the recipe your pantry already covers. Anything you're missing goes straight onto a shopping list.

## Stack

| Concern | Choice | Cost |
| --- | --- | --- |
| App shell | Expo SDK 57 (React Native) + expo-router | Free |
| Barcode scanning | `expo-camera` (on-device, no API calls) | Free |
| Product lookup | [Open Food Facts](https://world.openfoodfacts.org) REST API | Free, no key |
| Recipes | Local seed recipes + [TheMealDB](https://www.themealdb.com) | Free, no key |
| Local storage | `@react-native-async-storage/async-storage` | Free |
| Optional cloud sync | Supabase (schema in `supabase/schema.sql`) | Free tier |
| Web hosting | Vercel (`vercel.json` included) | Free tier |

Everything works offline-first with no account. Supabase is opt-in: without env vars the app just saves to the device.

## Run it

```bash
npm install
npx expo start
```

Then press `w` for the browser, or scan the QR code with **Expo Go** on your phone. Barcode scanning needs a real device or the browser's camera permission — the iOS Simulator has no camera.

The first load on a phone takes 60-90 seconds while Metro builds the ~1,500 module bundle. Your terminal prints `Android Bundled` or `iOS Bundled` when it finishes. Later reloads are instant.

```bash
npm run android   # Android device or emulator
npm run ios       # iOS (requires macOS)
npm run web       # browser
```

## Expo Go must match the project's SDK

Each Expo Go build runs exactly one SDK version, and the project's `expo` version in `package.json` must match it. Since September 2026 the App Store and Play Store Expo Go is **SDK 57**, which is what this project uses. If Expo Go updates to a newer SDK, run `npx expo install expo@latest --fix` to follow it.

On iPhone, Expo Go also requires the **same Expo account** to be signed in on both sides: run `npx expo login` on your computer and sign into the Expo Go app with that account, or the project refuses to open.

## Troubleshooting a phone that won't connect

If Expo Go spins forever, look at your terminal. No `Bundling` line means the phone never reached your PC, which is a network problem rather than a code problem:

- Turn **cellular data off** so the phone can't route the `192.168.x.x` address out to the internet.
- Many home gateways (T-Mobile's included) isolate devices from each other. Run `npx expo start --tunnel` to route through Expo's servers instead. `@expo/ngrok` is already a devDependency, so it won't prompt you.
- If a `Bundling` line *is* present, nothing is wrong. Wait out the first build.

## Project layout

```
app/
  _layout.tsx          root stack, kitchen theme, AppStateProvider
  (tabs)/index.tsx     the wooden pantry shelves
  (tabs)/book.tsx      the recipe book
  (tabs)/scan.tsx      continuous barcode scanner + manual fallback
  (tabs)/list.tsx      shopping list
  modal.tsx            add a food by name
components/
  pantry/WoodenShelf.tsx     shelf board, plaque, alcove shadow
  pantry/PantryItemCard.tsx  can / jar / box shaped item
  book/RecipeBook.tsx        leather cover, ribbon tabs, page turn
context/AppState.tsx   single source of truth, persisted
lib/
  types.ts         CanonicalItem, PantryItem, Recipe, ShoppingListItem
  canonical.ts     ingredient normalization (brand text -> canonical id)
  matching.ts      recipe match %, owned vs missing ingredients
  openFoodFacts.ts barcode -> PantryItem
  mealdb.ts        pantry ingredients -> Recipe[]
  storage.ts       AsyncStorage persistence
  seed.ts          demo pantry + offline seed recipes
supabase/schema.sql  tables + row level security for cloud sync
```

## How ingredient matching works

The hard part is that a barcode returns `"Heinz Organic Tomato Paste 6 oz"` while a recipe just says `"tomato paste"`. `lib/canonical.ts` strips sizes, units, and brand words, then resolves the remainder against an alias table and a canonical ingredient list, producing a stable id like `ing_tomato_paste`.

Matching then compares two sets of canonical ids. Pantry staples (salt, pepper, oil) are excluded from the denominator so a recipe isn't marked incomplete just because you didn't scan your salt.

```ts
matchRecipe(recipe, pantryCanonicalIds)
// -> { matchPercentage: 66.6, hasAllIngredients: false,
//      ownedIngredients: [...], missingIngredients: [...] }
```

`missingIngredients` is exactly what the shopping list needs, so "Add missing to shopping list" is a direct copy.

## Optional: turn on Supabase sync

1. Create a free project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor. It creates `pantry_items` and `shopping_list` with row level security so each user only sees their own rows.
3. Copy `.env.example` to `.env` and fill in:

```
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

`lib/supabase.ts` exports `null` when those are absent, and the Pantry header shows "saved on this device" instead of "cloud ready".

## Optional: deploy the web build to Vercel

```bash
npx expo export -p web
npx vercel deploy --prebuilt
```

`vercel.json` already points Vercel at `npx expo export -p web` and the `dist` output directory.

## Notes on Flutter

Flutter was on the table for the page-flip animation, but the app is built on Expo/React Native as chosen — the two are separate stacks and can't share this codebase. The page turn here is a `react-native-reanimated`-free `Animated` rotateY on the page surface, which keeps the dependency list small; swapping in a richer flip later only touches `components/book/RecipeBook.tsx`.
