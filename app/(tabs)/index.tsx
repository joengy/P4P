import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/constants/theme';
import { CheckInCard, type CheckInValue } from '@/components/home/CheckInCard';
import { RecommendationCard } from '@/components/home/RecommendationCard';
import { AltRecRow } from '@/components/home/AltRecRow';
import { WhenHardCard } from '@/components/home/WhenHardCard';
import { SectionHead } from '@/components/ui';
import { useHomeRecs, useTodayCheckIn, useSaveCheckIn } from '@/data/queries';
import { pickHomeRec } from '@/data/mock';

const DEFAULT_CHECKIN: CheckInValue = { body: 'ok', place: 'indoorNearby', mood: 'neutral', social: 'with' };

export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: recs } = useHomeRecs();
  const [checkIn, setCheckIn] = useState<CheckInValue>(DEFAULT_CHECKIN);
  const { data: todays } = useTodayCheckIn();
  const saveCheckIn = useSaveCheckIn();

  // Reopen on today's last check-in, once it loads.
  useEffect(() => {
    if (todays) setCheckIn(todays);
  }, [todays]);

  // The card updates on every chip tap with no submit step, so save the
  // settled answer rather than one row per tap.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onCheckIn = (v: CheckInValue) => {
    setCheckIn(v);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveCheckIn.mutate(v), 1500);
  };
  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const { primaryId, alternatives } = useMemo(
    () => pickHomeRec(checkIn.body, checkIn.place, checkIn.mood, checkIn.social),
    [checkIn]
  );

  const recMap = useMemo(() => Object.fromEntries((recs ?? []).map((r) => [r.id, r])), [recs]);
  const primary = recMap[primaryId];
  const altRecs = alternatives.map((id) => recMap[id]).filter(Boolean);
  const showWhenHard = checkIn.body === 'sore' || checkIn.mood === 'reset';

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 18 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: 4 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: '600', color: colors.ink, letterSpacing: -0.4 }}>
          {t('home.homeTitle')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}>{t('home.homeSub')}</Text>
      </View>

      <CheckInCard value={checkIn} onChange={onCheckIn} />

      {primary && <RecommendationCard rec={primary} />}

      {showWhenHard && <WhenHardCard />}

      {altRecs.length > 0 && (
        <View>
          <SectionHead>{t('home.exploreMore')}</SectionHead>
          <View style={{ gap: 10 }}>
            {altRecs.map((r) => (
              <AltRecRow key={r.id} rec={r} />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
