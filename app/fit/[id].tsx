import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Icon, Btn } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { L, type Bilingual } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useCircleIdea } from '@/data/queries';

type Opt = { id: string; label: Bilingual };

const langOpts: Opt[] = [
  { id: 'en', label: { en: 'English', zh: '英文' } },
  { id: 'zh', label: { en: '中文', zh: '中文' } },
  { id: 'either', label: { en: 'Either is fine', zh: '都可以' } },
];
const paceOpts: Opt[] = [
  { id: 'gentle', label: { en: 'Gentle', zh: '温和' } },
  { id: 'steady', label: { en: 'Steady', zh: '平稳' } },
  { id: 'either', label: { en: 'No preference', zh: '无所谓' } },
];
const sizeOpts: Opt[] = [
  { id: 'solo', label: { en: 'Just us', zh: '只有我们' } },
  { id: 'small', label: { en: 'A few people', zh: '几个人' } },
  { id: 'any', label: { en: 'Any size', zh: '多少都行' } },
];

function RowSel({ label, opts, value, onChange }: { label: string; opts: Opt[]; value: string; onChange: (id: string) => void }) {
  const { lang } = useLang();
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.muted, marginBottom: 8 }}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
        {opts.map((o) => {
          const on = value === o.id;
          return (
            <Pressable
              key={o.id}
              onPress={() => onChange(o.id)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: radii.pill,
                backgroundColor: on ? colors.accent : colors.surface2,
                borderWidth: on ? 0 : 1,
                borderColor: colors.line,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: on ? colors.onAccent : colors.muted }}>{L(o.label, lang)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function PreferenceCheckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data: idea, isLoading: loading } = useCircleIdea(id);
  const [lg, setLg] = useState('either');
  const [pace, setPace] = useState('gentle');
  const [size, setSize] = useState('small');
  const [sent, setSent] = useState(false);

  const onClose = () => router.back();

  if (!idea) {
    return (
      <Sheet onClose={onClose} snapPoints={['60%']}>
        <View style={{ padding: 24 }}>
          {!loading && <Text>Not found</Text>}
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose} snapPoints={['70%']}>
      <View style={{ paddingHorizontal: 20 }}>
        {!sent ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 4 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: colors.accent, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
                  {t('plan.checkFit')}
                </Text>
                <Text style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: '600', lineHeight: 25, color: colors.ink }}>
                  {L(idea.title, lang)}
                </Text>
              </View>
              <Pressable onPress={onClose} style={{ width: 32, height: 32, borderRadius: 99, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={17} stroke={colors.muted} />
              </Pressable>
            </View>
            <Text style={{ fontSize: 12.5, color: colors.faint, lineHeight: 18, marginTop: 6, marginBottom: 18 }}>{t('plan.fitIntro')}</Text>

            <RowSel label={t('plan.fitLang')} opts={langOpts} value={lg} onChange={setLg} />
            <RowSel label={t('plan.fitPace')} opts={paceOpts} value={pace} onChange={setPace} />
            <RowSel label={t('plan.fitGroup')} opts={sizeOpts} value={size} onChange={setSize} />

            <Btn full size="lg" onPress={() => setSent(true)} icon={<Icon name="heart" size={16} stroke={colors.onAccent} />}>
              {t('plan.fitSend')}
            </Btn>
            <Pressable onPress={onClose} style={{ alignSelf: 'center', marginTop: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.faint }}>{t('common.cancel')}</Text>
            </Pressable>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 14 }}>
            <View style={{ width: 58, height: 58, borderRadius: 99, backgroundColor: colors.calmSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name="check" size={27} stroke={colors.calmInk} sw={2.4} />
            </View>
            <Text style={{ fontFamily: fonts.display, fontSize: 19, fontWeight: '600', marginBottom: 6, color: colors.ink }}>{t('plan.fitSent')}</Text>
            <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 19, textAlign: 'center', marginBottom: 18 }}>
              {L(idea.who, lang)} {lang === 'zh' ? '会看到你的偏好，并据此安排。' : 'will see your preferences and plan around them.'}
            </Text>
            <Btn full size="md" tone="calm" ghost onPress={onClose}>
              {t('common.done')}
            </Btn>
          </View>
        )}
      </View>
    </Sheet>
  );
}
