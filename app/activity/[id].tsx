import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Photo, Tag, Btn, Stars, Avatar, SectionHead } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useSaved } from '@/data/queries';
import { useHomeRec, useDiscoverItem } from '@/data/queries';

function KV({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: '50%', paddingVertical: 6, paddingRight: 8 }}>
      <Text style={{ fontSize: 11, color: colors.faint, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</Text>
      <Text style={{ fontSize: 13.5, color: colors.ink, fontWeight: '600', marginTop: 2 }}>{value}</Text>
    </View>
  );
}

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(id);

  const { data: rec, isLoading: recLoading } = useHomeRec(id);
  const { data: discoverItem, isLoading: discoverLoading } = useDiscoverItem(rec ? null : id);
  const loading = recLoading || discoverLoading;

  const onClose = () => router.back();

  if (rec) {
    return (
      <Sheet onClose={onClose}>
        <Photo kind={rec.photo} height={190} round={0} />
        <View style={{ padding: 18, gap: 16 }}>
          <View style={{ gap: 4 }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: '600', color: colors.ink }}>
              {L(rec.invite, lang)}
            </Text>
            <Text style={{ fontSize: 13.5, color: colors.muted }}>{L(rec.sub, lang)}</Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <KV label={t('session.whenLabel')} value={rec.detail.time} />
            <KV label={t('session.whereLabel')} value={rec.detail.location} />
            <KV label="Cost" value={rec.detail.cost} />
            <KV label={t('home.languageLabel')} value={rec.detail.language} />
            <KV label={t('session.intensityLabel')} value={rec.detail.intensity} />
            <KV label="Bring" value={rec.detail.bring} />
          </View>

          {rec.org && (
            <View style={{ gap: 10 }}>
              <SectionHead>{t('home.whoLeadsIt')}</SectionHead>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar name={rec.org.initials} size={40} idx={2} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>{L(rec.org.name, lang)}</Text>
                  {rec.guide && (
                    <Text style={{ fontSize: 12.5, color: colors.muted }}>
                      {rec.guide.name}
                      {rec.guide.bilingual ? ` · ${t('badges.bilingual')}` : ''}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          <View style={{ gap: 10 }}>
            <SectionHead>{t('home.commentsHeading')}</SectionHead>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Stars value={rec.rating} />
              <Text style={{ fontSize: 12, color: colors.faint }}>
                {rec.reviewsCount} {t('home.commentCount')}
              </Text>
            </View>
            {rec.comments.slice(0, 3).map((c, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                <Avatar name={c.name} size={30} idx={c.idx} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink }}>
                    {c.name} <Text style={{ fontWeight: '400', color: colors.faint }}>· {L(c.when, lang)}</Text>
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.ink, lineHeight: 19 }}>{L(c.text, lang)}</Text>
                </View>
              </View>
            ))}
          </View>

          <Btn full>{rec.kind === 'vr' ? t('move.startSession') : t('home.tryThis')}</Btn>

          <Btn full ghost onPress={() => router.push(`/share/${rec.id}`)}>
            {t('social.shareWithFriend')}
          </Btn>

          {rec.groupChatId && (
            <Btn
              full
              ghost
              onPress={() =>
                router.push({ pathname: '/messages/[id]', params: { id: rec.groupChatId!, from: `/activity/${rec.id}` } })
              }
            >
              {t('social.openGroupChat')}
            </Btn>
          )}

          <Text
            onPress={() => toggleSaved(rec.id)}
            style={{ textAlign: 'center', fontSize: 13.5, fontWeight: '700', color: colors.accent, paddingVertical: 6 }}
          >
            {saved ? t('home.saved') : t('home.saveForLater')}
          </Text>
        </View>
      </Sheet>
    );
  }

  if (discoverItem) {
    return (
      <Sheet onClose={onClose}>
        <Photo kind={discoverItem.photo} height={190} round={0} />
        <View style={{ padding: 18, gap: 16 }}>
          <View style={{ gap: 4 }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: '600', color: colors.ink }}>
              {L(discoverItem.title, lang)}
            </Text>
            <Text style={{ fontSize: 13.5, color: colors.muted }}>{L(discoverItem.note, lang)}</Text>
          </View>

          {discoverItem.org && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar name={discoverItem.org.initials} size={40} idx={2} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>{L(discoverItem.org.name, lang)}</Text>
                {discoverItem.org.verified && <Tag tone="calm">{t('social.verified')}</Tag>}
              </View>
            </View>
          )}

          {discoverItem.coach && (
            <View style={{ gap: 10 }}>
              <SectionHead>{t('home.whoLeadsIt')}</SectionHead>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Avatar name={discoverItem.coach.name} size={40} idx={discoverItem.coach.idx} />
                <Text style={{ fontSize: 13, color: colors.muted, flex: 1 }}>{L(discoverItem.coach.bio, lang)}</Text>
              </View>
            </View>
          )}

          {discoverItem.testimonial && (
            <View style={{ backgroundColor: colors.surface2, borderRadius: 14, padding: 14, gap: 6 }}>
              <Text style={{ fontSize: 13.5, fontStyle: 'italic', color: colors.ink }}>
                “{L(discoverItem.testimonial.text, lang)}”
              </Text>
              <Text style={{ fontSize: 12, color: colors.faint }}>{L(discoverItem.testimonial.by, lang)}</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Stars value={discoverItem.rating} />
            <Text style={{ fontSize: 12, color: colors.faint }}>
              {discoverItem.reviews} {t('social.reviews')}
            </Text>
          </View>

          <Btn full>{t(`discover.cta${discoverItem.cta[0].toUpperCase()}${discoverItem.cta.slice(1)}` as any)}</Btn>

          <Btn full ghost onPress={() => router.push(`/share/${discoverItem.id}`)}>
            {t('social.shareWithFriend')}
          </Btn>

          <Text
            onPress={() => toggleSaved(discoverItem.id)}
            style={{ textAlign: 'center', fontSize: 13.5, fontWeight: '700', color: colors.accent, paddingVertical: 6 }}
          >
            {saved ? t('home.saved') : t('home.saveForLater')}
          </Text>
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose}>
      <View style={{ padding: 24 }}>
        {!loading && <Text>Not found</Text>}
      </View>
    </Sheet>
  );
}
