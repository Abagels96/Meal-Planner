import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecipeBook } from '@/components/book/RecipeBook';
import { theme } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

export default function BookScreen() {
  const { matchedRecipes, mealFilter, setMealFilter, addMissingToList, pantry } = useAppState();
  const [note, setNote] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Recipe book</Text>
        <Text style={styles.title}>Flip through meals</Text>
        <Text style={styles.meta}>
          Recipes rise to the top when your shelves already cover the ingredients.
        </Text>
        {note ? <Text style={styles.note}>{note}</Text> : null}
      </View>
      <View style={styles.bookWrap}>
        <RecipeBook
          recipes={matchedRecipes}
          mealFilter={mealFilter}
          onFilter={setMealFilter}
          pantryIds={pantry.map((item) => item.canonicalId)}
          onAddMissing={(recipe) => {
            const count = addMissingToList(recipe);
            setNote(
              count === 0
                ? 'Those items are already on your list.'
                : `Added missing items from ${recipe.title} to your list.`
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.wall,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  eyebrow: {
    color: theme.goldSoft,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: theme.cream,
    fontSize: 28,
    fontWeight: '800',
  },
  meta: {
    color: theme.woodLight,
    marginTop: 4,
  },
  note: {
    color: theme.goldSoft,
    marginTop: 8,
    fontWeight: '600',
  },
  bookWrap: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
