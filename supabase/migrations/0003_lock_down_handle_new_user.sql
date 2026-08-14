-- handle_new_user is SECURITY DEFINER and lives in the public schema, so
-- PostgREST exposes it as a directly-callable RPC (/rest/v1/rpc/handle_new_user)
-- to anon/authenticated by default. It's only meant to run via the
-- on_auth_user_created trigger — revoke direct execute so it can't be called
-- to insert arbitrary profiles rows.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
