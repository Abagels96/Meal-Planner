import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

import { theme } from '@/constants/theme';

function TabGlyph({ glyph, color }: { glyph: string; color: ColorValue }) {
  return <Text style={{ fontSize: 18, color }}>{glyph}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.goldSoft,
        tabBarInactiveTintColor: theme.woodLight,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.woodDark,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pantry',
          tabBarIcon: ({ color }) => <TabGlyph glyph="⌂" color={color} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Book',
          tabBarIcon: ({ color }) => <TabGlyph glyph="❧" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <TabGlyph glyph="▣" color={color} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'List',
          tabBarIcon: ({ color }) => <TabGlyph glyph="☰" color={color} />,
        }}
      />
    </Tabs>
  );
}
