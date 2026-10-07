import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { ReadingTheme, useReader } from '@/context/ReaderContext';

const themeOptions: { id: ReadingTheme; label: string; note: string }[] = [
  { id: 'paper', label: 'ورقي', note: 'فاتح ونقي' },
  { id: 'sepia', label: 'دافئ', note: 'لون الكتب' },
  { id: 'night', label: 'ليلي', note: 'قراءة هادئة' },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { preferences, setTheme, setFontSize, storageIssue } = useReader();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : 6 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="رجوع"
          testID="settings-back"
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          style={({ pressed }) => [styles.backButton, { borderColor: colors.border }, pressed && styles.pressed]}
        >
          <Feather name="arrow-right" size={19} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>إعدادات القراءة</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 30, Platform.OS === 'web' ? 34 : 40) }]}
      >
        <View style={styles.intro}>
          <View style={[styles.introIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="book-outline" size={23} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>اجعل القراءة على طريقتك</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            تُحفظ اختياراتك وتقدّمك على هذا الجهاز.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>لون الصفحة</Text>
            <Ionicons name="color-palette-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.themeList}>
            {themeOptions.map((option) => {
              const selected = preferences.theme === option.id;
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  testID={`theme-${option.id}`}
                  onPress={() => setTheme(option.id)}
                  style={({ pressed }) => [
                    styles.themeOption,
                    { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.accent : colors.background },
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.themeCopy}>
                    <Text style={[styles.themeName, { color: colors.foreground }]}>{option.label}</Text>
                    <Text style={[styles.themeNote, { color: colors.mutedForeground }]}>{option.note}</Text>
                  </View>
                  <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.mutedForeground }]}>
                    {selected && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>حجم الخط</Text>
            <Ionicons name="text-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.fontControl}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="تصغير الخط"
              testID="settings-font-smaller"
              disabled={preferences.fontSize <= 16}
              onPress={() => setFontSize(preferences.fontSize - 2)}
              style={({ pressed }) => [styles.fontButton, { borderColor: colors.border, opacity: preferences.fontSize <= 16 ? 0.4 : 1 }, pressed && styles.pressed]}
            >
              <Feather name="minus" size={18} color={colors.foreground} />
            </Pressable>
            <View style={styles.fontPreview}>
              <Text style={[styles.fontPreviewText, { color: colors.foreground, fontSize: preferences.fontSize }]}>أبجد</Text>
              <Text style={[styles.fontSize, { color: colors.mutedForeground }]}>{preferences.fontSize} نقطة</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="تكبير الخط"
              testID="settings-font-larger"
              disabled={preferences.fontSize >= 30}
              onPress={() => setFontSize(preferences.fontSize + 2)}
              style={({ pressed }) => [styles.fontButton, { borderColor: colors.border, opacity: preferences.fontSize >= 30 ? 0.4 : 1 }, pressed && styles.pressed]}
            >
              <Feather name="plus" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        {storageIssue && (
          <View style={[styles.notice, { backgroundColor: colors.accent }]}>
            <Ionicons name="warning-outline" size={17} color={colors.primary} />
            <Text style={[styles.noticeText, { color: colors.foreground }]}>تعذّر حفظ بعض الإعدادات على هذا الجهاز.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { minHeight: 54, paddingHorizontal: 19, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 39, height: 39, borderWidth: 1, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '800' },
  headerSpacer: { width: 39 },
  content: { paddingHorizontal: 22, paddingTop: 10, gap: 14 },
  intro: { alignItems: 'flex-end', paddingVertical: 12, gap: 7 },
  introIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { fontSize: 21, fontWeight: '800', textAlign: 'right' },
  subtitle: { fontSize: 13, textAlign: 'right', lineHeight: 21 },
  section: { borderRadius: 21, borderWidth: 1, padding: 16, gap: 14 },
  sectionHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 14, fontWeight: '800' },
  themeList: { gap: 8 },
  themeOption: { minHeight: 57, borderRadius: 15, borderWidth: 1, paddingHorizontal: 12, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  themeCopy: { alignItems: 'flex-end', gap: 3 },
  themeName: { fontSize: 13, fontWeight: '700' },
  themeNote: { fontSize: 10 },
  radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 9, height: 9, borderRadius: 5 },
  fontControl: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 5 },
  fontButton: { width: 43, height: 43, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  fontPreview: { alignItems: 'center', gap: 4 },
  fontPreviewText: { fontWeight: '700' },
  fontSize: { fontSize: 10 },
  notice: { borderRadius: 14, padding: 12, flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  noticeText: { flex: 1, fontSize: 12, textAlign: 'right' },
  pressed: { opacity: 0.78 },
});
