import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, shadows } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { DiscoverCard } from '@/components/discover/DiscoverCard';
import { useDiscoverItems } from '@/data/queries';
import { DISCOVER_FILTERS } from '@/data/mock';
import type { DiscoverFilterId } from '@/data/mock';

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const insets = useSafeAreaInsets();
  const { data: items } = useDiscoverItems();
  const [filter, setFilter] = useState<DiscoverFilterId>('all');

  const filtered = useMemo(() => {
    if (!items) return [];
    if (filter === 'all') return items;
    return items.filter((it) => it.kind.includes(filter));
  }, [items, filter]);

  return (
    // Laid out like Move and Plan: title, then a segmented-style filter track
    // (it scrolls sideways, as six filters don't fit across a phone), then cards.
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: insets.bottom + 24, gap: 18 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: 4 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: '600', color: colors.ink, letterSpacing: -0.4 }}>
          {t('discover.discoverTitle')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}>{t('discover.discoverSub')}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, borderRadius: radii.pill, backgroundColor: colors.surface2 }}
        contentContainerStyle={{ padding: 3, gap: 2 }}
      >
        {DISCOVER_FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                {
                  minHeight: 40,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: radii.pill,
                  backgroundColor: on ? colors.surface : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                on ? shadows.soft : null,
              ]}
            >
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: on ? colors.accent : colors.muted }}>{L(f.label, lang)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ gap: 14 }}>
        {filtered.map((item) => (
          <DiscoverCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}
