import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Card, Photo, Tag, Btn, BadgeRow, Stars } from '@/components/ui';
import { colors } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import type { DiscoverItem, CtaKey } from '@/data/mock';

const ctaLabelKey: Record<CtaKey, string> = {
  rsvp: 'discover.ctaRsvp',
  join: 'discover.ctaJoin',
  saveRoute: 'discover.ctaSaveRoute',
  start: 'discover.ctaStart',
  startVR: 'discover.ctaStartVR',
  addPlan: 'discover.ctaAddPlan',
  askFirst: 'discover.ctaAskFirst',
};

export function DiscoverCard({ item }: { item: DiscoverItem }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const router = useRouter();

  return (
    <Card onPress={() => router.push(`/activity/${item.id}`)} pad={0} style={{ overflow: 'hidden' }}>
      <View>
        <Photo kind={item.photo} height={130} round={0}>
          {(item.kind.includes('vr') || item.min) && (
            <View
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: 'rgba(20,18,16,.5)',
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderRadius: 99,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 10.5, fontWeight: '700' }}>
                {item.kind.includes('vr') ? 'VR' : `${item.min} ${t('common.min')}`}
              </Text>
            </View>
          )}
          {item.distance && (
            <View
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(20,18,16,.5)',
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderRadius: 99,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 10.5, fontWeight: '700' }}>{L(item.distance, lang)}</Text>
            </View>
          )}
        </Photo>
      </View>
      <View style={{ padding: 14, gap: 8 }}>
        <Text style={{ fontSize: 16.5, fontWeight: '700', color: colors.ink }}>{L(item.title, lang)}</Text>
        <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }} numberOfLines={2}>
          {L(item.note, lang)}
        </Text>

        {item.org ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.ink }}>{L(item.org.name, lang)}</Text>
            {item.org.verified && <Tag tone="calm">{t('social.verified')}</Tag>}
          </View>
        ) : item.access ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {item.access.map((a) => (
              <Tag key={a} tone="neutral">
                {a}
              </Tag>
            ))}
          </View>
        ) : null}

        {item.badges && <BadgeRow badges={item.badges} />}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Stars value={item.rating} />
            {item.when && <Text style={{ fontSize: 12, color: colors.faint }}>· {L(item.when, lang)}</Text>}
          </View>
          <Btn size="sm">{t(ctaLabelKey[item.cta])}</Btn>
        </View>
      </View>
    </Card>
  );
}
