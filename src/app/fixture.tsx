// Детали прибора — модальный экран (deep-link /fixture)

import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { FavoriteButton, OrnateHeader } from '../components';
import { useApp } from '../state';
import { C, cardStyle } from '../theme';
import type { Fixture, FixtureChannel } from '../models';

export default function FixtureScreen() {
  const params = useLocalSearchParams<{ name?: string; channels?: string }>();
  const { isFavorite, toggleFavorite } = useApp();

  const name = typeof params.name === 'string' ? params.name : '';
  const channels: FixtureChannel[] = (() => {
    try {
      const raw = typeof params.channels === 'string' ? params.channels : '';
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as FixtureChannel[]) : [];
    } catch {
      return [];
    }
  })();

  const fixture: Fixture = { name, channels };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'left', 'right', 'bottom']}>
      <FlatList
        data={channels}
        keyExtractor={(item) => String(item.number)}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 7,
              paddingHorizontal: 10,
              backgroundColor: index % 2 === 0 ? 'rgba(32,29,23,0.5)' : 'transparent',
            }}
          >
            <Text style={{ width: 38, fontSize: 12, fontWeight: '700', color: C.goldBright, fontFamily: 'monospace' }}>
              {item.number}
            </Text>
            <Text style={{ fontSize: 13, color: C.bone, fontFamily: 'monospace' }}>{item.attribute}</Text>
          </View>
        )}
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <OrnateHeader title="ПРИБОР" subtitle="Идентификация по данным Машины" />
              </View>
              <Pressable onPress={() => router.back()} hitSlop={8} style={({ pressed }) => pressed && { opacity: 0.6 }}>
                <Text style={{ fontSize: 18, color: C.gold, fontWeight: '700' }}>✕</Text>
              </Pressable>
            </View>
            <Text style={{ fontSize: 17, fontFamily: 'Cinzel', fontWeight: '700', color: C.bone }}>{name}</Text>
            <FavoriteButton isFavorite={isFavorite(name)} onPress={() => toggleFavorite(fixture)} />
            <View style={cardStyle}>
              <Text style={{ fontSize: 11, letterSpacing: 1.8, color: C.boneDim, fontFamily: 'monospace', fontWeight: '700' }}>
                КАРТА КАНАЛОВ · {channels.length}
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}