# App ↔ VR bridge

How the Hoa phone app and the Unity hike (`dsaw04/Hoa_XR_Hiking_Game`) talk to each other.

The two run on different devices, so there is no deep link or intent that can reach across.
They share one Supabase table instead. Nothing is real-time: the app queues a hike, the
headset picks it up next time it launches, and writes the result back when the hike ends.

## The table

`vr_device_sessions` (migration `0004`). **One row is one hike.** The app creates it, the
game finishes it.

| Column | Written by | Notes |
|---|---|---|
| `id` | db | uuid |
| `device_code` | app | 6 chars, identifies the headset |
| `vr_session_ref` | app | which catalogue session, currently `"v1"`/`"v2"`/`"v3"` |
| `title` | app | `{"en": "...", "zh": "..."}` — show whichever matches the headset language |
| `mode` | app | `gentle` \| `steady` \| `strong` |
| `intensity` | app | `low` \| `medium` \| `high` |
| `minutes` | app | requested length |
| `created_at` | db | |
| `started_at` | **game** | set when the player confirms the check-in |
| `ended_at` | **game** | set when the hike finishes |
| `actual_minutes` | **game** | how long they really went |
| `kcal` | **game** | optional, 0 is fine |

## Field mapping

`mode` and `intensity` line up with `MovementModeManager` almost exactly:

| DB `mode` | `MovementMode` | DB `intensity` | `MovementIntensity` |
|---|---|---|---|
| `gentle` | `Gentle` | `low` | `Low` |
| `steady` | `Steady` | `medium` | `Medium` |
| `strong` | `EnergyBoost` | `high` | `High` |

`minutes` maps to `SetDuration(int)`. **It is not always one of your three chips** — the
catalogue has an 8-minute session. Accept any positive int and highlight the nearest chip.

## What the game needs to do

Three HTTP calls. `UnityWebRequest` covers all of them; no new packages.

Both headers go on every request:

```
apikey: <anon key>
Authorization: Bearer <anon key>
```

The URL and anon key are in the app's `.env.local` — Joe will send them. The anon key is
publishable and safe to ship in the APK; row-level security is what protects the data.

### 1. On launch — is anything queued for this headset?

```
GET {SUPABASE_URL}/rest/v1/vr_device_sessions
    ?device_code=eq.{code}
    &started_at=is.null
    &order=created_at.desc
    &limit=1
```

Returns a JSON array — `[]` means nothing queued, so show the check-in as you do today.
If there is a row, **pre-fill** the check-in from it (mode, intensity, duration selected,
and ideally the title so she sees "Kauri Forest Walk" and knows it came from her phone).

Keep the panel up and keep requiring the Start button. Don't skip it — the affirmative
check-in every launch is the accessibility premise, and the app is only setting the defaults.

### 2. When she confirms — claim the row

```
PATCH {SUPABASE_URL}/rest/v1/vr_device_sessions?id=eq.{id}
Content-Type: application/json
Prefer: return=minimal

{"started_at": "2026-09-19T03:00:00Z"}
```

This is what stops the same hike being picked up again next launch.

### 3. When the hike ends — write the result back

```
PATCH {SUPABASE_URL}/rest/v1/vr_device_sessions?id=eq.{id}
Content-Type: application/json
Prefer: return=minimal

{"ended_at": "2026-09-19T03:12:00Z", "actual_minutes": 12, "kcal": 52}
```

Timestamps are ISO-8601 UTC. This row is what shows up in the app's You tab.

All three return `204`. Anything else, log it and carry on — a failed write should never
block or crash the hike. Offline is a normal case: if step 1 fails, just show the check-in
normally; if step 3 fails, consider keeping the row id in `PlayerPrefs` and retrying at the
next launch.

## The pairing code

The headset owns the code and the phone types it in — typing in VR is miserable, so the
direction matters.

Generate 6 characters once, store in `PlayerPrefs`, reuse forever. Avoid `0/O` and `1/I`
so nobody mistypes them. Show it on the menu panel, something like
**"Your code: K7M2QX — enter this in the Hoa app"**.

There is no registration step. The code is just a string both sides agree on; an unknown
code simply returns no rows.

## Android

Quest builds need `android.permission.INTERNET`. Unity normally adds it automatically —
worth confirming it survives into the manifest, because the symptom is every request
failing silently on device while working fine in the editor.

## Known limits

- Anyone who knows a code can read or claim that headset's hikes. Fine for a supervised
  study with a few devices and no personal data in the table; it needs real auth before
  this goes near actual participants.
- One hike at a time. The app queues, the headset takes the newest unstarted row. If she
  queues three, the older two just sit there.
