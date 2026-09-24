// Переиспользуемые 40k-компоненты

import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, cardStyle, chipStyle } from './theme';
import type { ChannelOption, Fixture } from './models';

export function GoldDivider() {
  return (
    <View
      style={{
        height: 1,
        alignSelf: 'stretch',
        marginHorizontal: 8,
        backgroundColor: 'rgba(194,158,77,0.8)',
      }}
    />
  );
}

export function OrnateHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 6, marginTop: 8 }}>
      <Text style={{ fontSize: 22, fontFamily: 'Cinzel', fontWeight: '700', color: C.bone, textAlign: 'center' }}>
        ✠  {title}  ✠
      </Text>
      {subtitle ? (
        <Text style={{ fontSize: 11, letterSpacing: 1.5, color: C.gold, textAlign: 'center', fontFamily: 'monospace' }}>
          {subtitle.toUpperCase()}
        </Text>
      ) : null}
      <GoldDivider />
    </View>
  );
}

export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={cardStyle}>
      <Text style={[s.label, { marginBottom: 8 }]}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

export function EmptySkull({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View
      style={{
        ...cardStyle,
        alignItems: 'center',
        paddingVertical: 26,
        borderColor: 'rgba(140,29,22,0.6)',
      }}
    >
      <Text style={{ fontSize: 40 }}>💀</Text>
      <Text style={{ fontSize: 16, fontFamily: 'Cinzel', fontWeight: '700', color: C.bloodBright, textAlign: 'center', marginTop: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 13, color: C.boneDim, textAlign: 'center', marginTop: 6 }}>{subtitle}</Text>
    </View>
  );
}

export function FavoriteButton({ isFavorite, onPress }: { isFavorite: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.75 }]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          alignSelf: 'flex-start',
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderRadius: 7,
          backgroundColor: isFavorite ? 'rgba(140,29,22,0.35)' : C.panel2,
          borderWidth: 1,
          borderColor: isFavorite ? 'rgba(237,204,115,0.6)' : 'rgba(194,158,77,0.3)',
        }}
      >
        <Text style={{ fontSize: 14 }}>{isFavorite ? '⭐' : '☆'}</Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color: isFavorite ? C.goldBright : C.bone, fontFamily: 'monospace' }}>
          {isFavorite ? 'В РЕЛИКВАРИИ' : 'В РЕЛИКВАРИЙ'}
        </Text>
      </View>
    </Pressable>
  );
}

export function ChannelChips({ channels }: { channels: { number: number; attribute: string }[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {channels.map((ch) => (
          <View key={ch.number} style={chipStyle}>
            <Text style={{ fontSize: 11, color: C.bone, fontFamily: 'monospace' }}>
              {ch.number} {ch.attribute}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function FixtureCard({ fixture, onPress }: { fixture: Fixture; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [cardStyle, { gap: 8 }, pressed && { opacity: 0.8 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Text style={{ fontSize: 16 }}>⚙</Text>
        <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.bone }}>{fixture.name}</Text>
      </View>
      <ChannelChips channels={fixture.channels} />
    </Pressable>
  );
}

// Кастомный выпадающий список атрибутов в готическом стиле
export function OptionPickerModal({
  visible,
  options,
  current,
  onSelect,
  onClose,
}: {
  visible: boolean;
  options: ChannelOption[];
  current: ChannelOption;
  onSelect: (opt: ChannelOption) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.modalBackdrop} onPress={onClose}>
        <Pressable style={s.modalPanel} onPress={(e) => e.stopPropagation()}>
          <Text style={{ fontSize: 13, letterSpacing: 2, color: C.gold, fontFamily: 'monospace', marginBottom: 10 }}>
            ВЫБЕРИ АТРИБУТ КАНАЛА
          </Text>
          <ScrollView style={{ maxHeight: 420 }}>
            {options.map((opt) => {
              const selected = opt.ma2 === current.ma2;
              return (
                <Pressable
                  key={opt.ma2}
                  onPress={() => {
                    onSelect(opt);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    {
                      paddingVertical: 11,
                      paddingHorizontal: 12,
                      borderRadius: 6,
                      marginBottom: 4,
                      backgroundColor: selected ? 'rgba(140,29,22,0.35)' : 'transparent',
                      borderWidth: 1,
                      borderColor: selected ? 'rgba(237,204,115,0.5)' : 'transparent',
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={{ fontSize: 14, fontWeight: selected ? '700' : '500', color: selected ? C.goldBright : C.bone }}>
                    {opt.label}
                    {selected ? '  ◄' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 11, letterSpacing: 1.8, color: C.boneDim, fontFamily: 'monospace', fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  modalPanel: {
    backgroundColor: C.panel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(194,158,77,0.6)',
    padding: 16,
  },
});