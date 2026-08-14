import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Photo, Icon, Btn, Avatar, AvatarStack } from '@/components/ui';
import { colors, fonts, toneColors, radii } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useHistoryItem } from '@/data/queries';
import { TYPE_META, INTENSITY } from '@/data/mock';

function DetailTile({ label, value, tone }: { label: string; value: string; tone: 'lav' | 'calm' | 'accent' | 'neutral' }) {
  const t = toneColors(tone);
  return (
    <View style={{ flex: 1, backgroundColor: t.bg, borderRadius: 14, padding: 12, alignItems: 'center' }}>
      <Text style={{ fontSize: 11, color: t.fg, fontWeight: '700' }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '700', color: t.fg, marginTop: 4 }}>{value}</Text>
    </View>
  );
}

function SessionKv({ icon, label, value, avatarName, avatarIdx }: { icon: 'pin' | 'people'; label: string; value: string; avatarName?: string; avatarIdx?: number | null }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface2, borderRadius: radii.sm, padding: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 80 }}>
        <Icon name={icon} size={12} stroke={colors.muted} />
        <Text style={{ fontSize: 10.5, color: colors.muted, fontWeight: '700', letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</Text>
      </View>
      {avatarIdx != null && <Avatar name={avatarName || '?'} size={22} idx={avatarIdx} />}
      <Text style={{ flex: 1, fontSize: 12.5, fontWeight: '700', color: colors.ink, lineHeight: 17 }}>{value}</Text>
    </View>
  );
}

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data: h } = useHistoryItem(id);

  const onClose = () => router.back();

  if (!h) {
    return (
      <Sheet onClose={onClose}>
        <View style={{ padding: 24 }}>
          <Text>Not found</Text>
        </View>
      </Sheet>
    );
  }

  const tm = TYPE_META[h.type];
  const it = INTENSITY[h.intensity];
  const env = h.type === 'vr' ? 'forest-vr' : h.type === 'outdoor' ? 'park' : h.type === 'social' ? 'court' : 'home';

  return (
    <Sheet onClose={onClose}>
      <Photo kind={env} height={140} round={0}>
        <View style={{ position: 'absolute', left: 16, bottom: 14 }}>
          <Text style={{ fontSize: 10.5, fontWeight: '800', opacity: 0.92, letterSpacing: 0.5, textTransform: 'uppercase', color: '#fff' }}>
            {t('session.sessionDetailKicker')} · {L(h.when, lang)}
          </Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: '600', lineHeight: 27, marginTop: 2, color: '#fff' }}>
            {L(h.title, lang)}
          </Text>
        </View>
      </Photo>

      <View style={{ padding: 20, paddingTop: 16, gap: 16 }}>
        <View style={{ gap: 9 }}>
          {h.location && <SessionKv icon="pin" label={t('session.whereLabel')} value={L(h.location, lang)} />}
          {h.ledBy && (
            <SessionKv
              icon="people"
              label={t('session.ledByLabel')}
              value={L(h.ledBy, lang)}
              avatarName={typeof h.ledBy === 'object' ? h.ledBy.en : h.ledBy}
              avatarIdx={h.ledByIdx}
            />
          )}
          {h.withWho && h.withWho.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface2, borderRadius: radii.sm, padding: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 80 }}>
                <Icon name="people" size={12} stroke={colors.muted} />
                <Text style={{ fontSize: 10.5, color: colors.muted, fontWeight: '700', letterSpacing: 0.3, textTransform: 'uppercase' }}>{t('session.withYou')}</Text>
              </View>
              <AvatarStack names={h.withWho} size={22} />
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.ink }}>{h.withWho.join(', ')}</Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <DetailTile label={t('session.durationLabel')} value={`${h.min} ${t('common.min')}`} tone={tm.tone} />
          <DetailTile label={t('profile.energyKcal')} value={`${h.kcal} ${t('profile.kcal')}`} tone="accent" />
          <DetailTile label={t('session.intensityLabel')} value={L(it.label, lang)} tone={it.tone} />
        </View>

        <View style={{ backgroundColor: colors.calmSoft, borderRadius: radii.sm, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 }}>
          <View style={{ width: 38, height: 38, borderRadius: 99, backgroundColor: colors.calm, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="heart" size={18} stroke="#fff" />
          </View>
          <View>
            <Text style={{ fontSize: 10.5, fontWeight: '800', color: colors.calmInk, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>
              {t('session.moodAfter')}
            </Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: '700', color: colors.ink }}>{L(h.mood, lang)}</Text>
          </View>
        </View>

        {h.notes && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.accent, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {t('session.whatHappened')}
            </Text>
            <Text style={{ fontSize: 13.5, lineHeight: 20, color: colors.ink }}>{L(h.notes, lang)}</Text>
          </View>
        )}

        <Btn full size="lg" tone={tm.tone} icon={<Icon name={tm.icon} size={17} stroke="#fff" />}>
          {t('session.doAgain')}
        </Btn>
      </View>
    </Sheet>
  );
}
