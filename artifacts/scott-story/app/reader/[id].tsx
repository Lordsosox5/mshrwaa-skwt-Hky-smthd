import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { ImageBackground, NativeScrollEvent, NativeSyntheticEvent, Platform, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { getChapter, getChapterIndex, chapterArtwork, chapters } from '@/lib/story';
import { useReader } from '@/context/ReaderContext';
import { readerPalettes } from '@/constants/colors';

export default function ReaderScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : '0';
  const chapter = getChapter(id);
  const chapterIndex = getChapterIndex(id);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { preferences, isReady, setFontSize, setProgress, toggleBookmark } = useReader();
  const scrollRef = useRef<ScrollView>(null);
  const contentHeight = useRef(0);
  const restoreKey = useRef<string | null>(null);
  const currentPercent = useRef(0);
  const bookmarkSaved = preferences.bookmarks.some((bookmark) => bookmark.chapterId === id);
  const savedPercent = id === preferences.lastChapterId ? preferences.progressByChapter[id] ?? 0 : 0;
  const pageColors = readerPalettes[preferences.theme];

  useEffect(() => {
    restoreKey.current = null;
    contentHeight.current = 0;
    currentPercent.current = 0;
    setProgress(id, preferences.progressByChapter[id] ?? 0);
  }, [id, setProgress]);

  useEffect(() => {
    if (!isReady || contentHeight.current <= 0 || restoreKey.current === id) return;
    const offset = savedPercent > 0 ? contentHeight.current * (savedPercent / 100) : 0;
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: offset, animated: false }));
    currentPercent.current = savedPercent;
    restoreKey.current = id;
  }, [id, isReady, savedPercent]);

  const handleContentSizeChange = useCallback((_width: number, height: number) => {
    contentHeight.current = height;
    if (!isReady || restoreKey.current === id) return;
    const offset = savedPercent > 0 ? height * (savedPercent / 100) : 0;
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: offset, animated: false }));
    currentPercent.current = savedPercent;
    restoreKey.current = id;
  }, [id, isReady, savedPercent]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (restoreKey.current !== id) return;
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxOffset = Math.max(1, contentSize.height - layoutMeasurement.height);
    const nextPercent = Math.min(100, Math.max(0, Math.round((contentOffset.y / maxOffset) * 100)));
    if (Math.abs(nextPercent - currentPercent.current) >= 5 || nextPercent === 100) {
      currentPercent.current = nextPercent;
      setProgress(id, nextPercent);
    }
  }, [id, setProgress]);

  if (!chapter) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <View style={styles.notFound}>
          <Ionicons name="book-outline" size={32} color={colors.primary} />
          <Text style={[styles.notFoundTitle, { color: colors.foreground }]}>هذا الفصل غير موجود</Text>
          <Pressable onPress={() => router.replace('/chapters')} style={[styles.backToList, { backgroundColor: colors.primary }]}>
            <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>العودة إلى الفصول</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const art = chapterArtwork[id];
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/chapters');
  const changeChapter = (nextIndex: number) => {
    const nextChapter = chapters[nextIndex];
    if (!nextChapter) return;
    router.replace({ pathname: '/reader/[id]', params: { id: nextChapter.id } });
  };
  const onBookmark = () => {
    if (Platform.OS !== 'web') void Haptics.selectionAsync();
    toggleBookmark(id);
  };
  const decreaseFont = () => {
    if (Platform.OS !== 'web') void Haptics.selectionAsync();
    setFontSize(preferences.fontSize - 2);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: pageColors.background }]} edges={['top']}>
      <StatusBar barStyle={preferences.theme === 'night' ? 'light-content' : 'dark-content'} />
      <View style={[styles.readerHeader, { paddingTop: Platform.OS === 'web' ? 67 : 6, borderBottomColor: pageColors.border }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="رجوع"
          testID="reader-back"
          onPress={goBack}
          style={({ pressed }) => [styles.headerIcon, pressed && styles.pressed]}
        >
          <Feather name="arrow-right" size={20} color={pageColors.foreground} />
        </Pressable>
        <View style={styles.headerMeta}>
          <Text style={[styles.headerMetaText, { color: pageColors.muted }]}>مشروع سكوت</Text>
          <Text style={[styles.headerMetaSub, { color: pageColors.muted }]}>{chapterIndex + 1} من {chapters.length}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={bookmarkSaved ? 'إزالة العلامة' : 'حفظ الفصل'}
          testID="toggle-bookmark"
          onPress={onBookmark}
          style={({ pressed }) => [styles.headerIcon, pressed && styles.pressed]}
        >
          <Ionicons name={bookmarkSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={bookmarkSaved ? pageColors.accent : pageColors.foreground} />
        </Pressable>
      </View>

      <View style={[styles.readerProgressTrack, { backgroundColor: pageColors.border }]}>
        <View style={[styles.readerProgressFill, { width: `${savedPercent}%`, backgroundColor: pageColors.accent }]} />
      </View>

      <View style={[styles.readerTools, { borderBottomColor: pageColors.border }]}>
        <View style={styles.fontTools}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="تصغير الخط"
            testID="font-smaller"
            onPress={decreaseFont}
            disabled={preferences.fontSize <= 16}
            style={({ pressed }) => [styles.fontButton, { borderColor: pageColors.border }, pressed && styles.pressed]}
          >
            <Feather name="minus" size={15} color={pageColors.foreground} />
          </Pressable>
          <Text style={[styles.fontSizeLabel, { color: pageColors.muted }]}>{preferences.fontSize}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="تكبير الخط"
            testID="font-larger"
            onPress={() => { if (Platform.OS !== 'web') void Haptics.selectionAsync(); setFontSize(preferences.fontSize + 2); }}
            disabled={preferences.fontSize >= 30}
            style={({ pressed }) => [styles.fontButton, { borderColor: pageColors.border }, pressed && styles.pressed]}
          >
            <Feather name="plus" size={15} color={pageColors.foreground} />
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="تغيير مظهر القراءة"
          testID="reader-settings"
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.themeButton, pressed && styles.pressed]}
        >
          <Ionicons name="color-palette-outline" size={17} color={pageColors.muted} />
          <Text style={[styles.themeLabel, { color: pageColors.muted }]}>المظهر</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={300}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.article, { paddingBottom: Math.max(insets.bottom + 24, Platform.OS === 'web' ? 48 : 30) }]}
      >
        {art ? (
          <View style={styles.artFrame}>
            <ImageBackground source={art} resizeMode="cover" style={styles.artImage}>
              <LinearGradient colors={['rgba(10,10,10,0.02)', 'rgba(10,10,10,0.82)']} style={StyleSheet.absoluteFill} />
              <View style={styles.artCaption}>
                <Text style={styles.artChapter}>{chapter.heading}</Text>
                <Text style={styles.artTitle}>{chapter.title}</Text>
              </View>
            </ImageBackground>
          </View>
        ) : (
          <View style={[styles.chapterHeading, { borderBottomColor: pageColors.border }]}>
            <Text style={[styles.chapterNumber, { color: pageColors.accent }]}>{chapter.heading}</Text>
            <Text style={[styles.chapterTitle, { color: pageColors.foreground }]}>{chapter.title}</Text>
          </View>
        )}

        <View style={styles.paragraphs}>
          {chapter.paragraphs.map((paragraph, index) => (
            <Text
              key={`${chapter.id}-${index}`}
              style={[
                styles.paragraph,
                {
                  color: pageColors.foreground,
                  fontSize: preferences.fontSize,
                  lineHeight: preferences.fontSize * 1.9,
                },
                paragraph === 'النهاية....' && [styles.ending, { color: pageColors.accent }],
              ]}
            >
              {paragraph}
            </Text>
          ))}
        </View>

        <View style={[styles.chapterNavigation, { borderTopColor: pageColors.border }]}>
          <Pressable
            accessibilityRole="button"
            testID="previous-chapter"
            disabled={chapterIndex <= 0}
            onPress={() => changeChapter(chapterIndex - 1)}
            style={({ pressed }) => [
              styles.chapterNavButton,
              { borderColor: pageColors.border, opacity: chapterIndex <= 0 ? 0.35 : 1 },
              pressed && styles.pressed,
            ]}
          >
            <Feather name="arrow-right" size={16} color={pageColors.foreground} />
            <Text style={[styles.chapterNavText, { color: pageColors.foreground }]}>السابق</Text>
          </Pressable>
          <Text style={[styles.chapterNavCount, { color: pageColors.muted }]}>{chapterIndex + 1} / {chapters.length}</Text>
          <Pressable
            accessibilityRole="button"
            testID="next-chapter"
            disabled={chapterIndex >= chapters.length - 1}
            onPress={() => changeChapter(chapterIndex + 1)}
            style={({ pressed }) => [
              styles.chapterNavButton,
              { borderColor: pageColors.border, opacity: chapterIndex >= chapters.length - 1 ? 0.35 : 1 },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.chapterNavText, { color: pageColors.foreground }]}>التالي</Text>
            <Feather name="arrow-left" size={16} color={pageColors.foreground} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  readerHeader: { minHeight: 55, paddingHorizontal: 18, paddingBottom: 8, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerMeta: { alignItems: 'center', gap: 2 },
  headerMetaText: { fontSize: 12, fontWeight: '700' },
  headerMetaSub: { fontSize: 10 },
  readerProgressTrack: { height: 2, width: '100%' },
  readerProgressFill: { height: '100%' },
  readerTools: { minHeight: 53, paddingHorizontal: 19, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fontTools: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fontButton: { width: 31, height: 31, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  fontSizeLabel: { minWidth: 20, textAlign: 'center', fontSize: 12 },
  themeButton: { minHeight: 36, flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 3 },
  themeLabel: { fontSize: 12 },
  article: { paddingHorizontal: 23, paddingTop: 20 },
  artFrame: { height: 205, borderRadius: 22, overflow: 'hidden', marginBottom: 22 },
  artImage: { flex: 1, justifyContent: 'flex-end' },
  artCaption: { paddingHorizontal: 17, paddingBottom: 16, alignItems: 'flex-end' },
  artChapter: { color: '#F2C27F', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  artTitle: { color: '#FFF8ED', fontSize: 24, fontWeight: '800', textAlign: 'right' },
  chapterHeading: { borderBottomWidth: 1, paddingBottom: 18, marginBottom: 20, alignItems: 'flex-end' },
  chapterNumber: { fontSize: 12, fontWeight: '700', marginBottom: 7 },
  chapterTitle: { fontSize: 28, fontWeight: '800', textAlign: 'right' },
  paragraphs: { gap: 17 },
  paragraph: { textAlign: 'right', writingDirection: 'rtl', fontWeight: '400' },
  ending: { textAlign: 'center', fontSize: 23, fontWeight: '800', marginTop: 10, marginBottom: 6 },
  chapterNavigation: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, marginTop: 28, paddingTop: 17 },
  chapterNavButton: { minHeight: 43, borderRadius: 14, borderWidth: 1, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
  chapterNavText: { fontSize: 12, fontWeight: '700' },
  chapterNavCount: { fontSize: 11, fontWeight: '600' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 15, padding: 24 },
  notFoundTitle: { fontSize: 18, fontWeight: '700' },
  backToList: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14 },
  pressed: { opacity: 0.72 },
});
