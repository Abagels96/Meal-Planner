import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WoodenShelf } from '@/components/pantry/WoodenShelf';
import { theme } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { SHELF_ORDER } from '@/lib/canonical';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { PantryItem } from '@/lib/types';

export default function PantryScreen() {
  const { pantry, fillDemoPantry, clearPantry, removePantryItem, adjustQuantity } = useAppState();
  const [selected, setSelected] = useState<PantryItem | null>(null);

  const grouped = useMemo(
    () =>
      SHELF_ORDER.map((category) => ({
        category,
        items: pantry.filter((item) => item.category === category),
      })),
    [pantry]
  );

  const onItemPress = (item: PantryItem) => {
    setSelected(item);
    Alert.alert(item.rawTitle, `On the ${item.category} shelf · qty ${item.quantity}`, [
      { text: 'Add one', onPress: () => adjustQuantity(item.id, 1) },
      { text: 'Remove one', onPress: () => adjustQuantity(item.id, -1), style: 'destructive' },
      { text: 'Take off shelf', onPress: () => removePantryItem(item.id), style: 'destructive' },
      { text: 'Close', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Virtual pantry</Text>
        <Text style={styles.title}>The Wooden Shelves</Text>
        <Text style={styles.meta}>
          {pantry.length} item{pantry.length === 1 ? '' : 's'} stocked
          {isSupabaseConfigured ? ' · cloud ready' : ' · saved on this device'}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroller}>
        {pantry.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Your pantry is bare.</Text>
            <Text style={styles.emptyCopy}>
              Scan a barcode from the Scan tab, add a food by name, or stock a demo pantry to see matching recipes.
            </Text>
            <Pressable style={styles.primary} onPress={fillDemoPantry}>
              <Text style={styles.primaryText}>Stock a demo pantry</Text>
            </Pressable>
            <Link href="/modal" asChild>
              <Pressable style={styles.secondary}>
                <Text style={styles.secondaryText}>Add food by name</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <View style={styles.actions}>
            <Link href="/modal" asChild>
              <Pressable style={styles.chip}>
                <Text style={styles.chipText}>Add by name</Text>
              </Pressable>
            </Link>
            <Pressable style={styles.chip} onPress={clearPantry}>
              <Text style={styles.chipText}>Clear shelves</Text>
            </Pressable>
          </View>
        )}
        {grouped.map(({ category, items }) => (
          <WoodenShelf key={category} category={category} items={items} onItemPress={onItemPress} />
        ))}
        {selected ? <Text style={styles.hint}>Last touched: {selected.rawTitle}</Text> : null}
      </ScrollView>
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
    backgroundColor: theme.wallWarm,
    borderBottomWidth: 2,
    borderBottomColor: theme.woodDark,
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
    marginTop: 2,
  },
  meta: {
    color: theme.woodLight,
    marginTop: 4,
  },
  scroller: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyCard: {
    backgroundColor: 'rgba(244, 232, 208, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: theme.wood,
  },
  emptyTitle: {
    color: theme.cream,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyCopy: {
    color: theme.woodLight,
    marginTop: 8,
    lineHeight: 20,
  },
  primary: {
    marginTop: 14,
    backgroundColor: theme.gold,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryText: {
    color: theme.ink,
    fontWeight: '800',
  },
  secondary: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryText: {
    color: theme.goldSoft,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: theme.woodDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.brass,
  },
  chipText: {
    color: theme.cream,
    fontWeight: '700',
    fontSize: 12,
  },
  hint: {
    color: theme.woodLight,
    textAlign: 'center',
    marginTop: 8,
  },
});
