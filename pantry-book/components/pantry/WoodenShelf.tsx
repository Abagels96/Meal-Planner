import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { FoodCategory, PantryItem } from '@/lib/types';

import { PantryItemCard } from './PantryItemCard';

type Props = {
  category: FoodCategory;
  items: PantryItem[];
  onItemPress: (item: PantryItem) => void;
};

export function WoodenShelf({ category, items, onItemPress }: Props) {
  return (
    <View style={styles.block}>
      <View style={styles.plaque}>
        <Text style={styles.plaqueText}>{category}</Text>
      </View>
      <View style={styles.alcove}>
        {items.length === 0 ? (
          <Text style={styles.empty}>This shelf is waiting for a scan.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {items.map((item) => (
              <PantryItemCard key={item.id} item={item} onPress={() => onItemPress(item)} />
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.board}>
        <View style={styles.grain} />
        <View style={styles.grainSoft} />
        <View style={styles.edge} />
      </View>
      <View style={styles.shadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 22,
  },
  plaque: {
    alignSelf: 'center',
    backgroundColor: theme.woodDark,
    borderColor: theme.brass,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  plaqueText: {
    color: theme.goldSoft,
    fontSize: 13,
    letterSpacing: 1.4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  alcove: {
    minHeight: 118,
    backgroundColor: 'rgba(20, 10, 4, 0.35)',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  row: {
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  empty: {
    color: theme.woodLight,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 28,
    opacity: 0.75,
  },
  board: {
    height: 18,
    backgroundColor: theme.wood,
    borderTopColor: theme.woodLight,
    borderTopWidth: 2,
    borderBottomColor: theme.woodDark,
    borderBottomWidth: 3,
    overflow: 'hidden',
  },
  grain: {
    position: 'absolute',
    top: 5,
    left: 12,
    right: 40,
    height: 2,
    backgroundColor: 'rgba(92, 58, 30, 0.35)',
  },
  grainSoft: {
    position: 'absolute',
    top: 10,
    left: 48,
    right: 16,
    height: 2,
    backgroundColor: 'rgba(230, 211, 176, 0.18)',
  },
  edge: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: theme.woodDark,
  },
  shadow: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.28)',
    marginHorizontal: 6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
