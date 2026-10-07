import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { chapters } from '@/lib/story';
import { useReader } from '@/context/ReaderContext';

export default function ChaptersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { preferences } = useReader();
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return chapters;
    return chapters.filter((chapter) =>
      `${chapter.heading} ${chapter.title}`.toLocaleLowerCase().includes(term),
    );
  }, [search]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={styles.fill} behavior="padding">
        <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : Math.max(10, insets.top * 0.15) }]}>
          <View>
            <Text style={[styles.kicker, { color: colors.primary }]}>الأرشيف الكامل</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>فصول الرواية</Text>
          </View>
          <View style={[styles.count, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.countText, { color: colors.foreground }]}>٢٠ فصلاً</Text>
          </View>
        </View>

        <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={19} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="ابحث عن فصل"
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel="ابحث عن فصل"
            testID="chapter-search"
            returnKeyType="search"
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} accessibilityLabel="مسح البحث" testID="clear-search">
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: Platform.OS === 'web' ? 120 : 112 }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={25} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>لا توجد فصول مطابقة</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>جرّب البحث بعنوان آخر.</Text>
            </View>
          ) : filtered.map((chapter) => {
            const progress = preferences.progressByChapter[chapter.id] ?? 0;
            return (
              <Pressable
                key={chapter.id}
                accessibilityRole="button"
                testID={`chapter-${chapter.id}`}
                onPress={() => router.push({ pathname: '/reader/[id]', params: { id: chapter.id } })}
                style={({ pressed }) => [
                  styles.row,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.chapterIndex, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.indexText, { color: colors.accentForeground }]}>{chapter.number}</Text>
                </View>
                <View style={styles.rowCopy}>
                  <Text style={[styles.rowKicker, { color: colors.mutedForeground }]}>{chapter.heading}</Text>
                  <Text style={[styles.rowTitle, { color: colors.foreground }]} numberOfLines={1}>{chapter.title}</Text>
                  <View style={styles.rowProgress}>
                    <View style={[styles.miniTrack, { backgroundColor: colors.secondary }]}>
                      <View style={[styles.miniFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={[styles.percent, { color: colors.mutedForeground }]}>{progress}%</Text>
                  </View>
                </View>
                <Feather name="chevron-left" size={18} color={colors.mutedForeground} />
              </Pressable>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1 },
  header: { paddingHorizontal: 22, paddingBottom: 18, flexDirection: 'row-reverse', alignItems: 'flex-end', justifyContent: 'space-between' },
  kicker: { fontSize: 12, fontWeight: '700', textAlign: 'right' },
  title: { fontSize: 27, fontWeight: '800', textAlign: 'right', marginTop: 5 },
  count: { borderWidth: 1, paddingVertical: 8, paddingHorizontal: 11, borderRadius: 12 },
  countText: { fontSize: 11, fontWeight: '700' },
  searchWrap: { marginHorizontal: 22, marginBottom: 14, minHeight: 48, borderWidth: 1, borderRadius: 16, paddingHorizontal: 13, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, fontSize: 14, textAlign: 'right', paddingVertical: 10 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 22, gap: 10 },
  row: { minHeight: 83, borderRadius: 18, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 12, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  chapterIndex: { width: 43, height: 49, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  indexText: { fontSize: 11, fontWeight: '800', textAlign: 'center' },
  rowCopy: { flex: 1, gap: 4 },
  rowKicker: { fontSize: 10, textAlign: 'right' },
  rowTitle: { fontSize: 14, fontWeight: '700', textAlign: 'right' },
  rowProgress: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: 2 },
  miniTrack: { height: 3, flex: 1, maxWidth: 90, borderRadius: 5, overflow: 'hidden' },
  miniFill: { height: '100%', borderRadius: 5 },
  percent: { fontSize: 9, minWidth: 28, textAlign: 'right' },
  empty: { alignItems: 'center', justifyContent: 'center', padding: 28, borderWidth: 1, borderStyle: 'dashed', borderRadius: 20, gap: 9, marginTop: 28 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptyText: { fontSize: 12 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
});
