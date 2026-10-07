import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { getChapter } from '@/lib/story';
import { useReader } from '@/context/ReaderContext';

export default function SavedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { preferences, toggleBookmark } = useReader();
  const bookmarks = [...preferences.bookmarks].sort((a, b) => b.savedAt - a.savedAt);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: PlatformBottom(insets.bottom) },
        ]}
      >
        <Text style={[styles.kicker, { color: colors.primary }]}>علاماتك</Text>
        <View style={styles.heading}>
          <Text style={[styles.title, { color: colors.foreground }]}>فصول محفوظة</Text>
          <View style={[styles.count, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.countText, { color: colors.foreground }]}>{bookmarks.length}</Text>
          </View>
        </View>
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>الفصول التي وضعت عليها علامة للعودة إليها.</Text>

        {bookmarks.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.accent }]}>
              <Ionicons name="bookmark-outline" size={23} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>لا توجد علامات بعد</Text>
            <Text style={[styles.emptyCopy, { color: colors.mutedForeground }]}>
              احفظ أي فصل من شاشة القراءة ليظهر هنا.
            </Text>
            <Pressable
              accessibilityRole="button"
              testID="browse-chapters"
              onPress={() => router.push('/chapters')}
              style={({ pressed }) => [styles.browseButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
            >
              <Text style={[styles.browseText, { color: colors.primaryForeground }]}>تصفّح الفصول</Text>
              <Feather name="arrow-left" size={15} color={colors.primaryForeground} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.savedList}>
            {bookmarks.map((bookmark) => {
              const chapter = getChapter(bookmark.chapterId);
              if (!chapter) return null;
              const progress = preferences.progressByChapter[chapter.id] ?? 0;
              return (
                <View key={bookmark.chapterId} style={[styles.savedRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Pressable
                    accessibilityRole="button"
                    testID={`saved-${chapter.id}`}
                    onPress={() => router.push({ pathname: '/reader/[id]', params: { id: chapter.id } })}
                    style={({ pressed }) => [styles.savedMain, pressed && styles.pressed]}
                  >
                    <View style={[styles.savedIcon, { backgroundColor: colors.accent }]}>
                      <Ionicons name="bookmark" size={17} color={colors.primary} />
                    </View>
                    <View style={styles.savedCopy}>
                      <Text style={[styles.savedKicker, { color: colors.mutedForeground }]}>{chapter.heading}</Text>
                      <Text style={[styles.savedTitle, { color: colors.foreground }]} numberOfLines={1}>{chapter.title}</Text>
                      <Text style={[styles.savedProgress, { color: colors.mutedForeground }]}>{progress}% من الفصل</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="إزالة العلامة"
                    testID={`remove-saved-${chapter.id}`}
                    onPress={() => toggleBookmark(chapter.id)}
                    style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
                  >
                    <Feather name="x" size={17} color={colors.mutedForeground} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PlatformBottom(bottomInset: number) {
  return Math.max(bottomInset + 26, 44);
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 22, gap: 7 },
  kicker: { fontSize: 12, fontWeight: '700', textAlign: 'right' },
  heading: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  title: { fontSize: 27, fontWeight: '800', textAlign: 'right' },
  count: { minWidth: 31, height: 31, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 12, fontWeight: '700' },
  intro: { fontSize: 13, lineHeight: 22, textAlign: 'right', marginBottom: 16 },
  empty: { alignItems: 'center', borderWidth: 1, borderRadius: 24, paddingHorizontal: 24, paddingVertical: 32, gap: 12 },
  emptyIcon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  emptyTitle: { fontSize: 17, fontWeight: '800' },
  emptyCopy: { fontSize: 13, lineHeight: 21, textAlign: 'center' },
  browseButton: { minHeight: 46, borderRadius: 15, paddingHorizontal: 16, marginTop: 7, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  browseText: { fontSize: 13, fontWeight: '700' },
  savedList: { gap: 11 },
  savedRow: { minHeight: 85, borderRadius: 18, borderWidth: 1, paddingVertical: 10, paddingLeft: 12, paddingRight: 8, flexDirection: 'row-reverse', alignItems: 'center' },
  savedMain: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  savedIcon: { width: 43, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  savedCopy: { flex: 1, alignItems: 'flex-end', gap: 3 },
  savedKicker: { fontSize: 10 },
  savedTitle: { fontSize: 14, fontWeight: '700' },
  savedProgress: { fontSize: 10 },
  removeButton: { width: 37, height: 42, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
