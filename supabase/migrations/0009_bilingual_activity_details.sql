-- Testers reading in Chinese still saw an activity's time, place, cost,
-- language, intensity and what-to-bring in English: 0001 stored them as text.
-- They become jsonb like every other display field. Existing values convert
-- to JSON strings, which the app's Bilingual type already accepts, and the
-- seed then replaces them with {en, zh} objects.
alter table activities
  alter column detail_time type jsonb using to_jsonb(detail_time),
  alter column detail_location type jsonb using to_jsonb(detail_location),
  alter column detail_cost type jsonb using to_jsonb(detail_cost),
  alter column detail_language type jsonb using to_jsonb(detail_language),
  alter column detail_intensity type jsonb using to_jsonb(detail_intensity),
  alter column detail_bring type jsonb using to_jsonb(detail_bring);
