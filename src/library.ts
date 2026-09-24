// Оффлайн-библиотека: чтение JSON из ассетов + логика поиска
// В SDK 57 expo-file-system использует новый класс File (старый readAsStringAsync из главного импорта — throw).

import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { FIXTURE_DATA } from './dataIndex';
import type { ChannelSelection, Fixture } from './models';

const cache: Partial<Record<number, Fixture[]>> = {};

export async function loadFixtures(channels: number): Promise<Fixture[]> {
  if (cache[channels]) return cache[channels]!;
  try {
    const mod = FIXTURE_DATA[channels];
    if (!mod) {
      cache[channels] = [];
      return [];
    }
    const asset = Asset.fromModule(mod);
    if (!asset.localUri) await asset.downloadAsync();
    if (!asset.localUri) throw new Error('asset not downloaded');
    const file = new File(asset.localUri);
    const text = await file.text();
    const list = JSON.parse(text) as Fixture[];
    cache[channels] = list;
    return list;
  } catch (e) {
    console.warn('loadFixtures failed', channels, e);
    cache[channels] = [];
    return [];
  }
}

// Логика поиска повторяет mafixture.ru:
// для каждого канала, где выбран не-ANY атрибут, прибор должен точно совпадать,
// если канал помечен «НЕ» — наоборот, НЕ совпадать.
export function searchFixtures(fixtures: Fixture[], selections: ChannelSelection[]): Fixture[] {
  const wanted = new Map<number, ChannelSelection>(selections.map((s) => [s.number, s]));
  return fixtures.filter((fx) =>
    fx.channels.every((ch) => {
      const sel = wanted.get(ch.number);
      if (!sel || sel.option.ma2 === 'ANY') return true;
      const equal = ch.attribute === sel.option.ma2;
      return sel.inverted ? !equal : equal;
    }),
  );
}