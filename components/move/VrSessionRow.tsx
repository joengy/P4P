import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Card, Photo, Tag } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import type { VrSession } from '@/data/mock';

export function VrSessionRow({ session }: { session: VrSession }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const router = useRouter();
  return (
    <Card onPress={() => router.push(`/vr/${session.id}`)} pad={10} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Photo kind={session.env} height={62} round={14} style={{ width: 62 }} />
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 14.5, fontWeight: '700', color: colors.ink }} numberOfLines={1}>
          {L(session.title, lang)}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Tag tone={session.tone}>
            {session.min} {t('common.min')}
          </Tag>
          <Tag tone="neutral">{L(session.goal, lang)}</Tag>
        </View>
      </View>
    </Card>
  );
}
