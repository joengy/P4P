import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/constants/theme';
import { Segmented } from '@/components/ui';
import { ConfirmedCard } from '@/components/plan/ConfirmedCard';
import { CircleIdeaCard } from '@/components/plan/CircleIdeaCard';
import { useConfirmedPlans, useCircleIdeas, useSetRsvp } from '@/data/queries';
import type { ConfirmedPlan, PlanStatus } from '@/data/mock';

const nextStatus: Record<PlanStatus, PlanStatus> = { going: 'saved', saved: 'maybe', maybe: 'going' };

export default function PlanScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: confirmed } = useConfirmedPlans();
  const { data: circleIdeas } = useCircleIdeas();
  const setRsvp = useSetRsvp();
  // Shown immediately while the RSVP saves; the refetched plan then agrees.
  const [statuses, setStatuses] = useState<Record<string, PlanStatus>>({});
  const [tab, setTab] = useState<'yours' | 'circle'>('yours');

  const cycle = (plan: ConfirmedPlan) => {
    const next = nextStatus[statuses[plan.id] ?? plan.status];
    setStatuses((s) => ({ ...s, [plan.id]: next }));
    if (plan.dbId) setRsvp.mutate({ planDbId: plan.dbId, status: next });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: insets.bottom + 24, gap: 18 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: '600', color: colors.ink, letterSpacing: -0.4 }}>
          {t('plan.planTitle')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}>{t('plan.planIntro')}</Text>
      </View>

      <Segmented
        options={[
          { id: 'yours', label: t('plan.tabYourPlans') },
          { id: 'circle', label: t('plan.tabCircleIdeas') },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'yours' | 'circle')}
      />

      {tab === 'yours' ? (
        <View>
          <Text style={{ fontSize: 12.5, color: colors.faint, lineHeight: 17, marginBottom: 12 }}>
            {t('plan.confirmedIntro')}
          </Text>
          <View style={{ gap: 12 }}>
            {(confirmed ?? []).map((plan) => (
              <ConfirmedCard
                key={plan.id}
                plan={plan}
                status={statuses[plan.id] ?? plan.status}
                onCycle={() => cycle(plan)}
              />
            ))}
          </View>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 12.5, color: colors.faint, lineHeight: 17, marginBottom: 12 }}>{t('plan.decideIntro')}</Text>
          <View style={{ gap: 12 }}>
            {(circleIdeas ?? []).map((idea) => (
              <CircleIdeaCard key={idea.id} idea={idea} />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
