import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { theme } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { SHELF_ORDER } from '@/lib/canonical';
import type { FoodCategory } from '@/lib/types';

export default function ManualAddModal() {
  const { addManualItem } = useAppState();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory | undefined>();

  const submit = () => {
    if (!name.trim()) return;
    addManualItem(name.trim(), category);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Place a food on the shelf</Text>
      <Text style={styles.copy}>Use this when a barcode is torn, or you just grabbed produce.</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Tomato paste"
        placeholderTextColor={theme.woodLight}
        style={styles.input}
        autoFocus
        onSubmitEditing={submit}
      />
      <Text style={styles.label}>Shelf (optional)</Text>
      <View style={styles.chips}>
        {SHELF_ORDER.map((entry) => (
          <Pressable
            key={entry}
            onPress={() => setCategory(entry)}
            style={[styles.chip, category === entry && styles.chipOn]}>
            <Text style={[styles.chipText, category === entry && styles.chipTextOn]}>{entry}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.primary} onPress={submit}>
        <Text style={styles.primaryText}>Add to pantry</Text>
      </Pressable>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.wall,
    padding: 20,
  },
  title: {
    color: theme.cream,
    fontSize: 24,
    fontWeight: '800',
  },
  copy: {
    color: theme.woodLight,
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    backgroundColor: theme.woodDark,
    color: theme.cream,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.brass,
    fontSize: 16,
  },
  label: {
    color: theme.goldSoft,
    marginTop: 18,
    marginBottom: 8,
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.brass,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipOn: {
    backgroundColor: theme.gold,
  },
  chipText: {
    color: theme.cream,
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextOn: {
    color: theme.ink,
  },
  primary: {
    marginTop: 24,
    backgroundColor: theme.gold,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: theme.ink,
    fontWeight: '800',
    fontSize: 16,
  },
});
