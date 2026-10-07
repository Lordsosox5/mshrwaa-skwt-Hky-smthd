import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, ImageBackground, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { chapters, chapterArtwork, storyMeta } from '@/lib/story';
import { useReader } from '@/context/ReaderContext';

const featuredIds = ['1', '3', '19'];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { preferences } = useReader();
  const currentChapter = chapters.find((chapter) => chapter.id === preferences.lastChapterId) ?? chapters[0];
  const currentProgress = preferences.progressByChapter[currentChapter.id] ?? 0;
  const openReader = (id: string) => router.push({ pathname: '/reader/[id]', params: { id } });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: Platform.OS === 'web' ? 67 : Math.max(12, insets.top * 0.15), paddingBottom: Platform.OS === 'web' ? 122 : 112 },
        ]}
      >
        <View style={styles.topbar}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.accentForeground }]}>دفتر الأسرار</Text>
            <Text style={[styles.topTitle, { color: colors.foreground }]}>حكايةٌ لا تنتهي</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="الإعدادات"
            testID="open-settings"
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [styles.iconButton, { borderColor: colors.border }, pressed && styles.pressed]}
          >
            <Feather name="sliders" size={19} color={colors.foreground} />
          </Pressable>
        </View>

        <View style={styles.coverFrame}>
          <ImageBackground source={chapterArtwork['1']} resizeMode="cover" style={styles.cover}>
            <LinearGradient
              colors={['rgba(12,13,14,0.02)', 'rgba(12,13,14,0.22)', 'rgba(12,13,14,0.94)']}
              locations={[0, 0.38, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.coverTopline}>
              <View style={styles.tag}>
                <View style={[styles.tagDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.tagText}>رواية رعب وغموض</Text>
              </View>
              <Text style={styles.coverCount}>٢٠ فصلاً</Text>
            </View>
            <View style={styles.coverCopy}>
              <Text style={styles.coverKicker}>طائفة اسمثدا</Text>
              <Text style={styles.coverTitle}>{storyMeta.title}</Text>
              <Text style={styles.coverAuthor}>أسامة آدم · نايتز للنشر</Text>
            </View>
          </ImageBackground>
        </View>

        <Pressable
          accessibilityRole="button"
          testID="continue-reading"
          onPress={() => openReader(currentChapter.id)}
          style={({ pressed }) => [styles.continueButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
        >
          <View style={styles.continueIcon}>
            <Ionicons name="book-outline" size={19} color={colors.primaryForeground} />
          </View>
          <View style={styles.continueCopy}>
            <Text style={[styles.continueLabel, { color: colors.primaryForeground }]}>
              {currentProgress > 0 ? 'تابع القراءة' : 'ابدأ القراءة'}
            </Text>
            <Text style={[styles.continueMeta, { color: colors.primaryForeground }]} numberOfLines={1}>
              {currentChapter.title}
              {currentProgress > 0 ? ` · ${currentProgress}%` : ''}
            </Text>
          </View>
          <Feather name="arrow-left" size={19} color={colors.primaryForeground} />
        </Pressable>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>حين يوقظ الصيفُ الأسرار</Text>
            <Text style={[styles.sectionCaption, { color: colors.mutedForeground }]}>مغامرة تبدأ بكابوس ورسالة غامضة</Text>
          </View>
          <Ionicons name="sparkles-outline" size={19} color={colors.primary} />
        </View>
        <Text style={[styles.synopsis, { color: colors.mutedForeground }]}>
          يخطط سكوت وأصدقاؤه لتوثيق أماكن مهجورة، لكن كل موقع يقودهم إلى أثر جديد من جماعة اسمثدا. ما يبدأ كمشروع صيفي يتحول إلى سباق لكشف سرّ يهدد العالم.
        </Text>

        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.progressHeading}>
            <View>
              <Text style={[styles.progressEyebrow, { color: colors.mutedForeground }]}>رحلتك مع الرواية</Text>
              <Text style={[styles.progressTitle, { color: colors.foreground }]}>
                {currentProgress > 0 ? `الفصل ${currentChapter.number}` : 'عشرون فصلاً من الغموض'}
              </Text>
            </View>
            <Text style={[styles.progressNumber, { color: colors.primary }]}>{currentProgress}%</Text>
          </View>
          <View style={[styles.track, { backgroundColor: colors.secondary }]}>
            <View style={[styles.trackFill, { width: `${currentProgress}%`, backgroundColor: colors.primary }]} />
          </View>
        </View>

        <View style={styles.featureHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>من ملفّات القضية</Text>
            <Text style={[styles.sectionCaption, { color: colors.mutedForeground }]}>محطات مصوّرة من الحكاية</Text>
          </View>
          <Pressable onPress={() => router.push('/chapters')} accessibilityRole="button" testID="all-chapters">
            <Text style={[styles.viewAll, { color: colors.primary }]}>كل الفصول</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featureList}>
          {featuredIds.map((id) => {
            const chapter = chapters.find((item) => item.id === id);
            const art = chapterArtwork[id];
            if (!chapter || !art) return null;
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                testID={`featured-chapter-${id}`}
                onPress={() => openReader(id)}
                style={({ pressed }) => [styles.featureCard, pressed && styles.pressed]}
              >
                <View style={styles.featureImageFrame}>
                  <Image source={art} resizeMode="cover" style={styles.featureImage} />
                  <LinearGradient colors={['transparent', 'rgba(12,13,14,0.88)']} style={StyleSheet.absoluteFill} />
                  <Text style={styles.featureNumber}>الفصل {chapter.number}</Text>
                </View>
                <Text style={[styles.featureTitle, { color: colors.foreground }]} numberOfLines={1}>{chapter.title}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 22, gap: 18 },
  topbar: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, textAlign: 'right' },
  topTitle: { fontSize: 25, fontWeight: '700', textAlign: 'right', marginTop: 4 },
  iconButton: { width: 44, height: 44, borderWidth: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  coverFrame: { borderRadius: 28, overflow: 'hidden' },
  cover: { height: 340, justifyContent: 'space-between', padding: 20 },
  coverTopline: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  tag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 100, backgroundColor: 'rgba(15,15,14,0.66)' },
  tagDot: { width: 6, height: 6, borderRadius: 6 },
  tagText: { color: '#F4EEE3', fontSize: 11, fontWeight: '600' },
  coverCount: { color: '#F4EEE3', fontSize: 12, fontWeight: '600', backgroundColor: 'rgba(15,15,14,0.66)', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 100 },
  coverCopy: { alignItems: 'flex-end' },
  coverKicker: { color: '#E6B478', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  coverTitle: { color: '#FFF9EF', fontSize: 34, fontWeight: '800', textAlign: 'right' },
  coverAuthor: { color: '#DDD4C6', fontSize: 12, marginTop: 8 },
  continueButton: { minHeight: 72, borderRadius: 20, paddingHorizontal: 15, flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  continueIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.11)', alignItems: 'center', justifyContent: 'center' },
  continueCopy: { flex: 1, alignItems: 'flex-end', gap: 3 },
  continueLabel: { fontSize: 15, fontWeight: '800' },
  continueMeta: { fontSize: 12, opacity: 0.82 },
  sectionHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '800', textAlign: 'right' },
  sectionCaption: { fontSize: 12, textAlign: 'right', marginTop: 4 },
  synopsis: { fontSize: 14, lineHeight: 25, textAlign: 'right', marginTop: -9 },
  progressCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 14 },
  progressHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  progressEyebrow: { fontSize: 11, textAlign: 'right' },
  progressTitle: { fontSize: 14, fontWeight: '700', textAlign: 'right', marginTop: 4 },
  progressNumber: { fontSize: 20, fontWeight: '800' },
  track: { height: 5, overflow: 'hidden', borderRadius: 6 },
  trackFill: { height: '100%', borderRadius: 6 },
  featureHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 },
  viewAll: { fontSize: 12, fontWeight: '700' },
  featureList: { gap: 12, paddingBottom: 2 },
  featureCard: { width: 166, gap: 9 },
  featureImageFrame: { height: 130, borderRadius: 18, overflow: 'hidden', justifyContent: 'flex-end' },
  featureImage: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  featureNumber: { color: '#F7F1E8', fontSize: 10, fontWeight: '700', textAlign: 'right', padding: 11 },
  featureTitle: { fontSize: 13, fontWeight: '700', textAlign: 'right', paddingHorizontal: 2 },
  pressed: { opacity: 0.84, transform: [{ scale: 0.985 }] },
});
