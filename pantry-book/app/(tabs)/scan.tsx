import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { lookupBarcode } from '@/lib/openFoodFacts';

export default function ScanScreen() {
  const { addPantryItem, addManualItem } = useAppState();
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState('Point the camera at a barcode.');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const lock = useRef(false);

  const ingestBarcode = async (code: string) => {
    if (lock.current || busy) return;
    lock.current = true;
    setBusy(true);
    setStatus(`Looking up ${code}…`);
    try {
      const item = await lookupBarcode(code.trim());
      addPantryItem(item);
      setStatus(`${item.rawTitle} landed on the ${item.category} shelf.`);
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not add that item.');
    } finally {
      setBusy(false);
      setTimeout(() => {
        lock.current = false;
      }, 1800);
    }
  };

  const addByName = () => {
    const name = query.trim();
    if (!name) return;
    const item = addManualItem(name);
    setQuery('');
    setStatus(`${item.rawTitle} was placed on the ${item.category} shelf.`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Continuous scan</Text>
        <Text style={styles.title}>Fill the shelves</Text>
        <Text style={styles.meta}>{status}</Text>
      </View>

      <View style={styles.finder}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'qr'],
            }}
            onBarcodeScanned={({ data }) => {
              void ingestBarcode(data);
            }}
          />
        ) : (
          <View style={styles.permission}>
            <Text style={styles.permissionText}>
              Camera access makes pantry stocking fast. You can still type a barcode or a food name below.
            </Text>
            <Pressable style={styles.primary} onPress={() => void requestPermission()}>
              <Text style={styles.primaryText}>Enable camera</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.reticle} />
        {busy ? <ActivityIndicator style={styles.spinner} color={theme.goldSoft} /> : null}
      </View>

      <View style={styles.fallback}>
        <Text style={styles.fallbackLabel}>Torn label? Add it by name</Text>
        <View style={styles.row}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="black beans"
            placeholderTextColor={theme.woodLight}
            style={styles.input}
            onSubmitEditing={addByName}
          />
          <Pressable style={styles.primary} onPress={addByName}>
            <Text style={styles.primaryText}>Shelf it</Text>
          </Pressable>
        </View>
        <Text style={styles.fallbackLabel}>Or enter a barcode</Text>
        <View style={styles.row}>
          <TextInput
            value={barcodeInput}
            onChangeText={setBarcodeInput}
            placeholder="0041570054118"
            placeholderTextColor={theme.woodLight}
            style={styles.input}
            keyboardType="number-pad"
            onSubmitEditing={() => void ingestBarcode(barcodeInput)}
          />
          <Pressable style={styles.secondary} onPress={() => void ingestBarcode(barcodeInput)}>
            <Text style={styles.secondaryText}>Lookup</Text>
          </Pressable>
        </View>
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
  finder: {
    height: 280,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111',
    borderWidth: 3,
    borderColor: theme.wood,
  },
  permission: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionText: {
    color: theme.cream,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  reticle: {
    position: 'absolute',
    top: '30%',
    left: '12%',
    right: '12%',
    height: 90,
    borderWidth: 2,
    borderColor: theme.goldSoft,
    borderRadius: 8,
  },
  spinner: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  fallback: {
    padding: 16,
  },
  fallbackLabel: {
    color: theme.goldSoft,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.woodDark,
    color: theme.cream,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.brass,
  },
  primary: {
    backgroundColor: theme.gold,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryText: {
    color: theme.ink,
    fontWeight: '800',
  },
  secondary: {
    backgroundColor: theme.leather,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryText: {
    color: theme.cream,
    fontWeight: '800',
  },
});
