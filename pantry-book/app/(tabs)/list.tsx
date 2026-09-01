import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { useAppState } from '@/context/AppState';

export default function ListScreen() {
  const { shoppingList, toggleListItem, removeListItem, addManualItem } = useAppState();
  const remaining = shoppingList.filter((item) => !item.isChecked).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Market list</Text>
        <Text style={styles.title}>What the recipe still needs</Text>
        <Text style={styles.meta}>
          {shoppingList.length === 0
            ? 'Flip the book and add missing ingredients from a recipe page.'
            : `${remaining} still to pick up`}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.paper}>
        {shoppingList.length === 0 ? (
          <Text style={styles.empty}>This page is blank. The recipe book will write on it.</Text>
        ) : (
          shoppingList.map((item, index) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.number}>{index + 1}.</Text>
              <Pressable style={styles.main} onPress={() => toggleListItem(item.id)}>
                <Text style={[styles.item, item.isChecked && styles.checked]}>
                  {item.amount} {item.unit} {item.displayName}
                </Text>
                {item.sourceRecipeTitle ? (
                  <Text style={styles.source}>for {item.sourceRecipeTitle}</Text>
                ) : null}
              </Pressable>
              <Pressable onPress={() => addManualItem(item.displayName)}>
                <Text style={styles.shelf}>Shelf</Text>
              </Pressable>
              <Pressable onPress={() => removeListItem(item.id)}>
                <Text style={styles.remove}>✕</Text>
              </Pressable>
            </View>
          ))
        )}
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
  paper: {
    marginHorizontal: 16,
    backgroundColor: theme.page,
    borderRadius: 10,
    padding: 16,
    minHeight: 360,
    borderWidth: 1,
    borderColor: theme.woodLight,
  },
  empty: {
    color: theme.inkMuted,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e4d6b6',
    gap: 8,
  },
  number: {
    color: theme.inkMuted,
    width: 22,
    marginTop: 2,
  },
  main: {
    flex: 1,
  },
  item: {
    color: theme.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  checked: {
    textDecorationLine: 'line-through',
    color: theme.inkMuted,
  },
  source: {
    color: theme.inkMuted,
    fontSize: 12,
    marginTop: 2,
  },
  shelf: {
    color: theme.owned,
    fontWeight: '800',
    marginTop: 2,
  },
  remove: {
    color: theme.missing,
    fontWeight: '800',
    marginTop: 2,
  },
});
