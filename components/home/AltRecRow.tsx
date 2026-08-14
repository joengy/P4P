import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Photo } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import type { HomeRec } from '@/data/mock';

export function AltRecRow({ rec }: { rec: HomeRec }) {
  const { lang } = useLang();
  const router = useRouter();
  return (
    <Card onPress={() => router.push(`/activity/${rec.id}`)} pad={10} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Photo kind={rec.photo} height={62} round={14} style={{ width: 62 }} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 14.5, fontWeight: '700', color: colors.ink }} numberOfLines={1}>
          {L(rec.invite, lang)}
        </Text>
        <Text style={{ fontSize: 12.5, color: colors.muted }} numberOfLines={1}>
          {L(rec.sub, lang)}
        </Text>
      </View>
    </Card>
  );
}
