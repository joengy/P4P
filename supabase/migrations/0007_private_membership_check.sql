-- Moves 0006's membership check out of the API-exposed public schema, so it
-- is no longer callable as /rest/v1/rpc/is_conversation_member (flagged by the
-- security advisor). The RLS policies reference the function by oid, so they
-- follow it; they run as the requesting role, which keeps USAGE on the schema
-- and EXECUTE on the function. PostgREST only exposes `public`.

create schema if not exists private;
grant usage on schema private to anon, authenticated;
alter function public.is_conversation_member(uuid) set schema private;
