// Оффлайн-библиотека: загрузка данных приборов + логика поиска
//
// ВАЖНО про Metro и JSON-файлы:
// - В dev-режиме (Expo Go) Metro встраивает .json в JS-бандл, поэтому
//   `require(...)` возвращает УЖЕ РАЗОБРАННЫЙ массив приборов — берём его напрямую.
// - В production (eas build) .json упаковывается как АССЕТ: `require(...)` отдаёт
//   числовой id, данные читаются с диска через expo-asset + expo-file-system.
// Проверяем тип: Array.isArray(mod) → dev, иначе → production-ассет.
//
// Сырые данные с mafixture.ru используют КАПС-ключи: Name, Channels,
// Channels[].Number, Channels[].Attribute. Внутри приложения работаем в нижнем
// регистре (name/channels/number/attribute) — нормализуем при загрузке.

import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import * as LegacyFileSystem from 'expo-file-system/legacy';
import { FIXTURE_DATA } from './dataIndex';
import type { ChannelSelection, Fixture } from './models';

// Сырая схема сайта mafixture.ru
interface RawChannel {
  Number: number;
  Attribute: string;
}
interface RawFixture {
  Name: string;
  Channels: RawChannel[];
}

export interface LoadResult {
  fixtures: Fixture[];
  error: string | null;
}

const cache: Partial<Record<number, Fixture[]>> = {};

function normalizeFixtures(raw: RawFixture[]): Fixture[] {
  return raw.map((f) => ({
    name: f && typeof f.Name === 'string' ? f.Name : 'Unknown fixture',
    channels: Array.isArray(f && f.Channels)
      ? f.Channels.filter((c) => c && typeof c.Number === 'number').map((c) => ({
          number: c.Number,
          attribute: typeof c.Attribute === 'string' ? c.Attribute : '',
        }))
      : [],
  }));
}

async function loadFromAsset(modId: number): Promise<Fixture[]> {
  const asset = Asset.fromModule(modId);
  if (!asset.localUri) await asset.downloadAsync();
  if (!asset.localUri) throw new Error('asset not downloaded');
  // Читаем file:// через стабильный legacy-API, при ошибке — новый класс File
  let raw: RawFixture[];
  try {
    const text = await LegacyFileSystem.readAsStringAsync(asset.localUri);
    raw = JSON.parse(text) as RawFixture[];
  } catch {
    const file = new File(asset.localUri);
    raw = JSON.parse(await file.text()) as RawFixture[];
  }
  if (!Array.isArray(raw)) throw new Error('bad data shape');
  return normalizeFixtures(raw);
}

export async function loadFixturesMeta(channels: number): Promise<LoadResult> {
  if (cache[channels]) return { fixtures: cache[channels]!, error: null };
  const mod = FIXTURE_DATA[channels];
  let list: Fixture[] | null = null;
  let error: string | null = null;
  try {
    if (Array.isArray(mod)) {
      // dev: данные уже инлайнятся в бандл — это сырые записи с сайта
      list = normalizeFixtures(mod as RawFixture[]);
    } else if (typeof mod === 'number') {
      // production: ассет на диске
      list = await loadFromAsset(mod);
    } else {
      error = 'неизвестный тип модуля данных';
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    console.warn('loadFixtures failed', channels, error);
  }
  cache[channels] = list ?? [];
  return { fixtures: cache[channels]!, error };
}

export async function loadFixtures(channels: number): Promise<Fixture[]> {
  return (await loadFixturesMeta(channels)).fixtures;
}

// Логика поиска повторяет замысел mafixture.ru:
// для каждого канала, где выбран не-ANY атрибут, прибор должен точно совпадать;
// если канал помечен «НЕ» — наоборот, НЕ совпадать (атрибут ≠ выбранному).
// (На самом сайте в коде filters есть баг: включённый NOT всегда даёт 0
// приборов; здесь реализована корректная семантика «НЕ».)
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