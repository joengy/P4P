import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Photo, Icon, Avatar, AvatarStack, Tag } from '@/components/ui';
import { colors, fonts, toneColors, radii, type Tone } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useConfirmedPlan, useSetRsvp } from '@/data/queries';
import type { PlanStatus, GroupNormKey } from '@/data/mock';

const statusMeta: Record<PlanStatus, { tone: Tone; icon: 'check' | 'spark' | 'moon' }> = {
  going: { tone: 'calm', icon: 'check' },
  maybe: { tone: 'lav', icon: 'spark' },
  saved: { tone: 'neutral', icon: 'moon' },
};
const nextStatus: Record<PlanStatus, PlanStatus> = { going: 'saved', saved: 'maybe', maybe: 'going' };
const normKey: Record<GroupNormKey, string> = {
  slowPace: 'plan.normSlowPace',
  newcomers: 'plan.normNewcomers',
  noChat: 'plan.normNoChat',
  restAnytime: 'plan.normRestAnytime',
  familyWelcome: 'plan.normFamilyWelcome',
  stayClose: 'plan.normStayClose',
};

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data: plan, isLoading: loading } = useConfirmedPlan(id);
  const [status, setStatus] = useState<PlanStatus | null>(null);
  const setRsvp = useSetRsvp();
  const [left, setLeft] = useState(false);

  const onClose = () => router.back();

  if (!plan) {
    return (
      <Sheet onClose={onClose}>
        <View style={{ padding: 24 }}>
          {!loading && <Text>Not found</Text>}
        </View>
      </Sheet>
    );
  }

  const s = statusMeta[status ?? plan.status];
  const st = toneColors(s.tone);
  const f = plan.facilitator;
  const env = plan.type === 'outdoor' ? 'beach' : 'park';

  return (
    <Sheet onClose={onClose}>
      <Photo kind={env} height={140} round={0}>
        <Pressable
          onPress={onClose}
          style={{ position: 'absolute', right: 14, top: 14, width: 34, height: 34, borderRadius: 99, backgroundColor: 'rgba(255,255,255,.92)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="x" size={18} stroke={colors.ink} />
        </Pressable>
        <View style={{ position: 'absolute', left: 16, bottom: 14 }}>
          <Text style={{ fontSize: 10.5, fontWeight: '800', opacity: 0.92, letterSpacing: 0.5, textTransform: 'uppercase', color: '#fff' }}>
            {t('plan.planDetailKicker')} · {L(plan.day, lang)} {plan.date}
          </Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 22, fontWeight: '600', lineHeight: 27, marginTop: 2, color: '#fff' }}>
            {L(plan.title, lang)}
          </Text>
        </View>
      </Photo>

      <View style={{ padding: 20, paddingTop: 16, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="sun" size={15} stroke={colors.muted} />
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: colors.ink }}>{L(plan.time, lang)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="pin" size={15} stroke={colors.muted} />
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: colors.ink }}>{L(plan.where, lang)}</Text>
          </View>
          <Pressable
            onPress={() => {
              const next = nextStatus[status ?? plan.status];
              setStatus(next);
              if (plan.dbId) setRsvp.mutate({ planDbId: plan.dbId, status: next });
            }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: st.bg, paddingHorizontal: 12, paddingVertical: 9, borderRadius: radii.sm, alignSelf: 'flex-start' }}
          >
            <Icon name={s.icon} size={14} stroke={st.fg} sw={2.2} />
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: st.fg }}>
              {(status ?? plan.status) === 'going' ? t('social.going') : (status ?? plan.status) === 'maybe' ? t('plan.statusMaybe') : t('home.saved')} · {t('plan.statusChangeHint')}
            </Text>
          </Pressable>
        </View>

        {f && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.lavInk, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {t('plan.whoHolds')}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.surface2, borderRadius: radii.sm, padding: 12 }}>
              <Avatar name={f.name} size={44} idx={f.idx} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 14.5, fontWeight: '700', color: colors.ink }}>{f.name}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 16 }}>{L(f.role, lang)}</Text>
              </View>
              {f.bilingual && <Tag tone="calm">{t('badges.bilingual')} · EN / 中</Tag>}
            </View>
          </View>
        )}

        {plan.welcome && (
          <View style={{ backgroundColor: colors.calmSoft, borderRadius: radii.sm, padding: 14, gap: 7 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Icon name="quote" size={14} stroke={colors.calmInk} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.calmInk, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {t('plan.pinnedWelcome')}
              </Text>
            </View>
            <Text style={{ fontSize: 13.5, lineHeight: 21, color: colors.ink }}>{L(plan.welcome, lang)}</Text>
          </View>
        )}

        <View style={{ gap: 9 }}>
          <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.accent, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {t('plan.whoGoing')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <AvatarStack names={plan.names} extra={Math.max(0, plan.going - plan.names.length)} size={30} />
            <Text style={{ fontSize: 12.5, color: colors.muted, flex: 1 }}>
              <Text style={{ fontWeight: '700', color: colors.ink }}>{plan.going}</Text> {t('plan.goingCount')}
              {plan.friends && plan.friends.length > 0 && (
                <>
                  {' · '}
                  <Text style={{ fontWeight: '700', color: colors.ink }}>{plan.friends.join(', ')}</Text> {t('plan.youKnowThem')}
                </>
              )}
            </Text>
          </View>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', paddingVertical: 10, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.accentSoft }}
          >
            <Icon name="plus" size={15} stroke={colors.accentInk} sw={2.2} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accentInk }}>{t('plan.inviteFriends')}</Text>
          </Pressable>
        </View>

        {plan.norms && plan.norms.length > 0 && (
          <View style={{ gap: 9 }}>
            <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.calmInk, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {t('plan.groupNormsLabel')}
            </Text>
            <View style={{ gap: 7 }}>
              {plan.norms.map((n) => (
                <View key={n} style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                  <View style={{ width: 22, height: 22, borderRadius: 99, backgroundColor: colors.calmSoft, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="check" size={12} stroke={colors.calmInk} sw={2.6} />
                  </View>
                  <Text style={{ fontSize: 13.5, color: colors.ink }}>{t(normKey[n] as any)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {plan.groupChatId && (
          <Pressable
            onPress={() =>
              router.push({ pathname: '/messages/[id]', params: { id: plan.groupChatId!, from: `/plan/${plan.id}` } })
            }
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%', paddingVertical: 12, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.calmSoft }}
          >
            <Icon name="chat" size={16} stroke={colors.calmInk} sw={2} />
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.calmInk, flex: 1 }}>{t('social.openGroupChat')}</Text>
            {plan.chatUnread > 0 && (
              <View style={{ minWidth: 18, height: 18, paddingHorizontal: 6, borderRadius: 99, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.onAccent, fontSize: 11, fontWeight: '800' }}>{plan.chatUnread}</Text>
              </View>
            )}
            <Icon name="chev" size={15} stroke={colors.calmInk} />
          </Pressable>
        )}

        <Pressable
          onPress={() =>
            plan.groupChatId &&
            router.push({ pathname: '/messages/[id]', params: { id: plan.groupChatId, from: `/plan/${plan.id}` } })
          }
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', paddingVertical: 11, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.surface2 }}
        >
          <Icon name="chat" size={15} stroke={colors.ink} sw={2} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink }}>{t('plan.askQuestionFirst')}</Text>
        </Pressable>

        {!left ? (
          <Pressable onPress={() => setLeft(true)} style={{ alignSelf: 'center' }}>
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.faint }}>{t('plan.leavePlan')}</Text>
          </Pressable>
        ) : (
          <Text style={{ textAlign: 'center', fontSize: 12, color: colors.faint, lineHeight: 17 }}>{t('plan.noPressureLeave')}</Text>
        )}
      </View>
    </Sheet>
  );
}
