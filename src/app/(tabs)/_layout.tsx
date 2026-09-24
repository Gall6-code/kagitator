// Нижняя навигация (табы) в стиле 40k

import React from 'react';
import { Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { C } from '../../theme';

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={{ opacity: focused ? 1 : 0.55 }}>
      <Text style={{ fontSize: 18 }}>{icon}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.panel,
          borderTopColor: 'rgba(194,158,77,0.5)',
          borderTopWidth: 1,
          height: 62,
        },
        tabBarActiveTintColor: C.goldBright,
        tabBarInactiveTintColor: C.boneDim,
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 1,
          fontWeight: '700',
          fontFamily: 'monospace',
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ПОИСК',
          tabBarIcon: ({ focused }) => <TabIcon icon="🔍" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'РЕЛИКВАРИЙ',
          tabBarIcon: ({ focused }) => <TabIcon icon="⭐" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'ХРОНИКИ',
          tabBarIcon: ({ focused }) => <TabIcon icon="📜" focused={focused} />,
        }}
      />
    </Tabs>
  );
}