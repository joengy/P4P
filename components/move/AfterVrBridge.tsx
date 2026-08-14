import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Card, Photo, Btn, Icon, Tag } from '@/components/ui';
import { colors } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import type { VrSession } from '@/data/mock';

export function AfterVrBridge({ session }: { session: VrSession }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const router = useRouter();
  const rw = session.realWorld;
  if (!rw) return null;

  return (
    <Card pad={0} style={{ overflow: 'hidden' }}>
      <View>
        <Photo kind="park" height={140} round={0} />
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: 'rgba(20,18,16,.5)',
            paddingHorizontal: 9,
            paddingVertical: 5,
            borderRadius: 99,
          }}
        >
          <Icon name="arrow" size={11} stroke="#fff" />
          <Text style={{ color: '#fff', fontSize: 10.5, fontWeight: '800', letterSpacing: 0.4 }}>VR TO REAL</Text>
        </View>
      </View>
      <View style={{ padding: 16, gap: 10 }}>
        <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.accent, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          {t('move.bridgeKicker')}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.ink }}>{L(rw.title, lang)}</Text>
        <Text style={{ fontSize: 13, color: colors.muted }}>{L(rw.when, lang)}</Text>
        <Text style={{ fontSize: 13.5, color: colors.ink, lineHeight: 20 }}>{t('move.bridgeBody')}</Text>
        <Tag tone="lav">{t('move.bridgeStep')}</Tag>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Btn full>{t('move.bridgeCta')}</Btn>
          </View>
          <View style={{ flex: 1 }}>
            <Btn full ghost onPress={() => router.push(`/share/${session.id}?invite=1`)}>
              {t('move.inviteFriend')}
            </Btn>
          </View>
        </View>
      </View>
    </Card>
  );
}
