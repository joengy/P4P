import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, PanResponder, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Icon, Btn, Card, Photo, Tag, Segmented } from '@/components/ui';
import { colors, toneColors, radii, fonts, type Tone } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { MOODS, moodSuggestion } from '@/data/mock';
import type { MoodEnergy } from '@/data/mock';

type Variant = 'chips' | 'dial' | 'breath';

function EnergyChips({ value, onChange }: { value: MoodEnergy | null; onChange: (v: MoodEnergy) => void }) {
  const { t } = useTranslation();
  const opts: { id: MoodEnergy; labelKey: string; icon: 'moon' | 'leaf' | 'sun' }[] = [
    { id: 'low', labelKey: 'mood.energyLow', icon: 'moon' },
    { id: 'med', labelKey: 'mood.energyMed', icon: 'leaf' },
    { id: 'high', labelKey: 'mood.energyHigh', icon: 'sun' },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {opts.map((o) => {
        const on = value === o.id;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={{
              flex: 1,
              paddingVertical: 18,
              paddingHorizontal: 8,
              borderRadius: 18,
              alignItems: 'center',
              gap: 9,
              backgroundColor: on ? colors.calmSoft : colors.surface2,
              borderWidth: 2,
              borderColor: on ? colors.calm : 'transparent',
            }}
          >
            <Icon name={o.icon} size={26} stroke={on ? colors.calmInk : colors.muted} sw={1.7} />
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: on ? colors.calmInk : colors.muted }}>{t(o.labelKey)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const TRACK_WIDTH = 280;

function EnergyDial({ value, onChange }: { value: MoodEnergy | null; onChange: (v: MoodEnergy) => void }) {
  const { t } = useTranslation();
  const [v, setV] = useState(value === 'low' ? 18 : value === 'high' ? 86 : 52);

  useEffect(() => {
    onChange(v < 34 ? 'low' : v < 67 ? 'med' : 'high');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const pct = Math.max(0, Math.min(100, (gesture.moveX - 40) / TRACK_WIDTH * 100));
        setV(Math.round(pct));
      },
    })
  ).current;

  const labels = [t('mood.energyLow'), t('mood.energyMed'), t('mood.energyHigh')];
  const current = v < 34 ? labels[0] : v < 67 ? labels[1] : labels[2];

  return (
    <View style={{ backgroundColor: colors.surface2, borderRadius: 20, padding: 20, paddingBottom: 18 }}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: '600', color: colors.calmInk }}>{current}</Text>
      </View>
      <View
        {...panResponder.panHandlers}
        style={{ width: TRACK_WIDTH, alignSelf: 'center', height: 30, justifyContent: 'center' }}
      >
        <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.line }} />
        <View
          style={{
            position: 'absolute',
            left: (v / 100) * TRACK_WIDTH - 12,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.calm,
            borderWidth: 3,
            borderColor: colors.surface,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, width: TRACK_WIDTH, alignSelf: 'center' }}>
        {labels.map((l) => (
          <Text key={l} style={{ fontSize: 11.5, color: colors.faint, fontWeight: '600' }}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

function EnergyBreath({ value, onChange }: { value: MoodEnergy | null; onChange: (v: MoodEnergy) => void }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p === 'in' ? 'out' : 'in')), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Animated.timing(scale, { toValue: phase === 'in' ? 1.15 : 0.9, duration: 3400, useNativeDriver: true }).start();
  }, [phase, scale]);

  const opts: { id: MoodEnergy; color: string }[] = [
    { id: 'low', color: colors.lav },
    { id: 'med', color: colors.calm },
    { id: 'high', color: colors.accent },
  ];
  const lbls: Record<MoodEnergy, string> = { low: t('mood.energyLow'), med: t('mood.energyMed'), high: t('mood.energyHigh') };

  return (
    <View style={{ backgroundColor: colors.surface2, borderRadius: 20, padding: 20, alignItems: 'center' }}>
      <View style={{ width: 130, height: 130, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Animated.View
          style={{ position: 'absolute', width: 110, height: 110, borderRadius: 55, backgroundColor: colors.calmSoft, transform: [{ scale }] }}
        />
        <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.calmInk }}>{phase === 'in' ? t('mood.breatheIn') : t('mood.breatheOut')}</Text>
      </View>
      <Text style={{ fontSize: 12.5, color: colors.muted, marginBottom: 14 }}>{t('mood.tapWhenReady')}</Text>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {opts.map((o) => {
          const on = value === o.id;
          return (
            <Pressable key={o.id} onPress={() => onChange(o.id)} style={{ alignItems: 'center', gap: 7 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: on ? o.color : colors.surface,
                  borderWidth: 2,
                  borderColor: o.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="leaf" size={20} stroke={on ? '#fff' : o.color} />
              </View>
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: on ? colors.ink : colors.muted }}>{lbls[o.id]}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function MoodCheckInScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { lang } = useLang();
  const [variant, setVariant] = useState<Variant>('chips');
  const [energy, setEnergy] = useState<MoodEnergy | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [stage, setStage] = useState<'input' | 'result'>('input');

  const ready = !!energy && !!mood;
  const suggestion = useMemo(() => (ready ? moodSuggestion(energy!, mood!) : null), [ready, energy, mood]);
  const onClose = () => router.back();

  if (stage === 'result' && suggestion) {
    const kindTone: Tone = suggestion.kind === 'vr' ? 'lav' : suggestion.kind === 'home' ? 'calm' : 'accent';
    const kindIcon = suggestion.kind === 'vr' ? 'headset' : suggestion.kind === 'home' ? 'leaf' : 'pin';
    const kindLabel = suggestion.kind === 'vr' ? t('mood.kindVr') : suggestion.kind === 'home' ? t('mood.kindHome') : t('mood.kindOutdoor');
    const moodObj = MOODS.find((m) => m.id === mood);
    return (
      <Sheet onClose={onClose} snapPoints={['70%']}>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: colors.muted, flex: 1 }}>
              {t('mood.suggestionFor')} <Text style={{ color: colors.ink, fontWeight: '700' }}>{moodObj ? L(moodObj.label, lang).toLowerCase() : ''}</Text>
            </Text>
            <Pressable onPress={onClose} style={{ width: 34, height: 34, borderRadius: 99, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="x" size={18} stroke={colors.muted} />
            </Pressable>
          </View>
          <Card pad={0} soft style={{ overflow: 'hidden' }}>
            <Photo kind={suggestion.kind === 'vr' ? 'forest-vr' : suggestion.kind === 'home' ? 'home' : 'park'} height={130} round={0}>
              <View style={{ position: 'absolute', left: 12, top: 12 }}>
                <Tag tone={kindTone} icon={<Icon name={kindIcon} size={14} stroke={toneColors(kindTone).fg} />}>
                  {kindLabel}
                </Tag>
              </View>
            </Photo>
            <View style={{ padding: 16 }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: '600', marginBottom: 6, color: colors.ink }}>
                {L(suggestion.title, lang)}
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20, marginBottom: 15 }}>{L(suggestion.body, lang)}</Text>
              <Btn full size="lg" tone={kindTone} icon={<Icon name={suggestion.kind === 'vr' ? 'headset' : 'play'} size={17} stroke="#fff" />}>
                {suggestion.kind === 'outdoor' ? t('move.continueOutdoors') : t('move.startSession')}
              </Btn>
            </View>
          </Card>
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose} snapPoints={['88%']}>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 26, fontWeight: '600', letterSpacing: -0.4, color: colors.ink, marginBottom: 4 }}>{t('mood.moodTitle')}</Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>{t('mood.moodEnergyQ')}</Text>
          </View>
          <Pressable onPress={onClose} style={{ width: 34, height: 34, borderRadius: 99, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={18} stroke={colors.muted} />
          </Pressable>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Segmented
            options={[
              { id: 'chips', label: 'Chips' },
              { id: 'dial', label: 'Dial' },
              { id: 'breath', label: 'Breathe' },
            ]}
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
          />
        </View>

        {variant === 'chips' && <EnergyChips value={energy} onChange={setEnergy} />}
        {variant === 'dial' && <EnergyDial value={energy} onChange={setEnergy} />}
        {variant === 'breath' && <EnergyBreath value={energy} onChange={setEnergy} />}

        <Text style={{ fontSize: 14, color: colors.muted, marginTop: 22, marginBottom: 12 }}>{t('mood.moodFeelQ')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
          {MOODS.map((m) => {
            const on = mood === m.id;
            const tone = toneColors(m.tone);
            return (
              <Pressable
                key={m.id}
                onPress={() => setMood(m.id)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: radii.pill,
                  backgroundColor: on ? tone.solid : tone.bg,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: on ? '#fff' : tone.fg }}>{L(m.label, lang)}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 26 }}>
          <Btn full size="lg" onPress={() => ready && setStage('result')} disabled={!ready} icon={<Icon name="arrow" size={18} stroke={colors.onAccent} />}>
            {t('mood.moodNext')}
          </Btn>
        </View>
        <Pressable onPress={onClose} style={{ alignSelf: 'center', marginTop: 14 }}>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.faint }}>{t('mood.moodSkip')}</Text>
        </Pressable>
      </View>
    </Sheet>
  );
}
