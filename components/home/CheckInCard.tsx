import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Card, Icon } from '@/components/ui';
import { colors, radii } from '@/constants/theme';
import type { CheckInBody, CheckInPlace, CheckInMood, CheckInSocial } from '@/data/mock';

export type CheckInValue = {
  body: CheckInBody;
  place: CheckInPlace;
  mood: CheckInMood;
  social: CheckInSocial;
};

function PillRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = value === o.id;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: radii.pill,
              backgroundColor: on ? colors.accent : colors.surface,
              borderWidth: on ? 0 : 1,
              borderColor: colors.line,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: on ? colors.onAccent : colors.ink }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CheckInCard({ value, onChange }: { value: CheckInValue; onChange: (v: CheckInValue) => void }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const bodyOpts: { id: CheckInBody; label: string }[] = [
    { id: 'ok', label: t('home.bodyOk') },
    { id: 'sore', label: t('home.bodySore') },
    { id: 'energised', label: t('home.bodyEnergised') },
  ];
  const moodOpts: { id: CheckInMood; label: string }[] = [
    { id: 'reset', label: t('home.moodReset') },
    { id: 'neutral', label: t('home.moodNeutral') },
    { id: 'motivated', label: t('home.moodMotivated') },
  ];
  const placeOpts: { id: CheckInPlace; label: string }[] = [
    { id: 'home', label: t('home.placeHome') },
    { id: 'indoorNearby', label: t('home.placeIndoor') },
    { id: 'outside', label: t('home.placeOutside') },
  ];
  const socialOpts: { id: CheckInSocial; label: string }[] = [
    { id: 'alone', label: t('home.socialAlone') },
    { id: 'with', label: t('home.socialWith') },
    { id: 'group', label: t('home.socialGroup') },
  ];

  return (
    <Card soft style={{ gap: 16 }}>
      <Pressable onPress={() => router.push('/mood')} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontWeight: '700', fontSize: 15, color: colors.accentInk, flex: 1 }}>{t('home.checkInNudge')}</Text>
        <View style={{ width: 32, height: 32, borderRadius: 99, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow" size={15} stroke={colors.accentInk} />
        </View>
      </Pressable>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.muted }}>{t('home.checkInBody')}</Text>
        <PillRow options={bodyOpts} value={value.body} onChange={(body) => onChange({ ...value, body })} />
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.muted }}>{t('home.checkInMoodLabel')}</Text>
        <PillRow options={moodOpts} value={value.mood} onChange={(mood) => onChange({ ...value, mood })} />
      </View>

      {expanded && (
        <>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.muted }}>{t('home.checkInLocation')}</Text>
            <PillRow options={placeOpts} value={value.place} onChange={(place) => onChange({ ...value, place })} />
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.muted }}>{t('home.checkInCompany')}</Text>
            <PillRow options={socialOpts} value={value.social} onChange={(social) => onChange({ ...value, social })} />
          </View>
        </>
      )}

      <Pressable onPress={() => setExpanded((e) => !e)}>
        <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.accent }}>
          {expanded ? t('home.hideDetail') : t('home.addDetail')}
        </Text>
      </Pressable>
    </Card>
  );
}
