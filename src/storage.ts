// Хранилище: избранное + история (AsyncStorage)

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_KEY = 'cogitator.favorites.v1';
const HIST_KEY = 'cogitator.history.v1';
const MAX_HISTORY = 50;

export async function loadJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('save failed', key, e);
  }
}

export function loadFavorites() {
  return loadJSON<{ name: string; channels: { number: number; attribute: string }[]; savedAt: number }[]>(FAV_KEY);
}
export async function saveFavorites(favorites: unknown): Promise<void> {
  await saveJSON(FAV_KEY, favorites);
}

export function loadHistory() {
  return loadJSON<
    {
      id: string;
      channelCount: number;
      selections: { number: number; option: { ma2: string; label: string }; inverted: boolean }[];
      found: number;
      date: number;
    }[]
  >(HIST_KEY);
}
export async function saveHistory(history: unknown): Promise<void> {
  await saveJSON(HIST_KEY, history);
}

export function trimHistory<T>(history: T[]): T[] {
  return history.slice(0, MAX_HISTORY);
}