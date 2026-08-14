import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Card, Photo, Tag, SaveButton, SectionHead, Icon } from '@/components/ui';
import { colors } from '@/constants/theme';
import { L, type Bilingual } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useSavedStore } from '@/store/saved';
import { resolveSaved } from '@/data/mock';
import type { SavedResolved } from '@/data/mock';

function SavedRow({ resolved, onOpen, onUnsave }: { resolved: SavedResolved; onOpen: () => void; onUnsave: () => void }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const { title, sub, photo, kindLabel } = (() => {
    switch (resolved.kind) {
      case 'vr':
        return { title: resolved.item.title, sub: resolved.item.sub, photo: resolved.item.env, kindLabel: t('saved.kindVr') };
      case 'rec':
        return { title: resolved.item.invite, sub: resolved.item.sub, photo: resolved.item.photo, kindLabel: t('saved.kindRec') };
      default:
        return { title: resolved.item.title, sub: resolved.item.note, photo: resolved.item.photo, kindLabel: t('saved.kindDiscover') };
    }
  })();

  return (
    <Card pad={0} onPress={onOpen} style={{ overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch' }}>
      <Photo kind={photo} height={82} style={{ width: 70 }} round={0} />
      <View style={{ padding: 13, flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontWeight: '700', fontSize: 13.5, marginBottom: 3, lineHeight: 17, color: colors.ink }}>{L(title, lang)}</Text>
          {sub && (
            <Text style={{ fontSize: 11.5, color: colors.muted, marginBottom: 6, lineHeight: 15 }} numberOfLines={1}>
              {L(sub, lang)}
            </Text>
          )}
          <Tag tone="neutral">{kindLabel}</Tag>
        </View>
        <SaveButton size={34} saved onToggle={onUnsave} />
      </View>
    </Card>
  );
}

export function SavedBlock() {
  const { t } = useTranslation();
  const router = useRouter();
  const saved = useSavedStore((s) => s.saved);
  const toggleSaved = useSavedStore((s) => s.toggleSaved);

  const items = saved.map(resolveSaved).filter((r): r is SavedResolved => !!r);

  return (
    <View>
      <SectionHead>{t('saved.savedTitle')}</SectionHead>
      {items.length === 0 ? (
        <Card pad={16} soft style={{ borderWidth: 1, borderColor: colors.line, borderStyle: 'dashed' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
            <Icon name="bookmark" size={17} stroke={colors.faint} style={{ marginTop: 1 }} />
            <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 19, flex: 1 }}>{t('saved.savedEmpty')}</Text>
          </View>
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {items.map((r) => (
            <SavedRow
              key={r.item.id}
              resolved={r}
              onOpen={() => router.push(r.kind === 'vr' ? `/vr/${r.item.id}` : `/activity/${r.item.id}`)}
              onUnsave={() => toggleSaved(r.item.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
