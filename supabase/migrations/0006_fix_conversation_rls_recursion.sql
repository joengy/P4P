-- 0001's conversation_members select policy queried conversation_members
-- itself, so Postgres rejected every read that touched it with "infinite
-- recursion detected in policy" — including the conversations embed on
-- activities and plans, and every messages read.
--
-- The membership check now runs in a SECURITY DEFINER function, which reads
-- conversation_members without re-entering its RLS. It only ever answers
-- "is the caller a member of this conversation", so exposing it to anon is
-- harmless (auth.uid() is null there, so it returns false).

create function public.is_conversation_member(conv uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.conversation_members
    where conversation_id = conv and user_id = auth.uid()
  );
$$;

revoke execute on function public.is_conversation_member(uuid) from public;
grant execute on function public.is_conversation_member(uuid) to anon, authenticated;

drop policy "members read their conversations" on conversations;
create policy "members read their conversations" on conversations for select
  using (public.is_conversation_member(id));

drop policy "members read conversation membership" on conversation_members;
create policy "members read conversation membership" on conversation_members for select
  using (public.is_conversation_member(conversation_id));

drop policy "members read messages" on messages;
create policy "members read messages" on messages for select
  using (public.is_conversation_member(conversation_id));

drop policy "members send messages" on messages;
create policy "members send messages" on messages for insert
  with check (auth.uid() = sender_id and public.is_conversation_member(conversation_id));
