import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Card, Tag, Icon, Avatar, AvatarStack } from '@/components/ui';
import { colors, toneColors, radii, fonts, type Tone } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import type { ConfirmedPlan, PlanStatus } from '@/data/mock';

const statusMeta: Record<PlanStatus, { tone: Tone; icon: 'check' | 'spark' | 'moon' }> = {
  going: { tone: 'calm', icon: 'check' },
  maybe: { tone: 'lav', icon: 'spark' },
  saved: { tone: 'neutral', icon: 'moon' },
};

export function ConfirmedCard({ plan, status, onCycle }: { plan: ConfirmedPlan; status: PlanStatus; onCycle: () => void }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const router = useRouter();
  const s = statusMeta[status];
  const st = toneColors(s.tone);
  const f = plan.facilitator;
  const statusLabel = status === 'going' ? t('social.going') : status === 'maybe' ? t('plan.statusMaybe') : t('home.saved');

  return (
    <Card pad={0} onPress={() => router.push(`/plan/${plan.id}`)} style={{ overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', gap: 13, padding: 13 }}>
        <View style={{ width: 54, flexShrink: 0, borderRadius: radii.sm, backgroundColor: toneColors('accent').bg, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 }}>
          <Text style={{ fontSize: 10.5, fontWeight: '800', letterSpacing: 0.5, color: toneColors('accent').fg }}>{L(plan.day, lang)}</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: '700', lineHeight: 27, color: toneColors('accent').fg }}>{plan.date}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
            <Text style={{ fontWeight: '700', fontSize: 15.5, flex: 1, lineHeight: 19, color: colors.ink }}>{L(plan.title, lang)}</Text>
            <Tag tone={s.tone} icon={<Icon name={s.icon} size={11} stroke={st.fg} sw={2.2} />}>
              {statusLabel}
            </Tag>
          </View>
          <View style={{ gap: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="sun" size={13} stroke={colors.muted} />
              <Text style={{ fontSize: 12, color: colors.muted }}>{L(plan.time, lang)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="pin" size={13} stroke={colors.muted} />
              <Text style={{ fontSize: 12, color: colors.muted }}>{L(plan.where, lang)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ padding: 13, backgroundColor: colors.surface2, borderTopWidth: 1, borderTopColor: colors.line }}>
        {f && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Avatar name={f.name} size={30} idx={f.idx} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.ink }}>
                {t('plan.facilitatorLabel')} · {f.name}
              </Text>
              <Text style={{ fontSize: 11, color: colors.faint }}>{L(f.role, lang)}</Text>
            </View>
            {f.bilingual && <Tag tone="calm">{t('badges.bilingual')}</Tag>}
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
          <AvatarStack names={plan.names} extra={Math.max(0, plan.going - plan.names.length)} size={22} />
          <Text style={{ fontSize: 11.5, color: colors.faint, flex: 1 }}>
            {plan.going} {t('plan.goingCount')}
            {plan.friends && plan.friends.length ? ` · ${plan.friends.length} ${t('plan.youKnowThem')}` : ''}
          </Text>
          {plan.language && <Tag tone="lav" icon={<Icon name="wave" size={11} stroke={colors.lavInk} />}>{L(plan.language, lang)}</Tag>}
        </View>
      </View>

      {plan.groupChatId && (
        <Pressable
          onPress={() => router.push(`/messages/${plan.groupChatId}`)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 13, backgroundColor: colors.calmSoft, borderTopWidth: 1, borderTopColor: colors.line }}
        >
          <Icon name="chat" size={15} stroke={colors.calmInk} sw={2} />
          <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.calmInk, flex: 1 }}>{t('social.openGroupChat')}</Text>
          {plan.chatUnread > 0 && (
            <View style={{ minWidth: 18, height: 18, paddingHorizontal: 6, borderRadius: 99, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.onAccent, fontSize: 11, fontWeight: '800' }}>{plan.chatUnread}</Text>
            </View>
          )}
          <Icon name="chev" size={15} stroke={colors.calmInk} />
        </Pressable>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, padding: 13, borderTopWidth: 1, borderTopColor: colors.line }}>
        <Pressable
          onPress={onCycle}
          style={{ paddingHorizontal: 11, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.line }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.accent }}>{t('plan.yourStatus')} →</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.muted }}>{t('plan.viewPlan')}</Text>
          <Icon name="chev" size={14} stroke={colors.muted} />
        </View>
      </View>
    </Card>
  );
}
