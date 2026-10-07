import React from 'react';
import { StyleSheet, Text as NativeText, type TextProps, type TextStyle } from 'react-native';

export const appFonts = {
  regular: 'IBMPlexSansArabic_400Regular',
  medium: 'IBMPlexSansArabic_500Medium',
  semiBold: 'IBMPlexSansArabic_600SemiBold',
  bold: 'IBMPlexSansArabic_700Bold',
} as const;

type AvailableWeight = '400' | '500' | '600' | '700';

function resolveWeight(weight?: TextStyle['fontWeight']): AvailableWeight {
  switch (String(weight ?? '400')) {
    case '500':
      return '500';
    case '600':
      return '600';
    case '700':
    case '800':
    case '900':
    case 'bold':
      return '700';
    default:
      return '400';
  }
}

const fontByWeight: Record<AvailableWeight, string> = {
  '400': appFonts.regular,
  '500': appFonts.medium,
  '600': appFonts.semiBold,
  '700': appFonts.bold,
};

export function AppText({ style, ...props }: TextProps) {
  const flattenedStyle = StyleSheet.flatten(style);
  const customFontFamily = flattenedStyle?.fontFamily;
  const weight = resolveWeight(flattenedStyle?.fontWeight);
  const fontStyle = customFontFamily
    ? undefined
    : { fontFamily: fontByWeight[weight], fontWeight: weight };

  return <NativeText {...props} style={[style, fontStyle]} />;
}
