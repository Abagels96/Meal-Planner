import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { theme } from '@/constants/theme';
import { pantryHas } from '@/lib/matching';
import type { MatchedRecipe, MealType } from '@/lib/types';

const MEAL_TABS: Array<MealType | 'All'> = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];

const NATIVE_DRIVER = Platform.OS !== 'web';

type Props = {
  recipes: MatchedRecipe[];
  mealFilter: MealType | 'All';
  onFilter: (value: MealType | 'All') => void;
  onAddMissing: (recipe: MatchedRecipe) => void;
  pantryIds: string[];
};

export function RecipeBook({ recipes, mealFilter, onFilter, onAddMissing, pantryIds }: Props) {
  const [index, setIndex] = useState(0);
  const flip = useRef(new Animated.Value(0)).current;
  const recipe = recipes[index];

  useEffect(() => {
    setIndex(0);
  }, [mealFilter, recipes.length]);

  const turn = (direction: 1 | -1) => {
    const next = index + direction;
    if (next < 0 || next >= recipes.length) return;
    Animated.sequence([
      Animated.timing(flip, { toValue: direction, duration: 160, useNativeDriver: NATIVE_DRIVER }),
      Animated.timing(flip, { toValue: 0, duration: 160, useNativeDriver: NATIVE_DRIVER }),
    ]).start();
    setIndex(next);
  };

  const rotate = flip.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  return (
    <View style={styles.cover}>
      <View style={styles.spine} />
      <View style={styles.ribbonRow}>
        {MEAL_TABS.map((tab) => {
          const active = tab === mealFilter;
          return (
            <Pressable key={tab} onPress={() => onFilter(tab)} style={[styles.ribbon, active && styles.ribbonActive]}>
              <Text style={[styles.ribbonText, active && styles.ribbonTextActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>

      {recipe ? (
        <Animated.View style={[styles.page, { transform: [{ perspective: 900 }, { rotateY: rotate }] }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageInner}>
            <Text style={styles.kicker}>
              {recipe.mealType} · {recipe.prepTimeMins} min · {Math.round(recipe.match.matchPercentage)}% match
            </Text>
            <Text style={styles.title}>{recipe.title}</Text>
            {recipe.imageUrl ? (
              <Image source={{ uri: recipe.imageUrl }} style={styles.photo} />
            ) : null}
            <View style={styles.matchBarTrack}>
              <View style={[styles.matchBar, { width: `${Math.max(8, recipe.match.matchPercentage)}%` }]} />
            </View>
            <Text style={styles.section}>Ingredients</Text>
            {recipe.ingredients.map((ingredient) => {
              const owned = pantryHas(ingredient.canonicalId, pantryIds) || ingredient.isPantryStaple;
              return (
                <Text key={`${recipe.id}-${ingredient.canonicalId}`} style={[styles.line, !owned && styles.missing]}>
                  {owned ? '•' : '○'} {ingredient.amount} {ingredient.unit} {ingredient.displayName}
                  {ingredient.isPantryStaple ? '  (staple)' : owned ? '' : '  — missing'}
                </Text>
              );
            })}
            <Text style={styles.section}>Method</Text>
            {recipe.instructions.map((step, stepIndex) => (
              <Text key={step} style={styles.line}>
                {stepIndex + 1}. {step}
              </Text>
            ))}
            {recipe.match.missingIngredients.length > 0 ? (
              <Pressable style={styles.addBtn} onPress={() => onAddMissing(recipe)}>
                <Text style={styles.addBtnText}>Add missing to shopping list</Text>
              </Pressable>
            ) : (
              <Text style={styles.ready}>You have everything for this page.</Text>
            )}
          </ScrollView>
        </Animated.View>
      ) : (
        <View style={styles.page}>
          <Text style={styles.empty}>No recipes in this chapter yet. Stock a few shelves first.</Text>
        </View>
      )}

      <View style={styles.nav}>
        <Pressable onPress={() => turn(-1)} style={[styles.navBtn, index === 0 && styles.navDisabled]}>
          <Text style={styles.navText}>‹ Prev page</Text>
        </Pressable>
        <Text style={styles.folio}>
          {recipes.length === 0 ? '0 / 0' : `${index + 1} / ${recipes.length}`}
        </Text>
        <Pressable
          onPress={() => turn(1)}
          style={[styles.navBtn, index >= recipes.length - 1 && styles.navDisabled]}>
          <Text style={styles.navText}>Next page ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    flex: 1,
    backgroundColor: theme.leather,
    borderRadius: 16,
    padding: 10,
    borderWidth: 3,
    borderColor: theme.leatherDeep,
  },
  spine: {
    position: 'absolute',
    left: 18,
    top: 8,
    bottom: 8,
    width: 6,
    backgroundColor: theme.gold,
    opacity: 0.35,
    borderRadius: 3,
  },
  ribbonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
    paddingLeft: 16,
  },
  ribbon: {
    backgroundColor: theme.leatherDeep,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  ribbonActive: {
    backgroundColor: theme.gold,
  },
  ribbonText: {
    color: theme.cream,
    fontSize: 11,
    fontWeight: '700',
  },
  ribbonTextActive: {
    color: theme.ink,
  },
  page: {
    flex: 1,
    backgroundColor: theme.page,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.woodLight,
  },
  pageInner: {
    paddingBottom: 16,
  },
  kicker: {
    color: theme.inkMuted,
    fontSize: 12,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    color: theme.ink,
    fontWeight: '800',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: theme.woodLight,
  },
  matchBarTrack: {
    height: 8,
    backgroundColor: '#e4d6b6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  matchBar: {
    height: 8,
    backgroundColor: theme.owned,
  },
  section: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: '800',
    color: theme.leather,
  },
  line: {
    color: theme.ink,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 3,
  },
  missing: {
    color: theme.missing,
  },
  addBtn: {
    marginTop: 14,
    backgroundColor: theme.leather,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: theme.cream,
    fontWeight: '700',
  },
  ready: {
    marginTop: 14,
    color: theme.owned,
    fontWeight: '700',
  },
  empty: {
    color: theme.inkMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 40,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 6,
  },
  navBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navDisabled: {
    opacity: 0.35,
  },
  navText: {
    color: theme.goldSoft,
    fontWeight: '700',
  },
  folio: {
    color: theme.cream,
    fontWeight: '700',
  },
});
