// Корневой layout (Expo Router): шрифты → глобальное состояние → стек навигации

import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../state';
import { C } from '../theme';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <Text style={{ fontSize: 44 }}>💀</Text>
      <Text style={{ fontSize: 22, fontFamily: 'Cinzel', fontWeight: '700', color: C.bone }}>КОГИТАТОР</Text>
      <ActivityIndicator color={C.gold} />
      <Text style={{ fontSize: 11, color: C.gold, fontFamily: 'monospace' }}>МАШИННЫЙ ДУХ ПРОБУЖДАЕТСЯ…</Text>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Cinzel: require('../../assets/fonts/Cinzel-Variable.ttf') });

  if (!fontsLoaded && !fontError) {
    return (
      <SafeAreaProvider>
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: C.bg },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="fixture" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}