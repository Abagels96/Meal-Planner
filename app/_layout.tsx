import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { AppStateProvider } from '@/context/AppState';
import { theme } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const KitchenTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#2a1b0e',
    card: '#1f140b',
    text: '#f4e8d0',
    border: '#5c3a1e',
    primary: '#c9a227',
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppStateProvider>
      <ThemeProvider value={KitchenTheme}>
        <View style={styles.backdrop}>
          <View style={styles.frame}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', title: 'Add by name', headerTintColor: '#f4e8d0' }}
              />
            </Stack>
          </View>
        </View>
      </ThemeProvider>
    </AppStateProvider>
  );
}

// On wide browser windows the phone-shaped layout is centered in a frame so the
// shelves and book keep their intended proportions.
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#1a1008' : theme.wall,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 480,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.woodDark,
      },
      default: {},
    }),
  },
});
