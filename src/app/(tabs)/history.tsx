// История поиска («Хроники когитатора»)

import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { EmptySkull, OrnateHeader } from '../../components';
import { useApp } from '../../state';
import { C, cardStyle } from '../../theme';
import type { SearchRecord } from '../../models';

export default function HistoryScreen() {
  const { history, restore, clearHistory } = useApp();

  const handleRestore = (record: SearchRecord) => {
    restore(record);
    router.navigate('/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'left', 'right']}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Row item={item} onRestore={handleRestore} />}
        ListHeaderComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <OrnateHeader title="ХРОНИКИ КОГИТАТОРА" subtitle="Летопись всех призывов" />
            </View>
            {history.length > 0 ? (
              <Pressable
                onPress={clearHistory}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'rgba(204,41,26,0.6)',
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', fontFamily: 'monospace', color: C.bloodBright }}>
                  ОЧИСТИТЬ
                </Text>
              </Pressable>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptySkull
            title="ХРОНИКИ ПУСТЫ"
            subtitle="Проведи поиск на вкладке «Поиск» — каждый запрос сохранится здесь, и его можно будет повторить."
          />
        }
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function Row({ item, onRestore }: { item: SearchRecord; onRestore: (r: SearchRecord) => void }) {
  const parts = item.selections
    .filter((s) => s.option.ma2 !== 'ANY')
    .map((s) => `${s.number}:${s.option.label}${s.inverted ? '≠' : ''}`);
  const summary = parts.length ? parts.join('  ·  ') : 'Все каналы: ANY';

  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, fontFamily: 'Cinzel', fontWeight: '700', color: C.goldBright }}>
          {item.channelCount} КАНАЛОВ
        </Text>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 10, color: C.boneDim, fontFamily: 'monospace' }}>
          {new Date(item.date).toLocaleString()}
        </Text>
      </View>
      <Text numberOfLines={2} style={{ fontSize: 12, color: C.boneDim, fontFamily: 'monospace', marginTop: 6 }}>
        {summary}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', fontFamily: 'monospace', color: item.found > 0 ? C.bone : C.bloodBright }}>
          Найдено: {item.found}
        </Text>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => onRestore(item)}
          style={({ pressed }) => [
            {
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              backgroundColor: C.gold,
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={{ fontSize: 11, fontWeight: '700', fontFamily: 'monospace', color: C.bg }}>ВОССОЗДАТЬ</Text>
        </Pressable>
      </View>
    </View>
  );
}