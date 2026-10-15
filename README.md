# Hoa

A bilingual (EN / 中文) movement and wellbeing app built with Expo and React Native.

Screens are file-based routes under [app/](app/), content is served through React Query
hooks in [data/queries.ts](data/queries.ts), and the Postgres schema lives in Supabase.
Users sign in with email and password; every screen reads and writes the Supabase backend.

---

## Requirements

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20 LTS or newer | Developed on 22.15.0 |
| npm | 10+ | Ships with Node (`package-lock.json` is committed, so prefer npm) |
| Expo Go **or** a dev build | SDK 54 | Expo Go from the App Store / Play Store is enough to start |
| Xcode | 16+ | Only for the iOS simulator |
| Android Studio | Latest | Only for the Android emulator |

There is no committed `ios/` or `android/` folder — this is a managed Expo project and
the native projects are generated on demand.

---

## 1. Install

```bash
git clone <this-repo-url>
cd P4P
npm install
```

## 2. Configure the backend

The app reads and writes everything through Supabase, so it needs a project with the
migrations and seed applied (section 3). Copy the template and fill in your own project's
values:

```bash
cp .env.example .env.local
```

```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Both values come from your Supabase dashboard under **Project Settings → API**.

Notes:

- `.env.local` is gitignored and must stay that way. Only the anon/publishable key
  belongs here — never the `service_role` key, which bypasses row-level security.
- The `EXPO_PUBLIC_` prefix is what makes these readable from client code; Expo inlines
  them into the bundle at build time, so treat anything in this file as public.
- Restart the dev server after editing `.env.local` — env vars are read at bundle time,
  not on hot reload.

Without valid credentials [lib/supabase.ts](lib/supabase.ts) falls back to a placeholder
URL and every screen will fail to load.

## 3. Set up the database

Apply the migrations in [supabase/migrations/](supabase/migrations/) in filename order,
then optionally load the catalog seed data:

| File | Purpose |
|---|---|
| `0001_init.sql` | Tables, row-level security policies, indexes |
| `0002_profile_trigger.sql` | Creates a `profiles` row on user signup |
| `0003_lock_down_handle_new_user.sql` | Hardens the signup trigger |
| `0004_vr_device_sessions.sql` | Bridge table to the Unity VR hike — queued sessions + completions |
| `0005_catalogue_slugs.sql` | `slug` ids (r1, d4, v1 …) the app routes by, plus display columns |
| `0006_fix_conversation_rls_recursion.sql` | Membership check in a SECURITY DEFINER function (fixes RLS recursion) |
| `0007_private_membership_check.sql` | Moves that function out of the API-exposed schema |
| `0008_demo_senders_and_chat_display.sql` | `sender_name` for demo-community messages, Messages-list fields |
| `0009_bilingual_activity_details.sql` | Activity details become `{en, zh}` jsonb |
| `seed.sql` | Public catalog content — activities, VR sessions, plans, circle ideas, conversations |
| `seed_demo.sql` | History, chats, RSVPs and memberships for the demo account |

The quickest route is the SQL editor in the Supabase dashboard: paste each file's
contents and run them in order. With the [Supabase CLI](https://supabase.com/docs/guides/local-development)
installed you can instead run:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

`seed.sql` inserts only content that is visible without a login. Personal and social
rows (check-ins, saved items, messages, RSVPs) are foreign-keyed to `auth.users` under
RLS, so `seed_demo.sql` attaches them to the demo account, which must exist first (sign
it up through the app or Auth). It clears that account's rows before inserting, so it can
be re-run to reset the demo.

## 4. Run it

```bash
npm start
```

Then press `i` for the iOS simulator, `a` for Android, or `w` for web — or scan the QR
code with Expo Go on a physical device. You can also jump straight to a platform:

| Command | What it does |
|---|---|
| `npm start` | Starts the Metro dev server with the interactive menu |
| `npm run ios` | Starts and opens the iOS simulator |
| `npm run android` | Starts and opens the Android emulator |
| `npm run web` | Starts and opens the web build |

The app opens on the sign-in screen, then the Home tab.

---

## Project layout

```
app/                    Expo Router screens — every file is a route
  (tabs)/               the five tab screens (home, discover, move, plan, you)
  activity/ vr/ plan/   stack + modal detail routes
  fit/ ask/ session/
  share/ messages/
components/
  ui/                   design-system primitives (Btn, Card, Tag, Avatar, Photo…)
  move/                 Move-tab specific composites
constants/theme.ts      colors, spacing, type scale
data/
  queries.ts            React Query hooks — the single data-access surface
  catalog.ts            public catalogue reads + row→type mappers
  user.ts               per-user reads and writes (saved, RSVPs, check-ins, chats, history)
  mock/                 shared types and fixed UI config (filters, moods, stickers, tips)
i18n/                   i18next setup + en/zh locale JSON
lib/
  supabase.ts           Supabase client
  auth.tsx              AuthProvider / useAuth (session state)
  vrBridge.ts           phone half of the VR headset bridge
  L.ts                  Bilingual<T> resolver — L(node, lang)
store/device.ts         paired headset code, persisted to AsyncStorage
supabase/               SQL migrations and seed data
```

### Conventions worth knowing

- **Path alias.** `@/*` maps to the repo root, so imports read `@/lib/supabase`, not
  `../../lib/supabase`. Configured in [tsconfig.json](tsconfig.json).
- **Typed routes** are on (`experiments.typedRoutes` in [app.json](app.json)), so route
  strings are type-checked. Run the dev server once after adding a route to regenerate
  the types.
- **Bilingual content** is stored as `{ en, zh }` objects and read through `L()` from
  [lib/L.ts](lib/L.ts), matching the `jsonb` columns in Postgres.
- **Data access goes through [data/queries.ts](data/queries.ts).** Screens call hooks
  like `useHomeRecs()` and never touch the Supabase client directly. Rows are mapped onto
  the types in [data/mock/types.ts](data/mock/types.ts) by [data/catalog.ts](data/catalog.ts)
  and [data/user.ts](data/user.ts).
- **New Architecture** is enabled. Check compatibility before adding native modules.

---

## Type checking

```bash
npx tsc --noEmit
```

TypeScript runs in strict mode.

## Troubleshooting

**Stale bundle or odd module errors** — clear the Metro cache:

```bash
npx expo start --clear
```

**Dependency versions drift out of range** after adding packages:

```bash
npx expo install --check
```

Always install Expo-managed packages with `npx expo install <pkg>` rather than
`npm install`, so versions stay aligned with the SDK.

**Env vars not picked up** — confirm the variable name starts with `EXPO_PUBLIC_`, then
fully restart the dev server.
