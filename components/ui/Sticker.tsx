import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { AppLang } from '@/i18n';
import { toneColors, type Tone } from '@/constants/theme';

export type PhraseSticker = { id: string; en: string; zh: string; tone: Tone };
export type StickerValue = string | PhraseSticker;

type Size = 'xs' | 'sm' | 'md' | 'lg';

const emojiSizes: Record<Size, number> = { xs: 18, sm: 24, md: 40, lg: 56 };
const pads: Record<Size, { h: number; v: number }> = {
  xs: { h: 9, v: 4 },
  sm: { h: 11, v: 6 },
  md: { h: 15, v: 11 },
  lg: { h: 18, v: 14 },
};
const enFs: Record<Size, number> = { xs: 11, sm: 12, md: 15, lg: 17 };

export function Sticker({
  sticker,
  lang,
  size = 'md',
  onPress,
}: {
  sticker: StickerValue;
  lang: AppLang;
  size?: Size;
  onPress?: () => void;
}) {
  if (typeof sticker === 'string') {
    return (
      <Pressable onPress={onPress} disabled={!onPress}>
        <Text style={{ fontSize: emojiSizes[size] }}>{sticker}</Text>
      </Pressable>
    );
  }
  const t = toneColors(sticker.tone);
  const pad = pads[size];
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View
        style={{
          alignItems: 'center',
          gap: 1,
          backgroundColor: t.bg,
          paddingHorizontal: pad.h,
          paddingVertical: pad.v,
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: t.solid,
          maxWidth: 170,
        }}
      >
        <Text style={{ fontWeight: '800', fontSize: enFs[size], color: t.fg, textAlign: 'center' }}>
          {lang === 'zh' ? sticker.zh : sticker.en}
        </Text>
        <Text style={{ fontWeight: '600', fontSize: enFs[size] - 3, opacity: 0.72, color: t.fg, textAlign: 'center' }}>
          {lang === 'zh' ? sticker.en : sticker.zh}
        </Text>
      </View>
    </Pressable>
  );
}
