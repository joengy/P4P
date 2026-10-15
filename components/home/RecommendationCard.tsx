import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Card, Photo, Tag, Btn, SaveButton } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useSaved } from '@/data/queries';
import type { HomeRec } from '@/data/mock';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.accent, letterSpacing: 0.4, textTransform: 'uppercase' }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

export function RecommendationCard({ rec }: { rec: HomeRec }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const router = useRouter();
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(rec.id);

  const cueMap: Record<string, string> = {
    beginner: t('cues.beginner'),
    friendWelcome: t('cues.friendWelcome'),
    women: t('cues.women'),
    seated: t('cues.seated'),
    quiet: t('cues.quiet'),
    noBooking: t('cues.noBooking'),
    stopAnytime: t('cues.stopAnytime'),
  };

  return (
    <Card pad={0} style={{ overflow: 'hidden', gap: 0 }}>
      <View>
        <Photo kind={rec.photo} height={150} round={0} />
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'rgba(20,18,16,.5)',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 99,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{t('home.basedOnCheckIn')}</Text>
        </View>
      </View>

      <View style={{ padding: 16, gap: 14 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: '600', color: colors.ink }}>
            {L(rec.invite, lang)}
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted }}>{L(rec.sub, lang)}</Text>
        </View>

        {/* Who runs it stays on the card, not only on the detail page — for a
            woman deciding whether this feels safe to try, the organiser and the
            language support are part of the first impression. */}
        <View style={{ backgroundColor: colors.surface2, borderRadius: 12, padding: 12, gap: 4 }}>
          <Text style={{ fontSize: 12.5 }}>
            <Text style={{ color: colors.muted }}>{t('home.organisedBy')}: </Text>
            <Text style={{ fontWeight: '700', color: colors.ink }}>
              {rec.org ? L(rec.org.name, lang) : t('home.selfGuided')}
            </Text>
          </Text>
          {rec.org && (
            <Text style={{ fontSize: 12.5 }}>
              <Text style={{ color: colors.muted }}>{t('home.languageLabel')}: </Text>
              <Text style={{ fontWeight: '700', color: colors.ink }}>{rec.detail.language}</Text>
            </Text>
          )}
        </View>

        <Section label={t('home.whyItFits')}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.ink }}>{L(rec.why, lang)}</Text>
        </Section>

        <Section label={t('home.theBasics')}>
          <Text style={{ fontSize: 13, color: colors.muted }}>
            {rec.detail.time} · {L(rec.dur, lang)} · {rec.detail.location} · {rec.detail.cost}
          </Text>
        </Section>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.accent, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            {t('home.firstEntry')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {rec.comfort.map((c) =>
              cueMap[c] ? (
                <Tag key={c} tone="accent">
                  {cueMap[c]}
                </Tag>
              ) : null
            )}
          </View>
          <Text
            onPress={() => router.push(`/activity/${rec.id}`)}
            style={{ fontSize: 12, fontWeight: '700', color: colors.accent }}
          >
            {t('home.moreOnDetail')} →
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Btn full onPress={() => router.push(`/activity/${rec.id}`)}>
              {t('home.viewDetails')}
            </Btn>
          </View>
          <SaveButton saved={saved} onToggle={() => toggleSaved(rec.id)} />
        </View>
      </View>
    </Card>
  );
}
