-- Messages from the demonstration community (Mei-Lin, Sarah, Lien …), who are
-- not accounts, carry a sender_name instead of a sender_id. Clients still
-- cannot post as anyone else: the insert policy requires auth.uid() = sender_id,
-- which a null sender_id never satisfies, so only the seed writes these rows.
alter table messages alter column sender_id drop not null;
alter table messages add column sender_name text;
alter table messages add constraint messages_sender_present
  check (sender_id is not null or sender_name is not null);

-- Display fields the Messages list shows that 0001 had no column for.
-- member_count describes the demo group; derive it from conversation_members
-- once every member is an account.
alter table conversations
  add column avatar_idx int not null default 0,
  add column member_count int,
  add column pinned_by_name text,
  add column pinned_by_idx int,
  add column pinned_role jsonb;
