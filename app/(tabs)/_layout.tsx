import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Gift, Bookmark } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopWidth: 1,
          borderTopColor: Colors[colorScheme].muted + '20',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wizard',
          tabBarIcon: ({ color }) => <Gift size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <Bookmark size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
