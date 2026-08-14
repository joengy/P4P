import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Tag } from './Tag';
import type { Tone } from '@/constants/theme';

export type BadgeKey = 'free' | 'dropin' | 'women' | 'bilingual' | 'home';

export function BadgeRow({ badges }: { badges: BadgeKey[] }) {
  const { t } = useTranslation();
  const map: Record<BadgeKey, { label: string; tone: Tone }> = {
    free: { label: t('badges.free'), tone: 'calm' },
    dropin: { label: t('badges.dropIn'), tone: 'lav' },
    women: { label: t('badges.womenOnly'), tone: 'accent' },
    bilingual: { label: t('badges.bilingual'), tone: 'neutral' },
    home: { label: 'VR', tone: 'lav' },
  };
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {badges.map((b) =>
        map[b] ? (
          <Tag key={b} tone={map[b].tone}>
            {map[b].label}
          </Tag>
        ) : null
      )}
    </View>
  );
}
