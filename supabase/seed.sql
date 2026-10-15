-- Hoa — prototype seed data.
-- Populates catalog content only (activities, vr_sessions, activity_comments,
-- plans, circle_ideas, conversations) — everything visible without a login.
-- Skips personal/social rows (check_ins, movement_sessions, saved_items,
-- friendships, circle_interests, plan_rsvps, conversation_members, messages)
-- because they're all FK'd to profiles(id) -> auth.users(id) under RLS, and
-- no real account exists yet. Once a real user signs up, a follow-on seed
-- can attach history/messages/saved items to that account.
--
-- IDs are uuid-v5 (namespace 5c2f9b1a-0000-4000-8000-000000000000) derived
-- from the mock data's original string ids (r1, d1, v1, ...) so this file
-- can be re-run idempotently (on conflict do nothing) and so relations
-- between rows below are stable and readable.

-- ── conversations (c1–c4) — inserted first: activities/plans below
-- reference group_chat_id via FK. pinned_text/members/messages are skipped
-- (need real users); only the shell + pinned announcement banner
-- (public-facing, no sender) is seeded.
insert into conversations (id, kind, name, pinned_text) values
  ('230ed220-b23c-514e-9496-e2ead16e8beb', 'coach', '"Mei-Lin"', null),
  ('e5c6fe18-b094-5aef-a173-dadfaac57f65', 'group', '{"en":"Saturday Walkers","zh":"周六步行团"}',
    '{"en":"📍 Meet by the Mission Bay fountain at 9:00. Easy 40-min flat loop, slow pace, rest anytime. Bring water; family welcome. No pressure to chat — just come as you are. 💚","zh":"📍 9:00 在使命湾喷泉旁集合。轻松的 40 分钟平坦环线，慢节奏，随时可休息。带上水；欢迎家人。不强迫交谈——以你的样子来就好。💚"}'),
  ('fb6a06d6-0d1e-544f-b324-05d24ee754df', 'friend', '"Elena R."', null),
  ('e8d1c5e6-c3fa-5336-bfa6-8844d87e8227', 'family', '{"en":"Family 家人","zh":"家人"}', null)
on conflict (id) do nothing;

-- ── activities: HOME_REC_LIBRARY (r1–r5) ─────────────────────
insert into activities (
  id, kind, tags, headline, subline, why, photo_kind, org_name, org_initials, org_verified,
  guide_name, guide_bilingual, guide_idx, trust, comfort, badges, cta, rating, reviews_count,
  attended_count, group_chat_id, detail_time, detail_location, detail_cost, detail_language,
  detail_intensity, detail_bring, dur, testimonial_text, testimonial_by
) values
  (
    '8fb6136c-518c-556d-aaf6-d21807d384fe', 'group', '{}',
    '{"en":"A slow, friendly walk this afternoon","zh":"今天下午有一段慢步走"}',
    '{"en":"Cornwall Park · 40 min · plenty of benches","zh":"康沃尔公园 · 40 分钟 · 沿途多长椅"}',
    '{"en":"Flat ground, group pace, and a guide who speaks both your languages.","zh":"平坦的路面、集体节奏，向导会说你的两种语言。"}',
    'park', '{"en":"Auckland Women Walk","zh":"奥克兰女性步行会"}', 'AW', false,
    'Mei-Lin', true, 3, '{communityLed,beginner,lowCost}', '{beginner,friendWelcome,women,seated}', '{}',
    'rsvp', 4.9, 38, 12, 'e5c6fe18-b094-5aef-a173-dadfaac57f65',
    '9:00 AM Sat', 'Cornwall Park rose garden', 'Free', 'EN / 中', 'Gentle', 'Comfortable shoes, water',
    '{"en":"40 min","zh":"40 分钟"}',
    '{"en":"I finally felt safe to start moving again.","zh":"我终于敢重新开始活动了。"}',
    '{"en":"Hana · 3 months in","zh":"Hana · 加入 3 个月"}'
  ),
  (
    'd70b2be4-00fa-5899-8931-e8c1554316bb', 'home', '{}',
    '{"en":"A 10-minute shoulder & neck reset","zh":"10 分钟肩颈舒缓"}',
    '{"en":"In your living room · seated or standing","zh":"在你的客厅 · 站姿或坐姿"}',
    '{"en":"Releases the tightness from carrying, caring, and screen time.","zh":"缓解照顾家人、久坐与屏幕带来的肩颈紧绷。"}',
    'home', '{"en":"Hoa VR studio","zh":"Hoa VR 工作室"}', 'VR', false,
    null, false, null, '{professional,beginner,stopAnytime}', '{beginner,stopAnytime,seated}', '{}',
    'start', 4.8, 31, 42, null,
    'Anytime', 'Home', 'Free', 'EN / 中', 'Very gentle', 'A chair, water',
    '{"en":"10 min","zh":"10 分钟"}', null, null
  ),
  (
    '4b7e3c27-5447-51ad-a5c3-3801e871190f', 'vr', '{}',
    '{"en":"A 10-min VR walk through kauri forest","zh":"10 分钟 VR 贝壳杉森林漫步"}',
    '{"en":"Indoors, private, headset on","zh":"室内、私密、戴上头显"}',
    '{"en":"A soft warm-up for body and mood — and a bridge to a real trail nearby.","zh":"温和地唤醒身体与心情——也是通往附近真实步道的桥梁。"}',
    'forest-vr', '{"en":"Hoa VR","zh":"Hoa VR"}', 'VR', false,
    null, false, null, '{professional,beginner,stopAnytime}', '{beginner,stopAnytime,quiet}', '{}',
    'startVR', 4.8, 84, 84, null,
    'Anytime', 'Home · 1.5m space', 'Free', 'EN / 中', 'Gentle', 'Headset, water',
    '{"en":"10 min","zh":"10 分钟"}', null, null
  ),
  (
    '4e1ede18-e562-5983-bcf5-f46a2d073d49', 'library', '{}',
    '{"en":"Quiet library stretch circle","zh":"安静的图书馆拉伸小圈"}',
    '{"en":"Mt Roskill Library · Wed 11 AM · 30 min","zh":"罗斯希尔图书馆 · 周三上午 11:00 · 30 分钟"}',
    '{"en":"A calm, dry, indoor space when the weather or noise feels too much.","zh":"当天气或喧嚣令人疲惫时，一个安静、干燥、室内的空间。"}',
    'home', '{"en":"Auckland Libraries Wellbeing","zh":"奥克兰图书馆健康项目"}', 'LB', false,
    'Priya', false, 2, '{communityLed,beginner,lowCost}', '{beginner,noBooking,friendWelcome,quiet}', '{}',
    'addPlan', 4.7, 18, 9, 'e5c6fe18-b094-5aef-a173-dadfaac57f65',
    'Wed 11:00 AM', 'Mt Roskill Library', 'Free', 'EN only', 'Gentle', 'Yourself',
    '{"en":"30 min","zh":"30 分钟"}', null, null
  ),
  (
    '7bedeccd-fe9c-518c-b533-b8c1195f867d', 'outdoor', '{}',
    '{"en":"A quiet self-guided shore walk","zh":"一段安静的自助海岸散步"}',
    '{"en":"Mission Bay · 2.4 km flat loop · at your own pace","zh":"使命湾 · 2.4 公里平坦环线 · 按自己的节奏"}',
    '{"en":"Flat, well-lit, and yours to pace — no group, no pressure to talk.","zh":"平坦、灯光充足、完全按你的节奏——没有小组，没有交谈压力。"}',
    'beach', null, null, false,
    null, false, null, '{lowCost,stopAnytime}', '{stopAnytime}', '{}',
    'saveRoute', 4.6, 12, 12, null,
    'Anytime', 'Mission Bay waterfront', 'Free', '—', 'Gentle', 'Water, comfortable shoes',
    '{"en":"35 min","zh":"35 分钟"}', null, null
  )
on conflict (id) do nothing;

-- ── activities: DISCOVER_ITEMS (d1–d6) ───────────────────────
insert into activities (
  id, kind, tags, headline, why, photo_kind, min_duration, org_name, org_initials, org_verified, org_tone,
  guide_name, guide_idx, guide_bio, trust, badges, cta, rating, reviews_count, attended_count,
  when_text, distance_text, access, testimonial_text, testimonial_by
) values
  (
    '1b5925fe-8717-5f55-9290-ae2aec11f0b6', 'group', '{group,near,women}',
    '{"en":"Cornwall Park slow walk","zh":"康沃尔公园慢步走"}',
    '{"en":"Flat loop · 40 min · benches along the way.","zh":"平坦环线 · 40 分钟 · 沿途多长椅。"}',
    'park', null, '{"en":"Auckland Women Walk","zh":"奥克兰女性步行会"}', 'AW', true, 'calm',
    'Mei-Lin', 3, '{"en":"Bilingual guide · 6 years leading women’s walks","zh":"双语向导 · 带领女性步行 6 年"}',
    '{communityLed,beginner,lowCost}', '{free,women,bilingual}', 'rsvp', 4.9, 38, 12,
    '{"en":"Sat 9:00 AM","zh":"周六 上午9:00"}', '{"en":"15 min away","zh":"15 分钟车程"}', '{}',
    '{"en":"I finally felt safe to start moving again.","zh":"我终于敢重新开始活动了。"}',
    '{"en":"Hana · joined 3 months ago","zh":"Hana · 3 个月前加入"}'
  ),
  (
    'ef412cba-0a2c-58f4-8f1b-24ad24a1d141', 'group', '{group,near,women}',
    '{"en":"Beginner badminton","zh":"初学者羽毛球"}',
    '{"en":"Borrow a racket · no experience needed.","zh":"可借球拍 · 零基础可参加。"}',
    'court', null, '{"en":"Sandringham Community House","zh":"桑德灵厄姆社区中心"}', 'CH', true, 'lav',
    null, null, null,
    '{communityLed,beginner}', '{dropin,women}', 'askFirst', 4.7, 21, 9,
    '{"en":"Tue 6:30 PM","zh":"周二 晚6:30"}', '{"en":"8 min away","zh":"8 分钟车程"}', '{}',
    null, null
  ),
  (
    '6cb28eaa-266f-5177-b0af-f650f094c821', 'outdoor', '{near}',
    '{"en":"Mission Bay self-guided shore walk","zh":"使命湾自助海岸散步"}',
    '{"en":"Toilets at start · cafés along the way · safe lighting after dark.","zh":"起点有洗手间 · 沿途咖啡馆 · 夜间路灯安全。"}',
    'beach', null, null, null, false, null,
    null, null, null,
    '{}', '{}', 'saveRoute', 4.6, 12, 0,
    '{"en":"Anytime · flat sealed path","zh":"任何时间 · 平坦沥青路"}', '{"en":"6 min away · 2.4 km loop","zh":"6 分钟车程 · 2.4 公里环线"}',
    '{stroller,wheelchair,lit,water}', null, null
  ),
  (
    '7772d30a-a5fb-5612-8db6-a34bb8c54070', 'vr', '{vr,home}',
    '{"en":"Kauri Forest VR walk","zh":"贝壳杉森林 VR 漫步"}',
    '{"en":"A calm first step before the real trail.","zh":"在真实步道之前，一个平静的起点。"}',
    'forest', 10, '{"en":"Hoa VR studio","zh":"Hoa VR 工作室"}', 'VR', true, 'lav',
    null, null, null,
    '{professional,beginner,stopAnytime}', '{home,bilingual}', 'startVR', 4.8, 54, 0,
    null, null, '{}', null, null
  ),
  (
    '0c34070a-2731-5495-8eac-a8f884118da4', 'home', '{home}',
    '{"en":"Shoulder & neck reset","zh":"肩颈舒缓"}',
    '{"en":"For long days at the desk or caring for others.","zh":"适合久坐或照顾家人的漫长一天。"}',
    'home', 8, '{"en":"Hoa VR studio","zh":"Hoa VR 工作室"}', 'VR', true, 'lav',
    null, null, null,
    '{professional,beginner,stopAnytime}', '{home}', 'start', 4.9, 31, 0,
    null, null, '{}', null, null
  ),
  (
    'd91afe0b-ebd4-5c1e-ae57-bc9947d4e656', 'group', '{group,near}',
    '{"en":"Library stretch circle","zh":"图书馆拉伸小圈"}',
    '{"en":"Indoor · dry · quiet · 30 min.","zh":"室内 · 干燥 · 安静 · 30 分钟。"}',
    'home', null, '{"en":"Auckland Libraries Wellbeing","zh":"奥克兰图书馆健康项目"}', 'LB', true, 'accent',
    null, null, null,
    '{communityLed,beginner,lowCost}', '{free,dropin}', 'addPlan', 4.7, 18, 9,
    '{"en":"Wed 11:00 AM","zh":"周三 上午11:00"}', '{"en":"12 min away","zh":"12 分钟车程"}', '{}',
    null, null
  )
on conflict (id) do nothing;

-- ── activity_comments (from HOME_REC_LIBRARY.comments) ───────
insert into activity_comments (activity_id, display_name, avatar_idx, body) values
  ('8fb6136c-518c-556d-aaf6-d21807d384fe', 'Hana', 1, '{"en":"I finally felt safe to start moving again. The pace was very kind.","zh":"我终于敢重新开始活动了。节奏很温柔。"}'),
  ('8fb6136c-518c-556d-aaf6-d21807d384fe', 'Priya', 2, '{"en":"Met two other Mums. We walked, chatted, and rested when we needed to.","zh":"认识了两位妈妈——一边走一边聊，累了就休息。"}'),
  ('8fb6136c-518c-556d-aaf6-d21807d384fe', 'Wei', 4, '{"en":"Mei-Lin explained everything in Mandarin too. So welcoming for newcomers.","zh":"美琳还会用普通话讲解，对新人非常友善。"}'),
  ('d70b2be4-00fa-5899-8931-e8c1554316bb', 'Lien', 1, '{"en":"Did this from my couch after work. Shoulders much looser after.","zh":"下班后在沙发上跟着做。结束时肩膀松了很多。"}'),
  ('d70b2be4-00fa-5899-8931-e8c1554316bb', 'Elena', 2, '{"en":"Calm voice. No pressure to do every movement — just what felt right.","zh":"声音很平和。没有强迫做完每个动作——只做让自己舒服的。"}'),
  ('4b7e3c27-5447-51ad-a5c3-3801e871190f', 'Hana', 1, '{"en":"It felt like a real walk. I forgot I had the headset on.","zh":"感觉就像真的在散步。一会儿就忘了头显戴着。"}'),
  ('4b7e3c27-5447-51ad-a5c3-3801e871190f', 'Sarah', 2, '{"en":"Booked the real Cornwall Park walk after this. It made me brave.","zh":"体验完之后我报名了真正的康沃尔公园散步。它让我有了勇气。"}'),
  ('4b7e3c27-5447-51ad-a5c3-3801e871190f', 'Priya', 4, '{"en":"I paused once to look around. The kauri trees are stunning.","zh":"我中途停下来看了一会儿。贝壳杉真的很美。"}'),
  ('4e1ede18-e562-5983-bcf5-f46a2d073d49', 'Wei', 4, '{"en":"Quiet space, no music. My back loved it.","zh":"空间安静，没有音乐。背部很喜欢。"}'),
  ('4e1ede18-e562-5983-bcf5-f46a2d073d49', 'Priya', 2, '{"en":"Easy parking. I came back the next week with my daughter.","zh":"停车方便。第二周我带女儿一起来了。"}');

-- ── vr_sessions (v1–v3) ───────────────────────────────────────
insert into vr_sessions (
  id, title, sub, min, tone, goal, env, felt_intensity, beginner_safe, can_stop, space, movement,
  energy_kcal, tried_by, feedback, guide_name, guide_bilingual, guide_beginner, guide_idx, guide_bio,
  real_world_activity_id, real_world_when
) values
  (
    '93654dd0-a25a-5207-8edd-3dd90bff5471',
    '{"en":"Kauri Forest Walk","zh":"贝壳杉森林漫步"}', '{"en":"Slow walk-in-place · NZ native bush","zh":"原地慢走 · 新西兰原生丛林"}',
    10, 'calm', '{"en":"mood reset","zh":"舒缓情绪"}', 'forest', 'gentle', true, true,
    '{"en":"1.5m clear space · standing or seated","zh":"1.5 米空地 · 站姿或坐姿"}',
    '{"en":"Walking in place, gentle gaze shifts","zh":"原地行走、温和转头"}',
    45, 84,
    '[{"id":"f","label":{"en":"felt safe","zh":"感到安全"},"pct":96},{"id":"b","label":{"en":"beginner-friendly","zh":"适合初学"},"pct":92},{"id":"u","label":{"en":"useful","zh":"有帮助"},"pct":88}]',
    'Mei-Lin', true, true, 3, '{"en":"Bilingual guide · welcomes first-timers","zh":"双语向导 · 欢迎初次尝试"}',
    '1b5925fe-8717-5f55-9290-ae2aec11f0b6', '{"en":"Sat 9:00 AM · 15 min away","zh":"周六上午 9:00 · 15 分钟车程"}'
  ),
  (
    '0332f303-9aeb-5276-88f2-d989b2e0b637',
    '{"en":"Wake the Upper Body","zh":"唤醒上半身"}', '{"en":"Gentle reaches & shoulder circles","zh":"轻柔伸展与肩部画圈"}',
    8, 'accent', '{"en":"reduce stiffness","zh":"缓解僵硬"}', 'sky', 'gentle', true, true,
    '{"en":"A chair · arm’s reach of clear space","zh":"一把椅子 · 手臂可伸展的空间"}',
    '{"en":"Seated reaches, shoulder rolls","zh":"坐姿伸展、肩部转动"}',
    30, 42,
    '[{"id":"f","label":{"en":"felt safe","zh":"感到安全"},"pct":98},{"id":"b","label":{"en":"beginner-friendly","zh":"适合初学"},"pct":95}]',
    'Aroha', true, true, 1, '{"en":"Physio-trained · beginners welcome","zh":"物理治疗师背景 · 欢迎初学者"}',
    null, null
  ),
  (
    '476d149f-1862-5899-92d8-fc45d0ec8723',
    '{"en":"Lakeside Rhythm","zh":"湖畔律动"}', '{"en":"Step side-to-side · light circulation","zh":"左右踏步 · 促进循环"}',
    12, 'lav', '{"en":"energy boost","zh":"提升精力"}', 'lake', 'steady', true, true,
    '{"en":"2m clear space · standing","zh":"2 米空地 · 站立"}',
    '{"en":"Side-step, light arm sway","zh":"侧步、轻摆双臂"}',
    70, 31,
    '[{"id":"f","label":{"en":"felt safe","zh":"感到安全"},"pct":90},{"id":"u","label":{"en":"useful","zh":"有帮助"},"pct":89}]',
    'Sun', false, true, 4, '{"en":"Community fitness lead","zh":"社区健身带领者"}',
    null, null
  )
on conflict (id) do nothing;

-- ── plans (CONFIRMED u1–u2) ───────────────────────────────────
insert into plans (
  id, title, day, date, time, where_text, type, facilitator_name, facilitator_idx,
  facilitator_bilingual, facilitator_role, language, welcome, norms, group_chat_id
) values
  (
    '94b8e9b7-2f92-51e0-a91d-61bdd29b5a46',
    '{"en":"Saturday harbour walk","zh":"周六海港散步"}', '{"en":"SAT","zh":"周六"}', '14', '{"en":"9:00 AM","zh":"上午 9:00"}',
    '{"en":"Mission Bay, by the fountain","zh":"使命湾喷泉旁"}', 'outdoor',
    'Sarah', 2, false, '{"en":"Blue Coast group lead · 4 yrs","zh":"蓝海岸小组带领 · 4 年"}',
    '{"en":"English · 中文 on request","zh":"英文 · 可用中文"}',
    '{"en":"Kia ora! We keep an easy, chatty pace along the flat waterfront. Rest whenever you like — nobody gets left behind. Family and kids welcome. See you by the fountain. 🌊","zh":"Kia ora！我们沿平坦的海滨慢慢走、边走边聊。想休息随时休息——不会落下任何人。欢迎家人和孩子。喷泉旁见。🌊"}',
    '{slowPace,restAnytime,familyWelcome,newcomers}', 'e5c6fe18-b094-5aef-a173-dadfaac57f65'
  ),
  (
    'affbca3f-8140-59f0-8107-bf7291d2ffdb',
    '{"en":"Sunrise park yoga","zh":"日出公园瑜伽"}', '{"en":"SUN","zh":"周日"}', '15', '{"en":"7:30 AM","zh":"上午 7:30"}',
    '{"en":"Cornwall Park rose garden","zh":"康沃尔公园玫瑰园"}', 'social',
    'Mei-Lin', 3, true, '{"en":"Bilingual movement guide · 6 yrs","zh":"双语运动向导 · 6 年"}',
    '{"en":"EN / 中文","zh":"英文 / 中文"}',
    '{"en":"A gentle sunrise flow for every body. Beginners are the reason we’re here — come as you are and move only what feels right. No poses to “get right”. 🌸","zh":"温和的日出流动，适合每一个身体。初学者正是我们存在的意义——以你此刻的样子前来，只做让自己舒服的动作。没有必须“做对”的姿势。🌸"}',
    '{slowPace,newcomers,noChat,stayClose}', 'e5c6fe18-b094-5aef-a173-dadfaac57f65'
  )
on conflict (id) do nothing;

-- ── circle_ideas (ci1–ci3) ─────────────────────────────────────
insert into circle_ideas (
  id, who_name, who_idx, relation, source, title, body, tag, tag_tone, pref_lang, pref_size, pref_pace
) values
  (
    '0eb7f58e-5d21-5e99-bad0-f8cfd447dbef', 'Mei-Lin', 3,
    '{"en":"your guide","zh":"你的向导"}', '{"en":"You walked this trail together in VR","zh":"你们在 VR 里一起走过这条步道"}',
    '{"en":"A short kauri trail this weekend","zh":"周末一段短贝壳杉步道"}',
    '{"en":"Same trail we walked in VR — first 1.5 km only. Bring water.","zh":"我们在 VR 里走过的步道——只走前 1.5 公里。带上水。"}',
    '{"en":"Outdoor","zh":"户外"}', 'calm',
    '{"en":"EN / 中文","zh":"英文 / 中文"}', '{"en":"3–5 people","zh":"3–5 人"}', '{"en":"Gentle","zh":"温和"}'
  ),
  (
    '7b2b4bdd-1a9d-563b-8c12-ef1af38c76a9', 'Lien', 1,
    '{"en":"VR partner","zh":"VR 伙伴"}', '{"en":"You’ve done VR sessions side by side","zh":"你们一起做过 VR 练习"}',
    '{"en":"Shoulder reset together over a video call","zh":"一起视频通话做肩颈舒缓"}',
    '{"en":"Same 8-min routine on Tuesday evening. Pyjamas welcome.","zh":"周二晚上一起做 8 分钟练习。睡衣也可以。"}',
    '{"en":"At home","zh":"居家"}', 'lav',
    '{"en":"中文","zh":"中文"}', '{"en":"Just us two","zh":"只有我们俩"}', '{"en":"Very gentle","zh":"非常温和"}'
  ),
  (
    'aa90b26b-67c0-5e38-801e-5b75843c9ccb', 'Priya', 2,
    '{"en":"friend from walk","zh":"步行认识的朋友"}', '{"en":"You met on the Cornwall Park walk","zh":"你们在康沃尔公园散步时认识"}',
    '{"en":"Mid-week library stretch","zh":"一起去图书馆拉伸"}',
    '{"en":"Quiet, indoor, free. Could carpool from Mt Roskill.","zh":"安静、室内、免费。可以从罗斯希尔一起拼车。"}',
    '{"en":"Indoor","zh":"室内"}', 'accent',
    '{"en":"English","zh":"英文"}', '{"en":"Small · under 6","zh":"小圈 · 6 人以内"}', '{"en":"Gentle","zh":"温和"}'
  )
on conflict (id) do nothing;


-- ── 0005: slugs + the display fields 0001 had no column for ────────────────
-- Plain updates keyed on the uuid-v5 ids above, so this block re-runs safely.
update activities a set slug = v.slug, surface = v.surface,
  peer_safe = v.safe, peer_welcoming = v.welcoming, peer_useful = v.useful,
  feedback = v.feedback::jsonb
from (values
  ('8fb6136c-518c-556d-aaf6-d21807d384fe'::uuid, 'r1', 'home', 96, 94, 90, '[]'),
  ('d70b2be4-00fa-5899-8931-e8c1554316bb'::uuid, 'r2', 'home', 98, 90, 92, '[]'),
  ('4b7e3c27-5447-51ad-a5c3-3801e871190f'::uuid, 'r3', 'home', 96, 88, 88, '[]'),
  ('4e1ede18-e562-5983-bcf5-f46a2d073d49'::uuid, 'r4', 'home', 94, 100, 86, '[]'),
  ('7bedeccd-fe9c-518c-b533-b8c1195f867d'::uuid, 'r5', 'home', 95, 88, 84, '[]'),
  ('1b5925fe-8717-5f55-9290-ae2aec11f0b6'::uuid, 'd1', 'discover', null, null, null,
    '[{"id":"f","label":{"en":"safe","zh":"安全"},"pct":96},{"id":"w","label":{"en":"welcoming","zh":"友善"},"pct":94},{"id":"b","label":{"en":"beginner-friendly","zh":"适合初学"},"pct":92}]'),
  ('ef412cba-0a2c-58f4-8f1b-24ad24a1d141'::uuid, 'd2', 'discover', null, null, null,
    '[{"id":"f","label":{"en":"safe","zh":"安全"},"pct":92},{"id":"w","label":{"en":"welcoming","zh":"友善"},"pct":95}]'),
  ('6cb28eaa-266f-5177-b0af-f650f094c821'::uuid, 'd3', 'discover', null, null, null, '[]'),
  ('7772d30a-a5fb-5612-8db6-a34bb8c54070'::uuid, 'd4', 'discover', null, null, null, '[]'),
  ('0c34070a-2731-5495-8eac-a8f884118da4'::uuid, 'd5', 'discover', null, null, null, '[]'),
  ('d91afe0b-ebd4-5c1e-ae57-bc9947d4e656'::uuid, 'd6', 'discover', null, null, null, '[]')
) as v(id, slug, surface, safe, welcoming, useful, feedback)
where a.id = v.id;

update vr_sessions s set slug = v.slug from (values
  ('93654dd0-a25a-5207-8edd-3dd90bff5471'::uuid, 'v1'),
  ('0332f303-9aeb-5276-88f2-d989b2e0b637'::uuid, 'v2'),
  ('476d149f-1862-5899-92d8-fc45d0ec8723'::uuid, 'v3')
) as v(id, slug) where s.id = v.id;

update plans p set slug = v.slug, host = v.host::jsonb, going_count = v.going,
  attendee_names = v.names, friend_names = v.friends
from (values
  ('94b8e9b7-2f92-51e0-a91d-61bdd29b5a46'::uuid, 'u1', '{"en":"Sarah · Blue Coast","zh":"Sarah · 蓝海岸"}', 12,
    '{Sarah,Elena,Priya}'::text[], '{Elena,Priya}'::text[]),
  ('affbca3f-8140-59f0-8107-bf7291d2ffdb'::uuid, 'u2', '{"en":"Mei-Lin","zh":"美琳"}', 6,
    '{Mei-Lin,Hana}'::text[], '{Hana}'::text[])
) as v(id, slug, host, going, names, friends)
where p.id = v.id;

update circle_ideas c set slug = v.slug, who = v.who::jsonb,
  interested_count = v.n, interested_names = v.names
from (values
  ('0eb7f58e-5d21-5e99-bad0-f8cfd447dbef'::uuid, 'ci1', '{"en":"Mei-Lin","zh":"美琳"}', 4, '{Hana,Sarah}'::text[]),
  ('7b2b4bdd-1a9d-563b-8c12-ef1af38c76a9'::uuid, 'ci2', '{"en":"Lien","zh":"莲"}', 2, '{Lien}'::text[]),
  ('aa90b26b-67c0-5e38-801e-5b75843c9ccb'::uuid, 'ci3', '{"en":"Priya","zh":"普里娅"}', 0, '{}'::text[])
) as v(id, slug, who, n, names)
where c.id = v.id;

update conversations c set slug = v.slug from (values
  ('230ed220-b23c-514e-9496-e2ead16e8beb'::uuid, 'c1'),
  ('e5c6fe18-b094-5aef-a173-dadfaac57f65'::uuid, 'c2'),
  ('fb6a06d6-0d1e-544f-b324-05d24ee754df'::uuid, 'c3'),
  ('e8d1c5e6-c3fa-5336-bfa6-8844d87e8227'::uuid, 'c4')
) as v(id, slug) where c.id = v.id;

-- Backdate the demonstration comments so their relative times ("3 days ago")
-- match the mock copy at seed time; the app formats them from created_at.
update activity_comments ac set created_at = now() - make_interval(days => v.days)
from (values
  ('8fb6136c-518c-556d-aaf6-d21807d384fe'::uuid, 'Hana', 3), ('8fb6136c-518c-556d-aaf6-d21807d384fe'::uuid, 'Priya', 8),
  ('8fb6136c-518c-556d-aaf6-d21807d384fe'::uuid, 'Wei', 14), ('d70b2be4-00fa-5899-8931-e8c1554316bb'::uuid, 'Lien', 2),
  ('d70b2be4-00fa-5899-8931-e8c1554316bb'::uuid, 'Elena', 8), ('4b7e3c27-5447-51ad-a5c3-3801e871190f'::uuid, 'Hana', 4),
  ('4b7e3c27-5447-51ad-a5c3-3801e871190f'::uuid, 'Sarah', 8), ('4b7e3c27-5447-51ad-a5c3-3801e871190f'::uuid, 'Priya', 14),
  ('4e1ede18-e562-5983-bcf5-f46a2d073d49'::uuid, 'Wei', 3), ('4e1ede18-e562-5983-bcf5-f46a2d073d49'::uuid, 'Priya', 14)
) as v(activity_id, name, days)
where ac.activity_id = v.activity_id and ac.display_name = v.name;

-- ── 0008: Messages-list display fields for the demo conversations ─────────
update conversations c set avatar_idx = v.idx, member_count = v.n,
  pinned_by_name = v.pin_by, pinned_by_idx = v.pin_idx, pinned_role = v.pin_role::jsonb
from (values
  ('c1', 3, null::int, null, null::int, null),
  ('c2', 1, 14, 'Sarah', 2, '{"en":"Facilitator","zh":"带领者"}'),
  ('c3', 2, null, null, null, null),
  ('c4', 4, 5, null, null, null)
) as v(slug, idx, n, pin_by, pin_idx, pin_role)
where c.slug = v.slug;

-- ── 0009: bilingual activity details (Home recommendations r1–r5) ─────────
update activities a set
  detail_time = v.dt::jsonb, detail_location = v.loc::jsonb, detail_cost = v.cost::jsonb,
  detail_language = v.lang::jsonb, detail_intensity = v.inten::jsonb, detail_bring = v.bring::jsonb
from (values
  ('r1', '{"en":"9:00 AM Sat","zh":"周六上午 9:00"}', '{"en":"Cornwall Park rose garden","zh":"康沃尔公园玫瑰园"}',
    '{"en":"Free","zh":"免费"}', '{"en":"EN / 中","zh":"英文 / 中文"}', '{"en":"Gentle","zh":"温和"}', '{"en":"Comfortable shoes, water","zh":"舒适的鞋、水"}'),
  ('r2', '{"en":"Anytime","zh":"任何时间"}', '{"en":"Home","zh":"居家"}',
    '{"en":"Free","zh":"免费"}', '{"en":"EN / 中","zh":"英文 / 中文"}', '{"en":"Very gentle","zh":"非常温和"}', '{"en":"A chair, water","zh":"一把椅子、水"}'),
  ('r3', '{"en":"Anytime","zh":"任何时间"}', '{"en":"Home · 1.5m space","zh":"居家 · 1.5 米空间"}',
    '{"en":"Free","zh":"免费"}', '{"en":"EN / 中","zh":"英文 / 中文"}', '{"en":"Gentle","zh":"温和"}', '{"en":"Headset, water","zh":"头显、水"}'),
  ('r4', '{"en":"Wed 11:00 AM","zh":"周三上午 11:00"}', '{"en":"Mt Roskill Library","zh":"罗斯希尔图书馆"}',
    '{"en":"Free","zh":"免费"}', '{"en":"EN only","zh":"仅英文"}', '{"en":"Gentle","zh":"温和"}', '{"en":"Yourself","zh":"只需你自己"}'),
  ('r5', '{"en":"Anytime","zh":"任何时间"}', '{"en":"Mission Bay waterfront","zh":"使命湾海滨"}',
    '{"en":"Free","zh":"免费"}', '{"en":"—","zh":"—"}', '{"en":"Gentle","zh":"温和"}', '{"en":"Water, comfortable shoes","zh":"水、舒适的鞋"}')
) as v(slug, dt, loc, cost, lang, inten, bring)
where a.slug = v.slug;
