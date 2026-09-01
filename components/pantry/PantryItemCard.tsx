import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { categoryAccent, theme } from '@/constants/theme';
import type { PantryItem } from '@/lib/types';

type Props = {
  item: PantryItem;
  onPress?: () => void;
};

export function PantryItemCard({ item, onPress }: Props) {
  const accent = categoryAccent[item.category] ?? theme.woodMid;
  const isCan = item.category === 'Canned Goods';
  const isJar = item.category === 'Spices';

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={[styles.body, isCan && styles.can, isJar && styles.jar, { borderColor: accent }]}>
        {isCan ? <View style={styles.rim} /> : null}
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: accent }]}>
            <Text style={styles.placeholderText}>{item.rawTitle.slice(0, 1).toUpperCase()}</Text>
          </View>
        )}
        {item.quantity > 1 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>×{item.quantity}</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={2} style={styles.label}>
        {item.rawTitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 86,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  body: {
    width: 72,
    height: 86,
    backgroundColor: theme.paper,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 3px 4px rgba(0,0,0,0.28)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.28,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
      },
    }),
  },
  can: {
    borderRadius: 10,
    width: 64,
  },
  jar: {
    width: 52,
    height: 72,
    borderRadius: 18,
  },
  rim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#d0d4d8',
    borderBottomWidth: 1,
    borderColor: '#9aa0a6',
  },
  image: {
    width: 58,
    height: 58,
    marginTop: 6,
  },
  placeholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: theme.white,
    fontWeight: '800',
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: theme.leather,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: theme.cream,
    fontSize: 10,
    fontWeight: '700',
  },
  label: {
    marginTop: 6,
    color: theme.cream,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
});
