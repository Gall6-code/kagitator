// Избранное («Реликварий»)

import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChannelChips, EmptySkull, OrnateHeader } from '../../components';
import { useApp } from '../../state';
import { C, cardStyle } from '../../theme';
import type { Fixture, SavedFixture } from '../../models';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useApp();

  const openDetail = (fixture: Fixture) => {
    router.push({
      pathname: '/fixture',
      params: { name: fixture.name, channels: JSON.stringify(fixture.channels) },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'left', 'right']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Row item={item} onRemove={removeFavorite} onOpen={openDetail} />
        )}
        ListHeaderComponent={<OrnateHeader title="РЕЛИКВАРИЙ" subtitle="Священные реликвии Императора" />}
        ListEmptyComponent={
          <EmptySkull
            title="РЕЛИКВАРИЙ ПУСТ"
            subtitle="Добавляй понравившиеся приборы звездой ⭐ на их странице — они сохранятся здесь, в оффлайне."
          />
        }
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function Row({
  item,
  onRemove,
  onOpen,
}: {
  item: SavedFixture;
  onRemove: (name: string) => void;
  onOpen: (fixture: Fixture) => void;
}) {
  const fixture: Fixture = { name: item.name, channels: item.channels };
  return (
    <Pressable onPress={() => onOpen(fixture)} style={({ pressed }) => [cardStyle, { gap: 8 }, pressed && { opacity: 0.8 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Text style={{ fontSize: 16 }}>⭐</Text>
        <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.bone }}>{item.name}</Text>
        <Pressable onPress={() => onRemove(item.name)} hitSlop={8} style={({ pressed }) => pressed && { opacity: 0.6 }}>
          <Text style={{ fontSize: 14, color: C.bloodBright, fontWeight: '700' }}>✕</Text>
        </Pressable>
      </View>
      <ChannelChips channels={item.channels} />
      <Text style={{ fontSize: 10, color: C.boneDim, fontFamily: 'monospace' }}>
        Сохранено: {new Date(item.savedAt).toLocaleString()}
      </Text>
    </Pressable>
  );
}