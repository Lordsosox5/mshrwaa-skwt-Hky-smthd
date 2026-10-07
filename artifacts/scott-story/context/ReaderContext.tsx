import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ReadingTheme = 'paper' | 'sepia' | 'night';

export type SavedChapter = {
  chapterId: string;
  savedAt: number;
};

export type ReaderPreferences = {
  theme: ReadingTheme;
  fontSize: number;
  lastChapterId: string;
  progressByChapter: Record<string, number>;
  bookmarks: SavedChapter[];
};

type ReaderContextValue = {
  preferences: ReaderPreferences;
  isReady: boolean;
  storageIssue: boolean;
  setTheme: (theme: ReadingTheme) => void;
  setFontSize: (fontSize: number) => void;
  setProgress: (chapterId: string, percent: number) => void;
  toggleBookmark: (chapterId: string) => void;
};

const STORAGE_KEY = 'scott-story.reader.v1';
const defaults: ReaderPreferences = {
  theme: 'sepia',
  fontSize: 20,
  lastChapterId: '0',
  progressByChapter: {},
  bookmarks: [],
};

const ReaderContext = createContext<ReaderContextValue | null>(null);

function normalizePreferences(input: Partial<ReaderPreferences>): ReaderPreferences {
  const theme = input.theme === 'paper' || input.theme === 'night' || input.theme === 'sepia'
    ? input.theme
    : defaults.theme;
  const fontSize = typeof input.fontSize === 'number' && Number.isFinite(input.fontSize)
    ? Math.min(30, Math.max(16, input.fontSize))
    : defaults.fontSize;
  const progressByChapter: Record<string, number> = {};
  if (input.progressByChapter && typeof input.progressByChapter === 'object') {
    for (const [id, value] of Object.entries(input.progressByChapter)) {
      if (typeof value === 'number' && Number.isFinite(value)) {
        progressByChapter[id] = Math.min(100, Math.max(0, Math.round(value)));
      }
    }
  }
  const bookmarks = Array.isArray(input.bookmarks)
    ? input.bookmarks.filter((item): item is SavedChapter =>
        Boolean(item) && typeof item.chapterId === 'string' && typeof item.savedAt === 'number',
      )
    : [];
  return {
    ...defaults,
    ...input,
    theme,
    fontSize,
    lastChapterId: typeof input.lastChapterId === 'string' ? input.lastChapterId : defaults.lastChapterId,
    progressByChapter,
    bookmarks,
  };
}

export function ReaderProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<ReaderPreferences>(defaults);
  const [isReady, setIsReady] = useState(false);
  const [storageIssue, setStorageIssue] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!active || !value) return;
        try {
          setPreferences(normalizePreferences(JSON.parse(value) as Partial<ReaderPreferences>));
        } catch {
          setStorageIssue(true);
        }
      })
      .catch(() => {
        if (active) setStorageIssue(true);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)).catch(() => setStorageIssue(true));
  }, [isReady, preferences]);

  const setTheme = useCallback((theme: ReadingTheme) => {
    setPreferences((current) => ({ ...current, theme }));
  }, []);

  const setFontSize = useCallback((fontSize: number) => {
    const nextSize = Math.min(30, Math.max(16, Math.round(fontSize)));
    setPreferences((current) => ({ ...current, fontSize: nextSize }));
  }, []);

  const setProgress = useCallback((chapterId: string, percent: number) => {
    const nextPercent = Math.min(100, Math.max(0, Math.round(percent)));
    setPreferences((current) => {
      if (
        current.lastChapterId === chapterId &&
        current.progressByChapter[chapterId] === nextPercent
      ) return current;
      return {
        ...current,
        lastChapterId: chapterId,
        progressByChapter: { ...current.progressByChapter, [chapterId]: nextPercent },
      };
    });
  }, []);

  const toggleBookmark = useCallback((chapterId: string) => {
    setPreferences((current) => {
      const exists = current.bookmarks.some((item) => item.chapterId === chapterId);
      return {
        ...current,
        bookmarks: exists
          ? current.bookmarks.filter((item) => item.chapterId !== chapterId)
          : [...current.bookmarks, { chapterId, savedAt: Date.now() }],
      };
    });
  }, []);

  const value = useMemo(
    () => ({ preferences, isReady, storageIssue, setTheme, setFontSize, setProgress, toggleBookmark }),
    [preferences, isReady, storageIssue, setTheme, setFontSize, setProgress, toggleBookmark],
  );

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (!context) throw new Error('useReader must be used inside ReaderProvider');
  return context;
}
