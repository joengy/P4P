-- Auto-create a profiles row whenever a new auth.users row is inserted, so
-- sign-up never races the profiles-insert RLS policy (auth.uid() = id can't
-- be checked client-side until the session exists, which may lag sign-up if
-- email confirmation is enabled). security definer lets this run as the
-- table owner, bypassing RLS for this one trusted insert.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), 'Hoa member')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
