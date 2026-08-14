import type { AppLang } from '@/i18n';

// Bilingual content node shape used throughout mock/Supabase data records
// (activity titles, notes, comments, etc.) — distinct from i18next UI strings.
export type Bilingual = { en: string; zh?: string } | string;

// Mirrors data.jsx's L(node, lang): resolves a { en, zh } node for the
// current language, falling back to English when a zh string is missing.
export function L(node: Bilingual | null | undefined, lang: AppLang): string {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  return node[lang] ?? node.en ?? '';
}
