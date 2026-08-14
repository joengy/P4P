import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Card, Tag, Icon, Avatar, AvatarStack, Btn } from '@/components/ui';
import { colors, radii, fonts } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import type { CircleIdea } from '@/data/mock';

function IdeaPill({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.muted }}>{children}</Text>
    </View>
  );
}

export function CircleIdeaCard({ idea }: { idea: CircleIdea }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const router = useRouter();
  const [interested, setInterested] = useState(false);
  const [count, setCount] = useState(idea.interested);

  const toggleInterest = () => {
    setCount((n) => n + (interested ? -1 : 1));
    setInterested((v) => !v);
  };

  return (
    <Card pad={15}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Avatar name={L(idea.who, lang)} size={36} idx={idea.idx} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', fontSize: 14, color: colors.ink }}>{L(idea.who, lang)}</Text>
          <Text style={{ fontSize: 11.5, color: colors.faint }}>{L(idea.relation, lang)}</Text>
        </View>
        <Tag tone={idea.tagTone}>{L(idea.tag, lang)}</Tag>
      </View>

      {idea.source && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, backgroundColor: colors.lavSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.pill, alignSelf: 'flex-start' }}>
          <Icon name="people" size={12} stroke={colors.lavInk} />
          <Text style={{ fontSize: 11.5, color: colors.lavInk }}>{L(idea.source, lang)}</Text>
        </View>
      )}

      <Text style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: '600', marginBottom: 5, lineHeight: 21, color: colors.ink }}>{L(idea.title, lang)}</Text>
      <Text style={{ fontSize: 13.5, color: colors.muted, lineHeight: 20, marginBottom: 11 }}>{L(idea.body, lang)}</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        <Tag tone="neutral" icon={<Icon name="wave" size={11} stroke={colors.muted} />}>{L(idea.prefLang, lang)}</Tag>
        <Tag tone="neutral" icon={<Icon name="people" size={11} stroke={colors.muted} />}>{L(idea.prefSize, lang)}</Tag>
        <Tag tone="neutral" icon={<Icon name="leaf" size={11} stroke={colors.muted} />}>{L(idea.prefPace, lang)}</Tag>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
        <IdeaPill>{t('plan.suggestTime')}</IdeaPill>
        <IdeaPill>{t('plan.bringFriend')}</IdeaPill>
        <Pressable onPress={() => router.push(`/ask/${idea.id}`)}>
          <IdeaPill>{t('plan.askQ')}</IdeaPill>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 11 }}>
        {count > 0 ? (
          <AvatarStack names={idea.names.length ? idea.names : ['Hana']} extra={Math.max(0, count - Math.max(1, idea.names.length))} />
        ) : (
          <Text style={{ fontSize: 12.5, color: colors.faint, flex: 1 }}>{t('plan.beFirstInterested')}</Text>
        )}
        <View style={{ flex: 1 }} />
        <Btn
          size="sm"
          tone={interested ? 'calm' : 'accent'}
          ghost={interested}
          onPress={toggleInterest}
          icon={interested ? <Icon name="check" size={14} stroke={colors.calmInk} sw={2.4} /> : <Icon name="heart" size={14} stroke={colors.onAccent} />}
        >
          {interested ? t('plan.voted') : t('plan.imInterested')}
        </Btn>
      </View>

      <Pressable
        onPress={() => router.push(`/fit/${idea.id}`)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 7, width: '100%', padding: 11, borderRadius: radii.sm, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line }}
      >
        <Icon name="spark" size={14} stroke={colors.accent} />
        <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.ink, flex: 1 }}>{t('plan.checkFit')}</Text>
        <Icon name="chev" size={15} stroke={colors.faint} />
      </Pressable>
    </Card>
  );
}
