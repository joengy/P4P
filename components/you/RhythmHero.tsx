import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Card, Segmented, Icon } from '@/components/ui';
import { colors, toneColors, radii, fonts, type Tone } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { TYPE_META, INTENSITY, rangeRead } from '@/data/mock';
import type { HistoryItem } from '@/data/mock';
import { useHistory } from '@/data/queries';

const CHART_H = 158;

type Range = 'week' | 'month' | 'all';
type Bucket = { key: string; label: string; mins: number; sessions: HistoryItem[]; isNow: boolean };

function buildBuckets(range: Range, history: HistoryItem[]): Bucket[] {
  if (range === 'week') {
    // The last seven days ending today, each labelled with its real weekday
    // (the mock data always ended on a Sunday, so a fixed M–S row looked right).
    const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date().getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const day = 6 - i;
      const sessions = history.filter((h) => h.daysAgo === day);
      const label = letters[(today - day + 7) % 7];
      return { key: 'd' + day, label, mins: sessions.reduce((s, h) => s + h.min, 0), sessions, isNow: day === 0 };
    });
  }
  const weeks = range === 'month' ? 4 : 6;
  return Array.from({ length: weeks }, (_, i) => {
    const wk = weeks - 1 - i;
    const lo = wk * 7;
    const hi = lo + 6;
    const sessions = history.filter((h) => h.daysAgo >= lo && h.daysAgo <= hi);
    return { key: 'w' + wk, label: wk === 0 ? '·' : wk + 'w', mins: sessions.reduce((s, h) => s + h.min, 0), sessions, isNow: wk === 0 };
  });
}

function Legend({ tone, n, label }: { tone: Tone; n: number; label: string }) {
  const dotColor = tone === 'lav' ? colors.lav : tone === 'calm' ? colors.calm : colors.accent;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 9, height: 9, borderRadius: 9, backgroundColor: dotColor }} />
      <Text style={{ fontSize: 12.5, color: colors.ink }}>
        <Text style={{ fontWeight: '700' }}>{n}</Text> {label}
      </Text>
    </View>
  );
}

function DiscRow({ label, hint, open, onPress, children, last }: { label: string; hint?: string; open: boolean; onPress: () => void; children: React.ReactNode; last?: boolean }) {
  return (
    <View style={{ borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}>
      <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 14 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>{label}</Text>
        {hint != null && (
          <View style={{ backgroundColor: colors.surface2, paddingHorizontal: 8, paddingVertical: 1, borderRadius: 99 }}>
            <Text style={{ fontSize: 11.5, fontWeight: '700', color: colors.faint }}>{hint}</Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
        <Icon name="chev" size={17} stroke={colors.muted} style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }} />
      </Pressable>
      {open && <View style={{ paddingBottom: 14 }}>{children}</View>}
    </View>
  );
}

function HistoryRow({ h, last, onOpenSession }: { h: HistoryItem; last: boolean; onOpenSession: (h: HistoryItem) => void }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const tm = TYPE_META[h.type];
  const it = INTENSITY[h.intensity];
  const tone = toneColors(tm.tone);
  return (
    <Pressable
      onPress={() => onOpenSession(h)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: tone.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={tm.icon} size={18} stroke={tone.fg} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.ink }}>{L(h.title, lang)}</Text>
        <Text style={{ fontSize: 11.5, color: colors.faint }}>
          {L(h.when, lang)} · {h.min} {t('common.min')} · {t('profile.feltAfter')} {L(h.mood, lang)}
        </Text>
      </View>
      <View style={{ backgroundColor: toneColors(it.tone).bg, paddingHorizontal: 9, paddingVertical: 4, borderRadius: radii.pill }}>
        <Text style={{ fontSize: 11.5, fontWeight: '700', color: toneColors(it.tone).fg }}>{L(it.label, lang)}</Text>
      </View>
      <Icon name="chev" size={16} stroke={colors.faint} />
    </Pressable>
  );
}

function DayReveal({ bucket, range, onOpenSession, onClose }: { bucket: Bucket; range: Range; onOpenSession: (h: HistoryItem) => void; onClose: () => void }) {
  const { t } = useTranslation();
  const title =
    range === 'week'
      ? bucket.isNow
        ? t('common.today')
        : t('profile.thisDay')
      : bucket.isNow
        ? t('plan.thisWeek')
        : t('profile.agoTemplate', { label: bucket.label });
  return (
    <View style={{ backgroundColor: colors.surface2, borderRadius: radii.sm, padding: 13, marginTop: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: bucket.sessions.length ? 10 : 0 }}>
        <Text style={{ fontSize: 11, fontWeight: '800', color: colors.accent, letterSpacing: 0.4, textTransform: 'uppercase' }}>{title}</Text>
        {bucket.mins > 0 && (
          <Text style={{ fontSize: 11.5, color: colors.faint }}>
            {bucket.mins} {t('common.min')}
          </Text>
        )}
        <View style={{ flex: 1 }} />
        <Pressable onPress={onClose} style={{ width: 24, height: 24, borderRadius: 99, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={13} stroke={colors.muted} />
        </Pressable>
      </View>
      {bucket.sessions.length === 0 ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="moon" size={15} stroke={colors.faint} />
          <Text style={{ fontSize: 13, color: colors.muted }}>{t('profile.restDay')}</Text>
        </View>
      ) : (
        <View style={{ gap: 7 }}>
          {bucket.sessions.map((h) => (
            <MiniSessionRow key={h.id} h={h} onOpenSession={onOpenSession} />
          ))}
        </View>
      )}
    </View>
  );
}

function MiniSessionRow({ h, onOpenSession }: { h: HistoryItem; onOpenSession: (h: HistoryItem) => void }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const tm = TYPE_META[h.type];
  const tone = toneColors(tm.tone);
  return (
    <Pressable
      onPress={() => onOpenSession(h)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 10, padding: 10 }}
    >
      <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: tone.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={tm.icon} size={15} stroke={tone.fg} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink }}>{L(h.title, lang)}</Text>
        <Text style={{ fontSize: 11, color: colors.faint }}>
          {h.min} {t('common.min')} · {t('profile.feltAfter')} {L(h.mood, lang)}
        </Text>
      </View>
      <Icon name="chev" size={15} stroke={colors.faint} />
    </Pressable>
  );
}

export function RhythmHero() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const router = useRouter();
  const [range, setRange] = useState<Range>('week');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [panel, setPanel] = useState<'where' | 'history' | null>(null);

  // Mock history plus anything completed in the VR headset — see useHistory.
  const { data: history = [] } = useHistory();

  const cutoff = range === 'week' ? 7 : range === 'month' ? 30 : 9999;
  const items = history.filter((h) => h.daysAgo <= cutoff);
  const sessions = items.length;
  const mins = items.reduce((s, h) => s + h.min, 0);
  const kcal = items.reduce((s, h) => s + h.kcal, 0);
  const vr = items.filter((h) => h.type === 'vr').length;
  const irl = items.filter((h) => h.type === 'outdoor' || h.type === 'social').length;
  const home = items.filter((h) => h.type === 'home').length;
  const read = rangeRead(sessions);
  const readTone: Tone = sessions === 0 ? 'lav' : sessions <= 2 ? 'lav' : sessions <= 5 ? 'calm' : 'accent';
  const readColors = toneColors(readTone);

  const buckets = buildBuckets(range, history);
  const peak = Math.max(...buckets.map((b) => b.mins), 30);
  const activeDays = buckets.filter((b) => b.mins > 0).length;
  const avg = activeDays ? Math.round(buckets.reduce((s, b) => s + b.mins, 0) / activeDays) : 0;
  const unit = range === 'week' ? t('profile.minsPerDay') : t('profile.minsPerWeek');

  const open = buckets.find((b) => b.key === openKey) ?? null;
  const togglePanel = (p: 'where' | 'history') => setPanel((cur) => (cur === p ? null : p));
  const onOpenSession = (h: HistoryItem) => router.push(`/session/${h.id}`);

  return (
    <View>
      <Segmented
        options={[
          { id: 'week', label: t('profile.weeklyTrends') },
          { id: 'month', label: t('profile.monthlyTrends') },
          { id: 'all', label: t('profile.all') },
        ]}
        value={range}
        onChange={(r) => {
          setRange(r as Range);
          setOpenKey(null);
        }}
      />

      <Card pad={20} style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <Text style={{ fontSize: 12.5, color: colors.muted }}>{t('profile.stretchFelt')}</Text>
          <View style={{ backgroundColor: readColors.bg, paddingHorizontal: 12, paddingVertical: 2, borderRadius: 99 }}>
            <Text style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: '700', color: readColors.fg }}>{L(read.word, lang)}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 14.5, lineHeight: 21, color: colors.ink, marginBottom: 18 }}>{L(read.line, lang)}</Text>

        {sessions > 0 ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16, gap: 4 }}>
              <Text style={{ fontSize: 11, color: colors.muted, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', flexShrink: 1 }}>
                {unit}
              </Text>
              <Text style={{ fontSize: 11.5, color: colors.faint, fontWeight: '600', flexShrink: 0 }}>{t('profile.tapBarOpen')}</Text>
            </View>

            <View style={{ position: 'relative', height: CHART_H + 30 }}>
              {avg > 0 && (
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 30 + (avg / peak) * CHART_H, borderTopWidth: 1, borderTopColor: colors.faint, borderStyle: 'dashed' }}>
                  <Text
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: -15,
                      fontSize: 9.5,
                      color: colors.faint,
                      fontWeight: '700',
                      backgroundColor: colors.surface2,
                      paddingHorizontal: 4,
                    }}
                  >
                    {t(range === 'week' ? 'profile.avg' : 'profile.avgWeek', { n: avg })}
                  </Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: '100%' }}>
                {buckets.map((b) => {
                  const sel = b.key === openKey;
                  const barH = b.mins <= 0 ? 4 : Math.max(16, Math.round((b.mins / peak) * CHART_H));
                  const fill = sel ? colors.accent : b.mins <= 0 ? colors.surface3 : b.isNow ? colors.calm : colors.calmSoft;
                  const valColor = sel ? colors.accent : b.mins > 0 ? colors.calmInk : colors.faint;
                  return (
                    <Pressable
                      key={b.key}
                      onPress={() => setOpenKey(sel ? null : b.key)}
                      style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '800', color: valColor, marginBottom: 6, fontFamily: fonts.display, minHeight: 14 }}>
                        {b.mins > 0 ? b.mins : ''}
                      </Text>
                      <View style={{ width: '100%', maxWidth: 34, height: barH, backgroundColor: fill, borderRadius: 7, borderWidth: b.mins > 0 && !sel && !b.isNow ? 1.5 : 0, borderColor: colors.calm }} />
                      <Text style={{ fontSize: 11, color: b.isNow ? colors.ink : colors.faint, fontWeight: b.isNow ? '800' : '600', marginTop: 9 }}>{b.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {open && <DayReveal bucket={open} range={range} onOpenSession={onOpenSession} onClose={() => setOpenKey(null)} />}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 18, marginBottom: 2 }}>
              <Text style={{ fontSize: 13, color: colors.muted }}>
                <Text style={{ color: colors.ink, fontFamily: fonts.display, fontSize: 15 }}>{sessions}</Text> {t('profile.sessions')}
              </Text>
              <Text style={{ color: colors.faint }}>·</Text>
              <Text style={{ fontSize: 13, color: colors.muted }}>
                <Text style={{ color: colors.ink, fontFamily: fonts.display, fontSize: 15 }}>{mins}</Text> {t('profile.minsMoved')}
              </Text>
              <Text style={{ color: colors.faint }}>·</Text>
              <Text style={{ fontSize: 13, color: colors.muted }}>
                <Text style={{ color: colors.ink, fontFamily: fonts.display, fontSize: 15 }}>{kcal}</Text> {t('profile.kcal')}
              </Text>
            </View>

            <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: colors.line }}>
              <DiscRow label={t('profile.whereYouMoved')} open={panel === 'where'} onPress={() => togglePanel('where')}>
                <View style={{ flexDirection: 'row', height: 9, borderRadius: 99, overflow: 'hidden', marginTop: 2, marginBottom: 11, gap: 2 }}>
                  <View style={{ width: `${(vr / sessions) * 100}%`, backgroundColor: colors.lav }} />
                  <View style={{ width: `${(irl / sessions) * 100}%`, backgroundColor: colors.calm }} />
                  <View style={{ width: `${(home / sessions) * 100}%`, backgroundColor: colors.accent }} />
                </View>
                <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
                  <Legend tone="lav" n={vr} label={t('profile.inVr')} />
                  <Legend tone="calm" n={irl} label={t('profile.outdoors')} />
                  <Legend tone="accent" n={home} label={t('profile.atHome')} />
                </View>
              </DiscRow>
              <DiscRow label={t('profile.history')} hint={`${items.length}`} open={panel === 'history'} onPress={() => togglePanel('history')} last>
                <View>
                  {items.map((h, i) => (
                    <HistoryRow key={h.id} h={h} last={i === items.length - 1} onOpenSession={onOpenSession} />
                  ))}
                </View>
              </DiscRow>
            </View>
          </>
        ) : (
          <Text style={{ paddingVertical: 6, fontSize: 13, color: colors.faint }}>{t('profile.nothingLogged')}</Text>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 16 }}>
          <Icon name="moon" size={14} stroke={colors.faint} style={{ marginTop: 1 }} />
          <Text style={{ fontSize: 11.5, color: colors.faint, lineHeight: 15.5, flex: 1 }}>{t('profile.metricsPrivate')}</Text>
        </View>
      </Card>
    </View>
  );
}
