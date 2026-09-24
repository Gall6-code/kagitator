// Экран поиска приборов («Когитатор») — вкладка ПОИСК

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { loadFixtures, searchFixtures } from '../../library';
import { ANY_OPTION, CHANNEL_OPTIONS, MA_VERSION, MAX_CHANNELS, TOTAL_FIXTURES } from '../../models';
import type { ChannelOption, ChannelSelection, Fixture } from '../../models';
import { EmptySkull, FixtureCard, GoldDivider, OptionPickerModal, OrnateHeader, SectionCard } from '../../components';
import { useApp } from '../../state';
import { C, cardStyle } from '../../theme';

const MAX_SHOWN = 300;

export default function FinderScreen() {
  const { revive, clearRevive, recordSearch } = useApp();
  const [channelCount, setChannelCount] = useState(8);
  const [selections, setSelections] = useState<ChannelSelection[]>([]);
  const [results, setResults] = useState<Fixture[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pickerChannel, setPickerChannel] = useState<number | null>(null);
  const revivedRef = useRef(false);

  const rebuild = useCallback((count: number, prev: ChannelSelection[]): ChannelSelection[] => {
    const trimmed = prev.slice(0, count);
    while (trimmed.length < count) {
      trimmed.push({ number: trimmed.length + 1, option: ANY_OPTION, inverted: false });
    }
    return trimmed;
  }, []);

  useEffect(() => {
    setSelections((prev) => rebuild(channelCount, prev));
  }, [channelCount, rebuild]);

  const runSearch = useCallback(
    async (count: number, sel: ChannelSelection[]) => {
      setLoading(true);
      const all = await loadFixtures(count);
      const found = searchFixtures(all, sel);
      setResults(found);
      setSearched(true);
      setLoading(false);
      recordSearch(count, sel, found.length);
    },
    [recordSearch],
  );

  // Восстановление поиска из истории
  useEffect(() => {
    if (!revive || revivedRef.current) return;
    revivedRef.current = true;
    const count = Math.min(Math.max(revive.channelCount, 1), MAX_CHANNELS);
    setChannelCount(count);
    const base = rebuild(count, []);
    const sorted = [...revive.selections].sort((a, b) => a.number - b.number);
    const valid = sorted.length === count && sorted.every((s) => s.number >= 1 && s.number <= count);
    const sel = valid ? sorted : base;
    setSelections(sel);
    void runSearch(count, sel);
    clearRevive();
  }, [revive, rebuild, runSearch, clearRevive]);

  const changeChannelCount = (delta: number) => {
    const next = Math.min(Math.max(channelCount + delta, 1), MAX_CHANNELS);
    if (next !== channelCount) setChannelCount(next);
  };

  const toggleNot = (number: number) => {
    setSelections((prev) => prev.map((s) => (s.number === number ? { ...s, inverted: !s.inverted } : s)));
  };

  const applyOption = (opt: ChannelOption) => {
    if (pickerChannel == null) return;
    setSelections((prev) => prev.map((s) => (s.number === pickerChannel ? { ...s, option: opt } : s)));
    setPickerChannel(null);
  };

  const openDetail = (fixture: Fixture) => {
    router.push({
      pathname: '/fixture',
      params: { name: fixture.name, channels: JSON.stringify(fixture.channels) },
    });
  };

  const currentOption = selections.find((s) => s.number === pickerChannel)?.option ?? ANY_OPTION;
  const shown = results.slice(0, MAX_SHOWN);

  const header = (
    <View style={{ gap: 16 }}>
      <OrnateHeader title="КОГИТАТОР" subtitle="Библиотека приборов grandMA2 · оффлайн" />

      <SectionCard title="Число каналов">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: C.boneDim, fontFamily: 'monospace' }}>ПРОТОКОЛ</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ fontSize: 30, fontFamily: 'Cinzel', fontWeight: '700', color: C.goldBright }}>
            {channelCount}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
          <StepButton symbol="−" onPress={() => changeChannelCount(-1)} />
          <View style={{ flex: 1 }} />
          <StepButton symbol="+" onPress={() => changeChannelCount(1)} />
        </View>
        <Text style={{ fontSize: 11, color: C.boneDim, marginTop: 8 }}>
          Данные библиотеки: 1–{MAX_CHANNELS} каналов
        </Text>
      </SectionCard>

      {selections.length > 0 ? (
        <SectionCard title="Настройка каналов">
          <View style={{ gap: 8 }}>
            {selections.map((sel) => (
              <View key={sel.number} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(140,29,22,0.35)',
                    borderWidth: 0.5,
                    borderColor: 'rgba(194,158,77,0.4)',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.goldBright, fontFamily: 'monospace' }}>
                    {sel.number}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setPickerChannel(sel.number)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 9,
                      borderRadius: 7,
                      backgroundColor: C.panel2,
                      borderWidth: 1,
                      borderColor: 'rgba(194,158,77,0.35)',
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={{ fontSize: 14, color: C.bone }}>{sel.option.label}</Text>
                </Pressable>

                <Pressable
                  onPress={() => toggleNot(sel.number)}
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 10,
                      paddingVertical: 9,
                      borderRadius: 5,
                      backgroundColor: sel.inverted ? 'rgba(140,29,22,0.6)' : C.panel2,
                      borderWidth: 1,
                      borderColor: sel.inverted ? C.bloodBright : 'rgba(194,158,77,0.35)',
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: sel.inverted ? C.bloodBright : C.boneDim,
                      fontFamily: 'monospace',
                    }}
                  >
                    НЕ
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </SectionCard>
      ) : null}

      <Pressable
        onPress={() => void runSearch(channelCount, selections)}
        disabled={loading}
        style={({ pressed }) => [
          {
            borderRadius: 9,
            borderWidth: 1,
            borderColor: 'rgba(235,222,184,0.35)',
            backgroundColor: C.gold,
            paddingVertical: 14,
            alignItems: 'center',
          },
          pressed && { opacity: 0.8 },
          loading && { opacity: 0.6 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={C.bg} />
        ) : (
          <Text style={{ fontSize: 18, fontFamily: 'Cinzel', fontWeight: '700', color: C.bg }}>
            ПРИЗВАТЬ ПРИБОРЫ
          </Text>
        )}
      </Pressable>

      {searched ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Text style={{ fontSize: 15, fontFamily: 'Cinzel', fontWeight: '700', color: C.bone }}>
            НАЙДЕНО ПРИБОРОВ
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={{ fontSize: 18, fontFamily: 'Cinzel', fontWeight: '700', color: C.goldBright }}>
            {results.length}
          </Text>
        </View>
      ) : (
        <View style={cardStyle}>
          <Text style={{ fontSize: 14, fontFamily: 'Cinzel', fontWeight: '700', color: C.gold, textAlign: 'center' }}>
            ⛨  ДАННЫЕ ПРОТОКОЛА  ⛨
          </Text>
          <Text style={{ fontSize: 13, color: C.boneDim, textAlign: 'center', marginTop: 8 }}>
            Выбери число каналов, задай атрибуты и нажми «Призвать приборы».
            {'\n'}Машинный дух найдёт подходящие приборы из библиотеки grandMA2.
          </Text>
        </View>
      )}

      {results.length > MAX_SHOWN ? (
        <Text style={{ fontSize: 11, color: C.bloodBright, fontFamily: 'monospace' }}>
          Показаны первые {MAX_SHOWN} из {results.length}. Уточни атрибуты, чтобы сузить список.
        </Text>
      ) : null}

      <View style={{ gap: 4 }}>
        <GoldDivider />
        <Text style={{ fontSize: 10, color: C.boneDim, fontFamily: 'monospace', textAlign: 'center' }}>
          Библиотека grandMA2 {MA_VERSION} · {TOTAL_FIXTURES} приборов · Оффлайн
        </Text>
        <Text style={{ fontSize: 9, color: C.boneDim, textAlign: 'center' }}>
          Данные: mafixture.ru © Artem Sysolyatin. Товарные знаки принадлежат их владельцам.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top', 'left', 'right']}>
      <FlatList
        data={shown}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <FixtureCard fixture={item} onPress={() => openDetail(item)} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          searched && !loading ? (
            <EmptySkull
              title="НИЧЕГО НЕ НАЙДЕНО"
              subtitle="Приборы молчат. Проверь раскладку каналов, слуга Императора."
            />
          ) : null
        }
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      />
      <OptionPickerModal
        visible={pickerChannel != null}
        options={CHANNEL_OPTIONS}
        current={currentOption}
        onSelect={applyOption}
        onClose={() => setPickerChannel(null)}
      />
    </SafeAreaView>
  );
}

function StepButton({ symbol, onPress }: { symbol: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: 64,
          alignItems: 'center',
          paddingVertical: 10,
          borderRadius: 8,
          backgroundColor: C.panel2,
          borderWidth: 1,
          borderColor: 'rgba(194,158,77,0.4)',
        },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={{ fontSize: 18, fontWeight: '700', color: C.bone }}>{symbol}</Text>
    </Pressable>
  );
}