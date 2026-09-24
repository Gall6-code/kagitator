// Глобальное состояние: избранное, история, восстановление поиска

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ChannelSelection, Fixture, SavedFixture, SearchRecord } from './models';
import { loadFavorites, loadHistory, saveFavorites, saveHistory, trimHistory } from './storage';

interface AppState {
  favorites: SavedFixture[];
  history: SearchRecord[];
  revive: SearchRecord | null;
  isFavorite: (name: string) => boolean;
  recordSearch: (channelCount: number, selections: ChannelSelection[], found: number) => void;
  toggleFavorite: (fixture: Fixture) => void;
  removeFavorite: (name: string) => void;
  restore: (record: SearchRecord) => void;
  clearRevive: () => void;
  clearHistory: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<SavedFixture[]>([]);
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [revive, setRevive] = useState<SearchRecord | null>(null);

  useEffect(() => {
    void (async () => {
      const [favs, hist] = await Promise.all([loadFavorites(), loadHistory()]);
      if (favs) setFavorites(favs);
      if (hist) setHistory(hist);
    })();
  }, []);

  useEffect(() => {
    void saveFavorites(favorites);
  }, [favorites]);
  useEffect(() => {
    void saveHistory(history);
  }, [history]);

  const favoriteNames = useMemo(() => new Set(favorites.map((f) => f.name)), [favorites]);
  const isFavorite = useCallback((name: string) => favoriteNames.has(name), [favoriteNames]);

  const recordSearch = useCallback((channelCount: number, selections: ChannelSelection[], found: number) => {
    setHistory((prev) =>
      trimHistory([
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          channelCount,
          selections,
          found,
          date: Date.now(),
        },
        ...prev,
      ]),
    );
  }, []);

  const toggleFavorite = useCallback((fixture: Fixture) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.name === fixture.name);
      if (exists) return prev.filter((f) => f.name !== fixture.name);
      return [{ name: fixture.name, channels: fixture.channels, savedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((name: string) => {
    setFavorites((prev) => prev.filter((f) => f.name !== name));
  }, []);

  const restore = useCallback((record: SearchRecord) => {
    setRevive(record);
  }, []);

  const clearRevive = useCallback(() => {
    setRevive(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      favorites,
      history,
      revive,
      isFavorite,
      recordSearch,
      toggleFavorite,
      removeFavorite,
      restore,
      clearRevive,
      clearHistory,
    }),
    [favorites, history, revive, isFavorite, recordSearch, toggleFavorite, removeFavorite, restore, clearRevive, clearHistory],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}