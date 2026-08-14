import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/constants/theme';
import { SectionHead } from '@/components/ui';
import { ConfirmedCard } from '@/components/plan/ConfirmedCard';
import { CircleIdeaCard } from '@/components/plan/CircleIdeaCard';
import { useConfirmedPlans, useCircleIdeas } from '@/data/queries';
import type { PlanStatus } from '@/data/mock';

const nextStatus: Record<PlanStatus, PlanStatus> = { going: 'saved', saved: 'maybe', maybe: 'going' };

export default function PlanScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: confirmed } = useConfirmedPlans();
  const { data: circleIdeas } = useCircleIdeas();
  const [statuses, setStatuses] = useState<Record<string, PlanStatus>>({});

  const cycle = (id: string, base: PlanStatus) =>
    setStatuses((s) => ({ ...s, [id]: nextStatus[s[id] ?? base] }));

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: insets.bottom + 24, gap: 18 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: '600', color: colors.ink, letterSpacing: -0.4 }}>
          {t('plan.planTitle')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}>{t('plan.planIntro')}</Text>
      </View>

      <View>
        <SectionHead>{t('plan.confirmedPlans')}</SectionHead>
        <Text style={{ fontSize: 12.5, color: colors.faint, lineHeight: 17, marginTop: -8, marginBottom: 12 }}>
          {t('plan.confirmedIntro')}
        </Text>
        <View style={{ gap: 12 }}>
          {(confirmed ?? []).map((plan) => (
            <ConfirmedCard
              key={plan.id}
              plan={plan}
              status={statuses[plan.id] ?? plan.status}
              onCycle={() => cycle(plan.id, plan.status)}
            />
          ))}
        </View>
      </View>

      <View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4, gap: 4 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', letterSpacing: -0.2, color: colors.ink, flexShrink: 1 }}>
            {t('plan.decideTogether')}
          </Text>
          <Text style={{ fontSize: 11, color: colors.faint, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, flexShrink: 0 }}>
            {t('plan.fromYourCircle')}
          </Text>
        </View>
        <Text style={{ fontSize: 12.5, color: colors.faint, lineHeight: 17, marginBottom: 13 }}>{t('plan.decideIntro')}</Text>
        <View style={{ gap: 12 }}>
          {(circleIdeas ?? []).map((idea) => (
            <CircleIdeaCard key={idea.id} idea={idea} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
