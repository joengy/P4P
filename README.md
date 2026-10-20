# Hoa

A bilingual (English / 中文) mobile app that supports physical activity through social
connection, built with Expo, React Native and Supabase.

This repository is the software compendium for the Part IV project report
*Design, Implementation, and Preliminary Evaluation of Hoa: A Socially Supportive Mobile
Physical Activity Application* (Joe Nguyen, Project 95, University of Auckland, 2026;
supervisor Dr Yun Suen Pai). Hoa is the mobile half of the project. The VR hiking game it
pairs with was built by Dhruv Sawant in a separate repository, [`dsaw04/Hoa_XR_Hiking_Game`](https://github.com/dsaw04/Hoa_XR_Hiking_Game).

---

## Contents

1. [Where things in the report live](#where-things-in-the-report-live)
2. [Two builds: tested and final](#two-builds-tested-and-final)
3. [Requirements](#requirements)
4. [Running the tested build (no setup)](#running-the-tested-build-no-setup)
5. [Running the final build](#running-the-final-build)
6. [Project layout](#project-layout)
7. [Troubleshooting](#troubleshooting)

---

## Where things in the report live

| Report | Code |
|---|---|
| Tab screens (Home, Discover, Move, Plan, You) | [app/(tabs)/](app/(tabs)/) |
| Detail screens, VR pairing, messages, sign-in | [app/](app/) |
| Data-access layer (React Query hooks) | [data/queries.ts](data/queries.ts), [data/catalog.ts](data/catalog.ts), [data/user.ts](data/user.ts) |
| Database schema and row-level security (ER diagram) | [supabase/migrations/](supabase/migrations/) |
| Demonstration content and demo account | [supabase/seed.sql](supabase/seed.sql), [supabase/seed_demo.sql](supabase/seed_demo.sql) |
| App ↔ VR headset bridge | [lib/vrBridge.ts](lib/vrBridge.ts), [docs/vr-bridge.md](docs/vr-bridge.md) |
| Bilingual support | [i18n/](i18n/), [lib/L.ts](lib/L.ts) |
| Authentication | [lib/auth.tsx](lib/auth.tsx), [app/(auth)/](app/(auth)/) |

## Two builds: tested and final

| | Tested build | Final build |
|---|---|---|
| Commit | `5f55024` (19 September 2026) | `main` |
| Used for | The evaluation with participants | The Implementation section of the report |
| Data | Bundled demonstration data | Live Supabase database |
| Sign-in | None | Email and password, or an emailed link |
| Expo SDK | 54 | 57 |
| Setup needed | `npm install` only | A Supabase project (see below) |

Everything after `5f55024` is the post-evaluation work in the report: sign-in, the live
database, and the changes made in response to testing.

---

## Requirements

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20 LTS or newer | Developed on 22.15.0 |
| npm | 10+ | Ships with Node. `package-lock.json` is committed, so use npm |
| Expo Go **or** a simulator/emulator | Matching the build's SDK | Not needed for the web build |
| Xcode | 16+ | Only for the iOS simulator |
| Android Studio | Latest | Only for the Android emulator |

This is a managed Expo project, so there is no committed `ios/` or `android/` folder; the
native projects are generated on demand.

The app is designed for a phone. In a desktop browser, narrow the window or use the
browser's device toolbar to see it at phone width.

---

## Running the tested build (no setup)

The tested build runs on bundled data, so it needs no backend or credentials.

```bash
git clone https://github.com/joengy/P4P.git
cd P4P
git checkout 5f55024
npm install
npm run web
```

`npm run ios` and `npm run android` also work and will install the matching Expo Go on the
simulator. The App Store / Play Store Expo Go only supports the newest SDK, so it cannot
open this SDK 54 build on a physical phone.

Return to the final build with `git checkout main && npm install`.

---

## Running the final build

### 1. Install

```bash
git clone https://github.com/joengy/P4P.git
cd P4P
npm install
```

### 2. Create the database

Create a free project at [supabase.com](https://supabase.com), open its **SQL Editor**, and
run each file below in order (paste its contents, then **Run**):

| File | Purpose |
|---|---|
| `migrations/0001_init.sql` | Tables, row-level security policies, indexes |
| `migrations/0002_profile_trigger.sql` | Creates a `profiles` row on sign-up |
| `migrations/0003_lock_down_handle_new_user.sql` | Hardens the sign-up trigger |
| `migrations/0004_vr_device_sessions.sql` | Bridge table to the VR hike: queued sessions and completions |
| `migrations/0005_catalogue_slugs.sql` | `slug` ids (r1, d4, v1 …) the app routes by, plus display columns |
| `migrations/0006_fix_conversation_rls_recursion.sql` | Membership check in a SECURITY DEFINER function (fixes RLS recursion) |
| `migrations/0007_private_membership_check.sql` | Moves that function out of the API-exposed schema |
| `migrations/0008_demo_senders_and_chat_display.sql` | `sender_name` for demo-community messages, Messages-list fields |
| `migrations/0009_bilingual_activity_details.sql` | Activity details become `{en, zh}` jsonb |
| `seed.sql` | Demonstration catalogue: activities, VR sessions, plans, circle ideas, conversations |

All files are under [supabase/](supabase/). If you have the
[Supabase CLI](https://supabase.com/docs/guides/local-development), `supabase link
--project-ref <ref>` followed by `supabase db push` applies the migrations, but the seed
still has to be run in the SQL Editor.

### 3. Connect the app

```bash
cp .env.example .env.local
```

Then fill in `.env.local` with the values from **Project Settings → API** in the Supabase
dashboard:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Use the anon (publishable) key only, never the `service_role` key. `.env.local` is
gitignored. Without it, [lib/supabase.ts](lib/supabase.ts) falls back to a placeholder URL
and the screens will not load.

### 4. Run it

```bash
npm start
```

Press `w` for web, `i` for the iOS simulator or `a` for Android, or scan the QR code with
Expo Go on a phone. `npm run web`, `npm run ios` and `npm run android` jump straight to a
platform.

### 5. Sign up and load the demo account (optional)

Create an account from the app's sign-up screen. Supabase sends a confirmation email by
default; confirm it, or turn off **Confirm email** under **Authentication → Sign In /
Providers** first.

A new account starts empty. To give it the movement history, chats and RSVPs that
participants saw during testing, change the email on line 8 of
[supabase/seed_demo.sql](supabase/seed_demo.sql) to your account's email and run the file
in the SQL Editor. It clears that account's rows first, so it can be re-run to reset the
demo.

---

## Project layout

```
app/                    Expo Router screens; every file is a route
  (auth)/               sign-in and sign-up
  (tabs)/               the five tabs: Home (index), Discover, Move, Plan, You
  activity/ vr/ plan/   detail screens
  fit/ ask/ session/ share/ messages/
  mood.tsx pair.tsx     mood check-in and VR headset pairing
components/
  ui/                   shared primitives (Btn, Card, Tag, Avatar, Photo …)
  home/ discover/ move/ plan/ you/ messages/ sheets/
                        screen-specific components
constants/theme.ts      colours, spacing, type scale
data/
  queries.ts            React Query hooks, the only data-access surface for screens
  catalog.ts            public catalogue reads and row-to-type mappers
  user.ts               per-user reads and writes (saved items, RSVPs, check-ins, chats, history)
  mock/                 shared types and fixed UI config (filters, moods, stickers)
i18n/                   i18next setup and the en/zh locale files
lib/
  supabase.ts           Supabase client
  auth.tsx              AuthProvider and useAuth (session state)
  vrBridge.ts           phone side of the VR headset bridge
  L.ts                  resolves bilingual { en, zh } content for the current language
store/device.ts         paired headset code, persisted on the device
supabase/               SQL migrations and seed data
docs/vr-bridge.md       how the app and the VR game exchange sessions
```

Notes for reading the code:

- `@/` maps to the repository root, so imports read `@/lib/supabase`.
- Bilingual content is stored as `{ en, zh }` objects (jsonb in Postgres) and read
  through `L()` in [lib/L.ts](lib/L.ts).
- Screens never call Supabase directly; they use the hooks in
  [data/queries.ts](data/queries.ts), which map rows onto the types in
  [data/mock/types.ts](data/mock/types.ts).

Type-check with `npx tsc --noEmit` (strict mode).

---

## Troubleshooting

- **Stale bundle or odd module errors:** `npx expo start --clear`.
- **Changes to `.env.local` not picked up:** fully stop and restart the dev server; the
  variables are read at bundle time.
- **Screens stuck loading or empty:** check `.env.local` and that every migration and
  `seed.sql` ran without errors.
- **Dependency version warnings:** `npx expo install --check`.
