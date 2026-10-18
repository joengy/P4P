import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '@/constants/theme';
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
    // One scroll view: the filter row (child 0) sits at the top and stays
    // pinned, while the title and cards scroll beneath it.
    <ScrollView
      style={{ flex: 1 }}
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
    >
      <View style={{ backgroundColor: colors.bg }}>
        <ScrollView
          horizontal
          style={{ flexGrow: 0, flexShrink: 0, height: 60 }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: 'center' }}
        >
          {DISCOVER_FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: radii.pill,
                  backgroundColor: on ? colors.accent : colors.surface,
                  borderWidth: on ? 0 : 1,
                  borderColor: colors.line,
                }}
              >
                <Text style={{ fontSize: 13, lineHeight: 18, fontWeight: '700', color: on ? colors.onAccent : colors.ink }}>
                  {L(f.label, lang)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 2, gap: 4 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: '600', color: colors.ink, letterSpacing: -0.4 }}>
          {t('discover.discoverTitle')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20, marginBottom: 8 }}>{t('discover.discoverSub')}</Text>
      </View>

      <View style={{ padding: 16, paddingTop: 4, gap: 14 }}>
        {filtered.map((item) => (
          <DiscoverCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}
